import 'jest-chain';
import ListingPage from "../../pages/listing";
import { getClassNameFromHandle, getInnerTextFromHandle } from "../../utils/base";


const lp = new ListingPage(page);

const testState = {
  symbol: "IBM",
  noResultsValue: "/~&*",
  errorMessageTarget: "Sorry, we couldn't find any instruments that match your criteria."
};

describe('Instrument Filter', () => {
    beforeAll(async () => {
        await page.goto(URL, { waitUntil: "networkidle0" });
        await page.waitForSelector(lp.instrumentFilterForm);

        page.on('response', async(response) => {
            let request = response.request();
            if (request.url() === lp.filterRequestUrl){
                testState.requestData = await JSON.parse(request.postData());
                testState.responseJSON = await response.json();
            }
        })
        await page.type(lp.instrumentFilterForm, testState.symbol);
        await page.waitForTimeout(1000);
    });

    it('should have form field populated with correct value', async () => {
        let formFieldValue = await page.$eval(lp.instrumentFilterForm, el => el.value);
        expect(formFieldValue).toEqual(testState.symbol);
    }, timeout);

    it('should display correct filter results (symbol and name) coming from API', async () => {
        let symbolText = await page.$eval(lp.companySymbolSelector, el => el.innerText);
        let nameText = await page.$eval(lp.companyNameSelector, el => el.innerText);

        expect(symbolText).toEqual(testState.responseJSON[0].symbolTicker);
        expect(nameText).toEqual(testState.responseJSON[0].instrumentName);
    }, timeout);

    it('should return only 1 match', async () => {
        let recordsCount = await page.$$eval(lp.recordsListSelector, records => records.length);
        expect(recordsCount)
            .toBe(1)
            .toEqual(testState.responseJSON.length);
    }, timeout);

    it('should have pager items disabled', async () => {
        // Previous
        await page.waitForXPath(lp.previousXPath);
        [testState.previousHandle] = await page.$x(lp.previousXPath);
        testState.previousClass = await getClassNameFromHandle(testState.previousHandle);

        // Next
        await page.waitForXPath(lp.nextXPath);
        [testState.nextHandle] = await page.$x(lp.nextXPath);
        testState.nextClass = await getClassNameFromHandle(testState.nextHandle);

        // First
        await page.waitForXPath(lp.firstXPath);
        [testState.firstHandle] = await page.$x(lp.firstXPath);
        testState.firstClass = await getClassNameFromHandle(testState.firstHandle);

        // Last
        await page.waitForXPath(lp.lastXPath);
        [testState.lastHandle] = await page.$x(lp.lastXPath);
        testState.lastClass = await getClassNameFromHandle(testState.lastHandle);

        expect(testState.previousClass).toContain('disabled');
        expect(testState.nextClass).toContain('disabled');
        expect(testState.firstClass).toContain('disabled');
        expect(testState.lastClass).toContain('disabled');
    }, timeout);

    it('should display error message when no results have been returned', async () => {
        await page.type(lp.instrumentFilterForm, testState.noResultsValue);
        await page.waitForTimeout(1000);

        await page.waitForXPath(lp.errorMessageXPath);
        [testState.errorMessageHandle] = await page.$x(lp.errorMessageXPath);
        testState.errorMessage = await getInnerTextFromHandle(testState.errorMessageHandle);

        expect(testState.errorMessage).toEqual(testState.errorMessageTarget);
    }, timeout);
});
