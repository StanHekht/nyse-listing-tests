import ListingPage from "../../pages/listing";
import { getClassNameFromHandle } from "../../utils/base";


const lp = new ListingPage(page);

const testState = {};

describe('Sorting', () => {
    beforeAll(async () => {
        page.on('response', async(response) => {
            let request = response.request();
            if (request.url() === lp.filterRequestUrl){
                testState.requestData = await JSON.parse(request.postData());
                testState.responseJSON = await response.json();
            }
        })
        await page.goto(URL, { waitUntil: "networkidle0" });

        // Symbol - Name
        await lp.getSymbolHeaderHandleAndClass(lp.symbolHeaderXPath, testState);
        await lp.getNameHeaderHandleAndClass(lp.nameHeaderXPath, testState);
    });

    it('should display data sorted by symbol (ascending) on initial load', async () => {
        // Verify that symbol header element gets a table-sort-asc class
        expect(testState.symbolHeaderClass).toContain("table-sort-asc");

        // Verify that name column is not sorted (not getting a table-sort-asc or table-sort-desc class)
        expect(testState.nameHeaderClass).toEqual("table-sort");
    }, timeout);

    it('should sort by symbol descending when user first clicks on a symbol header', async () => {
        // Click on a symbol header, make sure element gets "table-sort-desc" css class
        await testState.symbolHeaderHandle.click();
        await page.waitForTimeout(1000);
        testState.symbolHeaderClass = await getClassNameFromHandle(testState.symbolHeaderHandle);
        expect(testState.symbolHeaderClass).toContain("table-sort-desc");

        // Verify that name column is not sorted
        testState.nameHeaderClass = await getClassNameFromHandle(testState.nameHeaderHandle);
        expect(testState.nameHeaderClass).toEqual("table-sort");
    }, timeout);

    it('should sort by symbol ascending when user clicks on a symbol header again', async () => {
        await testState.symbolHeaderHandle.click();
        await page.waitForTimeout(1000);
        testState.symbolHeaderClass = await getClassNameFromHandle(testState.symbolHeaderHandle);
        expect(testState.symbolHeaderClass).toContain("table-sort-asc");

        // Verify that name column is not sorted
        testState.nameHeaderClass = await getClassNameFromHandle(testState.nameHeaderHandle);
        expect(testState.nameHeaderClass).toEqual("table-sort");
    }, timeout);

    it('should sort by name ascending when user first clicks on name header', async () => {
        await testState.nameHeaderHandle.click();
        await page.waitForTimeout(1000);
        testState.nameHeaderClass = await getClassNameFromHandle(testState.nameHeaderHandle);
        expect(testState.symbolHeaderClass).toContain("table-sort-asc");

        // Verify that symbol column is not sorted
        testState.symbolHeaderClass = await getClassNameFromHandle(testState.symbolHeaderHandle);
        expect(testState.symbolHeaderClass).toEqual("table-sort");
    }, timeout);

    it('should sort by name descending when user clicks on name header again', async () => {
        await testState.nameHeaderHandle.click();
        await page.waitForTimeout(1000);
        testState.nameHeaderClass = await getClassNameFromHandle(testState.nameHeaderHandle);
        expect(testState.nameHeaderClass).toContain("table-sort-desc");

        // Verify that symbol column is not sorted
        testState.symbolHeaderClass = await getClassNameFromHandle(testState.symbolHeaderHandle);
        expect(testState.symbolHeaderClass).toEqual("table-sort");
    }, timeout);

    it('should have API sort the entire directory', async () => {
        /* This may need a different approach. We assert against a
        1000 records, in order to avoid targeting a precise value of records in the response */
        expect(testState.responseJSON[0].total).toBeGreaterThan(1000);
    }, timeout);
});
