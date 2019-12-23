const config = require('config');
const { Builder, By, until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const assert = require('assert');

const UtilHelper = require('../../helpers/util.helper');
const PortalHelper = require('../../helpers/portal.helper');

describe('/VIEW HIDE FOLDER FUNCTION', () => {
    it('1.1.1 Check view/hide the unlocked folder. Hover to the "Eye" icon', async () => {
        /* 
            Input: 1. Hover to the "Eye" icon (Folder: 1 Unlock Folder View Hide)
            Output: - "Eye" icon has a crossline
                    - Show tooltip "Click to view"
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLPORTAL'), true);
            await UtilHelper.wait(5000);

            await PortalHelper.openAllFolderMapViewOption(driver);
            const actions = driver.actions({bridge: true});
            let elementMapViewOption = await driver.findElement(By.id('list-view-left'));
            let elementUnlockFolder = elementMapViewOption.findElement(By.id("5dfb3756d8116403ac3d9248"));
            await driver.executeScript("arguments[0].scrollIntoView(true);", elementUnlockFolder);
            let iconEyeOff = await elementUnlockFolder.findElement(By.css('.btn-visibility-off'));
            let iconEyeOn = await elementUnlockFolder.findElement(By.css('.btn-visibility'));           
            let attrEyeOff = await iconEyeOff.getAttribute("class");
            let attrEyeOn = await iconEyeOn.getAttribute("class");           
            if (attrEyeOff.includes("active")) {
                await actions.move({origin:iconEyeOff}).perform();
                let dataTooltip = await iconEyeOff.getAttribute("data-tooltip");
                assert.equal(dataTooltip, "Click to view");
                await driver.quit();
            } else if (attrEyeOn.includes("active")) {
                await actions.move({origin:iconEyeOn}).perform();
                let dataTooltip = await iconEyeOn.getAttribute("data-tooltip");
                assert.equal(dataTooltip, "Click to hide");
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('1.1.2 Check view/hide the unlocked folder', async () => {
        /* 
            Input: 2. Click to "Eye" to view (Folder: 1 Unlock Folder View Hide)
            Output: - All the dots and shapefiles will have the "Eye" icon to view 
                    - All the dots and shapefiles will be viewed on map
                    - The number or "Viewable" will be increased by the number of files in folder
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLPORTAL'), true);
            await UtilHelper.wait(5000);

            let totalViewable = await driver.findElement(By.css(".icon-list-folder"));            
            totalViewable = await totalViewable.getText();
            totalViewable = parseInt(totalViewable.replace(/\D/g, ""));
            await PortalHelper.openAllFolderMapViewOption(driver);
            const actions = driver.actions({bridge: true});
            let elementMapViewOption = await driver.findElement(By.id('list-view-left'));
            let elementUnlockFolder = elementMapViewOption.findElement(By.id("5dfb3756d8116403ac3d9248"));
            await driver.executeScript("arguments[0].scrollIntoView(true);", elementUnlockFolder);
            let iconEyeOff = await elementUnlockFolder.findElement(By.css('.btn-visibility-off'));
            let iconEyeOn = await elementUnlockFolder.findElement(By.css('.btn-visibility'));
            let attrEyeOff = await iconEyeOff.getAttribute("class");
            let attrEyeOn = await iconEyeOn.getAttribute("class");           
            if (attrEyeOff.includes("active")) {
                await actions.move({origin:iconEyeOff}).click().perform();
                await UtilHelper.wait(4000);
                let newViewable = await driver.findElement(By.css(".icon-list-folder"));            
                newViewable = await newViewable.getText();
                newViewable = parseInt(newViewable.replace(/\D/g, ""));
                assert.equal(newViewable > totalViewable, true);
                await driver.quit();
            } else if (attrEyeOn.includes("active")) {
                await actions.move({origin:iconEyeOn}).click().perform();
                await UtilHelper.wait(4000);
                let newViewable = await driver.findElement(By.css(".icon-list-folder"));            
                newViewable = await newViewable.getText();
                newViewable = parseInt(newViewable.replace(/\D/g, ""));
                assert.equal(newViewable < totalViewable, true);
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('1.1.3 Check view/hide the unlocked folder. Click to a dot or shapefile in the folder in Map view options', async () => {
        /* 
            Input: 3. Click to a dot or shapefile in the folder in Map view options (Folder: 1 Unlock Folder View Hide)
            Output: - All the dots and shapefiles will have the "Eye" icon to view 
                    - All the dots and shapefiles will be viewed on map
                    - The number or "Viewable" will be increased by the number of files in folder
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLPORTAL'), true);
            await UtilHelper.wait(5000);

            await PortalHelper.openAllFolderMapViewOption(driver);
            let elementMapViewOption = await driver.findElement(By.id('list-view-left'));
            let elementUnlockFolder = elementMapViewOption.findElement(By.id("5dfb3756d8116403ac3d9248"));
            await driver.executeScript("arguments[0].scrollIntoView(true);", elementUnlockFolder);
            let elementButtonSeeMoreFolderAA = await elementUnlockFolder.findElement(By.css('.jstree-ocl:nth-of-type(1)'));
            await driver.executeScript("arguments[0].click()", elementButtonSeeMoreFolderAA);
            await UtilHelper.wait(1000);
            let elementShapefile = elementMapViewOption.findElement(By.id("5dfb3763d8116403ac3d9249"));
            let iconEyeOff = await elementShapefile.findElement(By.css('.btn-visibility-off'));
            let iconEyeOn = await elementShapefile.findElement(By.css('.btn-visibility'));
            let attrEyeOff = await iconEyeOff.getAttribute("class");
            let attrEyeOn = await iconEyeOn.getAttribute("class");
            if (attrEyeOff.includes("active")) {
                let shapefileDot = await elementShapefile.findElement(By.css('.custom-folder-name'));
                await driver.executeScript("arguments[0].click()", shapefileDot);
                await UtilHelper.wait(2000);
                await driver.findElements(By.css('.popup-map-search-header-text')).then(function(elements) {
                    assert.equal(elements.length, 0);
                })
                await driver.quit();
            } else if (attrEyeOn.includes("active")) {
                let shapefileDot = await elementShapefile.findElement(By.css('.custom-folder-name'));
                await driver.executeScript("arguments[0].click()", shapefileDot);
                await UtilHelper.wait(2000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.css(".popup-map-search-header-text"))));
                let popupShapefile = await driver.findElement(By.css(".popup-map-search-header-text"));
                let nameShapefile = await popupShapefile.findElement(By.css('.title-text')).getText();
                assert.equal(nameShapefile, "Test dot");
                await driver.quit()
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('1.1.4 Check view/hide the unlocked folder. Click to a dot in the county folder in Folder management on the right site', async () => {
        /* 
            Input: 4. Click to a dot in the county folder in Folder management on the right site (Folder: 1 Unlock Folder View Hide)
            Output: - All the dots and shapefiles will have the "Eye" icon to view 
                    - All the dots and shapefiles will be viewed on map
                    - The number or "Viewable" will be increased by the number of files in folder
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLPORTAL'), true);
            await UtilHelper.wait(5000);

            await PortalHelper.openAllFolderMapViewOption(driver);
            let elementMapViewOption = await driver.findElement(By.id('list-view-left'));
            let elementUnlockFolder = elementMapViewOption.findElement(By.id("5dfb3756d8116403ac3d9248"));
            await driver.executeScript("arguments[0].scrollIntoView(true);", elementUnlockFolder);
            let elementButtonSeeMoreUnlockFolder = await elementUnlockFolder.findElement(By.css('.jstree-ocl:nth-of-type(1)'));
            await driver.executeScript("arguments[0].click()", elementButtonSeeMoreUnlockFolder);
            await UtilHelper.wait(1000);
            let elementShapefile = elementMapViewOption.findElement(By.id("5dfb3763d8116403ac3d9249"));
            let iconEyeOff = await elementShapefile.findElement(By.css('.btn-visibility-off'));
            let iconEyeOn = await elementShapefile.findElement(By.css('.btn-visibility'));
            let attrEyeOff = await iconEyeOff.getAttribute("class");
            let attrEyeOn = await iconEyeOn.getAttribute("class");
            if (attrEyeOff.includes("active")) {                
                let folderTab = await driver.findElement(By.id('folder-tab'));
                let unlockFolderTab = await folderTab.findElement(By.css('.folder-name[folder-name="1 Unlock Folder View Hide"]'));
                await driver.executeScript("arguments[0].click()", unlockFolderTab);
                await UtilHelper.wait(3000);
                let unlockDotFolderTab = await folderTab.findElement(By.css('.dot-name[data-tooltip="Test dot"]'));
                await driver.executeScript("arguments[0].click()", unlockDotFolderTab);
                await UtilHelper.wait(3000);
                await driver.findElements(By.css('.popup-map-search-header-text')).then(function(elements) {
                    assert.equal(elements.length, 0);
                })
                await driver.quit();
            } else if (attrEyeOn.includes("active")) {                
                let folderTab = await driver.findElement(By.id('folder-tab'));
                let unlockFolderTab = await folderTab.findElement(By.css('.folder-name[folder-name="1 Unlock Folder View Hide"]'));
                await driver.executeScript("arguments[0].click()", unlockFolderTab);
                await UtilHelper.wait(3000);
                let unlockDotFolderTab = await folderTab.findElement(By.css('.dot-name[data-tooltip="Test dot"]'));
                await driver.executeScript("arguments[0].click()", unlockDotFolderTab);
                await UtilHelper.wait(3000);
                let popupShapefile = await driver.findElement(By.css(".popup-map-search-header-text"));
                let nameShapefile = await popupShapefile.findElement(By.css('.title-text')).getText();
                assert.equal(nameShapefile, "Test dot");
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('1.2.1 Check view/hide the unlocked dots or shapefiles. Hover to the "Eye" icon', async () => {
        /* 
            Input: 1. Hover to the "Eye" icon
            Output: - "Eye" icon has a crossline
                    - Show tooltip "Click to view"
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLPORTAL'), true);
            await UtilHelper.wait(5000);

            await PortalHelper.openAllFolderMapViewOption(driver);
            const actions = driver.actions({bridge: true});
            let elementEye = await driver.findElement(By.css('.icon-shapefile'));
            let parentelementEye = await driver.executeScript("return arguments[0].parentNode;", elementEye);
            let iconEyeOff = await parentelementEye.findElement(By.css('.btn-visibility-off'));
            let iconEyeOn = await parentelementEye.findElement(By.css('.btn-visibility'));           
            let attrEyeOff = await iconEyeOff.getAttribute("class");
            let attrEyeOn = await iconEyeOn.getAttribute("class");           
            if (attrEyeOff.includes("active")) {
                await actions.move({origin:iconEyeOff}).perform();
                let dataTooltip = await iconEyeOff.getAttribute("data-tooltip");
                assert.equal(dataTooltip, "Click to view");
                await driver.quit();
            } else if (attrEyeOn.includes("active")) {
                await actions.move({origin:iconEyeOn}).perform();
                let dataTooltip = await iconEyeOn.getAttribute("data-tooltip");
                assert.equal(dataTooltip, "Click to hide");
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('1.2.2 Check view/hide the unlocked dots or shapefiles', async () => {
        /* 
            Input: 2. Click to "Eye" to view
            Output: - Dot will have the "Eye" icon to view 
                    - Dot will be viewed on map
                    - The number or "Viewable" will be increased
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLPORTAL'), true);
            await UtilHelper.wait(5000);

            let totalViewable = await driver.findElement(By.css(".icon-list-folder"));            
            totalViewable = await totalViewable.getText();
            totalViewable = parseInt(totalViewable.replace(/\D/g, ""));
            await PortalHelper.openAllFolderMapViewOption(driver);
            const actions = driver.actions({bridge: true});
            let elementEye = await driver.findElement(By.css('.icon-shapefile'));
            let parentElementEye = await driver.executeScript("return arguments[0].parentNode;", elementEye);
            let iconEyeOff = await parentElementEye.findElement(By.css('.btn-visibility-off'));
            let iconEyeOn = await parentElementEye.findElement(By.css('.btn-visibility'));           
            let attrEyeOff = await iconEyeOff.getAttribute("class");
            let attrEyeOn = await iconEyeOn.getAttribute("class");           
            if (attrEyeOff.includes("active")) {
                let dataTooltip = await iconEyeOff.getAttribute("data-tooltip");
                await actions.move({origin:iconEyeOff}).click().perform();
                assert.equal(dataTooltip, "Click to view");
                await UtilHelper.wait(4000);
                let newViewable = await driver.findElement(By.css(".icon-list-folder"));            
                newViewable = await newViewable.getText();
                newViewable = parseInt(newViewable.replace(/\D/g, ""));
                assert.equal(newViewable == totalViewable + 1, true);
                await driver.quit();
            } else if (attrEyeOn.includes("active")) {
                let dataTooltip = await iconEyeOn.getAttribute("data-tooltip");
                await actions.move({origin:iconEyeOn}).click().perform();
                assert.equal(dataTooltip, "Click to hide");
                await UtilHelper.wait(4000);
                let newViewable = await driver.findElement(By.css(".icon-list-folder"));            
                newViewable = await newViewable.getText();
                newViewable = parseInt(newViewable.replace(/\D/g, ""));
                assert.equal(newViewable == totalViewable - 1, true);
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('1.2.3. Check view/hide the unlocked dots or shapefiles. Click to a dot or shapefile in the folder in Map view options', async () => {
        /* 
            Input: 3. Click to a dot or shapefile in the folder in Map view options 
            Output: Dot (shapefile): 357.kml
                    * IF dot is viewed
                        - The dot is displayed on the map 
                        - Show popup with detail info about the dot on the map
                        - There is a small circle around the dot
                    * IF dot is hided
                        - The dot is not displayed on the map
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLPORTAL'), true);
            await UtilHelper.wait(5000);

            await PortalHelper.openAllFolderMapViewOption(driver);
            let dataTreeView = await driver.findElement(By.id('list-view-left'));
            let elementEye = await dataTreeView.findElement(By.id('5db97a8da0c42b4029326dc4'));
            let iconEyeOff = await elementEye.findElement(By.css('.btn-visibility-off'));
            let iconEyeOn = await elementEye.findElement(By.css('.btn-visibility'));           
            let attrEyeOff = await iconEyeOff.getAttribute("class");
            let attrEyeOn = await iconEyeOn.getAttribute("class");           
            if (attrEyeOff.includes("active")) {                
                let shapefileDot = await elementEye.findElement(By.css('.custom-folder-name'));
                await driver.executeScript("arguments[0].click()", shapefileDot);
                await UtilHelper.wait(2000);
                await driver.findElements(By.css('.popup-map-search-header-text')).then(function(elements) {
                    assert.equal(elements.length, 0);
                })
                await driver.quit();
            } else if (attrEyeOn.includes("active")) {                
                let shapefileDot = await elementEye.findElement(By.css('.custom-folder-name'));
                await driver.executeScript("arguments[0].click()", shapefileDot);
                await UtilHelper.wait(2000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.css(".popup-map-search-header-text"))));
                let popupShapefile = await driver.findElement(By.css(".popup-map-search-header-text"));
                let nameShapefile = await popupShapefile.findElement(By.css('.title-text')).getText();
                assert.equal(nameShapefile, "357");
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('1.2.4. Check view/hide the unlocked dots or shapefiles. Click to a dot or shapefile in the folder in Folder management on the right site', async () => {
        /* 
            Input: 4. Click to a dot or shapefile in the folder in Folder management on the right site
            Output: Dot (shapefile): 357.kml
                    * IF dot is viewed
                        - The dot is displayed on the map 
                        - Show popup with detail info about the dot on the map
                        - There is a small circle around the dot
                    * IF dot is hided
                        - The dot is not displayed on the map
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLPORTAL'), true);
            await UtilHelper.wait(5000);
            
            await PortalHelper.openAllFolderMapViewOption(driver);
            let dataTreeView = await driver.findElement(By.id('list-view-left'));
            let elementEye = await dataTreeView.findElement(By.id('5db97a8da0c42b4029326dc4'));
            let iconEyeOff = await elementEye.findElement(By.css('.btn-visibility-off'));
            let iconEyeOn = await elementEye.findElement(By.css('.btn-visibility'));           
            let attrEyeOff = await iconEyeOff.getAttribute("class");
            let attrEyeOn = await iconEyeOn.getAttribute("class");           
            if (attrEyeOff.includes("active")) {                
                let folderTab = await driver.findElement(By.id('folder-tab'));
                let shapefileDotFolderTab = await folderTab.findElement(By.css('.folder-name[folder-name="357.kml"]'));
                await driver.executeScript("arguments[0].click()", shapefileDotFolderTab);
                await UtilHelper.wait(2000);
                await driver.findElements(By.css('.popup-map-search-header-text')).then(function(elements) {
                    assert.equal(elements.length, 0);
                })
                await driver.quit();
            } else if (attrEyeOn.includes("active")) {                
                let folderTab = await driver.findElement(By.id('folder-tab'));
                let shapefileDotFolderTab = await folderTab.findElement(By.css('.folder-name[folder-name="357.kml"]'));
                await driver.executeScript("arguments[0].click()", shapefileDotFolderTab);
                await UtilHelper.wait(3000);
                let popupShapefile = await driver.findElement(By.css(".popup-map-search-header-text"));
                let nameShapefile = await popupShapefile.findElement(By.css('.title-text')).getText();
                assert.equal(nameShapefile, "357");
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.1.1 Check view/hide the Dots Folder locked. Hover to the "Eye" icon', async () => {
        /* 
            Input: 1. Hover to the "Eye" icon (Lock Folder: 1 Lock Folder View Hide)
            Output: - "Eye" icon has a crossline
                    - Show tooltip "Click to view"
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLPORTAL'), true);
            await UtilHelper.wait(5000);
            
            await PortalHelper.openAllFolderMapViewOption(driver);
            const actions = driver.actions({bridge: true});
            let elementLockFolder = await driver.findElement(By.id('5df9c69309915b67b25ec49b'));
            let iconEyeOff = await elementLockFolder.findElement(By.css('.btn-visibility-off'));
            let iconEyeOn = await elementLockFolder.findElement(By.css('.btn-visibility'));           
            let attrEyeOff = await iconEyeOff.getAttribute("class");
            let attrEyeOn = await iconEyeOn.getAttribute("class");           
            if (attrEyeOff.includes("active")) {
                await actions.move({origin:iconEyeOff}).perform();
                let dataTooltip = await iconEyeOff.getAttribute("data-tooltip");
                assert.equal(dataTooltip, "Click to view");
                await driver.quit();
            } else if (attrEyeOn.includes("active")) {
                await actions.move({origin:iconEyeOn}).perform();
                let dataTooltip = await iconEyeOn.getAttribute("data-tooltip");
                assert.equal(dataTooltip, "Click to hide");
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.1.2. Check view/hide the Dots Folder locked', async () => {
        /* 
            Input: 1. Hover to the "Eye" icon (Lock Folder: 1 Lock Folder View Hide)
            Output: - All the state and county folderwill have the "Eye" icon to view (not show the dots and shapefiles in the folder)
                    - All the dots and shapefiles in state and county folder will be viewed on map
                    - The number or "Viewable" will be increased by the number of files in folder
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLPORTAL'), true);
            await UtilHelper.wait(5000);
            
            let totalViewable = await driver.findElement(By.css(".icon-list-folder"));            
            totalViewable = await totalViewable.getText();
            totalViewable = parseInt(totalViewable.replace(/\D/g, ""));
            await PortalHelper.openAllFolderMapViewOption(driver);
            const actions = driver.actions({bridge: true});
            let elementLockFolder = await driver.findElement(By.id('5df9c69309915b67b25ec49b'));
            let iconEyeOff = await elementLockFolder.findElement(By.css('.btn-visibility-off'));
            let iconEyeOn = await elementLockFolder.findElement(By.css('.btn-visibility'));           
            let attrEyeOff = await iconEyeOff.getAttribute("class");
            let attrEyeOn = await iconEyeOn.getAttribute("class");           
            if (attrEyeOff.includes("active")) {
                let dataTooltip = await iconEyeOff.getAttribute("data-tooltip");
                assert.equal(dataTooltip, "Click to view");
                await actions.move({origin:iconEyeOff}).click().perform();
                await UtilHelper.wait(4000);
                let newViewable = await driver.findElement(By.css(".icon-list-folder"));            
                newViewable = await newViewable.getText();
                newViewable = parseInt(newViewable.replace(/\D/g, ""));
                assert.equal(newViewable > totalViewable, true);
                await driver.quit();
            } else if (attrEyeOn.includes("active")) {
                let dataTooltip = await iconEyeOn.getAttribute("data-tooltip");
                assert.equal(dataTooltip, "Click to hide");
                await actions.move({origin:iconEyeOn}).click().perform();
                await UtilHelper.wait(4000);
                let newViewable = await driver.findElement(By.css(".icon-list-folder"));            
                newViewable = await newViewable.getText();
                newViewable = parseInt(newViewable.replace(/\D/g, ""));
                assert.equal(newViewable < totalViewable, true);
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.1.3. Check view/hide the Dots Folder locked. Click to a dot in Map view options', async () => {
        /* 
            Input: 3. Click to a dot in Map view options (Lock Folder: 1 Lock Folder View Hide)
            Output: Dot (shapefile): 357.kml
                    * IF dot is viewed
                        - The dot is displayed on the map 
                        - Show popup with detail info about the dot on the map
                        - There is a small circle around the dot
                    * IF dot is hided
                        - The dot is not displayed on the map
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLPORTAL'), true);
            await UtilHelper.wait(5000);
            
            await PortalHelper.openAllFolderMapViewOption(driver);
            let dataTreeView = await driver.findElement(By.id('list-view-left'));
            let lockFolder = await dataTreeView.findElement(By.id('5df9c69309915b67b25ec49b'));
            await driver.executeScript("arguments[0].scrollIntoView(true);", lockFolder);
            let elementButtonSeeMoreLockFolder = await lockFolder.findElement(By.css('.jstree-ocl'));
            await driver.executeScript("arguments[0].click()", elementButtonSeeMoreLockFolder);
            await UtilHelper.wait(1000);
            let elementShapefile = dataTreeView.findElement(By.id("5df9c6b209915b67b25ec49c"));
            let iconEyeOff = await elementShapefile.findElement(By.css('.btn-visibility-off'));
            let iconEyeOn = await elementShapefile.findElement(By.css('.btn-visibility'));           
            let attrEyeOff = await iconEyeOff.getAttribute("class");
            let attrEyeOn = await iconEyeOn.getAttribute("class");           
            if (attrEyeOff.includes("active")) {
                let shapefileDot = await elementShapefile.findElement(By.css('.custom-folder-name'));
                await driver.executeScript("arguments[0].click()", shapefileDot);
                await UtilHelper.wait(2000);
                await driver.findElements(By.css('.popup-map-search-header-text')).then(function(elements) {
                    assert.equal(elements.length, 0);
                })
                await driver.quit();
            } else if (attrEyeOn.includes("active")) {
                let shapefileDot = await elementShapefile.findElement(By.css('.custom-folder-name'));
                await driver.executeScript("arguments[0].click()", shapefileDot);
                await UtilHelper.wait(2000);
                await driver.wait(until.elementIsVisible(await driver.findElement(By.css(".popup-map-search-header-text"))));
                let popupShapefile = await driver.findElement(By.css(".popup-map-search-header-text"));
                let nameShapefile = await popupShapefile.findElement(By.css('.title-text')).getText();
                assert.equal(nameShapefile, "1 Test View Hide");
                await driver.quit()
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.1.4 Check view/hide the unlocked folder. Click to a dot in the county folder in Folder management on the right site', async () => {
        /* 
            Input: 4. Click to a dot in the county folder in Folder management on the right site (Folder: 1 Unlock Folder View Hide)
            Output: - All the dots and shapefiles will have the "Eye" icon to view 
                    - All the dots and shapefiles will be viewed on map
                    - The number or "Viewable" will be increased by the number of files in folder
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLPORTAL'), true);
            await UtilHelper.wait(5000);

            await PortalHelper.openAllFolderMapViewOption(driver);
            let elementMapViewOption = await driver.findElement(By.id('list-view-left'));
            let elementLockFolder = elementMapViewOption.findElement(By.id("5df9c69309915b67b25ec49b"));
            await driver.executeScript("arguments[0].scrollIntoView(true);", elementLockFolder);
            let elementButtonSeeMoreLockFolder = await elementLockFolder.findElement(By.css('.jstree-ocl:nth-of-type(1)'));
            await driver.executeScript("arguments[0].click()", elementButtonSeeMoreLockFolder);
            await UtilHelper.wait(1000);
            let elementShapefile = elementMapViewOption.findElement(By.id("5df9c6b209915b67b25ec49c"));
            let iconEyeOff = await elementShapefile.findElement(By.css('.btn-visibility-off'));
            let iconEyeOn = await elementShapefile.findElement(By.css('.btn-visibility'));
            let attrEyeOff = await iconEyeOff.getAttribute("class");
            let attrEyeOn = await iconEyeOn.getAttribute("class");
            if (attrEyeOff.includes("active")) {                
                let folderTab = await driver.findElement(By.id('folder-tab'));
                let unlockFolderTab = await folderTab.findElement(By.css('.folder-name[folder-name="1 Lock Folder View Hide"]'));
                await driver.executeScript("arguments[0].click()", unlockFolderTab);
                await UtilHelper.wait(3000);
                let unlockDotFolderTab = await folderTab.findElement(By.css('.dot-name[data-tooltip="1 Test View Hide"]'));
                await driver.executeScript("arguments[0].click()", unlockDotFolderTab);
                await UtilHelper.wait(3000);
                await driver.findElements(By.css('.popup-map-search-header-text')).then(function(elements) {
                    assert.equal(elements.length, 0);
                })
                await driver.quit();
            } else if (attrEyeOn.includes("active")) {                
                let folderTab = await driver.findElement(By.id('folder-tab'));
                let unlockFolderTab = await folderTab.findElement(By.css('.folder-name[folder-name="1 Lock Folder View Hide"]'));
                await driver.executeScript("arguments[0].click()", unlockFolderTab);
                await UtilHelper.wait(3000);
                let unlockDotFolderTab = await folderTab.findElement(By.css('.dot-name[data-tooltip="1 Test View Hide"]'));
                await driver.executeScript("arguments[0].click()", unlockDotFolderTab);
                await UtilHelper.wait(3000);
                let popupShapefile = await driver.findElement(By.css(".popup-map-search-header-text"));
                let nameShapefile = await popupShapefile.findElement(By.css('.title-text')).getText();
                assert.equal(nameShapefile, "1 Test View Hide");
                await driver.quit();
            }
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })
})