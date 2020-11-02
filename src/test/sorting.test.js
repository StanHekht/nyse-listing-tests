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

        // Get ELementHandle and CSS className fo Symbol and Name Columns
        await lp.getSymbolHeaderHandleAndClass(lp.symbolHeaderXPath, testState);
        await lp.getNameHeaderHandleAndClass(lp.nameHeaderXPath, testState);
    });

    /* SPECIFICATION #1: On initial load the Directory must display data sorted by Symbol (ascending).*/
    it('should display data sorted by symbol (ascending) on initial load', async () => {
        // Verify that symbol header element gets a table-sort-asc class
        expect(testState.symbolHeaderClass).toContain("table-sort-asc");

        // Verify that name column is not sorted (not getting a table-sort-asc or table-sort-desc class)
        expect(testState.nameHeaderClass).toEqual("table-sort");
    }, timeout);

    /* SPECIFICATION #5: Directory must allow user to sort Symbol and Name column - use case 1 */
    it('should sort by symbol descending when user first clicks on a symbol header', async () => {
        // Click on a symbol header, make sure element gets "table-sort-DESC" css class
        await testState.symbolHeaderHandle.click();
        await page.waitForTimeout(1000);
        testState.symbolHeaderClass = await getClassNameFromHandle(testState.symbolHeaderHandle);
        expect(testState.symbolHeaderClass).toContain("table-sort-desc");

        // Verify that name column is not sorted, i.e. "Only one column may be sorted at a time"
        testState.nameHeaderClass = await getClassNameFromHandle(testState.nameHeaderHandle);
        expect(testState.nameHeaderClass).toEqual("table-sort");
    }, timeout);

    /* SPECIFICATION #5: Directory must allow user to sort Symbol and Name column - use case 2 */
    it('should sort by symbol ascending when user clicks on a symbol header again', async () => {
        // Click on a symbol header, make sure element gets "table-sort-ASC" css class
        await testState.symbolHeaderHandle.click();
        await page.waitForTimeout(1000);
        testState.symbolHeaderClass = await getClassNameFromHandle(testState.symbolHeaderHandle);
        expect(testState.symbolHeaderClass).toContain("table-sort-asc");

        // Verify that name column is not sorted, i.e. "Only one column may be sorted at a time"
        testState.nameHeaderClass = await getClassNameFromHandle(testState.nameHeaderHandle);
        expect(testState.nameHeaderClass).toEqual("table-sort");
    }, timeout);

    /* SPECIFICATION #5: Directory must allow user to sort Symbol and Name column - use case 3 */
    it('should sort by name ascending when user first clicks on name header', async () => {
        // Click on a name header, make sure element gets "table-sort-ASC" css class
        await testState.nameHeaderHandle.click();
        await page.waitForTimeout(1000);
        testState.nameHeaderClass = await getClassNameFromHandle(testState.nameHeaderHandle);
        expect(testState.symbolHeaderClass).toContain("table-sort-asc");

        // Verify that symbol column is not sorted, i.e. "Only one column may be sorted at a time"
        testState.symbolHeaderClass = await getClassNameFromHandle(testState.symbolHeaderHandle);
        expect(testState.symbolHeaderClass).toEqual("table-sort");
    }, timeout);

    /* SPECIFICATION #5: Directory must allow user to sort Symbol and Name column - use case 4 */
    it('should sort by name descending when user clicks on name header again', async () => {
        // Click on a name header, make sure element gets "table-sort-DESC" css class
        await testState.nameHeaderHandle.click();
        await page.waitForTimeout(1000);
        testState.nameHeaderClass = await getClassNameFromHandle(testState.nameHeaderHandle);
        expect(testState.nameHeaderClass).toContain("table-sort-desc");

        // Verify that symbol column is not sorted, i.e. "Only one column may be sorted at a time"
        testState.symbolHeaderClass = await getClassNameFromHandle(testState.symbolHeaderHandle);
        expect(testState.symbolHeaderClass).toEqual("table-sort");
    }, timeout);

    /* SPECIFICATION #5: Sort must occur across the entire directory. API performs sorting.*/
    it('should have API sort the entire directory', async () => {
        /* This may need a different approach. We assert against a
        1000 records, in order to avoid targeting a precise value of records in the response */
        expect(testState.responseJSON[0].total).toBeGreaterThan(1000);
    }, timeout);
});
