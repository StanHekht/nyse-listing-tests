import 'jest-chain';
import ListingPage from "../../pages/listing";

let timeout = 20000;
let responseJSON;
let requestData;

const lp = new ListingPage(page);

describe('Listing Directory', () => {
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

    it.only('should display data sorted by symbol (ascending)', async () => {
        await page.waitForSelector('[class*="table-sort"]');
        let sortHeadersClasses = await page.$$eval('[class*="table-sort"]', els => els.map(el => el.className));
        let [symbolClass, nameClass] = sortHeadersClasses;

        expect(symbolClass).toContain("table-sort-asc");
        expect(nameClass).toEqual("table-sort");
    }, timeout);

    it('should display symbol and name for the corresponding company', async () => {
        await page.waitForSelector('tr > td:nth-child(1) > a');
        let symbolText = await page.$eval('tr > td:nth-child(1) > a', el => el.innerText);
        expect(symbolText).not.toBe("");
        expect(symbolText).toEqual(responseJSON[0].symbolTicker);

        await page.waitForSelector('tr > td:nth-child(2)');
        let nameText = await page.$eval('tr > td:nth-child(2)', el => el.innerText);
        expect(nameText).not.toBe("");
        expect(nameText).toEqual(responseJSON[0].instrumentName);
    }, timeout);

    it('must display 10 records per page and provide a pager', async () => {
        await page.waitForSelector('td > a[href^="https://www.nyse.com/quote/"]');
        let recordsCount = await page.$$eval('td > a[href^="https://www.nyse.com/quote/"]', records => records.length);
        expect(recordsCount)
            .toBe(10)
            .toEqual(responseJSON.length);

        await page.waitForSelector('ul[class="pagination"] > li');
        let paginator = await page.$$eval('ul[class="pagination"] > li', els => els.map(el => el.textContent));
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

    it('should allow user to go to the next and previous pages', async () => {
        // Create variables to further store request and response data
        let newRequestData;
        let newResponseJSON;

        // Previous
        let previousXPath = "//a[contains(text(), 'Previous')]/..";
        await page.waitForXPath(previousXPath);
        let [previousHandle] = await page.$x(previousXPath);
        let previousText = await page.evaluate(el => el.innerText, previousHandle);
        let previousClass = await page.evaluate(el => el.className, previousHandle);

        // Next
        let nextXPath = "//a[contains(text(), 'Next')]/..";
        await page.waitForXPath(nextXPath);
        let [nextHandle] = await page.$x(nextXPath);
        let nextText = await page.evaluate(el => el.innerText, nextHandle);
        let nextClass = await page.evaluate(el => el.className, nextHandle);

        // 1
        let oneXPath = "//a[contains(text(), '1')]/..";
        await page.waitForXPath(oneXPath);
        let [oneHandle] = await page.$x(oneXPath);
        let oneText = await page.evaluate(el => el.innerText, oneHandle);
        let oneClass = await page.evaluate(el => el.className, oneHandle);

        // 2
        let twoXPath = "//a[contains(text(), '2')]/..";
        await page.waitForXPath(twoXPath);
        let [twoHandle] = await page.$x(twoXPath);
        let twoText = await page.evaluate(el => el.innerText, twoHandle);
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
