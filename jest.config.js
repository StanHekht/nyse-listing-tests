module.exports = {
    preset: "jest-puppeteer",
    globals: {
        URL: "https://www.nyse.com/listings_directory/stock",
        timeout: 10000
    },
    testMatch: [
        "**/test/**/*.test.js"
    ],
    verbose: true
}
