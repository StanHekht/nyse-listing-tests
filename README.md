## Automation Tests for NYSE "Stock Listing Directory"

## How to run
- Clone the project: ```git clone```
- Make sure node/npm are installed
- Install dependencies: ```npm install```
- Run ```npm tun test```
- Observe results in the terminal, i.e.: https://share.getcloudapp.com/ApuLmY1j

## Browser Details
- By default, the tests are run in Chromium HEADLESS mode
- In you prefer to run tests using a browser, go to ```jest-puppeteer.config.js``` in the project root directory and set ```headless: false``` in jest-puppeteer launch options
- TODO: move the above setting to an environment variable

## Specifications / Requirements
1. On initial load the Directory must display data sorted by Symbol (ascending).
1. Directory must display Symbol and Name for the corresponding company.
1. Directory must display 10 records per page and provide a pager.
1. Directory pager must allow user to navigate to next page, previous page, first page, and last page.
1. Directory must allow user to sort Symbol and Name column. Only one column may be sorted at a time.
    1. Sort must occur across the entire directory, not just the viewable page. API performs sorting.
1. Symbol must provide a link to the quote page (e.g. https://www.nyse.com/quote/XNYS:A for Symbol A).
    1. API provides the URL.
1. Filter input must allow a user to enter a part of a Symbol or Company Name to filter the Directory.
    1. Filtering must occur as soon as the end user stops typing into the input field. For example, if “IBM” is entered into the filter the Directory must filter automatically to display 1 record since “INTERNATIONAL BUS MACH CORP” would be the only match available.
    1. If there are no matches found the Directory must display error message “Sorry, we couldn't find any instruments that match your criteria”
    1. Pager must be disabled when Directory displays less than 10 records.


## Test Suite
- Test suite sonsists of 4 filer which can be located in ```src/test``` directory
- Each test file targets 1 or more project requirements (specifications):
  - ```src/test/instrumentFilter.test.js``` handles spec #7
  - ```src/test/listingPage.test.js``` handles specs #2, 3, and 6
  - ```src/test/pager.test.js``` handles spec #4
  - ```src/test/sorting.test.js``` handles specs #1 and 5
- A more detailed breakdown can be found in the comments inside each test file, e.g.: https://share.getcloudapp.com/mXu6WrRK

## TODOs
- Use BDD to compose tests based on provided requirements.
- Implement cross-browser testing
