const config = require('config');
const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');

const UtilHelper = require('../../helpers/util.helper');
const MapBoxHelper = require('../../helpers/mapbox.helper');

describe('/FILTER LANDFORSALE FUNCTION', () => {
    it('1.1. Check search function', async () => {
        /* 
            Input: 1. Search a county/address
            Output: Show list of suggestion of address
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.goToLandForSale(driver);
            await MapBoxHelper.waitLoadLandForSale(driver);        
            await driver.findElement(By.id('autocomplete')).sendKeys('Iowa');
            await UtilHelper.wait(1000);
            let listSearch = await driver.findElements(By.css('.pac-container .pac-item'));
            let listSearchLength = listSearch.length;
            await driver.quit();
            console.log('listSearchLength', listSearchLength);
            assert.equal(listSearchLength, 5);
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.1. Check correct number result search', async () => {
        /* 
            Input: Check correct number result search
            Output: * Check number dot in mapbox = total mapped record in LandForSale sidebar(total Auctions - total Auctions unmapped + total Listings - total Listings unmapped)
                    * LandForSale sidebar
                        - Mapped
                            + Auctions
                                Total mapbox in list bellow =  Total Auctions - Total Auctions unmapped
                                Check number page in pagination is correct
                            + Listings
                                Total mapbox in list bellow =  Total Listings - Total Listings unmapped
                                Check number page in pagination is correct
                        - Unmapped
                            + Auctions
                                Total item in list bellow =  Total Auctions unmapped
                                Check number page in pagination is correct
                            + Listings
                                Total item in list bellow =  Total Listings unmapped
                                Check number page in pagination is correct
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToLandForSale(driver);
            await UtilHelper.wait(3000);
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);            
            let amount = await MapBoxHelper.getTotalPointInMapLandForSale(driver);
            let compareAmount = await MapBoxHelper.getTotalPointInSidebarLandForSale(driver);
            assert.equal(amount, compareAmount);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('Show dropdown list of states', async () => {
        /* 
            Input: Click "States"
            Output: Show dropdown list of States (total = 12 States)
                    All states were checked by default
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            let locatorLoadingFolderIframe = By.className('loading-farmland-iframe');
            await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolderIframe);            
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let element = await driver.findElement(By.css('.select-type .search-label'));
            await driver.executeScript("arguments[0].click()", element)
            await UtilHelper.wait(1000);
            let listInput = await driver.findElements(By.css(".states div ul p input"));
            let listStateLength = listInput.length; 
            for(let input of listInput) {
                status = await input.isSelected();
                assert.equal(status, true);            
            }  
            await driver.quit();   
            assert.equal(listStateLength, 13);            
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('All states were unchecked', async () => {
        /* 
            Input: Click "States"
            Output: Show dropdown list of States (total = 12 States)
                    All states were unchecked by default
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            let locatorLoadingFolderIframe = By.className('loading-farmland-iframe');
            await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolderIframe);            
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let element = await driver.findElement(By.css('.select-type .search-label'));
            await driver.executeScript("arguments[0].click()", element)
            await UtilHelper.wait(1000);
            let elementSelectAll = await driver.findElement(By.id('select-all-states'));
            await driver.executeScript("arguments[0].click()", elementSelectAll);
            let listInput = await driver.findElements(By.css(".states div ul p input"));
            for(let input of listInput) {
                status = await input.isSelected();
                assert.equal(status, false);            
            }
            await driver.quit();   
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('The selected state will has a "check" icon', async () => {
        /* 
            Input: stateSelected: Iowa, Kansas
            Output: Iowa and Kansas were checked
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            let locatorLoadingFolderIframe = By.className('loading-farmland-iframe');
            await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolderIframe);            
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let element = await driver.findElement(By.css('.select-type .search-label'));
            await driver.executeScript("arguments[0].click()", element)
            await UtilHelper.wait(1000);
            let elementSelectAll = await driver.findElement(By.id('select-all-states'));
            await driver.executeScript("arguments[0].click()", elementSelectAll);
            let inputIowa = await driver.findElement(By.id('filled-19'));
            await driver.executeScript("arguments[0].click()", inputIowa);
            let inputKansas = await driver.findElement(By.id('filled-20'));
            await driver.executeScript("arguments[0].click()", inputKansas);
            let statusIowa = await driver.findElement(By.css(".states div ul p input[data-value='19']")).isSelected();
            let statusKansas = await driver.findElement(By.css(".states div ul p input[data-value='20']")).isSelected();
            await driver.quit();
            assert.equal(statusIowa, true);            
            assert.equal(statusKansas, true);            
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.2.4. Only select state Iowa and keep other search and excute search advanced', async () => {
        /* 
            Input: stateSelected: Iowa
            Output: Iowa and Kansas were checked
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            let element = await driver.findElement(By.css('.select-type .search-label'));
            await driver.executeScript("arguments[0].click()", element);
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementSelectAll = await driver.findElement(By.id('select-all-states'));
            await driver.executeScript("arguments[0].click()", elementSelectAll);
            let inputIowa = await driver.findElement(By.id('filled-19'));
            await driver.executeScript("arguments[0].click()", inputIowa);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let listCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let amount = 0;
            for(let cluster of listCluster) {
                amount += parseInt(await cluster.getText()) ;
            }
            let listMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            amount += parseInt(listMarker.length);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.2.5. Unselect all state and keep other search and excute search', async () => {
        /* 
            Input: Unselect all state and keep other search and excute search
            Output: Mapbox: don't show any dot in map
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            let element = await driver.findElement(By.css('.select-type .search-label'));
            await driver.executeScript("arguments[0].click()", element);
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementSelectAll = await driver.findElement(By.id('select-all-states'));
            await driver.executeScript("arguments[0].click()", elementSelectAll);
            let inputIowa = await driver.findElement(By.id('filled-19'));
            await driver.executeScript("arguments[0].click()", inputIowa);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let listCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let amount = 0;
            for(let cluster of listCluster) {
                amount += parseInt(await cluster.getText()) ;
            }
            let listMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            amount += parseInt(listMarker.length);
            await driver.executeScript("arguments[0].click()", element);
            await driver.executeScript("arguments[0].click()", inputIowa);            
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('Click "Counties"', async () => {
        /* 
            Input: Select state Iowa, only show counties in Iowa
            Output: - All the counties will be checked as default
                    - County lists will be sorted alphabetically
                    - Amount of Iowa's counties: 99 + 1(Iowa Select All)
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            let elementState = await driver.findElement(By.css('.select-type .search-label'));
            await driver.executeScript("arguments[0].click()", elementState);
            await UtilHelper.wait(1000);
            let elementSelectAll = await driver.findElement(By.id('select-all-states'));
            await driver.executeScript("arguments[0].click()", elementSelectAll);
            let inputIowa = await driver.findElement(By.id('filled-19'));
            await driver.executeScript("arguments[0].click()", inputIowa);
            await UtilHelper.wait(1000);
            let elementCounty = await driver.findElement(By.css('.search-box-item-county .search-label'));
            await driver.executeScript("arguments[0].click()", elementCounty);
            let listCountyInput = await driver.findElements(By.css(".counties div ul p input"));
            let listCountyLength = listCountyInput.length; 
            for(let county of listCountyInput) {
                status = await county.isSelected();
                assert.equal(status, true); 
            }
            let listCounty = await driver.findElements(By.css(".counties div ul p label"));
            let tempCounty = "";
            for(let county of listCounty) {
                nameCounty = await county.getText();
                assert.equal(status, true); 
                if (nameCounty != "IOWA") {
                    assert.equal(tempCounty.localeCompare(nameCounty), -1);     
                    tempCounty = nameCounty 
                }
            }
            assert.equal(listCountyLength, 100);            
            await driver.quit();           
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it(`Click to box "State's name"`, async () => {
        /* 
            Input: Click to box "State's name"
            Output: - All the counties will be unchecked
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            let elementState = await driver.findElement(By.css('.select-type .search-label'));
            await driver.executeScript("arguments[0].click()", elementState);
            await UtilHelper.wait(1000);
            let elementSelectAll = await driver.findElement(By.id('select-all-states'));
            await driver.executeScript("arguments[0].click()", elementSelectAll);
            let inputIowa = await driver.findElement(By.id('filled-19'));
            await driver.executeScript("arguments[0].click()", inputIowa);
            await UtilHelper.wait(1000);
            let elementCounty = await driver.findElement(By.css('.search-box-item-county .search-label'));
            await driver.executeScript("arguments[0].click()", elementCounty);
            let inputIowaSelectAllCounty = await driver.findElement(By.id('19'));
            await driver.executeScript("arguments[0].click()", inputIowaSelectAllCounty);
            let listCountyInput = await driver.findElements(By.css(".counties div ul p input"));
            for(let county of listCountyInput) {
                status = await county.isSelected();
                assert.equal(status, false); 
            }
            await driver.quit();           
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it(`Click to select counties`, async () => {
        /* 
            Input: countySelected: Benton and Butler
            Output: Benton and Butler were checked
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            let elementState = await driver.findElement(By.css('.select-type .search-label'));
            await driver.executeScript("arguments[0].click()", elementState);
            await UtilHelper.wait(1000);
            let elementSelectAll = await driver.findElement(By.id('select-all-states'));
            await driver.executeScript("arguments[0].click()", elementSelectAll);
            let inputIowa = await driver.findElement(By.id('filled-19'));
            await driver.executeScript("arguments[0].click()", inputIowa);
            await UtilHelper.wait(1000);
            let elementCounty = await driver.findElement(By.css('.search-box-item-county .search-label'));
            await driver.executeScript("arguments[0].click()", elementCounty);
            let inputIowaSelectAllCounty = await driver.findElement(By.id('19'));
            await driver.executeScript("arguments[0].click()", inputIowaSelectAllCounty);
            let inputBenton = await driver.findElement(By.id('filled-19-19011'));
            await driver.executeScript("arguments[0].click()", inputBenton);
            let inputButler = await driver.findElement(By.id('filled-19-19023'));
            await driver.executeScript("arguments[0].click()", inputButler);
            let statusBenton = await driver.findElement(By.css(".counties div ul p input[data-value='19011']")).isSelected();
            let statusButler = await driver.findElement(By.css(".counties div ul p input[data-value='19023']")).isSelected();
            await driver.quit();
            assert.equal(statusBenton, true);            
            assert.equal(statusButler, true);          
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.3.4. Select state Iowa, only select county Benton and keep other search and excute search advanced', async () => {
        /* 
            Input: stateSelected: Iowa
            Output: Benton was checked
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            let element = await driver.findElement(By.css('.select-type .search-label'));
            await driver.executeScript("arguments[0].click()", element)
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            
            let elementSelectAll = await driver.findElement(By.id('select-all-states'));
            await driver.executeScript("arguments[0].click()", elementSelectAll);
            await UtilHelper.wait(1000);
            let inputIowa = await driver.findElement(By.id('filled-19'));
            await driver.executeScript("arguments[0].click()", inputIowa);
            await UtilHelper.wait(1000);
            let elementCounty = await driver.findElement(By.css('.search-box-item-county .search-label'));
            await driver.executeScript("arguments[0].click()", elementCounty);
            await UtilHelper.wait(1000);
            let inputIowaSelectAllCounty = await driver.findElement(By.id('19'));
            await driver.executeScript("arguments[0].click()", inputIowaSelectAllCounty);
            await UtilHelper.wait(1000);
            let inputBenton = await driver.findElement(By.id('filled-19-19011'));
            await driver.executeScript("arguments[0].click()", inputBenton);
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let listCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let amount = 0;
            for(let cluster of listCluster) {
                amount += parseInt(await cluster.getText()) ;
            }
            let listMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            amount += parseInt(listMarker.length);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.3.5. Unselect all county and keep other search and excute search', async () => {
        /* 
            Unselect all county and keep other search and excute search
            Output: Mapbox: don't show any dot in map 

        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));            
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));            
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);            
            let element = await driver.findElement(By.css('.select-type .search-label'));
            await driver.executeScript("arguments[0].click()", element);
            await UtilHelper.wait(1000);
            let elementSelectAll = await driver.findElement(By.id('select-all-states'));
            await driver.executeScript("arguments[0].click()", elementSelectAll);
            await UtilHelper.wait(1000);
            let inputIowa = await driver.findElement(By.id('filled-19'));
            await driver.executeScript("arguments[0].click()", inputIowa);
            await UtilHelper.wait(1000);
            let elementCounty = await driver.findElement(By.css('.search-box-item-county .search-label'));
            await driver.executeScript("arguments[0].click()", elementCounty);
            await UtilHelper.wait(1000);
            let inputIowaSelectAllCounty = await driver.findElement(By.id('19'));
            await driver.executeScript("arguments[0].click()", inputIowaSelectAllCounty);
            await UtilHelper.wait(1000);
            let inputBenton = await driver.findElement(By.id('filled-19-19011'));
            await driver.executeScript("arguments[0].click()", inputBenton);
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);            
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);            
            let listCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let amount = 0;
            for(let cluster of listCluster) {
                amount += parseInt(await cluster.getText()) ;
            }
            let listMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            amount += parseInt(listMarker.length);
            await driver.executeScript("arguments[0].click()", elementCounty);
            await UtilHelper.wait(1000);
            await driver.executeScript("arguments[0].click()", inputBenton);
            await UtilHelper.wait(1000);
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.equal(newAmount != amount, true);            
            let buttonAuction = await driver.findElement(By.className('tabs-click-auction'));
            await driver.executeScript("arguments[0].click()", buttonAuction);
            await UtilHelper.wait(1000);
            let messageResultAuction = await driver.findElement(By.css('#auction p')).getText();
            assert.equal(messageResultAuction, 'No matching results. Try changing your search criteria to include more results.');
            await UtilHelper.wait(1000);
            let buttonListing = await driver.findElement(By.className('tabs-click-listing'));
            await driver.executeScript("arguments[0].click()", buttonListing);
            await UtilHelper.wait(2000);
            let messageResultListing = await driver.findElement(By.css('#listing p')).getText();
            assert.equal(messageResultListing, 'No matching results. Try changing your search criteria to include more results.');            
            await driver.quit();          
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.4.1. Show dropdown list of Land Type', async () => {
        /* 
            Input: Click to "Land Type"
            Output: Show dropdown list of Land Type
                    All were checked by default
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            let element = await driver.findElement(By.css('.type-show .search-label'));
            await driver.executeScript("arguments[0].click()", element)
            await UtilHelper.wait(1000);
            let listInputLandType = await driver.findElements(By.css(".show-dropdown div ul p input"));
            for(let input of listInputLandType) {
                status = await input.isSelected();
                assert.equal(status, true);            
            }  
            await driver.quit();   
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.4.2. Click 1-2 options to unselected', async () => {
        /* 
            Input: Click CropLand and CRPLand Option to unselected
            Output: Show dropdown list of Land Type
                    All were checked by default
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let elementLandType = await driver.findElement(By.css('.type-show .search-label'));
            let listCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let amount = 0;
            for(let cluster of listCluster) {
                amount += parseInt(await cluster.getText()) ;
            }
            let listMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            amount += parseInt(listMarker.length);
            await driver.executeScript("arguments[0].click()", elementLandType);
            await UtilHelper.wait(1000);
            let elementCropLand = await driver.findElement(By.id('filled-crop-land'));
            await driver.executeScript("arguments[0].click()", elementCropLand);
            await UtilHelper.wait(1000);
            let elementCRPLand = await driver.findElement(By.id('filled-crp-land'));
            await driver.executeScript("arguments[0].click()", elementCRPLand);
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.notEqual(amount, newAmount);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.4.4. Unselect all Land Type', async () => {
        /* 
            Input: Click CropLand and CRPLand Option to unselected
            Output: Show dropdown list of Land Type
                    All were checked by default
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            // await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementLandType = await driver.findElement(By.css('.type-show .search-label'));
            await driver.executeScript("arguments[0].click()", elementLandType);
            await UtilHelper.wait(1000);
            let elementCropLand = await driver.findElement(By.id('filled-crop-land'));
            await driver.executeScript("arguments[0].click()", elementCropLand);
            await UtilHelper.wait(1000);
            let elementPastureLand = await driver.findElement(By.id('filled-pasture-land'));
            await driver.executeScript("arguments[0].click()", elementPastureLand);
            await UtilHelper.wait(1000);
            let elementTimberLand = await driver.findElement(By.id('filled-timber-land'));
            await driver.executeScript("arguments[0].click()", elementTimberLand);
            await UtilHelper.wait(1000);
            let elementOtherLand = await driver.findElement(By.id('filled-other'));
            await driver.executeScript("arguments[0].click()", elementOtherLand);
            await UtilHelper.wait(1000);
            let elementCRPLand = await driver.findElement(By.id('filled-crp-land'));
            await driver.executeScript("arguments[0].click()", elementCRPLand);
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);            
            assert.equal(newAmount, 0);
            await UtilHelper.wait(1000);
            let buttonAuction = await driver.findElement(By.className('tabs-click-auction'));
            await driver.executeScript("arguments[0].click()", buttonAuction);
            let messageResultAuction = await driver.findElement(By.css('#auction p')).getText();
            assert.equal(messageResultAuction, 'No matching results. Try changing your search criteria to include more results.');            
            let buttonListing = await driver.findElement(By.className('tabs-click-listing'));
            await driver.executeScript("arguments[0].click()", buttonListing);
            await UtilHelper.wait(2000);
            let messageResultListing = await driver.findElement(By.css('#listing p')).getText();
            assert.equal(messageResultListing, 'No matching results. Try changing your search criteria to include more results.');
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.5.1. Click to "$/Acre". ', async () => {
        /* 
            Input: 1. Click to "$/Acre"
            Output: Show dropdown list with 2 fields 
                    The list will be sorted from min to max values
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementPriceAcres = await driver.findElement(By.css('.price-arces .search-label'));
            await driver.executeScript("arguments[0].click()", elementPriceAcres);
            let listListFrom = await driver.findElements(By.css(".price-arces .list-choose li"));
            let tempRange = -1;
            for(let option of listListFrom) {
                range = await option.getText();
                range = parseInt(range.substring(1));
                if (!isNaN(range)) {
                    assert.equal(range > tempRange, true);
                    tempRange = range;
                }
            }
            let elementListTo = await driver.findElement(By.css('.price-arces .range-complete input[name="to"]'));
            await driver.executeScript("arguments[0].click()", elementListTo);
            let listListTo = await driver.findElements(By.css(".price-arces .list-choose .align-right"));
            tempRange = -1;
            for(let option of listListTo) {
                range = await option.getText();
                range = parseInt(range.substring(1));
                if (!isNaN(range)) {
                    assert.equal(range > tempRange, true);
                    tempRange = range;
                }
            }
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.5.2. Select the 1st field ', async () => {
        /* 
            Input: Select the 1st field: $3,000
            Output: Show the correct value that selected
                    Move to the 2nd field automatically
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementPriceAcres = await driver.findElement(By.css('.price-arces .search-label'));
            await driver.executeScript("arguments[0].click()", elementPriceAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .list-choose li:nth-of-type(5)')).click();
            let valueFirstList = await driver.findElement(By.css('.price-arces .range-complete input[name="from"]')).getAttribute("value");
            assert.equal(valueFirstList, "$3,000");
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.5.3. Select the 2nd filed ', async () => {
        /* 
            Input: Select the 1st field: $3,000
                Select the 1st field: $6,000
            Output: Show the correct value that selected
                    Move to the 2nd field automatically
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementPriceAcres = await driver.findElement(By.css('.price-arces .search-label'));
            await driver.executeScript("arguments[0].click()", elementPriceAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .list-choose li:nth-of-type(5)')).click();
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .list-choose .align-right:nth-of-type(8)')).click();
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.5.4. Enter invalid value (not number) 1st field = "a" and 2st field = "b"', async () => {
        /* 
            Input: 4. Enter invalid value (not number) 1st field = "a" and 2st field = "b"
            Output: Mapbox: don't show any dot in map 
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementPriceAcres = await driver.findElement(By.css('.price-arces .search-label'));
            await driver.executeScript("arguments[0].click()", elementPriceAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.price-arces .range-complete input[name="from"]')).sendKeys('a');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.price-arces .range-complete input[name="to"]')).sendKeys('b');
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.equal(newAmount, 0);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.5.5. Enter 1st field = $15,000 and 2st field = $14,000', async () => {
        /* 
            Input: 5. Enter 1st field = $15,000 and 2st field = $14,000
            Output: Mapbox: don't show any dot in map
                    LandForSale sidebar: 
                    - Auctions: show text "No results" and dont' show any map in list bellow 
                    - Listings: show text "No results" and dont' show any map in list bellow
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementPriceAcres = await driver.findElement(By.css('.price-arces .search-label'));
            await driver.executeScript("arguments[0].click()", elementPriceAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.price-arces .range-complete input[name="from"]')).sendKeys('$15,000');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.price-arces .range-complete input[name="to"]')).sendKeys('$14,000');
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.equal(newAmount, 0);
            let buttonAuction = await driver.findElement(By.className('tabs-click-auction'));
            await driver.executeScript("arguments[0].click()", buttonAuction);
            await UtilHelper.wait(1000);
            let messageResultAuction = await driver.findElement(By.css('#auction p')).getText();
            assert.equal(messageResultAuction, 'No matching results. Try changing your search criteria to include more results.');            
            let buttonListing = await driver.findElement(By.className('tabs-click-listing'));
            await driver.executeScript("arguments[0].click()", buttonListing);
            await UtilHelper.wait(2000);
            let messageResultListing = await driver.findElement(By.css('#listing p')).getText();
            assert.equal(messageResultListing, 'No matching results. Try changing your search criteria to include more results.');
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.5.6. Enter 1st field = $10,000 and 2st field = $11,000', async () => {
        /* 
            Input: 6. Enter 1st field = $10,000 and 2st field = $11,000
            Output: * Check correct number result search
                    * Mapbox Click random dot in map to show propertyView and check $/Acre of mapbox >= $10,000 & <= $11,000
                    * LandForSale sidebar: 
                        - Mapped 
                            + Auctions: all $/Acre of mapbox >= $10,000 & <= $11,000
                            + Listings: all $/Acre of mapbox >= $10,000 & <= $11,000
                        - Unmapped: 
                            + Auctions: all $/Acre of mapbox >= $10,000 & <= $11,000
                            + Listings: all $/Acre of mapbox >= $10,000 & <= $11,000
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementPriceAcres = await driver.findElement(By.css('.price-arces .search-label'));
            await driver.executeScript("arguments[0].click()", elementPriceAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.price-arces .range-complete input[name="from"]')).sendKeys('$10,000');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.price-arces .range-complete input[name="to"]')).sendKeys('$11,000');
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.notEqual(newAmount, 0);
            let listItemAcreAuctions = await driver.findElements(By.css(".item-acre span"));
            for(let parcel of listItemAcreAuctions) {
                priceAcre = await parcel.getText();
                priceAcre = parseFloat(priceAcre.substring(1,7).replace(",","."))
                if (!isNaN(priceAcre)) {
                    assert.equal(priceAcre >= 10 && priceAcre <= 11, true);
                }
            }
            let buttonListing = await driver.findElement(By.className('tabs-click-listing'));
            await driver.executeScript("arguments[0].click()", buttonListing);
            await UtilHelper.wait(2000);
            let listItemAcreListing = await driver.findElements(By.css(".item-acre span"));
            for(let parcel of listItemAcreListing) {
                priceAcre = await parcel.getText();
                priceAcre = parseFloat(priceAcre.substring(1,7).replace(",","."))
                if (!isNaN(priceAcre)) {
                    assert.equal(priceAcre >= 10 && priceAcre <= 11, true);
                }
            }
             await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.5.7. Enter 1st fields = $10,000 and 2st field = any', async () => {
        /* 
            Input: 7. Enter 1st fields = $10,000 and 2st field = any
            Output: * Check correct number result search
                    * Mapbox Click random dot in map to show propertyView and check $/Acre of mapbox >= $10,000
                    * LandForSale sidebar: 
                        - Mapped 
                            + Auctions: all $/Acre of mapbox >= $10,000
                            + Listings: all $/Acre of mapbox >= $10,000
                        - Unmapped: 
                            + Auctions: all $/Acre of mapbox >= $10,000
                            + Listings: all $/Acre of mapbox >= $10,000
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementPriceAcres = await driver.findElement(By.css('.price-arces .search-label'));
            await driver.executeScript("arguments[0].click()", elementPriceAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.price-arces .range-complete input[name="from"]')).sendKeys('$10,000');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .range-complete input[name="to"]')).click();
            await driver.findElement(By.css('.price-arces .list-choose .align-right:nth-of-type(1)')).click();
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.notEqual(newAmount, 0);
            let listItemAcreAuctions = await driver.findElements(By.css(".item-acre span"));
            for(let parcel of listItemAcreAuctions) {
                priceAcre = await parcel.getText();
                priceAcre = parseFloat(priceAcre.substring(1,7).replace(",","."))
                if (!isNaN(priceAcre)) {
                    assert.equal(priceAcre >= 10, true);
                }
            }
            let buttonListing = await driver.findElement(By.className('tabs-click-listing'));
            await driver.executeScript("arguments[0].click()", buttonListing);
            await UtilHelper.wait(2000);
            let listItemAcreListing = await driver.findElements(By.css(".item-acre span"));
            for(let parcel of listItemAcreListing) {
                priceAcre = await parcel.getText();
                priceAcre = parseFloat(priceAcre.substring(1,7).replace(",","."))
                if (!isNaN(priceAcre)) {
                    assert.equal(priceAcre >= 10, true);
                }
            }
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.6.1. Click to Acres ', async () => {
        /* 
            Input: Click to Acres
            Output: Show dropdown list with 2 fields 
                    The list will be sorted from min to max values
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementAcreSearch = await driver.findElement(By.css('.total-arces .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementAcreSearch);
            let listListFrom = await driver.findElements(By.css(".total-arces .list-choose li"));
            let tempRange = -1;
            for(let option of listListFrom) {
                range = await option.getText();
                range = parseInt(range);
                if (!isNaN(range)) {
                    assert.equal(range > tempRange, true);
                    tempRange = range;
                }
            }
            let elementListTo = await driver.findElement(By.css('.total-arces .range-complete input[name="to"]'));
            await driver.executeScript("arguments[0].click()", elementListTo);
            let listListTo = await driver.findElements(By.css(".total-arces .list-choose .align-right"));
            tempRange = -1;
            for(let option of listListTo) {
                range = await option.getText();
                range = parseInt(range);
                if (!isNaN(range)) {
                    assert.equal(range > tempRange, true);
                    tempRange = range;
                }
            }
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.6.2. Select the 1st field ', async () => {
        /* 
            Input: Select the 1st field: 80
            Output: Show the correct value that selected
                    Move to the 2nd field automatically
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementAcres = await driver.findElement(By.css('.total-arces .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.total-arces .list-choose li:nth-of-type(4)')).click();
            let valueFirstList = await driver.findElement(By.css('.total-arces .range-complete input[name="from"]')).getAttribute("value");
            assert.equal(valueFirstList, "80");
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.6.3. Select the 2nd filed ', async () => {
        /* 
            Input: Select the 1st field: 80
                Select the 1st field: 160
            Output: Show the correct value that selected
                    Move to the 2nd field automatically
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            await UtilHelper.wait(1000);
            let elementAcres = await driver.findElement(By.css('.total-arces .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.total-arces .list-choose li:nth-of-type(4)')).click();
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.total-arces .list-choose .align-right:nth-of-type(6)')).click();
            await UtilHelper.wait(3000);
            let valueSecondList = await driver.findElement(By.css('.total-arces .range-complete input[name="to"]')).getAttribute("value");
            assert.equal(valueSecondList, "160");
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.6.4. Enter invalid value (not number) 1st field = "a" and 2st field = "b"', async () => {
        /* 
            Input: 4. Enter invalid value (not number) 1st field = "a" and 2st field = "b"
            Output: Mapbox: don't show any dot in map 
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementAcres = await driver.findElement(By.css('.total-arces .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.total-arces .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.total-arces .range-complete input[name="from"]')).sendKeys('a');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.total-arces .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.total-arces .range-complete input[name="to"]')).sendKeys('b');
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.equal(newAmount, 0);
            let buttonAuction = await driver.findElement(By.className('tabs-click-auction'));
            await driver.executeScript("arguments[0].click()", buttonAuction);
            await UtilHelper.wait(1000);
            let messageResultAuction = await driver.findElement(By.css('#auction p')).getText();
            assert.equal(messageResultAuction, 'No matching results. Try changing your search criteria to include more results.');            
            let buttonListing = await driver.findElement(By.className('tabs-click-listing'));
            await driver.executeScript("arguments[0].click()", buttonListing);
            await UtilHelper.wait(2000);
            let messageResultListing = await driver.findElement(By.css('#listing p')).getText();
            assert.equal(messageResultListing, 'No matching results. Try changing your search criteria to include more results.');            
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.6.5. Enter 1st field = 40 and 2st field = 30', async () => {
        /* 
            Input: 5. Enter 1st field = 40 and 2st field = 30
            Output: Mapbox: don't show any dot in map
                    LandForSale sidebar: 
                    - Auctions: show text "No results" and dont' show any map in list bellow 
                    - Listings: show text "No results" and dont' show any map in list bellow
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementAcres = await driver.findElement(By.css('.total-arces .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.total-arces .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.total-arces .range-complete input[name="from"]')).sendKeys('40');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.total-arces .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.total-arces .range-complete input[name="to"]')).sendKeys('30');
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.equal(newAmount, 0);
            let buttonAuction = await driver.findElement(By.className('tabs-click-auction'));
            await driver.executeScript("arguments[0].click()", buttonAuction);
            await UtilHelper.wait(1000);
            let messageResultAuction = await driver.findElement(By.css('#auction p')).getText();
            assert.equal(messageResultAuction, 'No matching results. Try changing your search criteria to include more results.');            
            let buttonListing = await driver.findElement(By.className('tabs-click-listing'));
            await driver.executeScript("arguments[0].click()", buttonListing);
            await UtilHelper.wait(2000);
            let messageResultListing = await driver.findElement(By.css('#listing p')).getText();
            assert.equal(messageResultListing, 'No matching results. Try changing your search criteria to include more results.');
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.6.6. Enter 1st field = 40 and 2st field 50', async () => {
        /* 
            Input: 6. Enter 1st field = 40 and 2st field 50
            Output: * Check correct number result search
                    * Mapbox Click random dot in map to show propertyView and check Acres of mapbox >= 40 & <= 50
                    * LandForSale sidebar: 
                        - Mapped 
                            + Auctions: all Acres of mapbox >= 40 & <= 50
                            + Listings: all Acres of mapbox >= 40 & <= 50
                        - Unmapped: 
                            + Auctions: all Acres of mapbox >= 40 & <= 50
                            + Listings: all Acres of mapbox >= 40 & <= 50
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementAcres = await driver.findElement(By.css('.total-arces .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.total-arces .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.total-arces .range-complete input[name="from"]')).sendKeys('40');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.total-arces .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.total-arces .range-complete input[name="to"]')).sendKeys('50');
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.notEqual(newAmount, 0);
            let listItemAcreAuctions = await driver.findElements(By.css(".item-info .lg-text"));
            for(let parcel of listItemAcreAuctions) {
                acre = await parcel.getText();
                acre = parseFloat(acre.replace(" acres",""))
                if (!isNaN(acre)) {
                    assert.equal(acre >= 40 && acre <= 50, true);
                }
            }
            let buttonListing = await driver.findElement(By.className('tabs-click-listing'));
            await driver.executeScript("arguments[0].click()", buttonListing);
            await UtilHelper.wait(2000);
            let listItemAcreListing = await driver.findElements(By.css(".item-info .lg-text"));
            for(let parcel of listItemAcreListing) {
                acre = await parcel.getText();
                acre = parseFloat(acre.replace(" acres",""))
                if (!isNaN(acre)) {
                    assert.equal(acre >= 40 && acre <= 50, true);
                }
            }
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.6.7. Enter 1st fields = 40 and 2st field = any', async () => {
        /* 
            Input: 7. Enter 1st fields = 40 and 2st field = any
            Output: * Check correct number result search
                    * Mapbox Click random dot in map to show propertyView and check Acres of mapbox >= 40
                    * LandForSale sidebar: 
                        - Mapped 
                            + Auctions: all Acres of mapbox >= 40
                            + Listings: all Acres of mapbox >= 40
                        - Unmapped: 
                            + Auctions: all Acres of mapbox >= 40
                            + Listings: all Acres of mapbox >= 40
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementAcres = await driver.findElement(By.css('.total-arces .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.total-arces .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.total-arces .range-complete input[name="from"]')).sendKeys('40');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.total-arces .range-complete input[name="to"]')).click();
            await driver.findElement(By.css('.total-arces .list-choose .align-right:nth-of-type(1)')).click();
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.notEqual(newAmount, 0);
            let listItemAcreAuctions = await driver.findElements(By.css(".item-info .lg-text"));
            for(let parcel of listItemAcreAuctions) {
                acre = await parcel.getText();
                acre = parseFloat(acre.replace(" acres",""))
                if (!isNaN(acre)) {
                    assert.equal(acre >= 40, true);
                }
            }
            let buttonListing = await driver.findElement(By.className('tabs-click-listing'));
            await driver.executeScript("arguments[0].click()", buttonListing);
            await UtilHelper.wait(2000);
            let listItemAcreListing = await driver.findElements(By.css(".item-info .lg-text"));
            for(let parcel of listItemAcreListing) {
                acre = await parcel.getText();
                acre = parseFloat(acre.replace(" acres",""))
                if (!isNaN(acre)) {
                    assert.equal(acre >= 40, true);
                }
            }
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.7.1. Click to Soil Value ', async () => {
        /* 
            Input: 1. Click to Soil Value
            Output: Show dropdown list with 2 fields 
                    The list will be sorted from min to max values
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementSoilValueSearch = await driver.findElement(By.css('.csr2-search .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementSoilValueSearch);
            let listListFrom = await driver.findElements(By.css(".csr2-search .list-choose li"));
            let tempRange = -1;
            for(let option of listListFrom) {
                range = await option.getText();
                range = parseInt(range);
                if (!isNaN(range)) {
                    assert.equal(range > tempRange, true);
                    tempRange = range;
                }
            }
            let elementListTo = await driver.findElement(By.css('.csr2-search .range-complete input[name="to"]'));
            await driver.executeScript("arguments[0].click()", elementListTo);
            let listListTo = await driver.findElements(By.css(".csr2-search .list-choose .align-right"));
            tempRange = -1;
            for(let option of listListTo) {
                range = await option.getText();
                range = parseInt(range);
                if (!isNaN(range)) {
                    assert.equal(range > tempRange, true);
                    tempRange = range;
                }
            }
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.7.2. Select the 1st field ', async () => {
        /* 
            Input: Select the 1st field: 10
            Output: Show the correct value that selected
                    Move to the 2nd field automatically
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementAcres = await driver.findElement(By.css('.csr2-search .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.csr2-search .list-choose li:nth-of-type(4)')).click();
            let valueFirstList = await driver.findElement(By.css('.csr2-search .range-complete input[name="from"]')).getAttribute("value");
            assert.equal(valueFirstList, "10");
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.7.3. Select the 2nd filed ', async () => {
        /* 
            Input: Select the 1st field: 10
                Select the 1st field: 20
            Output: Show the correct value that selected
                    Move to the 2nd field automatically
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementSoilValue = await driver.findElement(By.css('.csr2-search .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementSoilValue);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.csr2-search .list-choose li:nth-of-type(4)')).click();
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.csr2-search .list-choose .align-right:nth-of-type(6)')).click();
            await UtilHelper.wait(3000);
            let valueSecondList = await driver.findElement(By.css('.csr2-search .range-complete input[name="to"]')).getAttribute("value");
            assert.equal(valueSecondList, "20");
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.7.4. Enter invalid value (not number) 1st field = "a" and 2st field = "b"', async () => {
        /* 
            Input: 4. Enter invalid value (not number) 1st field = "a" and 2st field = "b"
            Output: Mapbox: don't show any dot in map 
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementSoilValue = await driver.findElement(By.css('.csr2-search .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementSoilValue);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.csr2-search .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.csr2-search .range-complete input[name="from"]')).sendKeys('a');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.csr2-search .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.csr2-search .range-complete input[name="to"]')).sendKeys('b');
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.equal(newAmount, 0);
            let buttonAuction = await driver.findElement(By.className('tabs-click-auction'));
            await driver.executeScript("arguments[0].click()", buttonAuction);
            await UtilHelper.wait(1000);
            let messageResultAuction = await driver.findElement(By.css('#auction p')).getText();
            assert.equal(messageResultAuction, 'No matching results. Try changing your search criteria to include more results.');            
            let buttonListing = await driver.findElement(By.className('tabs-click-listing'));
            await driver.executeScript("arguments[0].click()", buttonListing);
            await UtilHelper.wait(2000);
            let messageResultListing = await driver.findElement(By.css('#listing p')).getText();
            assert.equal(messageResultListing, 'No matching results. Try changing your search criteria to include more results.');            
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.7.5. Enter 1st field = 40 and 2st field = 30', async () => {
        /* 
            Input: 5. Enter 1st field = 40 and 2st field = 30
            Output: Mapbox: don't show any dot in map
                    LandForSale sidebar: 
                    - Auctions: show text "No results" and dont' show any map in list bellow 
                    - Listings: show text "No results" and dont' show any map in list bellow
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementSoilValue = await driver.findElement(By.css('.csr2-search .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementSoilValue);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.csr2-search .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.csr2-search .range-complete input[name="from"]')).sendKeys('40');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.csr2-search .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.csr2-search .range-complete input[name="to"]')).sendKeys('30');
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.equal(newAmount, 0);
            let buttonAuction = await driver.findElement(By.className('tabs-click-auction'));
            await driver.executeScript("arguments[0].click()", buttonAuction);
            await UtilHelper.wait(1000);
            let messageResultAuction = await driver.findElement(By.css('#auction p')).getText();
            assert.equal(messageResultAuction, 'No matching results. Try changing your search criteria to include more results.');            
            let buttonListing = await driver.findElement(By.className('tabs-click-listing'));
            await driver.executeScript("arguments[0].click()", buttonListing);
            await UtilHelper.wait(2000);
            let messageResultListing = await driver.findElement(By.css('#listing p')).getText();
            assert.equal(messageResultListing, 'No matching results. Try changing your search criteria to include more results.');
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.7.6. Enter 1st field = 40 and 2st field 50', async () => {
        /* 
            Input: 6. Enter 1st field = 40 and 2st field 50
            Output: * Check correct number result search
                    * Mapbox Click random dot in map to show propertyView and check Acres of mapbox >= 40 & <= 50
                    * LandForSale sidebar: 
                        - Mapped 
                            + Auctions: all Acres of mapbox >= 40 & <= 50
                            + Listings: all Acres of mapbox >= 40 & <= 50
                        - Unmapped: 
                            + Auctions: all Acres of mapbox >= 40 & <= 50
                            + Listings: all Acres of mapbox >= 40 & <= 50
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementSoilValue = await driver.findElement(By.css('.csr2-search .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementSoilValue);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.csr2-search .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.csr2-search .range-complete input[name="from"]')).sendKeys('40');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.csr2-search .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.csr2-search .range-complete input[name="to"]')).sendKeys('50');
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.notEqual(newAmount, 0);
            let listItemAcreAuctions = await driver.findElements(By.css(".item-info .sm-text"));
            for(let parcel of listItemAcreAuctions) {
                soilValue = await parcel.getText();                
                soilValue = parseFloat(soilValue.split(' ')[0]);
                assert.equal(soilValue >= 40 && soilValue <= 50, true);
            }
            let buttonListing = await driver.findElement(By.className('tabs-click-listing'));
            await driver.executeScript("arguments[0].click()", buttonListing);
            await UtilHelper.wait(2000);
            let listItemAcreListing = await driver.findElements(By.css(".item-info .sm-text"));
            for(let parcel of listItemAcreListing) {
                soilValue = await parcel.getText();
                soilValue = parseFloat(soilValue.split(' ')[0]);
                assert.equal(soilValue >= 40 && soilValue <= 50, true);
            }
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.7.7. Enter 1st fields = 40 and 2st field = any', async () => {
        /* 
            Input: 7. Enter 1st fields = 40 and 2st field = any
            Output: * Check correct number result search
                    * Mapbox Click random dot in map to show propertyView and check Acres of mapbox >= 40
                    * LandForSale sidebar: 
                        - Mapped 
                            + Auctions: all Acres of mapbox >= 40
                            + Listings: all Acres of mapbox >= 40
                        - Unmapped: 
                            + Auctions: all Acres of mapbox >= 40
                            + Listings: all Acres of mapbox >= 40
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementSoilValue = await driver.findElement(By.css('.csr2-search .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementSoilValue);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.csr2-search .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.csr2-search .range-complete input[name="from"]')).sendKeys('40');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.csr2-search .range-complete input[name="to"]')).click();
            await driver.findElement(By.css('.csr2-search .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.csr2-search .range-complete input[name="to"]')).sendKeys('Any');
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.notEqual(newAmount, 0);
            let listItemAcreAuctions = await driver.findElements(By.css(".item-info .sm-text"));
            for(let parcel of listItemAcreAuctions) {
                soilValue = await parcel.getText();                
                soilValue = parseFloat(soilValue.split(' ')[0]);
                assert.equal(soilValue >= 40, true);
            }
            let buttonListing = await driver.findElement(By.className('tabs-click-listing'));
            await driver.executeScript("arguments[0].click()", buttonListing);
            await UtilHelper.wait(2000);
            let listItemAcreListing = await driver.findElements(By.css(".item-info .sm-text"));
            for(let parcel of listItemAcreListing) {
                soilValue = await parcel.getText();                
                soilValue = parseFloat(soilValue.split(' ')[0]);
                assert.equal(soilValue >= 40, true);
            }
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.8.1. Click to % Tillable ', async () => {
        /* 
            Input: 1. Click to % Tillable
            Output: Show dropdown list with 2 fields 
                    The list will be sorted from min to max values
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            await UtilHelper.wait(1000);
            let elementTillableAcreSearch = await driver.findElement(By.css('.tillable-arces-search .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementTillableAcreSearch);
            await UtilHelper.wait(1000);
            let listListFrom = await driver.findElements(By.css(".tillable-arces-search .list-choose li"));
            let tempRange = -1;
            for(let option of listListFrom) {
                percentTillable = await option.getText();
                percentTillable = parseInt(percentTillable);
                if (!isNaN(percentTillable)) {
                    assert.equal(percentTillable > tempRange, true);
                    tempRange = percentTillable;
                }
            }
            let elementListTo = await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="to"]'));
            await driver.executeScript("arguments[0].click()", elementListTo);
            await UtilHelper.wait(1000);
            let listListTo = await driver.findElements(By.css(".tillable-arces-search .list-choose .align-right"));
            tempRange = -1;
            for(let option of listListTo) {
                percentTillable = await option.getText();
                percentTillable = parseInt(percentTillable);
                if (!isNaN(percentTillable)) {
                    assert.equal(percentTillable > tempRange, true);
                    tempRange = percentTillable;
                }
            }
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.8.2. Select the 1st field ', async () => {
        /* 
            Input: Select the 1st field: 10%
            Output: Show the correct value that selected
                    Move to the 2nd field automatically
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementTillableAcres = await driver.findElement(By.css('.tillable-arces-search .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementTillableAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.tillable-arces-search .list-choose li:nth-of-type(4)')).click();
            let valueFirstList = await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="from"]')).getAttribute("value");
            assert.equal(valueFirstList, "10%");
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.8.3. Select the 2nd filed ', async () => {
        /* 
            Input: Select the 1st field: 10%
                Select the 1st field: 20%
            Output: Show the correct value that selected
                    Move to the 2nd field automatically
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementTillableAcres = await driver.findElement(By.css('.tillable-arces-search .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementTillableAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.tillable-arces-search .list-choose li:nth-of-type(4)')).click();
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.tillable-arces-search .list-choose .align-right:nth-of-type(6)')).click();
            await UtilHelper.wait(3000);
            let valueSecondList = await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="to"]')).getAttribute("value");
            assert.equal(valueSecondList, "20%");
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.8.4. Enter invalid value (not number) 1st field = "a" and 2st field = "b"', async () => {
        /* 
            Input: 4. Enter invalid value (not number) 1st field = "a" and 2st field = "b"
            Output: Mapbox: don't show any dot in map 
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementTillableAcreSearch = await driver.findElement(By.css('.tillable-arces-search .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementTillableAcreSearch);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="from"]')).sendKeys('a');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="to"]')).sendKeys('b');
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.equal(newAmount, 0);
            let buttonAuction = await driver.findElement(By.className('tabs-click-auction'));
            await driver.executeScript("arguments[0].click()", buttonAuction);
            await UtilHelper.wait(1000);
            let messageResultAuction = await driver.findElement(By.css('#auction p')).getText();
            assert.equal(messageResultAuction, 'No matching results. Try changing your search criteria to include more results.');            
            let buttonListing = await driver.findElement(By.className('tabs-click-listing'));
            await driver.executeScript("arguments[0].click()", buttonListing);
            await UtilHelper.wait(2000);
            let messageResultListing = await driver.findElement(By.css('#listing p')).getText();
            assert.equal(messageResultListing, 'No matching results. Try changing your search criteria to include more results.');            
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.8.5. Enter 1st field = 40% and 2st field = 30%', async () => {
        /* 
            Input: 5. Enter 1st field = 40% and 2st field = 30%
            Output: Mapbox: don't show any dot in map
                    LandForSale sidebar: 
                    - Auctions: show text "No results" and dont' show any map in list bellow 
                    - Listings: show text "No results" and dont' show any map in list bellow
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementTillableAcreSearch = await driver.findElement(By.css('.tillable-arces-search .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementTillableAcreSearch);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="from"]')).sendKeys('40%');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="to"]')).sendKeys('30%');
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.equal(newAmount, 0);
            let buttonAuction = await driver.findElement(By.className('tabs-click-auction'));
            await driver.executeScript("arguments[0].click()", buttonAuction);
            await UtilHelper.wait(1000);
            let messageResultAuction = await driver.findElement(By.css('#auction p')).getText();
            assert.equal(messageResultAuction, 'No matching results. Try changing your search criteria to include more results.');            
            let buttonListing = await driver.findElement(By.className('tabs-click-listing'));
            await driver.executeScript("arguments[0].click()", buttonListing);
            await UtilHelper.wait(2000);
            let messageResultListing = await driver.findElement(By.css('#listing p')).getText();
            assert.equal(messageResultListing, 'No matching results. Try changing your search criteria to include more results.');
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.8.6. Enter 1st field = 40% and 2st field 50%', async () => {
        /* 
            Input: 6. Enter 1st field = 40% and 2st field 50%
            Output: * Check correct number result search
                    * Mapbox Click random dot in map to show propertyView and check Acres of mapbox >= 40% & <= 50%
                    * LandForSale sidebar: 
                        - Mapped 
                            + Auctions: all Acres of mapbox >= 40% & <= 50%
                            + Listings: all Acres of mapbox >= 40% & <= 50%
                        - Unmapped: 
                            + Auctions: all Acres of mapbox >= 40% & <= 50%
                            + Listings: all Acres of mapbox >= 40% & <= 50%
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            await UtilHelper.wait(1000);
            let elementTillableAcreSearch = await driver.findElement(By.css('.tillable-arces-search .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementTillableAcreSearch);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="from"]')).sendKeys('40%');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="to"]')).sendKeys('50%');
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.notEqual(newAmount, 0);
            let listItemAcreAuctions = await driver.findElements(By.css(".item-info .sm-text"));
            for(let parcel of listItemAcreAuctions) {
                tillableAcre = await parcel.getText();
                tillableAcre = !isNaN(parseInt(tillableAcre.split('%')[0].split(' ')[2])) ? parseInt(tillableAcre.split('%')[0].split(' ')[2]) : parseInt(tillableAcre.split('%')[0]);
                assert.equal(tillableAcre >= 40 && tillableAcre <= 50, true);
            }
            let buttonListing = await driver.findElement(By.className('tabs-click-listing'));
            await driver.executeScript("arguments[0].click()", buttonListing);
            await UtilHelper.wait(2000);
            let listItemAcreListing = await driver.findElements(By.css(".item-info .sm-text"));
            for(let parcel of listItemAcreListing) {
                tillableAcre = await parcel.getText();
                tillableAcre = !isNaN(parseInt(tillableAcre.split('%')[0].split(' ')[2])) ? parseInt(tillableAcre.split('%')[0].split(' ')[2]) : parseInt(tillableAcre.split('%')[0]);
                assert.equal(tillableAcre >= 40 && tillableAcre <= 50, true);
            }
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.8.7. Enter 1st fields = 40% and 2st field = any', async () => {
        /* 
            Input: 7. Enter 1st fields = 40% and 2st field = any
            Output: * Check correct number result search
                    * Mapbox Click random dot in map to show propertyView and check Acres of mapbox >= 40
                    * LandForSale sidebar: 
                        - Mapped 
                            + Auctions: all Acres of mapbox >= 40%
                            + Listings: all Acres of mapbox >= 40%
                        - Unmapped: 
                            + Auctions: all Acres of mapbox >= 40%
                            + Listings: all Acres of mapbox >= 40%
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementSoilValue = await driver.findElement(By.css('.tillable-arces-search .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementSoilValue);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="from"]')).sendKeys('40%');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="to"]')).sendKeys('Any');
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.notEqual(newAmount, 0);
            let listItemAcreAuctions = await driver.findElements(By.css(".item-info .sm-text"));
            for(let parcel of listItemAcreAuctions) {
                tillableAcre = await parcel.getText();                
                tillableAcre = !isNaN(parseInt(tillableAcre.split('%')[0].split(' ')[2])) ? parseInt(tillableAcre.split('%')[0].split(' ')[2]) : parseInt(tillableAcre.split('%')[0]);
                assert.equal(tillableAcre >= 40, true);
            }
            let buttonListing = await driver.findElement(By.className('tabs-click-listing'));
            await driver.executeScript("arguments[0].click()", buttonListing);
            await UtilHelper.wait(2000);
            let listItemAcreListing = await driver.findElements(By.css(".item-info .sm-text"));
            for(let parcel of listItemAcreListing) {
                tillableAcre = await parcel.getText();                
                tillableAcre = !isNaN(parseInt(tillableAcre.split('%')[0].split(' ')[2])) ? parseInt(tillableAcre.split('%')[0].split(' ')[2]) : parseInt(tillableAcre.split('%')[0]);
                assert.equal(tillableAcre >= 40, true);
            }
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('3. Test function clear search', async () => {
        /* 
            Test function clear search
            Output: Mapbox: show amount of dot as initial 

        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.login(driver);
            await UtilHelper.waitFinishLoading(driver, config.get('URLLANDFORSALE'));

            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('list-search-box'))));            
            await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loadding-cover'))));            
            let locatorLoadingFolder = By.className('loadding-cover');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let listCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let amount = 0;
            for(let cluster of listCluster) {
                amount += parseInt(await cluster.getText()) ;
            }
            let listMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            amount += parseInt(listMarker.length);
            let elementLandType = await driver.findElement(By.css('.type-show .search-label'));
            await driver.executeScript("arguments[0].click()", elementLandType);
            await UtilHelper.wait(1000);
            let elementCropLand = await driver.findElement(By.id('filled-crop-land'));
            await driver.executeScript("arguments[0].click()", elementCropLand);
            await UtilHelper.wait(1000);
            let elementCRPLand = await driver.findElement(By.id('filled-crp-land'));
            await driver.executeScript("arguments[0].click()", elementCRPLand);
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let listNewCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmount = 0;
            for(let cluster of listNewCluster) {
                newAmount += parseInt(await cluster.getText()) ;
            }
            let listNewMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmount += parseInt(listNewMarker.length);
            assert.notEqual(amount, newAmount);
            await UtilHelper.wait(5000);
            let buttonClearSearch = await driver.findElement(By.className('btn-clear-search'));
            await driver.executeScript("arguments[0].click()", buttonClearSearch);
            await UtilHelper.wait(1000);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(2000);
            let listNewClusterAfterFilter = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmountAfterFilter = 0;
            for(let cluster of listNewClusterAfterFilter) {
                if (!isNaN(parseInt(await cluster.getText()))) {
                    newAmountAfterFilter += parseInt(await cluster.getText());
                }
            }
            let listNewMarkerAfterFilter = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmountAfterFilter += parseInt(listNewMarkerAfterFilter.length);
            assert.equal(newAmountAfterFilter, amount);
            await driver.quit();          
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })
})