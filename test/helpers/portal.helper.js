const { By, until } = require('selenium-webdriver');

const UtilHelper = require('./util.helper');

const showModalCreateNewFolder = async (driver) => { 
    await driver.wait(until.elementIsVisible(await driver.findElement(By.id('map-search-page'))));
    let elementButtonNew = await driver.findElement(By.className('btn-option-folder-right-top'));
    await driver.executeScript("arguments[0].click()", elementButtonNew);
    let elementButtonAddNewFolder = await driver.findElement(By.className('btn-add-new-folder'));
    await driver.executeScript("arguments[0].click()", elementButtonAddNewFolder);
}

const deleteFolder = async (driver, elementFolder) => {
    let parentElementFolder1 = await driver.executeScript("return arguments[0].parentNode;", elementFolder);
    let parentElementFolder2 = await driver.executeScript("return arguments[0].parentNode;", parentElementFolder1);
    let parentElementFolder3 = await driver.executeScript("return arguments[0].parentNode;", parentElementFolder2);
    await UtilHelper.clickThreeDots(driver, parentElementFolder3);
    let elementButtonDelete = await parentElementFolder3.findElement(By.className('btn-delete-folder'));
    await driver.executeScript("arguments[0].click()", elementButtonDelete);
    await UtilHelper.wait(1000);
    await driver.wait(until.elementIsVisible(await driver.findElement(By.className('pc-container'))));
    await UtilHelper.wait(1000);
    let elementButtonOKDelete = await driver.findElement(By.className('pc-button-success'));
    await driver.executeScript("arguments[0].click()", elementButtonOKDelete);
    await driver.findElement(By.css('#passCheck')).sendKeys("12345678");
    let elementButtonCheck = await driver.findElement(By.css('#modal-check-password .btn-check'));
    await driver.executeScript("arguments[0].click()", elementButtonCheck);
}

const saveNewFolder = async (driver, name) => {
    await driver.findElement(By.css('.form-add-new-folder .input-field input')).sendKeys(name);
    let elementButtonSave = await driver.findElement(By.css('.form-add-new-folder .btn-save'));
    await driver.executeScript("arguments[0].click()", elementButtonSave);
}

const openAllFolderMapViewOption = async (driver) => {
    let elementButtonSeeMore = await driver.findElement(By.css('.jstree-ocl:nth-of-type(1)'));
    await driver.executeScript("arguments[0].click()", elementButtonSeeMore);
    await UtilHelper.wait(1000);
}

const accessPortalSettings = async (driver) => {
    await login(driver, true);
    await waitFinishLoading(driver, config.get('URLHQPORTAL'));
    await wait(2000);
    
    await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadingFarmland'))));
    let locatorLoadingFolderIframe = By.className('loadingFarmland');
    await waitUntilLoadingDisappear(driver, locatorLoadingFolderIframe); 

    await driver.wait(until.elementIsVisible(await driver.findElement(By.className('modal-check-admin-portal'))));
    let elePassword = await driver.findElement(By.id('passCheck'));
    await elePassword.sendKeys(config.get('PASSWORDHQ'));
}

const accessPortalFilter = async (driver, url) => {
    await UtilHelper.login(driver);
    await UtilHelper.waitFinishLoading(driver, url, true);
    await UtilHelper.wait(5000);
}

const openTreeView = async (driver, url) => {
    await accessPortalFilter(driver, url);
    let eleNodeOpen = await driver.findElement(By.xpath('//i[@class="jstree-icon jstree-ocl"]'));
    await eleNodeOpen.click();
    let locatorLoadingFolder = By.className('jstree-loading');
    await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
}

const getNumberViewalbe = async (driver) => {
    let eleHeaderOptions = await driver.findElement(By.className('icon-list-folder'));
    let text = await eleHeaderOptions.getText();
    return text;
}

module.exports = {
    openTreeView,
    deleteFolder,
    saveNewFolder,
    showModalCreateNewFolder,
    openAllFolderMapViewOption,
    getNumberViewalbe,
    accessPortalFilter,
    accessPortalSettings,
    showModalCreateNewFolder
}