import { Builder, By, Key, until, Capabilities, WebDriver } from 'selenium-webdriver';

require('dotenv').config();
require('chromedriver');
require('iedriver');

const timeout = 10 * 1000;
const userId = process.env.TEST_USER;
const userPass = process.env.TEST_PASSWORD;
const userToken = process.env.TEST_TOKEN;
let isLoggedIn: boolean;
let browser = process.env.TEST_BROWSER;
browser = browser && browser.trim();

console.log(`Configures Browser: '${browser}'`);

// Configure Jasmine's timeout value to account for longer tests.
// Adjust this value if you find our tests failing due to timeouts.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 50 * 1000;

export function startWebDriver(): WebDriver {
    let driver: WebDriver;
    if (browser === 'ie') {
        let capabilities = Capabilities.ie();
        capabilities.set("ignoreProtectedModeSettings", true);
        capabilities.set("ignoreZoomSetting", true);
        driver = new Builder().withCapabilities(capabilities).build();
    }
    else {
        driver = new Builder()
            .forBrowser(browser || 'chrome')
            .build();
    }

    return driver;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function ensureUserLoggedIn(driver: WebDriver, url: string) {
    if (isLoggedIn) {
        return;
    }

    let usernameLocator = By.name('j_username');
    let passwordLocator = By.name('j_password');
    let submitLocator = By.name('_eventId_proceed');

    await driver.get(url);

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

    isLoggedIn = true;
};
