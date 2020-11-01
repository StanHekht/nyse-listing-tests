import { getClassNameFromHandle } from "../utils/base";

export default class ListingPage {
    // Constructor
    constructor(page) {
        this.page = page;
    }
    // XPaths for paginator buttons
    previousXPath = "//a[contains(text(), 'Previous')]/..";
    nextXPath = "//a[contains(text(), 'Next')]/..";
    oneXPath = "//a[contains(text(), '1')]/..";
    twoXPath = "//a[contains(text(), '2')]/..";
    firstXPath = "//a[contains(text(), 'First')]/..";
    lastXPath = "//a[contains(text(), 'Last')]/..";

    // Other XPaths
    symbolHeaderXPath = "//th[contains(text(), 'Symbol')]";
    nameHeaderXPath = "//th[contains(text(), 'Name')]";
    errorMessageXPath = "//td[contains(text(), 'Sorry')]";

    // Request URLs
    filterRequestUrl = 'https://www.nyse.com/api/quotes/filter';

    // Selectors
    companySymbolSelector = 'tr > td:nth-child(1) > a';
    companyNameSelector = 'tr > td:nth-child(2)';
    sortSelector = '[class*="table-sort"]';
    pagerSelector = 'ul[class="pagination"] > li';
    recordsListSelector = 'td > a[href^="https://www.nyse.com/quote/"]';
    instrumentFilterForm = "#instrumentFilter";

    // Get page title: usuful getter method to have, although it is not uset atm
    async getTitle() {
        return this.page.title();
    }

    // Symbol and name header class and handle getters
    async getSymbolHeaderHandleAndClass(xpath, testState) {
        await page.waitForXPath(xpath);
        [testState.symbolHeaderHandle] = await page.$x(xpath);
        testState.symbolHeaderClass = await getClassNameFromHandle(testState.symbolHeaderHandle);
    }

    async getNameHeaderHandleAndClass(xpath, testState) {
        await page.waitForXPath(xpath);
        [testState.nameHeaderHandle] = await page.$x(xpath);
        testState.nameHeaderClass = await getClassNameFromHandle(testState.nameHeaderHandle);
    }


    // Paginator class and handle getters
    async getPreviousHandleAndClass(xpath, testState) {
        await page.waitForXPath(xpath);
        [testState.previousHandle] = await page.$x(xpath);
        testState.previousClass = await getClassNameFromHandle(testState.previousHandle);
    }

    async getNextHandleAndClass(xpath, testState) {
        await page.waitForXPath(xpath);
        [testState.nextHandle] = await page.$x(xpath);
        testState.nextClass = await getClassNameFromHandle(testState.nextHandle);
    }

    async getFirstHandleAndClass(xpath, testState) {
        await page.waitForXPath(xpath);
        [testState.firstHandle] = await page.$x(xpath);
        testState.firstClass = await getClassNameFromHandle(testState.firstHandle);
    }

    async getLastHandleAndClass(xpath, testState) {
        await page.waitForXPath(xpath);
        [testState.lastHandle] = await page.$x(xpath);
        testState.lastClass = await getClassNameFromHandle(testState.lastHandle);
    }

    async getOneHandleAndClass(xpath, testState) {
        await page.waitForXPath(xpath);
        [testState.oneHandle] = await page.$x(xpath);
        testState.oneClass = await getClassNameFromHandle(testState.oneHandle);
    }

    async getTwoHandleAndClass(xpath, testState) {
        await page.waitForXPath(xpath);
        [testState.twoHandle] = await page.$x(xpath);
        testState.twoClass = await getClassNameFromHandle(testState.twoHandle);
    }
}
