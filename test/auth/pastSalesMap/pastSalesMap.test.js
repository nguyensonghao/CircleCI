const assert = require('assert');
const { Builder, By } = require('selenium-webdriver');

const UtilHelper = require('../../helpers/util.helper');
const MapboxHelper = require('../../helpers/mapbox.helper');

describe('/FILTER PASTSALESMAP FUNCTION', () => {
    it('1.1. Check search function', async () => {
        /* 
            Input: 1. Search a county/address
            Output: Show list of suggestion of address
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);            
            await driver.findElement(By.id('autocomplete')).sendKeys('Iowa');
            await UtilHelper.wait(1000);
            let listSearch = await driver.findElements(By.css('.pac-container .pac-item'));
            let listSearchLength = listSearch.length;
            await driver.quit();
            assert.equal(listSearchLength, 5);
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.1. Check correct number result search', async () => {
        /* 
            Input: Excute search advanced
            Output: * Check number dot in mapbox = total mapped record in pastSalesMap sidebar(total Auctions - total Auctions unmapped + total Listings - total Listings unmapped)
                    * pastSalesMap sidebar
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let amount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            let total = await MapboxHelper.getTotalPointInSidebarPastSaleMap(driver);
            assert.equal(amount, total);
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);            
            let element = await driver.findElement(By.css('.select-type .search-label'));
            await driver.executeScript("arguments[0].click()", element)
            await UtilHelper.wait(1000);
            let listInput = await driver.findElements(By.css(".states div ul p input"));
            let listStateLength = listInput.length; 
            for (let input of listInput) {
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            let element = await driver.findElement(By.css('.select-type .search-label'));
            await driver.executeScript("arguments[0].click()", element)
            await UtilHelper.wait(1000);
            let elementSelectAll = await driver.findElement(By.id('select-all-states'));
            await driver.executeScript("arguments[0].click()", elementSelectAll);
            let listInput = await driver.findElements(By.css(".states div ul p input"));
            for (let input of listInput) {
                status = await input.isSelected();
                assert.equal(status, false);            
            }
            await driver.quit();   
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.1.3. Click to select ILLINOIS and execute search', async () => {
        /* 
            Input: 3. Click to select ILLINOIS and execute search
            Output: The selected state will has a "check" icon
                    '- Map zoom to level state with name ILLINOIS on map
                    - All dots are displayed in state ILLINOIS -> zoom in, zoom out map, dots are still in ILLINOIS 
                    - Total number of dots = land sales - unmapped
                    -  Click random dot in map to show propertyView and check state name in propertyView is ILLINOIS
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            let element = await driver.findElement(By.css('.select-type .search-label'));
            await driver.executeScript("arguments[0].click()", element)
            await UtilHelper.wait(1000);
            let elementSelectAll = await driver.findElement(By.id('select-all-states'));
            await driver.executeScript("arguments[0].click()", elementSelectAll);
            let inputIllinois = await driver.findElement(By.id('filled-17'));
            await driver.executeScript("arguments[0].click()", inputIllinois);
            let statusIllinois = await driver.findElement(By.css(".states div ul p input[data-value='17']")).isSelected();
            assert.equal(statusIllinois, true);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let amount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            let total = await MapboxHelper.getTotalPointInSidebarPastSaleMap(driver);            
            assert.equal(amount, total);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.1.4. Click random a dot in map to show propertyView ', async () => {
        /* 
            Input: 4.  Click random a dot in map to show propertyView 
            Output: '- Show detailed information of a dot on the right-site
                     - Check state name in propertyView is ILLINOIS
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            let element = await driver.findElement(By.css('.select-type .search-label'));
            await driver.executeScript("arguments[0].click()", element)
            await UtilHelper.wait(1000);
            let elementSelectAll = await driver.findElement(By.id('select-all-states'));
            await driver.executeScript("arguments[0].click()", elementSelectAll);
            await UtilHelper.wait(1000);
            let inputIllinois = await driver.findElement(By.id('filled-17'));
            await driver.executeScript("arguments[0].click()", inputIllinois);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            await driver.executeScript('$(".leaflet-clickable").click();');
            await UtilHelper.wait(1000);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.1.5. Unselect all state and keep other search and excute search', async () => {
        /* 
            Input: Unselect all state and keep other search and excute search
            Output: Mapbox: don't show any dot in map
                    - 0 landsale, 0 unmapped
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            let element = await driver.findElement(By.css('.select-type .search-label'));
            await driver.executeScript("arguments[0].click()", element);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let elementSelectAll = await driver.findElement(By.id('select-all-states'));
            await driver.executeScript("arguments[0].click()", elementSelectAll);
            let inputIowa = await driver.findElement(By.id('filled-19'));
            await driver.executeScript("arguments[0].click()", inputIowa);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let amount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);            
            await driver.executeScript("arguments[0].click()", element);
            await UtilHelper.wait(1000);
            await driver.executeScript("arguments[0].click()", inputIowa);
            await UtilHelper.wait(1000);
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            let newAmount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);            
            assert.equal(newAmount, 0);
            let totalLandSales = await driver.findElement(By.css(".total-record span"));            
            totalLandSales = await totalLandSales.getText();
            totalLandSales = totalLandSales.replace(/\D/g, "");
            let totalUnmapped = await driver.findElement(By.css(".total-record a"));            
            totalUnmapped = await totalUnmapped.getText();
            totalUnmapped = totalUnmapped.replace(/\D/g, "");
            assert.equal(totalLandSales, 0);
            assert.equal(totalLandSales, 0);
            await driver.quit();          
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.2.1. Click "Counties"', async () => {
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            let elementState = await driver.findElement(By.css('.select-type .search-label'));
            await driver.executeScript("arguments[0].click()", elementState);
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
            let listCountyInput = await driver.findElements(By.css(".counties div ul p input"));
            let listCountyLength = listCountyInput.length; 
            for (let county of listCountyInput) {
                status = await county.isSelected();
                assert.equal(status, true); 
            }

            let listCounty = await driver.findElements(By.css(".counties div ul p label"));
            let tempCounty = "";
            for (let county of listCounty) {
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

    it(`2.2.2. Click to box "State's name" ILLINOIS`, async () => {
        /* 
            Input: Click to box "State's name" ILLINOIS
            Output: - All the counties will be unchecked
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            let elementState = await driver.findElement(By.css('.select-type .search-label'));
            await driver.executeScript("arguments[0].click()", elementState);
            await UtilHelper.wait(1000);
            let elementSelectAll = await driver.findElement(By.id('select-all-states'));
            await driver.executeScript("arguments[0].click()", elementSelectAll);
            await UtilHelper.wait(1000);
            let inputIllinois = await driver.findElement(By.id('filled-17'));
            await driver.executeScript("arguments[0].click()", inputIllinois);
            await UtilHelper.wait(1000);
            let elementCounty = await driver.findElement(By.css('.search-box-item-county .search-label'));
            await driver.executeScript("arguments[0].click()", elementCounty);
            let inputIowaSelectAllCounty = await driver.findElement(By.id('17'));
            await driver.executeScript("arguments[0].click()", inputIowaSelectAllCounty);
            let listCountyInput = await driver.findElements(By.css(".counties div ul p input"));
            for (let county of listCountyInput) {
                status = await county.isSelected();
                assert.equal(status, false); 
            }
            await driver.quit();           
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it(`2.2.3. Select counties: Brown and keep other search and execute search`, async () => {
        /* 
            Input: 3. Select counties: Brown and keep other search and execute search
            Output: The selected counties will have a "check" icon
                ' - All dots are displayed in state ILLINOIS -> zoom in, zoom out map, dots are still in ILLINOIS 
                - Total number of dots = land sales - unmapped

                - Click to the dots -> map zoom in level county -> name of county shows on map when zoom in

        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            let elementState = await driver.findElement(By.css('.select-type .search-label'));
            await driver.executeScript("arguments[0].click()", elementState);
            await UtilHelper.wait(1000);
            let elementSelectAll = await driver.findElement(By.id('select-all-states'));
            await driver.executeScript("arguments[0].click()", elementSelectAll);
            await UtilHelper.wait(1000);
            let inputIllinois = await driver.findElement(By.id('filled-17'));
            await driver.executeScript("arguments[0].click()", inputIllinois);
            await UtilHelper.wait(1000);
            let elementCounty = await driver.findElement(By.css('.search-box-item-county .search-label'));
            await driver.executeScript("arguments[0].click()", elementCounty);
            await UtilHelper.wait(1000);
            let inputIllinoisSelectAllCounty = await driver.findElement(By.id('17'));
            await driver.executeScript("arguments[0].click()", inputIllinoisSelectAllCounty);
            await UtilHelper.wait(1000);
            let inputBrown = await driver.findElement(By.id('filled-17-17009'));
            await driver.executeScript("arguments[0].click()", inputBrown);
            await UtilHelper.wait(1000);
            let statusBrown = await driver.findElement(By.css(".counties div ul p input[data-value='17009']")).isSelected();
            assert.equal(statusBrown, true);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await driver.executeScript('$(".leaflet-clickable").click();');
            let county = await driver.findElement(By.css(".item:nth-of-type(5)")).getText();
            county = county.split(":")[1].trim();
            assert.equal(county, "Brown");
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.2.5. Unselect all county and keep other search and excute search', async () => {
        /* 
            Unselect all county and keep other search and excute search
            Output: Mapbox: don't show any dot in map 

        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
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
            let inputClarke = await driver.findElement(By.id('filled-19-19039'));
            await driver.executeScript("arguments[0].click()", inputClarke);
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.wait(1000);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            await driver.executeScript("arguments[0].click()", elementCounty);
            await UtilHelper.wait(1000);
            await driver.executeScript("arguments[0].click()", inputClarke);
            await UtilHelper.wait(1000);
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let newAmount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            assert.equal(newAmount, 0);
            let totalLandSales = await driver.findElement(By.css(".total-record span"));            
            totalLandSales = await totalLandSales.getText();
            totalLandSales = totalLandSales.replace(/\D/g, "");
            let totalUnmapped = await driver.findElement(By.css(".total-record a"));            
            totalUnmapped = await totalUnmapped.getText();
            totalUnmapped = totalUnmapped.replace(/\D/g, "");
            assert.equal(totalLandSales, 0);
            assert.equal(totalLandSales, 0);
            await driver.quit();          
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.3.1. Show dropdown list of Sale Type', async () => {
        /* 
            Input: Click to "Sale Type"
            Output: Show dropdown list of sale type: Auction and Listing
                    All were checked by default 
        */

        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            let element = await driver.findElement(By.css('.search-box-item:nth-of-type(3) .search-label'));
            await driver.executeScript("arguments[0].click()", element)
            let auctionCheck = await driver.findElement(By.id('auction-check')).isSelected();
            await UtilHelper.wait(1000);
            let listingCheck = await driver.findElement(By.id('listing-check')).isSelected();
            await UtilHelper.wait(1000);
            assert.equal(auctionCheck, true);
            assert.equal(listingCheck, true);
            await driver.quit();   
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.3.2. Click to Auction and keep other search and excute search', async () => {
        /* 
            Input: 2. Click to Auction and keep other search and excute search
            Output: '- 2 options in Auction were unchecked
                     - Check correct number of result search 
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            let element = await driver.findElement(By.css('.search-box-item:nth-of-type(3) .search-label'));
            await driver.executeScript("arguments[0].click()", element);
            await UtilHelper.wait(1000);
            let elementAuction = await driver.findElement(By.id('auction-check'));
            await driver.executeScript("arguments[0].click()", elementAuction);
            await UtilHelper.wait(1000);
            let elementAuctionNoSale = await driver.findElement(By.id('filled-150')).isSelected();
            await UtilHelper.wait(1000);
            let elementAuctionSold = await driver.findElement(By.id('filled-151')).isSelected();
            await UtilHelper.wait(1000);
            assert.equal(elementAuctionNoSale, false);
            assert.equal(elementAuctionSold, false);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let amount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            let total = await MapboxHelper.getTotalPointInSidebarPastSaleMap(driver);
            assert.equal(amount, total);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.3.3. Click to Listing and keep other search and excute search', async () => {
        /* 
            Input: 3. Click to Listing and keep other search and excute search
            Output: 2 options in Listing were unchecked
                    - Don't show any dot on map
        */

        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            let element = await driver.findElement(By.css('.search-box-item:nth-of-type(3) .search-label'));
            await driver.executeScript("arguments[0].click()", element);
            await UtilHelper.wait(1000);
            let elementListing = await driver.findElement(By.id('listing-check'));
            await driver.executeScript("arguments[0].click()", elementListing);
            await UtilHelper.wait(1000);
            let elementListingExpired = await driver.findElement(By.id('filled-152')).isSelected();
            await UtilHelper.wait(1000);
            let elementListingSold = await driver.findElement(By.id('filled-153')).isSelected();
            await UtilHelper.wait(1000);
            assert.equal(elementListingExpired, false);
            assert.equal(elementListingSold, false);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let amount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            let total = await MapboxHelper.getTotalPointInSidebarPastSaleMap(driver);
            assert.equal(amount, total);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.3.4. Click to select 1 option in Auction and 1 option in Listing and keep other search and excute search', async () => {
        /* 
            Input: 4. Click to select 1 option in Auction and 1 option in Listing and keep other search and excute search
            Output: Check correct number of result search
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            let element = await driver.findElement(By.css('.search-box-item:nth-of-type(3) .search-label'));
            await driver.executeScript("arguments[0].click()", element);
            await UtilHelper.wait(1000);
            let elementAuctionNoSale = await driver.findElement(By.id('filled-150'));
            await driver.executeScript("arguments[0].click()", elementAuctionNoSale);
            await UtilHelper.wait(1000);
            let elementListingSold = await driver.findElement(By.id('filled-153'));
            await driver.executeScript("arguments[0].click()", elementListingSold);
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let amount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            let total = await MapboxHelper.getTotalPointInSidebarPastSaleMap(driver);
            assert.equal(amount, total);
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementLandType = await driver.findElement(By.css('.type-show .search-label'));
            let amount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            await driver.executeScript("arguments[0].click()", elementLandType);
            await UtilHelper.wait(1000);
            let elementCropLand = await driver.findElement(By.id('name-filled-type-crop-land'));
            await driver.executeScript("arguments[0].click()", elementCropLand);
            await UtilHelper.wait(1000);
            let elementCRPLand = await driver.findElement(By.id('name-filled-type-crp-land'));
            await driver.executeScript("arguments[0].click()", elementCRPLand);
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let newAmount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            assert.equal(newAmount < amount, true);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.4.3. Unselect all Land Type', async () => {
        /* 
            Input: Click CropLand and CRPLand Option to unselected
            Output: Show dropdown list of Land Type
                    All were checked by default
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            let elementLandType = await driver.findElement(By.css('.type-show .search-label'));
            await driver.executeScript("arguments[0].click()", elementLandType);
            await UtilHelper.wait(1000);
            let elementCropLand = await driver.findElement(By.id('name-filled-type-crop-land'));
            await driver.executeScript("arguments[0].click()", elementCropLand);
            await UtilHelper.wait(1000);
            let elementPastureLand = await driver.findElement(By.id('filled-type-pasture-land'));
            await driver.executeScript("arguments[0].click()", elementPastureLand);
            await UtilHelper.wait(1000);
            let elementTimberLand = await driver.findElement(By.id('name-filled-type-timber-land'));
            await driver.executeScript("arguments[0].click()", elementTimberLand);
            await UtilHelper.wait(1000);
            let elementOtherLand = await driver.findElement(By.id('name-filled-type-other'));
            await driver.executeScript("arguments[0].click()", elementOtherLand);
            await UtilHelper.wait(1000);
            let elementCRPLand = await driver.findElement(By.id('name-filled-type-crp-land'));
            await driver.executeScript("arguments[0].click()", elementCRPLand);
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let newAmount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            assert.equal(newAmount, 0);
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementPriceAcres = await driver.findElement(By.css('.price-arces .search-label'));
            await driver.executeScript("arguments[0].click()", elementPriceAcres);
            await UtilHelper.wait(1000);
            let listListFrom = await driver.findElements(By.css(".price-arces .list-choose li"));
            let tempRange = -1;
            for (let option of listListFrom) {
                range = await option.getText();
                range = parseInt(range.substring(1));
                if (!isNaN(range)) {
                    assert.equal(range > tempRange, true);
                    tempRange = range;
                }
            }

            let elementListTo = await driver.findElement(By.css('.price-arces .range-complete input[name="to"]'));
            await driver.executeScript("arguments[0].click()", elementListTo);
            await UtilHelper.wait(1000);
            let listListTo = await driver.findElements(By.css(".price-arces .list-choose .align-right"));
            tempRange = -1;
            for (let option of listListTo) {
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementPriceAcres = await driver.findElement(By.css('.price-arces .search-label'));
            await driver.executeScript("arguments[0].click()", elementPriceAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .list-choose li:nth-of-type(5)')).click();
            await UtilHelper.wait(1000);
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementPriceAcres = await driver.findElement(By.css('.price-arces .search-label'));
            await driver.executeScript("arguments[0].click()", elementPriceAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .list-choose li:nth-of-type(5)')).click();
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .list-choose .align-right:nth-of-type(8)')).click();
            await UtilHelper.wait(3000);
            let valueSecondList = await driver.findElement(By.css('.price-arces .range-complete input[name="to"]')).getAttribute("value");
            assert.equal(valueSecondList, "$6,000");
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementPriceAcres = await driver.findElement(By.css('.price-arces .search-label'));
            await driver.executeScript("arguments[0].click()", elementPriceAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.price-arces .range-complete input[name="from"]')).sendKeys('a');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.price-arces .range-complete input[name="to"]')).sendKeys('b');
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let newAmount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            assert.equal(newAmount, 0);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.5.5. Enter 1st field = $2,000 and 2st field = $1,000', async () => {
        /* 
            Input: 5. Enter 1st field = $2,000 and 2st field = $1,000
            Output: Mapbox: don't show any dot in map
        */

        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementPriceAcres = await driver.findElement(By.css('.price-arces .search-label'));
            await driver.executeScript("arguments[0].click()", elementPriceAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.price-arces .range-complete input[name="from"]')).sendKeys('$2,000');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.price-arces .range-complete input[name="to"]')).sendKeys('$1,000');
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let newAmount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            assert.equal(newAmount, 0);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.5.6. Enter 1st field = $1,000 and 2st field = $5,000', async () => {
        /* 
            Input: 6. Enter 1st field = $1,000 and 2st field = $5,000
            Output: * Check correct number result search
                    * Mapbox Click random dot in map to show propertyView and check $/Acre of mapbox >= $1,000 & <= $5,000
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementPriceAcres = await driver.findElement(By.css('.price-arces .search-label'));
            await driver.executeScript("arguments[0].click()", elementPriceAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.price-arces .range-complete input[name="from"]')).sendKeys('$1,000');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.price-arces .range-complete input[name="to"]')).sendKeys('$5,000');
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let amount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            let total = await MapboxHelper.getTotalPointInSidebarPastSaleMap(driver);
            assert.equal(amount, total);
            await driver.executeScript('$(".leaflet-clickable").click();');
            await UtilHelper.wait(3000);            
            let valuePriceAcre = await driver.findElement(By.className("dark-text")).getText();            
            valuePriceAcre = parseInt(valuePriceAcre.replace(/\D/g, ""));
            assert.equal(valuePriceAcre >= 1000 && valuePriceAcre <= 5000, true);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.5.7. Enter 1st fields = $1,000 and 2st field = any', async () => {
        /* 
            Input: 7. Enter 1st fields = $1,000 and 2st field = any
            Output: * Check correct number result search
                    * Mapbox Click random dot in map to show propertyView and check $/Acre of mapbox >= $1,000
        */

        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementPriceAcres = await driver.findElement(By.css('.price-arces .search-label'));
            await driver.executeScript("arguments[0].click()", elementPriceAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.price-arces .range-complete input[name="from"]')).sendKeys('$1,000');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.price-arces .range-complete input[name="to"]')).click();
            await driver.findElement(By.css('.price-arces .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.price-arces .range-complete input[name="to"]')).sendKeys('Any');
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let amount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            let total = await MapboxHelper.getTotalPointInSidebarPastSaleMap(driver);
            assert.equal(amount, total);
            await driver.executeScript('$(".leaflet-clickable").click();');
            await UtilHelper.wait(3000);            
            let valuePriceAcre = await driver.findElement(By.className("dark-text")).getText();            
            valuePriceAcre = parseInt(valuePriceAcre.replace(/\D/g, ""));
            assert.equal(valuePriceAcre >= 1000, true);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.6.1. Click to Acres', async () => {
        /* 
            Input: Click to Acres
            Output: Show dropdown list with 2 fields 
                    The list will be sorted from min to max values
        */

        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();
        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            await UtilHelper.wait(1000);
            let elementAcreSearch = await driver.findElement(By.css('.total-arces .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementAcreSearch);
            await UtilHelper.wait(1000);
            let listListFrom = await driver.findElements(By.css(".total-arces .list-choose li"));
            let tempRange = -1;
            for (let option of listListFrom) {
                range = await option.getText();
                range = parseInt(range);
                if (!isNaN(range)) {
                    assert.equal(range > tempRange, true);
                    tempRange = range;
                }
            }
            let elementListTo = await driver.findElement(By.css('.total-arces .range-complete input[name="to"]'));
            await driver.executeScript("arguments[0].click()", elementListTo);
            await UtilHelper.wait(1000);
            let listListTo = await driver.findElements(By.css(".total-arces .list-choose .align-right"));
            tempRange = -1;
            for (let option of listListTo) {
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            await UtilHelper.wait(1000);
            let elementAcres = await driver.findElement(By.css('.total-arces .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.total-arces .list-choose li:nth-of-type(4)')).click();
            await UtilHelper.wait(1000);
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
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
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let newAmount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            assert.equal(newAmount, 0);           
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
                    pastSalesMap sidebar: 
                    - Auctions: show text "No results" and dont' show any map in list bellow 
                    - Listings: show text "No results" and dont' show any map in list bellow
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
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
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let newAmount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            assert.equal(newAmount, 0); 
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
                    * pastSalesMap sidebar: 
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
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
            await UtilHelper.wait(1000);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let amount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            let total = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            assert.equal(amount, total);
            await driver.executeScript('$(".leaflet-clickable").click();');
            await UtilHelper.wait(3000);
            let totalAcres = await driver.findElement(By.css(".cl-2:nth-of-type(2)")).getText();
            totalAcres = totalAcres.replace(/\D/g, "");
            assert.equal(totalAcres >= 40 && totalAcres <= 50, true);
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
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            let elementAcres = await driver.findElement(By.css('.total-arces .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.total-arces .range-complete input[name="from"]')).clear();
            await driver.findElement(By.css('.total-arces .range-complete input[name="from"]')).sendKeys('40');
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.total-arces .range-complete input[name="to"]')).clear();
            await driver.findElement(By.css('.total-arces .range-complete input[name="to"]')).sendKeys('Any');
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let amount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            let total = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            assert.equal(amount, total);
            await driver.executeScript('$(".leaflet-clickable").click();');
            await UtilHelper.wait(3000);
            let totalAcres = await driver.findElement(By.css(".cl-2:nth-of-type(2)")).getText();
            totalAcres = totalAcres.replace(/\D/g, "");
            assert.equal(totalAcres >= 40, true);
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            await UtilHelper.wait(1000);
            let elementSoilValueSearch = await driver.findElement(By.css('.csr2-search .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementSoilValueSearch);
            await UtilHelper.wait(1000);
            let listListFrom = await driver.findElements(By.css(".csr2-search .list-choose li"));
            let tempRange = -1;
            for (let option of listListFrom) {
                range = await option.getText();
                range = parseInt(range);
                if (!isNaN(range)) {
                    assert.equal(range > tempRange, true);
                    tempRange = range;
                }
            }

            let elementListTo = await driver.findElement(By.css('.csr2-search .range-complete input[name="to"]'));
            await driver.executeScript("arguments[0].click()", elementListTo);
            await UtilHelper.wait(1000);
            let listListTo = await driver.findElements(By.css(".csr2-search .list-choose .align-right"));
            tempRange = -1;
            for (let option of listListTo) {
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            await UtilHelper.wait(1000);
            let elementAcres = await driver.findElement(By.css('.csr2-search .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.csr2-search .list-choose li:nth-of-type(4)')).click();
            await UtilHelper.wait(1000);
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            await UtilHelper.wait(1000);
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
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
            await UtilHelper.wait(1000);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let newAmount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            assert.equal(newAmount, 0); 
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
                    pastSalesMap sidebar: 
                    - Auctions: show text "No results" and dont' show any map in list bellow 
                    - Listings: show text "No results" and dont' show any map in list bellow
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
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
            await UtilHelper.wait(1000);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let newAmount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            assert.equal(newAmount, 0); 
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
                    * pastSalesMap sidebar: 
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
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
            await UtilHelper.wait(1000);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let newAmount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            assert.notEqual(newAmount, 0);
            await driver.executeScript('$(".leaflet-clickable").click();');
            await UtilHelper.wait(3000);
            let totalAcres = await driver.findElement(By.css(".cl-2:nth-of-type(4) .lg-text")).getText();
            totalAcres = parseFloat(totalAcres);
            assert.equal(totalAcres >= 40 && totalAcres <= 50, true);
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
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
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
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);            
            let newAmount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            assert.notEqual(newAmount, 0);
            await driver.executeScript('$(".leaflet-clickable").click();');
            await UtilHelper.wait(3000);
            let totalAcres = await driver.findElement(By.css(".cl-2:nth-of-type(4) .lg-text")).getText();
            totalAcres = parseFloat(totalAcres);
            assert.equal(totalAcres >= 40, true);
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            await UtilHelper.wait(1000);
            let elementTillableAcreSearch = await driver.findElement(By.css('.tillable-arces-search .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementTillableAcreSearch);
            await UtilHelper.wait(1000);
            let listListFrom = await driver.findElements(By.css(".tillable-arces-search .list-choose li"));
            let tempRange = -1;
            for (let option of listListFrom) {
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
            for (let option of listListTo) {
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            await UtilHelper.wait(1000);
            let elementTillableAcres = await driver.findElement(By.css('.tillable-arces-search .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementTillableAcres);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.tillable-arces-search .list-choose li:nth-of-type(4)')).click();
            await UtilHelper.wait(1000);
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            await UtilHelper.wait(1000);
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
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            await UtilHelper.wait(1000);
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
            await UtilHelper.wait(1000);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let newAmount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            assert.equal(newAmount, 0);         
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
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
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
            await driver.findElement(By.css('.tillable-arces-search .range-complete input[name="to"]')).sendKeys('30%');
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let newAmount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            assert.equal(newAmount, 0);
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
                    * Mapbox Click random dot in map to show propertyView and check % Tillable of mapbox >= 40 & <= 50
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
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
            await UtilHelper.wait(1000);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let newAmount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            assert.notEqual(newAmount, 0);
            await driver.executeScript('$(".leaflet-clickable").click();');
            await UtilHelper.wait(3000);
            let tillableAcres = await driver.findElement(By.css(".cl-2:nth-of-type(3) .lg-text")).getText();
            let totalAcres = await driver.findElement(By.css(".cl-2:nth-of-type(4) .lg-text")).getText();
            let percentTotalAcres = parseInt(parseFloat(tillableAcres) * 100 / parseFloat(totalAcres))
            assert.equal(percentTotalAcres >= 40 && percentTotalAcres <= 50, true);
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
                    * Mapbox Click random dot in map to show propertyView and check % Tillable of mapbox >= 40
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            await UtilHelper.wait(1000);
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
            await UtilHelper.wait(1000);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let newAmount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            assert.notEqual(newAmount, 0);
            await driver.executeScript('$(".leaflet-clickable").click();');
            await UtilHelper.wait(3000);
            let tillableAcres = await driver.findElement(By.css(".cl-2:nth-of-type(3) .lg-text")).getText();
            let totalAcres = await driver.findElement(By.css(".cl-2:nth-of-type(4) .lg-text")).getText();
            let percentTotalAcres = parseInt(parseFloat(tillableAcres) * 100 / parseFloat(totalAcres))
            assert.equal(percentTotalAcres >= 40, true);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.9.1. Click to Soil date', async () => {
        /* 
            Input: 1. Click to Soil date
            Output: Show dropdown list 
                    The list will be sorted from min to max values
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            await UtilHelper.wait(1000);
            let elementSaleDate = await driver.findElement(By.css('.search-sale-date .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementSaleDate);
            await UtilHelper.wait(1000);
            let listListFrom = await driver.findElements(By.css(".search-sale-date .list-choose li"));
            for (let option of listListFrom) {
                optionDate = await option.getText();
            }
            assert.equal(listListFrom.length == 10, true);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('2.9.2. Click to past 12 month', async () => {
        /* 
            Input: 2. Click to past 12 month
            Output: * Check correct number result search 
                    * Mapbox Click random dot in map to show propertyView and check sale date within 12 month from now
        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let elementMoreSearch = await driver.findElement(By.css('.more-search .search-label'));
            await driver.executeScript("arguments[0].click()", elementMoreSearch);
            await UtilHelper.wait(1000);
            let elementSaleDate = await driver.findElement(By.css('.search-sale-date .search-more-label'));
            await driver.executeScript("arguments[0].click()", elementSaleDate);
            await UtilHelper.wait(1000);
            await driver.findElement(By.css('.search-sale-date .list-choose li:nth-of-type(5)')).click();
            await UtilHelper.wait(1000);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            await driver.executeScript('$(".leaflet-clickable").click();');
            await UtilHelper.wait(3000);
            let saleDate = await driver.findElement(By.css('.item:nth-of-type(1)')).getText();
            saleDate = saleDate.split(":")[1].trim();
            let now = new Date();
            let past12years = now.setFullYear( now.getFullYear() - 1 );
            past12years = new Date(past12years);
            past12years = past12years.setDate( past12years.getDate() - 1 );
            assert.equal(new Date(saleDate) >= new Date(past12years), true);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })

    it('3. Test function clear search', async () => {
        /* 
            3. Test function clear search
            Output: Mapbox: show amount of dot as initial 

        */
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(UtilHelper.getWebOption())
            .build();

        try {
            await UtilHelper.goToPastSaleMap(driver);
            await MapboxHelper.waitLoadPastSaleMap(driver);
            await UtilHelper.wait(1000);
            let listCluster = await driver.findElements(By.css(".marker-cluster div span"));
            let amount = 0;
            for(let cluster of listCluster) {
                amount += parseInt(await cluster.getText()) ;
            }
            let listMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            amount += parseInt(listMarker.length);
            let listForSaleMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            amount += parseInt(listForSaleMarker.length);
            let listSoldMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff0000"]`));
            amount += parseInt(listSoldMarker.length);
            let elementLandType = await driver.findElement(By.css('.type-show .search-label'));
            await driver.executeScript("arguments[0].click()", elementLandType);
            await UtilHelper.wait(1000);
            let elementCropLand = await driver.findElement(By.id('name-filled-type-crop-land'));
            await driver.executeScript("arguments[0].click()", elementCropLand);
            await UtilHelper.wait(1000);
            let elementPastureLand = await driver.findElement(By.id('filled-type-pasture-land'));
            await driver.executeScript("arguments[0].click()", elementPastureLand);
            await UtilHelper.wait(1000);
            let elementCRPLand = await driver.findElement(By.id('name-filled-type-crp-land'));
            await driver.executeScript("arguments[0].click()", elementCRPLand);
            await UtilHelper.wait(1000);
            let elementSidebar = await driver.findElement(By.className('new-search-advance'));
            await driver.executeScript("arguments[0].click()", elementSidebar);
            await UtilHelper.wait(1000);
            let locatorLoadingFolder = By.className('loading-past-sale-map');
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(1000);
            let newAmount = await MapboxHelper.getTotalPointInMapPastSaleMap(driver);
            let listNewSoldMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff0000"]`));
            newAmount += parseInt(listNewSoldMarker.length);
            assert.notEqual(amount, newAmount);
            await UtilHelper.wait(5000);
            let buttonClearSearch = await driver.findElement(By.className('btn-clear-search'));
            await driver.executeScript("arguments[0].click()", buttonClearSearch);
            await UtilHelper.wait(1000);
            await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
            await UtilHelper.wait(2000);
            let listNewClusterAfterFilter = await driver.findElements(By.css(".marker-cluster div span"));
            let newAmountAfterFilter = 0;
            for (let cluster of listNewClusterAfterFilter) {
                if (!isNaN(parseInt(await cluster.getText()))) {
                    newAmountAfterFilter += parseInt(await cluster.getText());
                }
            }
            let listForSaleMarkerAfterFilter = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff821e"]`));
            newAmountAfterFilter += parseInt(listForSaleMarkerAfterFilter.length);
            let listSoldMarkerAfterFilter = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff0000"]`));
            newAmountAfterFilter += parseInt(listSoldMarkerAfterFilter.length);
            assert.equal(newAmountAfterFilter, amount);
            await driver.quit();
        } catch (error) {
            await driver.quit();
            throw error;
        }
    })
})