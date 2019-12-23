const config = require('config');
const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');

const UtilHelper = require('../../helpers/util.helper');
const messageMoveSuccess = 'Your file was successfully moved.';

describe('/User can move a folder on Portal', () => {
    it('User can move a folder to unlocked folder on Portal excepting "My folder"', async () => {
        /* 
            Input: Click "3 dots icon" of a folder in Folder management
            Output: Show dropdown options
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {            
            await UtilHelper.goToPortal(driver, config.get('URLPORTAL'), true);
            // Check if folder is existed in root folder
            let folderName = '1 Selenium move';
            let folderDestinationName = '1 Selenium move destination';
            let checkExists = await driver.findElements(By.css(`p[folder-name='${folderName}']`));
            if (checkExists && checkExists.length) {
                let parentElementFolder = await driver.findElement(By.xpath(`//tr[.//@folder-name='${folderName}']`));
                await UtilHelper.clickThreeDots(driver, parentElementFolder);
                let eleBtnMoveFolder = await parentElementFolder.findElement(By.className('btn-move-folder'));
                await eleBtnMoveFolder.click();
                let eleModalMoveFolder = await driver.findElement(By.id('modal-move-folder'));
                let locatorLoadingFolder = By.className('preloader-wrapper loading-folder');
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let eleFolderDestination = await eleModalMoveFolder.findElement(By.xpath(`//div[@class='folder-move-item'][.//p[text()='${folderDestinationName}']]`));
                await eleFolderDestination.click();
                let eleBtnMove = await eleModalMoveFolder.findElement(By.className('btn-save btn'));
                await eleBtnMove.click();
                await UtilHelper.wait(3000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
                let eleToastMove = await driver.findElement(By.id('toast-container'));
                let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
                assert.equal(eleToastMoveText, messageMoveSuccess);            
                await driver.quit();  
            } else {
                let parentElementFolderDestinaion = await driver.findElement(By.xpath(`//tr[.//@folder-name='${folderDestinationName}']`));
                await parentElementFolderDestinaion.click()
                let locatorLoadingFolder = By.className('preloader-wrapper loading-folder');
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let parentElementFolder = await driver.findElement(By.xpath(`//tr[.//@folder-name='${folderName}']`));
                await UtilHelper.clickThreeDots(driver, parentElementFolder);
                let eleBtnMoveFolder = await parentElementFolder.findElement(By.className('btn-move-folder'));
                await eleBtnMoveFolder.click();
                let eleModalMoveFolder = await driver.findElement(By.id('modal-move-folder'));
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let eleFolderDestination = await eleModalMoveFolder.findElement(By.xpath('//button[text()="Home"]'));
                await eleFolderDestination.click();
                let eleBtnMove = await eleModalMoveFolder.findElement(By.className('btn-save btn'));
                await eleBtnMove.click();
                await UtilHelper.wait(3000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
                let eleToastMove = await driver.findElement(By.id('toast-container'));
                let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
                assert.equal(eleToastMoveText, messageMoveSuccess);    
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('User can move a file to a folder excepting "My folder"', async () => {
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPortal(driver, config.get('URLPORTAL'), true);
            // check if folder is existed in root folder
            let fileName = '1 Selenium move file.txt';
            let folderDestinationName = '1 Selenium move destination';
            let checkExists = await driver.findElements(By.css(`p[folder-name='${fileName}']`));
            if (checkExists && checkExists.length) {
                let parentElementFolder = await driver.findElement(By.xpath(`//tr[.//@folder-name='${fileName}']`));
                await UtilHelper.clickThreeDots(driver, parentElementFolder);
                let eleBtnMoveFolder = await parentElementFolder.findElement(By.className('btn-move-folder'));
                await eleBtnMoveFolder.click();
                let eleModalMoveFolder = await driver.findElement(By.id('modal-move-folder'));
                let locatorLoadingFolder = By.className('preloader-wrapper loading-folder');
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let eleFolderDestination = await eleModalMoveFolder.findElement(By.xpath(`//div[@class='folder-move-item'][.//p[text()='${folderDestinationName}']]`));
                await eleFolderDestination.click();
                let eleBtnMove = await eleModalMoveFolder.findElement(By.className('btn-save btn'));
                await eleBtnMove.click();
                await UtilHelper.wait(3000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
                let eleToastMove = await driver.findElement(By.id('toast-container'));
                let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
                assert.equal(eleToastMoveText, messageMoveSuccess);            
                await driver.quit();  
            } else {
                let parentElementFolderDestinaion = await driver.findElement(By.xpath(`//tr[.//@folder-name='${folderDestinationName}']`));
                await parentElementFolderDestinaion.click()
                let locatorLoadingFolder = By.className('preloader-wrapper loading-folder');
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let parentElementFolder = await driver.findElement(By.xpath(`//tr[.//@folder-name='${fileName}']`));
                await UtilHelper.clickThreeDots(driver, parentElementFolder);
                let eleBtnMoveFolder = await parentElementFolder.findElement(By.className('btn-move-folder'));
                await eleBtnMoveFolder.click();
                let eleModalMoveFolder = await driver.findElement(By.id('modal-move-folder'));
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let eleFolderDestination = await eleModalMoveFolder.findElement(By.xpath('//button[text()="Home"]'));
                await eleFolderDestination.click();
                let eleBtnMove = await eleModalMoveFolder.findElement(By.className('btn-save btn'));
                await eleBtnMove.click();
                await UtilHelper.wait(3000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
                let eleToastMove = await driver.findElement(By.id('toast-container'));
                let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
                assert.equal(eleToastMoveText, messageMoveSuccess);    
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('User can move a folder to another folder in "My folder"', async () => {
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPortal(driver, config.get('URLPORTAL'), true);
            // Click My folder
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath(`//p[@class='item'][.//i[text()='star']]`))));
            let eleMyFolder = await driver.findElement(By.xpath(`//p[@class='item'][.//i[text()='star']]`));
            await eleMyFolder.click();
            await UtilHelper.wait(3000);
            
            // Check if folder is existed in My folder
            let folderName = '1 Selenium move folder';
            let folderDestinationName = '1 Selenium move folder destination';
            let checkExists = await driver.findElements(By.css(`p[folder-name='${folderName}']`));
            if (checkExists && checkExists.length) {
                let parentElementFolder = await driver.findElement(By.xpath(`//tr[.//@folder-name='${folderName}']`));
                await UtilHelper.clickThreeDots(driver, parentElementFolder);
                let eleBtnMoveFolder = await parentElementFolder.findElement(By.className('btn-move-folder'));
                await eleBtnMoveFolder.click();
                let eleModalMoveFolder = await driver.findElement(By.id('modal-move-folder'));
                let locatorLoadingFolder = By.className('preloader-wrapper loading-folder');
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let eleFolderMyFolder = await eleModalMoveFolder.findElement(By.xpath(`//div[@class='folder-move-item'][.//p[text()='My Folder']]`));
                await eleFolderMyFolder.click();
                await UtilHelper.wait(1000);
                let eleFolderDestination = await eleModalMoveFolder.findElement(By.xpath(`//div[@class='folder-move-item'][.//p[text()='${folderDestinationName}']]`));
                await eleFolderDestination.click();
                let eleBtnMove = await eleModalMoveFolder.findElement(By.className('btn-save btn'));
                await eleBtnMove.click();
                await UtilHelper.wait(3000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
                let eleToastMove = await driver.findElement(By.id('toast-container'));
                let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
                assert.equal(eleToastMoveText, messageMoveSuccess);            
                await driver.quit();  
            } else {
                let parentElementFolderDestinaion = await driver.findElement(By.xpath(`//tr[.//@folder-name='${folderDestinationName}']`));
                parentElementFolderDestinaion = await parentElementFolderDestinaion.findElement(By.className('folder-name'));
                await parentElementFolderDestinaion.click();
                let locatorLoadingFolder = By.className('preloader-wrapper loading-folder');
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let parentElementFolder = await driver.findElement(By.xpath(`//tr[.//@folder-name='${folderName}']`));
                await UtilHelper.clickThreeDots(driver, parentElementFolder);
                let eleBtnMoveFolder = await parentElementFolder.findElement(By.className('btn-move-folder'));
                await eleBtnMoveFolder.click();
                let eleModalMoveFolder = await driver.findElement(By.id('modal-move-folder'));
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let eleFolderMyFolder = await eleModalMoveFolder.findElement(By.xpath(`//div[@class='folder-move-item'][.//p[text()='My Folder']]`));
                await eleFolderMyFolder.click();
                let eleBtnMove = await eleModalMoveFolder.findElement(By.className('btn-save btn'));
                await eleBtnMove.click();
                await UtilHelper.wait(3000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
                let eleToastMove = await driver.findElement(By.id('toast-container'));
                let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
                assert.equal(eleToastMoveText, messageMoveSuccess);    
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('User can move a file to a folder in "My folder"', async () => {
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPortal(driver, config.get('URLPORTAL'), true);
            // Click My folder
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath(`//p[@class='item'][.//i[text()='star']]`))));
            let eleMyFolder = await driver.findElement(By.xpath(`//p[@class='item'][.//i[text()='star']]`));
            await eleMyFolder.click();
            await UtilHelper.wait(3000);

            // check if folder is existed in My folder
            let fileName = '1 Selenium move my folder file.txt';
            let folderDestinationName = '1 Selenium move folder destination';
            let checkExists = await driver.findElements(By.css(`p[folder-name='${fileName}']`));
            if (checkExists && checkExists.length) {
                let parentElementFolder = await driver.findElement(By.xpath(`//tr[.//@folder-name='${fileName}']`));
                await UtilHelper.clickThreeDots(driver, parentElementFolder);
                let eleBtnMoveFolder = await parentElementFolder.findElement(By.className('btn-move-folder'));
                await eleBtnMoveFolder.click();
                let eleModalMoveFolder = await driver.findElement(By.id('modal-move-folder'));
                let locatorLoadingFolder = By.className('preloader-wrapper loading-folder');
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let eleFolderMyFolder = await eleModalMoveFolder.findElement(By.xpath(`//div[@class='folder-move-item'][.//p[text()='My Folder']]`));
                await eleFolderMyFolder.click();
                await UtilHelper.wait(1000);
                let eleFolderDestination = await eleModalMoveFolder.findElement(By.xpath(`//div[@class='folder-move-item'][.//p[text()='${folderDestinationName}']]`));
                await eleFolderDestination.click();
                let eleBtnMove = await eleModalMoveFolder.findElement(By.className('btn-save btn'));
                await eleBtnMove.click();
                await UtilHelper.wait(3000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
                let eleToastMove = await driver.findElement(By.id('toast-container'));
                let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
                assert.equal(eleToastMoveText, messageMoveSuccess);            
                await driver.quit();  
            } else {
                let parentElementFolderDestinaion = await driver.findElement(By.xpath(`//tr[.//@folder-name='${folderDestinationName}']`));
                parentElementFolderDestinaion = await parentElementFolderDestinaion.findElement(By.className('folder-name'));
                await parentElementFolderDestinaion.click()
                let locatorLoadingFolder = By.className('preloader-wrapper loading-folder');
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let parentElementFolder = await driver.findElement(By.xpath(`//tr[.//@folder-name='${fileName}']`));
                await UtilHelper.clickThreeDots(driver, parentElementFolder);
                let eleBtnMoveFolder = await parentElementFolder.findElement(By.className('btn-move-folder'));
                await eleBtnMoveFolder.click();
                let eleModalMoveFolder = await driver.findElement(By.id('modal-move-folder'));
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let eleFolderMyFolder = await eleModalMoveFolder.findElement(By.xpath(`//div[@class='folder-move-item'][.//p[text()='My Folder']]`));
                await eleFolderMyFolder.click();
                let eleBtnMove = await eleModalMoveFolder.findElement(By.className('btn-save btn'));
                await eleBtnMove.click();
                await UtilHelper.wait(3000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
                let eleToastMove = await driver.findElement(By.id('toast-container'));
                let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
                assert.equal(eleToastMoveText, messageMoveSuccess);    
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('User cannot move a folder has a same name with another folder', async () => {
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPortal(driver, config.get('URLPORTAL'), true);
            // Check if folder is existed in My folder
            let folderName = '1 Selenium move';
            let folderDestinationName = '1 Selenium move destination';
            let folderDestinationNameSameName = '1 Selenium move same name';
            let checkExists = await driver.findElements(By.css(`p[folder-name='${folderName}']`));
            if(checkExists && checkExists.length) {
                let parentElementFolder = await driver.findElement(By.xpath(`//tr[.//@folder-name='${folderName}']`));
                await UtilHelper.clickThreeDots(driver, parentElementFolder);
                let eleBtnMoveFolder = await parentElementFolder.findElement(By.className('btn-move-folder'));
                await eleBtnMoveFolder.click();
                let eleModalMoveFolder = await driver.findElement(By.id('modal-move-folder'));
                let locatorLoadingFolder = By.className('preloader-wrapper loading-folder');
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let eleFolderDestination = await eleModalMoveFolder.findElement(By.xpath(`//div[@class='folder-move-item'][.//p[text()='${folderDestinationNameSameName}']]`));
                await eleFolderDestination.click();
                let eleBtnMove = await eleModalMoveFolder.findElement(By.className('btn-save btn'));
                await eleBtnMove.click();
                await UtilHelper.wait(3000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
                let eleToastMove = await driver.findElement(By.id('toast-container'));
                let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
                assert.equal(eleToastMoveText, 'An existing file in this folder has the same name.');            
                await driver.quit();  
            } else {
                let parentElementFolderDestinaion = await driver.findElement(By.xpath(`//tr[.//@folder-name='${folderDestinationName}']`));
                await parentElementFolderDestinaion.click();
                let locatorLoadingFolder = By.className('preloader-wrapper loading-folder');
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let parentElementFolder = await driver.findElement(By.xpath(`//tr[.//@folder-name='${folderName}']`));
                await UtilHelper.clickThreeDots(driver, parentElementFolder);
                let eleBtnMoveFolder = await parentElementFolder.findElement(By.className('btn-move-folder'));
                await eleBtnMoveFolder.click();
                let eleModalMoveFolder = await driver.findElement(By.id('modal-move-folder'));
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let eleFolderDestination = await eleModalMoveFolder.findElement(By.xpath(`//div[@class='folder-move-item'][.//p[text()='${folderDestinationNameSameName}']]`));
                await eleFolderDestination.click();
                let eleBtnMove = await eleModalMoveFolder.findElement(By.className('btn-save btn'));
                await eleBtnMove.click();
                await UtilHelper.wait(3000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
                let eleToastMove = await driver.findElement(By.id('toast-container'));
                let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
                assert.equal(eleToastMoveText, 'An existing file in this folder has the same name.');    
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('User can move a folder to a locked folder', async () => {
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPortal(driver, config.get('URLPORTAL'), true);
            // Check if folder is existed in root folder
            let folderName = '1 Selenium move folder locked';
            let folderDestinationName = '1 Selenium move folder locked destination';
            let checkExists = await driver.findElements(By.css(`p[folder-name='${folderName}']`));
            if(checkExists && checkExists.length) {
                let parentElementFolder = await driver.findElement(By.xpath(`//tr[.//@folder-name='${folderName}']`));
                await UtilHelper.clickThreeDots(driver, parentElementFolder);
                let eleBtnMoveFolder = await parentElementFolder.findElement(By.className('btn-move-folder'));
                await eleBtnMoveFolder.click();
                let eleModalMoveFolder = await driver.findElement(By.id('modal-move-folder'));
                let locatorLoadingFolder = By.className('preloader-wrapper loading-folder');
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let eleFolderDestination = await eleModalMoveFolder.findElement(By.xpath(`//div[@class='folder-move-item'][.//p[text()='${folderDestinationName}']]`));
                await eleFolderDestination.click();
                let eleBtnMove = await eleModalMoveFolder.findElement(By.className('btn-save btn'));
                await eleBtnMove.click();
                await UtilHelper.wait(3000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
                let eleToastMove = await driver.findElement(By.id('toast-container'));
                let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
                assert.equal(eleToastMoveText, messageMoveSuccess);            
                await driver.quit();  
            } else {
                let parentElementFolderDestinaion = await driver.findElement(By.xpath(`//tr[.//@folder-name='${folderDestinationName}']`));
                await parentElementFolderDestinaion.click()
                let locatorLoadingFolder = By.className('preloader-wrapper loading-folder');
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let parentElementFolder = await driver.findElement(By.xpath(`//tr[.//@folder-name='${folderName}']`));
                await UtilHelper.clickThreeDots(driver, parentElementFolder);
                let eleBtnMoveFolder = await parentElementFolder.findElement(By.className('btn-move-folder'));
                await eleBtnMoveFolder.click();
                let eleModalMoveFolder = await driver.findElement(By.id('modal-move-folder'));
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let eleFolderDestination = await eleModalMoveFolder.findElement(By.xpath('//button[text()="Home"]'));
                await eleFolderDestination.click();
                let eleBtnMove = await eleModalMoveFolder.findElement(By.className('btn-save btn'));
                await eleBtnMove.click();
                await UtilHelper.wait(3000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
                let eleToastMove = await driver.findElement(By.id('toast-container'));
                let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
                assert.equal(eleToastMoveText, messageMoveSuccess);    
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('Use can move a locked folder to unlock folder by admin account', async () => {
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPortal(driver, config.get('URLPORTAL'), true);
            // Check if folder is existed in root folder
            let folderName = '1 Selenium move locked';
            let folderDestinationName = '1 Selenium move destination';
            let checkExists = await driver.findElements(By.css(`p[folder-name='${folderName}']`));
            if (checkExists && checkExists.length) {
                let parentElementFolder = await driver.findElement(By.xpath(`//tr[.//@folder-name='${folderName}']`));
                await UtilHelper.clickThreeDots(driver, parentElementFolder);
                let eleBtnMoveFolder = await parentElementFolder.findElement(By.className('btn-move-folder'));
                await eleBtnMoveFolder.click();
                let eleModalMoveFolder = await driver.findElement(By.id('modal-move-folder'));
                let locatorLoadingFolder = By.className('preloader-wrapper loading-folder');
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let eleFolderDestination = await eleModalMoveFolder.findElement(By.xpath(`//div[@class='folder-move-item'][.//p[text()='${folderDestinationName}']]`));
                await eleFolderDestination.click();
                let eleBtnMove = await eleModalMoveFolder.findElement(By.className('btn-save btn'));
                await eleBtnMove.click();
                await UtilHelper.wait(3000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
                let eleToastMove = await driver.findElement(By.id('toast-container'));
                let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
                assert.equal(eleToastMoveText, messageMoveSuccess);            
                await driver.quit();  
            } else {
                let parentElementFolderDestinaion = await driver.findElement(By.xpath(`//tr[.//@folder-name='${folderDestinationName}']`));
                await parentElementFolderDestinaion.click()
                let locatorLoadingFolder = By.className('preloader-wrapper loading-folder');
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let parentElementFolder = await driver.findElement(By.xpath(`//tr[.//@folder-name='${folderName}']`));
                await UtilHelper.clickThreeDots(driver, parentElementFolder);
                let eleBtnMoveFolder = await parentElementFolder.findElement(By.className('btn-move-folder'));
                await eleBtnMoveFolder.click();
                let eleModalMoveFolder = await driver.findElement(By.id('modal-move-folder'));
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let eleFolderDestination = await eleModalMoveFolder.findElement(By.xpath('//button[text()="Home"]'));
                await eleFolderDestination.click();
                let eleBtnMove = await eleModalMoveFolder.findElement(By.className('btn-save btn'));
                await eleBtnMove.click();
                await UtilHelper.wait(3000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
                let eleToastMove = await driver.findElement(By.id('toast-container'));
                let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
                assert.equal(eleToastMoveText, messageMoveSuccess);    
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('Use can move a locked file to unlock folder by admin account', async () => {
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPortal(driver, config.get('URLPORTAL'), true);
            // Check if folder is existed in root folder
            let fileName = '1 Selenium move file locked.txt';
            let folderDestinationName = '1 Selenium move destination';
            let checkExists = await driver.findElements(By.css(`p[folder-name='${fileName}']`));
            if (checkExists && checkExists.length) {
                let parentElementFolder = await driver.findElement(By.xpath(`//tr[.//@folder-name='${fileName}']`));
                await UtilHelper.clickThreeDots(driver, parentElementFolder);
                let eleBtnMoveFolder = await parentElementFolder.findElement(By.className('btn-move-folder'));
                await eleBtnMoveFolder.click();
                let eleModalMoveFolder = await driver.findElement(By.id('modal-move-folder'));
                let locatorLoadingFolder = By.className('preloader-wrapper loading-folder');
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let eleFolderDestination = await eleModalMoveFolder.findElement(By.xpath(`//div[@class='folder-move-item'][.//p[text()='${folderDestinationName}']]`));
                await eleFolderDestination.click();
                let eleBtnMove = await eleModalMoveFolder.findElement(By.className('btn-save btn'));
                await eleBtnMove.click();
                await UtilHelper.wait(3000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
                let eleToastMove = await driver.findElement(By.id('toast-container'));
                let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
                assert.equal(eleToastMoveText, messageMoveSuccess);            
                await driver.quit();  
            } else {
                let parentElementFolderDestinaion = await driver.findElement(By.xpath(`//tr[.//@folder-name='${folderDestinationName}']`));
                await parentElementFolderDestinaion.click()
                let locatorLoadingFolder = By.className('preloader-wrapper loading-folder');
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let parentElementFolder = await driver.findElement(By.xpath(`//tr[.//@folder-name='${fileName}']`));
                await UtilHelper.clickThreeDots(driver, parentElementFolder);
                let eleBtnMoveFolder = await parentElementFolder.findElement(By.className('btn-move-folder'));
                await eleBtnMoveFolder.click();
                let eleModalMoveFolder = await driver.findElement(By.id('modal-move-folder'));
                await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolder);
                let eleFolderDestination = await eleModalMoveFolder.findElement(By.xpath('//button[text()="Home"]'));
                await eleFolderDestination.click();
                let eleBtnMove = await eleModalMoveFolder.findElement(By.className('btn-save btn'));
                await eleBtnMove.click();
                await UtilHelper.wait(3000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
                let eleToastMove = await driver.findElement(By.id('toast-container'));
                let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
                assert.equal(eleToastMoveText, messageMoveSuccess);    
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })
})