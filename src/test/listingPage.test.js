import 'jest-chain';
import ListingPage from "../../pages/listing";


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

    /* SPECIFICATION #2: Directory must display Symbol and Name for the corresponding company. */
    it('should display symbol and name for the corresponding company', async () => {
        /* Compare against the first company on the list :
            1. Make sure symbol and name are not empty strings
            2. Make sure values displayed on the client side match values returned by the API
        */

        // Symbol
        await page.waitForSelector(lp.companySymbolSelector);
        let symbolText = await page.$eval(lp.companySymbolSelector, el => el.innerText);
        expect(symbolText).not.toBe("");
        expect(symbolText).toEqual(testState.responseJSON[0].symbolTicker);

        // Name
        await page.waitForSelector(lp.companyNameSelector);
        let nameText = await page.$eval(lp.companyNameSelector, el => el.innerText);
        expect(nameText).not.toBe("");
        expect(nameText).toEqual(testState.responseJSON[0].instrumentName);
    }, timeout);

    /* SPECIFICATION #3: Directory must display 10 records per page and provide a pager. */
    it('should display 10 records per page and provide a pager', async () => {

        /*  1. Count elements by selector
            2. Compare against hardcode spec (i.e. expect 10 records)
            3. Compare against the number of results in the API
        */
        await page.waitForSelector(lp.recordsListSelector);
        let recordsCount = await page.$$eval(lp.recordsListSelector, records => records.length);
        expect(recordsCount)
            .toBe(10)
            .toEqual(testState.responseJSON.length);

        // Make sure expected pager elements are present by inspecting and asserting their innerText value
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

    /* SPECIFICATION #6: Symbol must provide a link to the quote page. */
    it('should have symbol provide link to the quote page', async () => {
        /* 1. Compare against the href attribute to respect UI Testing best practices
           2. Avoid visiting the targeted page, and just target the href */
        await page.waitForSelector(lp.companySymbolSelector);
        let symbolHref = await page.$eval(lp.companySymbolSelector, el => el.href);
        expect(symbolHref).toEqual(testState.responseJSON[0].url);
    }, timeout);
});
