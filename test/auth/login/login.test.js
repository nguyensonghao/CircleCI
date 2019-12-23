// const config = require('config');
// const assert = require('assert');
// const { Builder, By, until } = require('selenium-webdriver');

// const UtilHelper = require('../../helpers/util.helper');

// describe('/LOGIN FUNCTION', () => {
//     it('Should return incorrect password when enter wrong password', async () => {
//         /* 
//             Input: email: selenium_terva@yopmail.com, password: wrongpassword
//             Output: message 'Incorrect password'
//         */
//         let driver = await new Builder().forBrowser('chrome')
//             .setChromeOptions(UtilHelper.getWebOption())
//             .build();

//         try {
//             const user = {
//                 email: 'selenium_terva@yopmail.com',
//                 password: 'wrongpassword'
//             }

//             await driver.get(config.get('URL'));
//             await driver.findElement(By.className('btn-signin')).click();
//             await UtilHelper.wait(500);
//             await driver.findElement(By.css('#tab1 #email')).sendKeys(user.email);
//             await driver.findElement(By.css('#tab1 #password')).sendKeys(user.password);
//             await driver.findElement(By.css('#tab1 button[type="submit"]')).click();
//             await driver.wait(until.elementIsVisible(await driver.findElement(By.id('modal-error'))));
//             let messageError = await driver.findElement(By.css('#modal-error .message')).getText();
//             await driver.quit();
//             assert.equal(messageError, 'Incorrect password');            
//         } catch (error) {
//             await driver.quit();
//             throw error;
//         }
//     })

//     it('Enter invalid email and blank password. Have the red line under the email and return error message "Please include an "@" in the email address"', async () => {
//         /* 
//             Input: email: selenium_terva, password is blank
//             Output: error message "Please include an '@' in the email address. 'selenium_terva' is missing an '@'."

//         */
//         let driver = await new Builder().forBrowser('chrome')
//             .setChromeOptions(UtilHelper.getWebOption())
//             .build();

//         try {
//             const user = {
//                 email: 'selenium_terva'
//             }

//             await driver.get(config.get('URL'));
//             await driver.findElement(By.className('btn-signin')).click();
//             await UtilHelper.wait(500);
//             await driver.findElement(By.css('#tab1 #email')).sendKeys(user.email);
//             await driver.findElement(By.css('#tab1 button[type="submit"]')).click();
//             let messageError = await driver.findElement(By.name("email")).getAttribute("validationMessage");
//             await driver.quit();
//             assert.equal(messageError, `Please include an '@' in the email address. '${user.email}' is missing an '@'.`);
//         } catch (error) {
//             await driver.quit();
//             throw error;
//         }
//     })

//     it('Enter valid email and blank password. Have the red line under the password and return error message "Please fill out this field."', async () => {
//         /* 
//             Input: email: selenium_terva@yopmail.com, password is blank
//             Output: error message "Please fill out this field."

//         */
//         let driver = await new Builder().forBrowser('chrome')
//             .setChromeOptions(UtilHelper.getWebOption())
//             .build();

//         try {
//             const user = {
//                 email: 'selenium_terva@yopmail.com'
//             }

//             await driver.get(config.get('URL'));
//             await driver.findElement(By.className('btn-signin')).click();
//             await UtilHelper.wait(500);
//             await driver.findElement(By.css('#tab1 #email')).sendKeys(user.email);
//             await driver.findElement(By.css('#tab1 button[type="submit"]')).click();
//             await UtilHelper.wait(500);
//             await driver.findElement(By.css('#tab1 button[type="submit"]')).click();
//             let messageError = await driver.findElement(By.name("password")).getAttribute("validationMessage");
//             await driver.quit();         
//             assert.equal(messageError, `Please fill out this field.`);
//         } catch (error) {
//             await driver.quit();
//             throw error;
//         }
//     })

//     it('Should return User not found when enter wrong email', async () => {
//         /* 
//             Input: email: wrongemail@gmail.com, password: correctpassword
//             Output: message 'User not found'
//         */
//         let driver = await new Builder().forBrowser('chrome')
//             .setChromeOptions(UtilHelper.getWebOption())
//             .build();

//         try {
//             const user = {
//                 email: 'wrongemail@gmail.com',
//                 password: 'correctpassword'
//             }

//             await driver.get(config.get('URL'));
//             await driver.findElement(By.className('btn-signin')).click();
//             await UtilHelper.wait(500);
//             await driver.findElement(By.css('#tab1 #email')).sendKeys(user.email);
//             await driver.findElement(By.css('#tab1 #password')).sendKeys(user.password);
//             await driver.findElement(By.css('#tab1 button[type="submit"]')).click();
//             await driver.wait(until.elementIsVisible(await driver.findElement(By.id('modal-error'))));
//             let messageError = await driver.findElement(By.css('#modal-error .message')).getText();
//             await driver.quit();   
//             assert.equal(messageError, 'User not found');            
//         } catch (error) {
//             await driver.quit();
//             throw error;
//         }
//     })

//     it('Email is blank. Have the red line under the email and return error message "Please fill out this field."', async () => {
//         /* 
//             Input: email is blank, password: correctpassword
//             Output: error message "Please fill out this field."

//         */
//         let driver = await new Builder().forBrowser('chrome')
//             .setChromeOptions(UtilHelper.getWebOption())
//             .build();

//         try {
//             const user = {                
//                 password: 'correctpassword'
//             }

//             await driver.get(config.get('URL'));
//             await driver.findElement(By.className('btn-signin')).click();
//             await UtilHelper.wait(500);
//             await driver.findElement(By.css('#tab1 #password')).sendKeys(user.password);
//             await driver.findElement(By.css('#tab1 button[type="submit"]')).click();
//             await UtilHelper.wait(500);
//             await driver.findElement(By.css('#tab1 button[type="submit"]')).click();
//             let messageError = await driver.findElement(By.name("email")).getAttribute("validationMessage");
//             let elementInputEmail = await driver.findElement(By.css('#tab1 input[type=email]'));
//             let className = await elementInputEmail.getAttribute('class');
//             await driver.quit();               
//             assert.equal(messageError, 'Please fill out this field.');
//             assert.equal(className.includes('invalid'), true);            
//         } catch (error) {
//             await driver.quit();
//             throw error;
//         }
//     })

//     it('Leave password & email blank. Have the red line under both and return error message "Please fill out this field."', async () => {
//         /* 
//             Input: Email: selenium_terva@yopmail.com, password: selenium_terva. After that, leave password word & email blank.
//             Output: error message "Please fill out this field."

//         */
//         let driver = await new Builder().forBrowser('chrome')
//             .setChromeOptions(UtilHelper.getWebOption())
//             .build();

//         try {
//             const user = {                
//                 email: 'selenium_terva@yopmail.com',
//                 password: 'selenium_terva'
//             }

//             await driver.get(config.get('URL'));
//             await driver.findElement(By.className('btn-signin')).click();
//             await UtilHelper.wait(500);
//             await driver.findElement(By.css('#tab1 #email')).sendKeys(user.email);
//             await driver.findElement(By.css('#tab1 #password')).sendKeys(user.password);
//             await driver.findElement(By.css('#tab1 #email')).clear();
//             await driver.findElement(By.css('#tab1 #password')).clear();
//             await driver.findElement(By.css('#tab1 button[type="submit"]')).click();
//             let messageError = await driver.findElement(By.name("email")).getAttribute("validationMessage");
//             let elementInputEmail = await driver.findElement(By.css('#tab1 input[type=email]'));
//             let classNameEmail = await elementInputEmail.getAttribute('class');
//             let elementInputPassword = await driver.findElement(By.css('#tab1 input[type=password]'));
//             let classNamePassword = await elementInputPassword.getAttribute('class');
//             await driver.quit();               
//             assert.equal(messageError, 'Please fill out this field.');
//             assert.equal(classNameEmail.includes('invalid'), true);       
//             assert.equal(classNamePassword.includes('invalid'), true);                 
//         } catch (error) {
//             await driver.quit();
//             throw error;
//         }
//     })

//     it('Login successfully', async () => {
//         /* 
//             Input: email: selenium_terva@yopmail.com, password: selenium_terva
//             Output: Login successfully
//         */
//         let driver = await new Builder().forBrowser('chrome')
//             .setChromeOptions(UtilHelper.getWebOption())
//             .build();
            
//         try {
//             const user = {                
//                 email: 'selenium_terva@yopmail.com',
//                 password: 'selenium_terva'
//             }

//             await driver.get(config.get('URL'));
//             await driver.findElement(By.className('btn-signin')).click();
//             await UtilHelper.wait(500);
//             await driver.findElement(By.css('#tab1 #email')).sendKeys(user.email);
//             await driver.findElement(By.css('#tab1 #password')).sendKeys(user.password);
//             await driver.findElement(By.css('#tab1 button[type="submit"]')).click();
//             await UtilHelper.wait(1000);
//             await driver.wait(until.elementIsVisible(await driver.findElement(By.id('header-account'))));
//             let spanText = await driver.findElement(By.css('#header-account a')).getText();
//             await driver.quit();   
//             assert.equal(spanText, 'MY ACCOUNT');            
//         } catch (error) {
//             await driver.quit();
//             throw error;
//         }
//     })
// })