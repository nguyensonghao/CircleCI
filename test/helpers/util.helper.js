const config = require('config');
const { By, until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');

const wait = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time)
    })
}

const login = async (driver, isAdmin = false) => {
    await driver.get(config.get('URLStaging'));
    await driver.findElement(By.className('btn-signin')).click();
    await wait(4000);
    if (isAdmin) {
        await driver.findElement(By.css('#tab1 #email')).sendKeys(config.get('ACCOUNTADMIN.USERNAME'));
        await driver.findElement(By.css('#tab1 #password')).sendKeys(config.get('ACCOUNTADMIN.PASSWORD'));
        await driver.findElement(By.css('#tab1 button[type="submit"]')).click();
    } else {
        await driver.findElement(By.css('#tab1 #email')).sendKeys(config.get('ACCOUNT.USERNAME'));
        await driver.findElement(By.css('#tab1 #password')).sendKeys(config.get('ACCOUNT.PASSWORD'));
        await driver.findElement(By.css('#tab1 button[type="submit"]')).click();
    }
    await wait(4000);
}

const waitFinishLoading = async (driver, url, showLoading) => {
    await driver.get(url);
    if (showLoading) {
        await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadingFarmland'))));
        await wait(3000);
        await driver.wait(until.elementIsVisible(await driver.findElement(By.id('map-search-page'))));
    }
}

const waitUntilLoadingDisappear = async (driver, locator) => {
    await driver.wait(() => {
        return driver.findElements(locator).then((elements) => {
            if (elements && elements.length <= 0) {
                return true;
            }
            return false;
        });
    }, 10000, 'The element was still present when it should have disappeared.');
}

const waitUntilLoadingInvisible  = async (driver, locator) => {
    await driver.wait(async () => {
        let element = await driver.findElement(locator);
        let invisibleLoading = await element.getAttribute("style");
        return invisibleLoading == "display: none;";
    }, 25000, 'The element was still present when it should have disappeared.');
}

const clickThreeDots = async (driver, parentElementFolder) => {
    let eleThreeDots = await parentElementFolder.findElement(By.className('btn-action-folder'));
    await eleThreeDots.click();
}

const getWebOption = () => {
    let chromeOption = new Options();
    chromeOption.windowSize(config.get('sizeScreen'));
    chromeOption.excludeSwitches('enable-logging');
    chromeOption.addArguments("--incognito");
    return chromeOption;
}

const goToPortal = async (driver, url, showLoading = false) => {
    await login(driver);
    await waitFinishLoading(driver, url, showLoading);
    await wait(5000);
}

const goToPastSaleMap = async (driver) => {
    await login(driver);
    await waitFinishLoading(driver, config.get('URLPASTSALEMAP'));
    await wait(5000);
}

const goToLandForSale = async (driver) => {
    await login(driver);
    await waitFinishLoading(driver, config.get('URLLANDFORSALE'));
}

module.exports = {
    wait,
    login,
    goToPortal,
    getWebOption,
    clickThreeDots,
    goToPastSaleMap,
    goToLandForSale,
    waitFinishLoading,
    waitUntilLoadingDisappear,
    waitUntilLoadingInvisible
}