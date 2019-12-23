const { By, until } = require('selenium-webdriver');

const UtilHelper = require('./util.helper');

const waitLoadPastSaleMap = async (driver) => {
    await driver.wait(until.elementIsVisible(await driver.findElement(By.className('loading-past-sale-map'))));
    let locatorLoadingFolder = By.className('loading-past-sale-map');
    await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
}

const waitLoadLandForSale = async (driver) => {
    let locatorLoadingFolderIframe = By.className('loading-farmland-iframe');
    await UtilHelper.waitUntilLoadingDisappear(driver, locatorLoadingFolderIframe);
    let locatorLoadingFolder = By.className('loadding-cover');
    await UtilHelper.waitUntilLoadingInvisible(driver, locatorLoadingFolder);
}

const getTotalPointInMapPastSaleMap = async (driver) => {
    let listCluster = await driver.findElements(By.css(".marker-cluster div span"));
    let amount = 0;
    for (let cluster of listCluster) {
        amount += parseInt(await cluster.getText()) ;
    }

    let listMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff0000"]`));
    amount += parseInt(listMarker.length);
    return amount;
}

const getTotalPointInSidebarPastSaleMap = async (driver) => {
    let totalLandSales = await driver.findElement(By.css(".total-record span"));            
    totalLandSales = await totalLandSales.getText();
    totalLandSales = totalLandSales.replace(/\D/g, "");
    let totalUnmapped = await driver.findElement(By.css(".total-record a"));            
    totalUnmapped = await totalUnmapped.getText();
    totalUnmapped = totalUnmapped.replace(/\D/g, "");
    let total = parseInt(totalLandSales) - parseInt(totalUnmapped);
    return total;
}

const getTotalPointInMapLandForSale = async (driver) => {
    let listCluster = await driver.findElements(By.css(".marker-cluster div span"));
    let amount = 0;
    for (let cluster of listCluster) {
        amount += parseInt(await cluster.getText()) ;
    }

    let listMarker = await driver.findElements(By.css(`.leaflet-clickable[fill="#ff0000"]`));
    amount += parseInt(listMarker.length);
    return amount;
}

const getTotalPointInSidebarLandForSale = async (driver) => {
    let upcomingLandAuction = await driver.findElement(By.css('.sider-bar-for-sale .total-for-sale .total')).getText();
    upcomingLandAuction = parseInt(upcomingLandAuction.replace(/\D/g, ""));
    let upcomingLandAuctionUnmapped = await driver.findElement(By.css('.sider-bar-for-sale .total-for-sale .unmapped')).getText();
    upcomingLandAuctionUnmapped = parseInt(upcomingLandAuctionUnmapped.replace(/\D/g, ""));
    let buttonListing = await driver.findElement(By.className('tabs-click-listing'));
    await driver.executeScript("arguments[0].click()", buttonListing);
    await UtilHelper.wait(2000);
    let activeListing = await driver.findElement(By.css('.sider-bar-for-sale .total-for-sale .total')).getText();
    activeListing = parseInt(activeListing.replace(/\D/g, ""));
    let activeListingUnmapped = await driver.findElement(By.css('.sider-bar-for-sale .total-for-sale .unmapped')).getText();
    activeListingUnmapped = parseInt(activeListingUnmapped.replace(/\D/g, ""));
    let compareAmount = upcomingLandAuction - upcomingLandAuctionUnmapped + activeListing - activeListingUnmapped;
    return compareAmount;
}

module.exports = {
    getTotalPointInMapPastSaleMap,
    getTotalPointInSidebarPastSaleMap,
    getTotalPointInMapLandForSale,
    getTotalPointInSidebarLandForSale,
    waitLoadPastSaleMap,
    waitLoadLandForSale
}