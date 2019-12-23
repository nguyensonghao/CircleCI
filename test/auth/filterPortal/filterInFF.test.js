const config = require('config');
const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');

const UtilHelper = require('../../helpers/util.helper');
const PortalHelper = require('../../helpers/portal.helper');

describe('/Change the logic of filter', () => {
    it('1.1 Check the total record in FF and Airtable of Sale Data API Testing', async () => {
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await PortalHelper.accessPortalFilter(driver, config.get('URLPORTALFILTER'));
            let text = await PortalHelper.getNumberViewalbe(driver);
            assert.equal(text.includes('1448 '), true);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('1.2. Click "Hide" the folder Sale Data API Testing', async () => {
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            // Access portal and open tree view
            await PortalHelper.openTreeView(driver, config.get('URLPORTALFILTER'));

            let eleBtnVisibility = await driver.findElement(By.xpath(`//span[text()="${config.get('FOLDERFILTERNAME')}"]/following-sibling::i`));
            let classBtnVisibility = await eleBtnVisibility.getAttribute('class');
            if (classBtnVisibility.includes('active')) {
                await eleBtnVisibility.click();
                let locatorLoading = By.className('loadding-cover');
                await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoading);
                let text = await PortalHelper.getNumberViewalbe(driver);
                assert.equal(text.includes('0 '), true);
                await driver.quit();
            } else {
                let text = await PortalHelper.getNumberViewalbe(driver);
                assert.equal(text.includes('0 '), true);
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('1.3. Click "Unhide"', async () => {
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            // Access portal and open tree view
            await PortalHelper.openTreeView(driver, config.get('URLPORTALFILTER'));

            let eleBtnVisibility = await driver.findElement(By.xpath(`//span[text()="${config.get('FOLDERFILTERNAME')}"]/following-sibling::i`));
            let classBtnVisibility = await eleBtnVisibility.getAttribute('class');
            if (classBtnVisibility.includes('active')) {
                let text = await PortalHelper.getNumberViewalbe(driver);
                assert.equal(text.includes('1448 '), true);
                await driver.quit();
            } else {
                let eleBtnVisibilityOff = await driver.findElement(By.xpath(`//span[text()="${config.get('FOLDERFILTERNAME')}"]/following-sibling::i/following-sibling::i`));
                await eleBtnVisibilityOff.click();
                let locatorLoading = By.className('loadding-cover');
                await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoading);
                let text = await PortalHelper.getNumberViewalbe(driver);
                assert.equal(text.includes('1448 '), true);
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    // it('2.1. Name with "contains" 15MN and click "Set filter"', async () => {
    //     let driver = await new Builder().forBrowser('chrome')
    //         .setChromeOptions(UtilHelper.getWebOption())
    //         .build();
    //     try {
    //         // Access portal and open tree view
    //         await PortalHelper.openTreeView(driver);
            
    //     } catch (error) {
    //         await driver.quit();
    //         throw error;
    //     }
    // })
})