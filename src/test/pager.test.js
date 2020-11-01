import 'jest-chain';
import ListingPage from "../../pages/listing";
import { getInnerTextFromHandle, getClassNameFromHandle } from "../../utils/base";

let timeout = 20000;
let responseJSON;
let requestData;

const lp = new ListingPage(page);

const testState = {};

describe('Pager', () => {
    beforeAll(async () => {
        page.on('response', async(response) => {
            let request = response.request();
            if (request.url() === 'https://www.nyse.com/api/quotes/filter'){
                requestData = await JSON.parse(request.postData());
                responseJSON = await response.json();
            }
        })
        await page.goto(URL, { waitUntil: "networkidle0" });
    });
    it('.....', async () => {

    }, timeout);


    it('should allow user to go to the next and previous pages', async () => {
        // Create variables to further store request and response data
        let newRequestData;
        let newResponseJSON;

        // Previous
        await page.waitForXPath(lp.previousXPath);
        let [previousHandle] = await page.$x(lp.previousXPath);
        let previousClass = await getClassNameFromHandle(previousHandle);

        // Next
        await page.waitForXPath(lp.nextXPath);
        let [nextHandle] = await page.$x(lp.nextXPath);
        let nextClass = await page.evaluate(el => el.className, nextHandle);

        // 1 - One
        await page.waitForXPath(lp.oneXPath);
        let [oneHandle] = await page.$x(lp.oneXPath);
        let oneClass = await page.evaluate(el => el.className, oneHandle);

        // 2
        await page.waitForXPath(lp.twoXPath);
        let [twoHandle] = await page.$x(lp.twoXPath);
        let twoClass = await page.evaluate(el => el.className, twoHandle);

        // Make sure paginator indicates that the person is on page1
        expect(oneClass).toContain('disabled');
        expect(twoClass).not.toContain('disabled');

        // Make sure Previous is disabled on initial load
        expect(previousClass).toContain('disabled');

        // Make sure Next is NOT disabled on initial load
        expect(nextClass).not.toContain('disabled');

        /* =================================== */

        // Click "Next", listen to request/response, save request/response data
        page.on('response', async(response) => {
            let request = response.request();
            if (request.url() === 'https://www.nyse.com/api/quotes/filter'){
                newRequestData = await JSON.parse(request.postData());
                newResponseJSON = await response.json();
            }
        })
        await nextHandle.click();
        await page.waitForTimeout(1000);

        // Make sure page 2 was requested in API
        expect(newRequestData.pageNumber).toEqual(2);

        // Make sure paginator indicates that the person is on page2 and no longer on page1
        oneClass = await page.evaluate(el => el.className, oneHandle);
        twoClass = await page.evaluate(el => el.className, twoHandle);
        expect(oneClass).not.toContain('disabled');
        expect(twoClass).toContain('disabled');

        // Make sure that the first company from page 2 is displayed
        await page.waitForSelector('tr > td:nth-child(2)');
        let nameText = await page.$eval('tr > td:nth-child(2)', el => el.innerText);
        expect(nameText).toEqual(newResponseJSON[0].instrumentName);

        // Make sure Previous is NOT disabled
        previousClass = await page.evaluate(el => el.className, previousHandle);
        expect(previousClass).not.toContain('disabled');

        /* =================================== */

        // Click "Previous", listen to request/response, save request/response data
        page.on('response', async(response) => {
            let request = response.request();
            if (request.url() === 'https://www.nyse.com/api/quotes/filter'){
                newRequestData = await JSON.parse(request.postData());
                newResponseJSON = await response.json();
            }
        })
        await previousHandle.click();
        await page.waitForTimeout(1000);

        // Make sure page 1 was requested in API
        expect(newRequestData.pageNumber).toEqual(1);

        // Make sure paginator indicates that the person is back on page1 and no longer on page2
        oneClass = await page.evaluate(el => el.className, oneHandle);
        twoClass = await page.evaluate(el => el.className, twoHandle);
        expect(oneClass).toContain('disabled');
        expect(twoClass).not.toContain('disabled');

        // Make sure that the first company from page 2 is displayed
        await page.waitForSelector('tr > td:nth-child(2)');
        nameText = await page.$eval('tr > td:nth-child(2)', el => el.innerText);
        expect(nameText).toEqual(newResponseJSON[0].instrumentName);

        // Make sure Previous is disabled
        previousClass = await page.evaluate(el => el.className, previousHandle);
        expect(previousClass).toContain('disabled');
    }, timeout);
});
