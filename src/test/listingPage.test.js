import 'jest-chain';
import ListingPage from "../../pages/listing";
import { getClassNameFromHandle, getHrefFromHandle } from "../../utils/base";

let timeout = 20000;

const lp = new ListingPage(page);

const testState = {};

describe('Listing Directory', () => {
    beforeAll(async () => {
        page.on('response', async(response) => {
            let request = response.request();
            if (request.url() === lp.filterRequestUrl){
                testState.requestData = await JSON.parse(request.postData());
                testState.responseJSON = await response.json();
            }
        })
        await page.goto(URL, { waitUntil: "networkidle0" });
    });
    it('should display symbol and name for the corresponding company', async () => {
        await page.waitForSelector(lp.companySymbolSelector);
        let symbolText = await page.$eval(lp.companySymbolSelector, el => el.innerText);
        expect(symbolText).not.toBe("");
        expect(symbolText).toEqual(responseJSON[0].symbolTicker);

        await page.waitForSelector(lp.companyNameSelector);
        let nameText = await page.$eval(lp.companyNameSelector, el => el.innerText);
        expect(nameText).not.toBe("");
        expect(nameText).toEqual(responseJSON[0].instrumentName);
    }, timeout);

    it('should display 10 records per page and provide a pager', async () => {
        await page.waitForSelector(lp.recordsListSelector);
        let recordsCount = await page.$$eval(lp.recordsListSelector, records => records.length);
        expect(recordsCount)
            .toBe(10)
            .toEqual(responseJSON.length);

        await page.waitForSelector(lp.pagerSelector);
        let paginator = await page.$$eval(lp.pagerSelector, els => els.map(el => el.textContent));
        let paginatorString = paginator.join();
        expect(paginatorString)
            .toContain('First')
            .toContain('Previous')
            .toContain('1')
            .toContain('3')
            .toContain('4')
            .toContain('5')
            .toContain('Next')
            .toContain('Last');
    }, timeout);

    it.only('should have symbol provide link to the quote page', async () => {
        await page.waitForSelector(lp.companySymbolSelector);
        let symbolHref = await page.$eval(lp.companySymbolSelector, el => el.href);
        expect(symbolHref).toEqual(testState.responseJSON[0].url);
    }, timeout);
});
