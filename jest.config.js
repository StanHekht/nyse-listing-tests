module.exports = {
    preset: "jest-puppeteer",
    globals: {
        URL: "https://www.nyse.com/listings_directory/stock"
    },
    testMatch: [
        "**/test/**/*.test.js"
    ],
    verbose: true
}
