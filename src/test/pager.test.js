import ListingPage from "../../pages/listing";
import { getClassNameFromHandle } from "../../utils/base";

let timeout = 20000;

const lp = new ListingPage(page);

const testState = {};

describe('Pager', () => {
    beforeAll(async () => {
        page.on('response', async(response) => {
            let request = response.request();
            if (request.url() === lp.filterRequestUrl){
                testState.requestData = await JSON.parse(request.postData());
                testState.responseJSON = await response.json();
            }
        })
        await page.goto(URL, { waitUntil: "networkidle0" });

        // Previous
        await page.waitForXPath(lp.previousXPath);
        [testState.previousHandle] = await page.$x(lp.previousXPath);
        testState.previousClass = await getClassNameFromHandle(testState.previousHandle);

        // Next
        await page.waitForXPath(lp.nextXPath);
        [testState.nextHandle] = await page.$x(lp.nextXPath);
        testState.nextClass = await getClassNameFromHandle(testState.nextHandle);

        // 1 - One
        await page.waitForXPath(lp.oneXPath);
        [testState.oneHandle] = await page.$x(lp.oneXPath);
        testState.oneClass = await getClassNameFromHandle(testState.oneHandle);

        // 2
        await page.waitForXPath(lp.twoXPath);
        [testState.twoHandle] = await page.$x(lp.twoXPath);
        testState.twoClass = await getClassNameFromHandle(testState.twoHandle);

        // First
        await page.waitForXPath(lp.firstXPath);
        [testState.firstHandle] = await page.$x(lp.firstXPath);
        testState.firstClass = await getClassNameFromHandle(testState.firstHandle);

        // Last
        await page.waitForXPath(lp.lastXPath);
        [testState.lastHandle] = await page.$x(lp.lastXPath);
        testState.lastClass = await getClassNameFromHandle(testState.lastHandle);
    });

    it('should display pager elements correctly on initial load', async () => {
        // Make sure paginator indicates that the person is on page1
        expect(testState.oneClass).toContain('disabled');

        // Sanity check that page2 is NOT disabled
        expect(testState.twoClass).not.toContain('disabled');

        // Make sure First is disabled on initial load
        expect(testState.firstClass).toContain('disabled');

        // Make sure Previous is disabled on initial load
        expect(testState.previousClass).toContain('disabled');

        // Make sure Next is NOT disabled on initial load
        expect(testState.nextClass).not.toContain('disabled');
    }, timeout);

    it('should display pager elements correctly after user clicks "Next >"', async () => {
        // Click "Next", listen to request/response, save request/response data
        page.on('response', async(response) => {
            let request = response.request();
            if (request.url() === lp.filterRequestUrl){
                testState.requestData = await JSON.parse(request.postData());
                testState.responseJSON = await response.json();
            }
        })
        await testState.nextHandle.click();
        await page.waitForTimeout(1000);

        // Make sure page 2 was requested in API
        expect(testState.requestData.pageNumber).toEqual(2);

        // Make sure paginator indicates that the person is on page2 and no longer on page1
        testState.oneClass = await getClassNameFromHandle(testState.oneHandle);
        testState.twoClass = await getClassNameFromHandle(testState.twoHandle);
        expect(testState.oneClass).not.toContain('disabled');
        expect(testState.twoClass).toContain('disabled');

        // Make sure that the first company from page 2 is displayed
        await page.waitForSelector(lp.companyNameSelector);
        testState.nameText = await page.$eval(lp.companyNameSelector, el => el.innerText);
        expect(testState.nameText).toEqual(testState.responseJSON[0].instrumentName);

        // Make sure Previous is NOT disabled
        testState.previousClass = await getClassNameFromHandle(testState.previousHandle);
        expect(testState.previousClass).not.toContain('disabled');
    }, timeout);

    it('should display pager elements correctly after user clicks "< Previous"', async () => {
        // Click "Previous", listen to request/response, save request/response data
        page.on('response', async(response) => {
            let request = response.request();
            if (request.url() === lp.filterRequestUrl){
                testState.requestData = await JSON.parse(request.postData());
                testState.responseJSON = await response.json();
            }
        })
        await testState.previousHandle.click();
        await page.waitForTimeout(1000);

        // Make sure page 1 was requested in API
        expect(testState.requestData.pageNumber).toEqual(1);

        // Make sure paginator indicates that the person is back on page1 and no longer on page2
        testState.oneClass = await getClassNameFromHandle(testState.oneHandle);
        testState.twoClass = await getClassNameFromHandle(testState.twoHandle);
        expect(testState.oneClass).toContain('disabled');
        expect(testState.twoClass).not.toContain('disabled');

        // Make sure that the first company from page 1 is displayed
        await page.waitForSelector(lp.companyNameSelector);
        testState.nameText = await page.$eval(lp.companyNameSelector, el => el.innerText);
        expect(testState.nameText).toEqual(testState.responseJSON[0].instrumentName);

        // Make sure Previous is disabled
        testState.previousClass = await getClassNameFromHandle(testState.previousHandle);
        expect(testState.previousClass).toContain('disabled');
    }, timeout);

    it('should display pager elements correctly after user clicks "Last >>"', async () => {
        // Click "Last", listen to request/response, save request/response data
        page.on('response', async(response) => {
            let request = response.request();
            if (request.url() === lp.filterRequestUrl){
                testState.requestData = await JSON.parse(request.postData());
                testState.responseJSON = await response.json();
            }
        })
        await testState.lastHandle.click();
        await page.waitForTimeout(1000);

        // Make sure last page was requested in API
        // Divide total number of records by 10 (number of records on page) to get the last page number
        let lastPageNumber = Math.ceil(testState.responseJSON[0].total / 10);
        expect(testState.requestData.pageNumber).toEqual(lastPageNumber);

        // Make sure paginator indicates that the person is on the last page
        testState.lastClass = await getClassNameFromHandle(testState.lastHandle);
        expect(testState.lastClass).toContain('disabled');


        // Make sure that the first company from the last page is displayed
        await page.waitForSelector(lp.companyNameSelector);
        testState.nameText = await page.$eval(lp.companyNameSelector, el => el.innerText);
        expect(testState.nameText).toEqual(testState.responseJSON[0].instrumentName);

        // Make sure Next is disabled
        testState.nextClass = await getClassNameFromHandle(testState.nextHandle);
        expect(testState.nextClass).toContain('disabled');
    }, timeout);

    it('should display pager elements correctly after user clicks "<< First"', async () => {
        // Click "First", listen to request/response, save request/response data
        page.on('response', async(response) => {
            let request = response.request();
            if (request.url() === lp.filterRequestUrl){
                testState.requestData = await JSON.parse(request.postData());
                testState.responseJSON = await response.json();
            }
        })
        await testState.firstHandle.click();
        await page.waitForTimeout(1000);

        // Make sure first page was requested in API
        expect(testState.requestData.pageNumber).toEqual(1);

        // Make sure paginator indicates that the person is on the first page
        testState.firstClass = await getClassNameFromHandle(testState.firstHandle);
        expect(testState.firstClass).toContain('disabled');


        // Make sure that the first company from the last page is displayed
        await page.waitForSelector(lp.companyNameSelector);
        testState.nameText = await page.$eval(lp.companyNameSelector, el => el.innerText);
        expect(testState.nameText).toEqual(testState.responseJSON[0].instrumentName);

        // Make sure 1 is disabled
        testState.oneClass = await getClassNameFromHandle(testState.oneHandle);
        expect(testState.oneClass).toContain('disabled');

        // Make sure Previous is disabled
        testState.previousClass = await getClassNameFromHandle(testState.previousHandle);
        expect(testState.previousClass).toContain('disabled');
    }, timeout);
});
