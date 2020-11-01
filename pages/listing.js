export default class ListingPage {
    // XPaths for paginator buttons
    previousXPath = "//a[contains(text(), 'Previous')]/..";
    nextXPath = "//a[contains(text(), 'Next')]/..";
    oneXPath = "//a[contains(text(), '1')]/..";
    twoXPath = "//a[contains(text(), '2')]/..";


    constructor(page) {
        this.page = page;
    }

    async getTitle() {
        return this.page.title();
    }
}
