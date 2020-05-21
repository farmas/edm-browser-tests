// Require modules used in the logic below
const {Builder, By, Key, until} = require('selenium-webdriver');
require('dotenv').config();
require('chromedriver');

const driver = new Builder()
    .forBrowser('safari')
    .build();

const timeout = 10 * 1000;
const userId = process.env.TEST_USER;
const userPass = process.env.TEST_PASSWORD;
const userToken = process.env.TEST_TOKEN;

// Configure Jasmine's timeout value to account for longer tests.
// Adjust this value if you find our tests failing due to timeouts.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 50 * 1000;

var sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var login = async function() {
    let usernameLocator = By.name('j_username');
    let passwordLocator = By.name('j_password');
    let submitLocator = By.name('_eventId_proceed');

     // Load the login page
    await driver.get('https://apps-dev.admin.uw.edu/content-services-ui/');

    await driver.wait(until.elementLocated(usernameLocator), timeout);
    await (await driver.findElement(usernameLocator)).sendKeys(userId, Key.TAB);
    await sleep(1000);

    await driver.wait(until.elementLocated(passwordLocator), timeout);
    await (await driver.findElement(passwordLocator)).sendKeys(userPass);
    await sleep(1000);

    await driver.wait(until.elementLocated(submitLocator), timeout);
    await (await driver.findElement(submitLocator)).click();
    await sleep(1000);

    let duoFrameLocator = By.id('duo_iframe');
    let duoButtonLocator = By.css('.auth-button');
    let duoPasscodeLocator = By.name('passcode');

    await driver.wait(until.elementLocated(duoFrameLocator), timeout);
    const dueFrame = await driver.findElement(duoFrameLocator);
    await sleep(1000);
    await driver.switchTo().frame(dueFrame);
    await sleep(1000);

    await driver.wait(until.elementLocated(duoButtonLocator), timeout);
    await (await driver.findElement(duoButtonLocator)).click();
    await sleep(1000);

    await (await driver.findElement(duoPasscodeLocator)).sendKeys(userToken, Key.ENTER);
    await sleep(1000);

    await sleep(1000);
    await driver.switchTo().parentFrame();
    await sleep(1000);
};

describe("Basic browser tests", function() {
    // Before every test, open a browser and login
    // using the logic written above.
    beforeEach(async function() {
        await login();
        console.log('Test beginning.')
    });

    // After each test, close the browser.
    afterAll(async function() {
        await driver.quit();
    });

    it("should execute fede's test", async function() {
        await driver.wait(until.elementLocated(By.css('.uw-patch')), timeout);
    });
});