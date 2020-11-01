export default class ListingPage {
    constructor(page) {
        this.page = page;
    }

    async getTitle() {
        return this.page.title();
    }
}
