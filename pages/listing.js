export default class ListingPage {
    // XPaths for paginator buttons
    previousXPath = "//a[contains(text(), 'Previous')]/..";
    nextXPath = "//a[contains(text(), 'Next')]/..";
    oneXPath = "//a[contains(text(), '1')]/..";
    twoXPath = "//a[contains(text(), '2')]/..";
    firstXPath = "//a[contains(text(), 'First')]/..";
    lastXPath = "//a[contains(text(), 'Last')]/..";

    // Request URLs
    filterRequestUrl = 'https://www.nyse.com/api/quotes/filter';

    // Selectors
    companySymbolSelector = 'tr > td:nth-child(1) > a';
    companyNameSelector = 'tr > td:nth-child(2)';
    sortSelector = '[class*="table-sort"]';
    pagerSelector = 'ul[class="pagination"] > li';
    recordsListSelector = 'td > a[href^="https://www.nyse.com/quote/"]';


    constructor(page) {
        this.page = page;
    }

    async getTitle() {
        return this.page.title();
    }
}
