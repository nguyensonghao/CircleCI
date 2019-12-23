const config = require('config');
const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');

const UtilHelper = require('../../helpers/util.helper');
const PortalHelper = require('../../helpers/portal.helper');

describe('/CREATE NEW FOLDER', () => {
    it('1. Click button "New" on Folder management', async () => {
        /* 
            Input: Click button "New" on Folder management'
            Output: Dropdown has 4 options
        */       
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPortal(driver, config.get('URLPORTAL'));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.id('map-search-page'))));
            let elementButtonNew = await driver.findElement(By.className('btn-option-folder-right-top'));
            await driver.executeScript("arguments[0].click()", elementButtonNew);
            let optionDropdown = await driver.findElements(By.css(".dropdown-option-folder-right-top ul li"));
            assert.equal(optionDropdown.length, 4);            
            await driver.quit();           
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    // it('1. Click "New folder"', async () => {
    //     /* 
    //         Input: Click "New folder"
    //         Output: Show popup to add new folder with "Name" field and button "Save", "Cancel"
    //     */
    //     let driver = await new Builder().forBrowser('chrome')
    //         .setChromeOptions(UtilHelper.getWebOption())
    //         .build();

    //     try {            
    //         await UtilHelper.goToPortal(driver, config.get('URLPORTAL'));
    //         await PortalHelper.showModalCreateNewFolder(driver);
    //         let spanTextButtonSave = await driver.findElement(By.css('.form-add-new-folder .btn-save')).getText();
    //         let spanTextButtonCancel = await driver.findElement(By.css('.form-add-new-folder .btn-cancel')).getText();
    //         let elementInputName = await driver.findElement(By.css('.form-add-new-folder .input-field label'));
    //         let spanTextInputName = await elementInputName.getText();
    //         assert.equal(spanTextInputName, 'Name');            
    //         assert.equal(spanTextButtonSave, 'Save');            
    //         assert.equal(spanTextButtonCancel, 'Cancel');            
    //         await driver.quit();           
    //     } catch (error) {
    //         await driver.quit();
    //         throw error;
    //     }
    // })

    // it('1. Click "New folder"', async () => {
    //     /* 
    //         Input: Enter "Name": New Folder Name
    //         Output: New Folder Name
    //     */
    //     let driver = await new Builder().forBrowser('chrome')
    //         .setChromeOptions(UtilHelper.getWebOption())
    //         .build();

    //     try {
    //         const folderName = 'Create New Folder Name';
    //         await UtilHelper.goToPortal(driver, config.get('URLPORTAL'));
    //         await PortalHelper.showModalCreateNewFolder(driver);
    //         await driver.findElement(By.css('.form-add-new-folder .input-field input')).sendKeys(folderName);
    //         let elementInputName = await driver.findElement(By.css('.form-add-new-folder .input-field input'));
    //         let valueInputName = await elementInputName.getAttribute("value");
    //         assert.equal(valueInputName, folderName);            
    //         await driver.quit();           
    //     } catch (error) {
    //         await driver.quit();
    //         throw error;
    //     }
    // })

    // it('1. Click "Save" button', async () => {
    //     /* 
    //         Input: Enter "Name"
    //         Output: Folder is saved with correct name
    //     */
    //     let driver = await new Builder().forBrowser('chrome')
    //         .setChromeOptions(UtilHelper.getWebOption())
    //         .build();

    //     try {
    //         const folderName = 'Create New Folder Name';
    //         await UtilHelper.goToPortal(driver, config.get('URLPORTAL'));
    //         await PortalHelper.showModalCreateNewFolder(driver);            
    //         await PortalHelper.saveNewFolder(driver, folderName);
    //         await UtilHelper.wait(3000);
    //         await driver.wait(until.elementIsVisible(await driver.findElement(By.className('folder-name'))));
    //         let elementFolder = await driver.findElement(By.css(`.folder-name[folder-name="${folderName}"]`));
    //         let valueFolderName = await elementFolder.getText();            
    //         assert.equal(valueFolderName, folderName);
            
    //         // Delete folder after create success
    //         await PortalHelper.deleteFolder(driver, elementFolder);
    //         await UtilHelper.wait(3000);
    //         await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
    //         let eleToastMove = await driver.findElement(By.id('toast-container'));
    //         let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
    //         assert.equal(eleToastMoveText, '1 item was successfully deleted.');
    //         await driver.quit();
    //     } catch (error) {
    //         await driver.quit();
    //         throw error;
    //     }
    // })

    // it('1. Click "Cancel" button', async () => {
    //     /* 
    //         Input: Enter "Name" Test Folder
    //         Output: Folder "TestFolder" is not saved with correct name
    //     */

    //     let driver = await new Builder().forBrowser('chrome')
    //         .setChromeOptions(UtilHelper.getWebOption())
    //         .build();
    //     try {
    //         const folderName = 'Create New Folder Name';
    //         await UtilHelper.goToPortal(driver, config.get('URLPORTAL'));
    //         await PortalHelper.showModalCreateNewFolder(driver);
    //         await driver.findElement(By.css('.form-add-new-folder .input-field input')).sendKeys(folderName);
    //         let elementButtonCancel = await driver.findElement(By.css('.form-add-new-folder .btn-cancel'));
    //         await driver.executeScript("arguments[0].click()", elementButtonCancel);
    //         await UtilHelper.wait(1000);
    //         await driver.wait(until.elementIsVisible(await driver.findElement(By.className('folder-name'))));
    //         let listFolder = await driver.findElements(By.className('folder-name'));
    //         for (let folder of listFolder) {
    //             name = await folder.getText();
    //             assert.notEqual(name, folderName);
    //         }            
    //         await driver.quit();           
    //     } catch (error) {
    //         await driver.quit();
    //         throw error;
    //     }
    // })

    // it('2.1. User create a new folder with Space separated name ', async () => {
    //     /* 
    //         Input: Enter "Name"
    //         Output: Folder is saved with correct name
    //     */

    //     let driver = await new Builder().forBrowser('chrome')
    //         .setChromeOptions(UtilHelper.getWebOption())
    //         .build();
    //     try {
    //         const folderName = 'Create New Folder Name';
    //         await UtilHelper.goToPortal(driver, config.get('URLPORTAL'));
    //         await PortalHelper.showModalCreateNewFolder(driver);
    //         await PortalHelper.saveNewFolder(driver, folderName);
    //         await UtilHelper.wait(3000);
    //         await driver.wait(until.elementIsVisible(await driver.findElement(By.className('folder-name'))));
    //         let elementFolder = await driver.findElement(By.css(`.folder-name[folder-name="${folderName}"]`));
    //         let valueFolderName = await elementFolder.getText();            
    //         assert.equal(valueFolderName, folderName);

    //         // Delete folder after create success
    //         await PortalHelper.deleteFolder(driver, elementFolder);
    //         await UtilHelper.wait(3000);
    //         await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
    //         let eleToastMove = await driver.findElement(By.id('toast-container'));
    //         let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
    //         assert.equal(eleToastMoveText, '1 item was successfully deleted.');
    //         await driver.quit();
    //     } catch (error) {
    //         await driver.quit();
    //         throw error;
    //     }
    // })

    // it('2.2. User create a new folder with number and text in "Name"', async () => {
    //     /* 
    //         Input: Enter "Name"
    //         Output: Folder is saved with correct name
    //     */

    //     let driver = await new Builder().forBrowser('chrome')
    //         .setChromeOptions(UtilHelper.getWebOption())
    //         .build();
    //     try {
    //         const folderName = 'Create New Folder Name 1';
    //         await UtilHelper.goToPortal(driver, config.get('URLPORTAL'));
    //         await PortalHelper.showModalCreateNewFolder(driver);
    //         await PortalHelper.saveNewFolder(driver, folderName);
    //         await UtilHelper.wait(3000);
    //         await driver.wait(until.elementIsVisible(await driver.findElement(By.className('folder-name'))));
    //         let elementFolder = await driver.findElement(By.css(`.folder-name[folder-name="${folderName}"]`));
    //         let valueFolderName = await elementFolder.getText();
    //         assert.equal(valueFolderName, folderName); 

    //         // Delete folder after create success
    //         await PortalHelper.deleteFolder(driver, elementFolder);
    //         await UtilHelper.wait(3000);
    //         await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
    //         let eleToastMove = await driver.findElement(By.id('toast-container'));
    //         let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
    //         assert.equal(eleToastMoveText, '1 item was successfully deleted.');
    //         await driver.quit();
    //     } catch (error) {
    //         await driver.quit();
    //         throw error;
    //     }
    // })

    // it('2.3. User create a new folder with Invalid name', async () => {
    //     /* 
    //         Input: Enter "Name": Text = test + character:   / : * ? " < > | 
    //         Output: Show error:  Red line with an error "A filename cannot contain any of the following characters: / : * ? " < > |" 
    //     */

    //     let driver = await new Builder().forBrowser('chrome')
    //         .setChromeOptions(UtilHelper.getWebOption())
    //         .build();
    //     try {
    //         const folderName = 'Create New Folder Name 1 /';
    //         await UtilHelper.goToPortal(driver, config.get('URLPORTAL'));
    //         await PortalHelper.showModalCreateNewFolder(driver);            
    //         await PortalHelper.saveNewFolder(driver, folderName);
    //         let messageError = await driver.findElement(By.id('new-folder-name-error')).getText();
    //         await driver.quit();   
    //         assert.equal(messageError, `A filename cannot contain any of the following characters: / : * ? " < > |`);           
    //     } catch (error) {
    //         await driver.quit();
    //         throw error;
    //     }
    // })

    // it('2.4. User create a new folder with empty name', async () => {
    //     /* 
    //         Input: Empty text
    //         Output: Show error:  Required
    //     */

    //     let driver = await new Builder().forBrowser('chrome')
    //         .setChromeOptions(UtilHelper.getWebOption())
    //         .build();
    //     try {
    //         await UtilHelper.goToPortal(driver, config.get('URLPORTAL'));
    //         await PortalHelper.showModalCreateNewFolder(driver);
    //         let elementButtonSave = await driver.findElement(By.css('.form-add-new-folder .btn-save'));
    //         await driver.executeScript("arguments[0].click()", elementButtonSave);
    //         let messageError = await driver.findElement(By.id('new-folder-name-error')).getText();
    //         await driver.quit();
    //         assert.equal(messageError, `Required`);           
    //     } catch (error) {
    //         await driver.quit();
    //         throw error;
    //     }
    // })

    // it('3. User create a new folder with existing name on Folder management', async () => {
    //     /* 
    //         Input: Enter "Name" Test (Folder Test is exist)
    //         Output: Folder is saved with correct name
    //     */

    //     let driver = await new Builder().forBrowser('chrome')
    //         .setChromeOptions(UtilHelper.getWebOption())
    //         .build();
    //     try {
    //         await UtilHelper.goToPortal(driver, config.get('URLPORTAL'));
    //         await PortalHelper.showModalCreateNewFolder(driver);
    //         await PortalHelper.saveNewFolder(driver, 'Test');
    //         await UtilHelper.wait(3000);
    //         await driver.wait(until.elementIsVisible(await driver.findElement(By.id('modal-error'))));
    //         let messageError = await driver.findElement(By.css('#modal-error .message')).getText();
    //         assert.equal(messageError, 'Exist folder have same name');           
    //         await driver.quit();           
    //     } catch (error) {
    //         await driver.quit();
    //         throw error;
    //     }
    // })

    // it('4. User create a new folder with existing name in unlocked folder. Click to folder "Test"', async () => {
    //     /* 
    //         Input: Create child folder "Test" on folder "Test" 
    //         Output: Show name of folder at the top of Folder Management with button "New"
    //     */

    //     let driver = await new Builder().forBrowser('chrome')
    //         .setChromeOptions(UtilHelper.getWebOption())
    //         .build();
    //     try {
    //         const folderName = 'Create New Folder Name';
    //         await UtilHelper.goToPortal(driver, 'https://staging.terva.ag/mapTab?id=5d94603ab3cb94706c7bf609&folder=5dfb22f709915b67b25ec4b6');
    //         await PortalHelper.showModalCreateNewFolder(driver);
    //         await PortalHelper.saveNewFolder(driver, folderName);
    //         await UtilHelper.wait(3000);
    //         let elementFolder = await driver.findElement(By.css(`.folder-name[folder-name="${folderName}"]`));
    //         let valueFolderName = await elementFolder.getText();            
    //         assert.equal(valueFolderName, folderName);

    //         // Delete folder after create success
    //         await PortalHelper.deleteFolder(driver, elementFolder);
    //         await UtilHelper.wait(3000);
    //         await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
    //         let eleToastMove = await driver.findElement(By.id('toast-container'));
    //         let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
    //         assert.equal(eleToastMoveText, '1 item was successfully deleted.');
    //         await driver.quit();
    //     } catch (error) {
    //         await driver.quit();
    //         throw error;
    //     }
    // })

    // it('5. User create a new folder in locked folder by admin account', async () => {
    //     /* 
    //         Input: Create child folder "Test" on folder "aa" 
    //         Output: Show name of folder at the top of Folder Management with button "New"
    //                 Folder is saved with correct name and convert to a locked folder
    //                 Folder is the child folder of "aa" 
    //     */

    //     let driver = await new Builder().forBrowser('chrome')
    //         .setChromeOptions(UtilHelper.getWebOption())
    //         .build();
    //     try {
    //         const folderName = 'Create New Folder Name';
    //         await UtilHelper.goToPortal(driver, 'https://staging.terva.ag/mapTab?id=5d94603ab3cb94706c7bf609&folder=5dccd1751656d47492857394');
    //         await PortalHelper.showModalCreateNewFolder(driver);
    //         await PortalHelper.saveNewFolder(driver, folderName);
    //         await UtilHelper.wait(3000);
    //         let elementFolder = await driver.findElement(By.css(`.folder-name[folder-name=${folderName}]`));
    //         let parentElementFolder = await driver.executeScript("return arguments[0].parentNode;", elementFolder);
    //         let elementLockFolder = await parentElementFolder.findElement(By.className('icon-permission'));
    //         let iconLockFolder = await elementLockFolder.getText();
    //         assert.equal(iconLockFolder, "lock");
    //         let valueFolderName = await elementFolder.getText();            
    //         assert.equal(valueFolderName, folderName);

    //         // Delete folder after create success
    //         await PortalHelper.deleteFolder(driver, elementFolder);
    //         await UtilHelper.wait(3000);
    //         await driver.wait(until.elementIsVisible(await driver.findElement(By.id('toast-container'))));
    //         let eleToastMove = await driver.findElement(By.id('toast-container'));
    //         let eleToastMoveText = await eleToastMove.findElement(By.className('toast')).getText();
    //         assert.equal(eleToastMoveText, '1 item was successfully deleted.');
    //         await driver.quit();            
    //     } catch (error) {
    //         await driver.quit();
    //         throw error;
    //     }
    // })
})