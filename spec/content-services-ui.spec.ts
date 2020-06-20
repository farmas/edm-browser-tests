import { By, until, WebDriver } from 'selenium-webdriver';
import * as utils from './utils/WebDriverUtils';

const testUrl = 'https://apps-eval.admin.uw.edu/content-services-ui/';

describe("UUI web application", function() {
    let driver: WebDriver;

    beforeAll(async () => {
        driver = utils.startWebDriver();

        await utils.ensureUserLoggedIn(driver, testUrl);
    });

    beforeEach(async function() {
        await driver.get(testUrl);
    });

    afterAll(async () => {
        await driver.quit();
    });

    it("should execute fede's test", async function() {
        await driver.wait(until.elementLocated(By.css('.uw-patch')), 10 * 1000);
    });

    it("should execute fede's second test", async function() {
        await driver.wait(until.elementLocated(By.css('.uw-patch')), 10 * 1000);
    });
});