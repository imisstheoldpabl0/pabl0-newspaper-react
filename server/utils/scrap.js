const puppeteer = require("puppeteer");
const fs = require("fs");

// extractNewsData() will extract the information from each product
const extractNewsData = async (url, browser) => {

    try {
        // newsData{} objetct will store the information of each product
        const newsData = {}

        // Open up a new tab in the browser
        const page = await browser.newPage()

        // Pass the url of each found link in scrap() and extract the data
        await page.goto(url)

        // date --> article date
        newsData['date'] = await page.$eval(".date", date => date.innerHTML)

        // title --> article title
        newsData['headline'] = await page.$eval(".font-caladea-regular", headline => headline.innerText)

        newsData['img'] = await page.$eval(".story-promo figure img", img => img.src)
        //keypoints --> main article keypoints (commented because some articles donw have keypoints and therefore throw an error)
        //newsData['keypoints'] = await page.$eval(".key-points", keypoints => keypoints.innerText)

        // body --> body text
        newsData['body'] = await page.$eval(".body", p => p.innerText)

        return newsData;

    }
    catch (err) {
        // return the error and its location
        return { error: err + `Something went wrong at extractNewsData()`}
    }
}

// scrap() function will 
const scrap = async (url) => {
    try {
        // create an empty array which will store the information from the products
        const scrapedData = []

        // initialize a new browser instance and select headless option (show browser or not)

        console.log("Opening the browser...");
        const browser = await puppeteer.launch({ headless: true })

        // open up a new tab (page)
        const page = await browser.newPage();

        // pass the general url it should navigate to (this is the base url that contains all of the other links)
        await page.goto(url);
        console.log(`Navigating to ${url}...`);

        // find all links with this selector
        const webElement = (".story-card-entire-link")

        // save all urls by mapping over all elements that meet the selector characteristics
        const urls = await page.$$eval(`${webElement}`, rest => rest.map(a => a.href));

        // delete duplicates
        //const urls = await tmpurls.filter((link, index) => { return tmpurls.indexOf(link) === index })

        console.log(`Found urls: ${urls.length}`, urls)

        // choose how many links to extract (urls.length selects all found links)
        // const urls2 = urls.slice(0, urls.length);
        const urls2 = urls.slice(0, 3);

        console.log(`${urls2.length} selected links`);

        // iterate over the found links list and edit each object to clean up the information received
        for (productLink in urls2) {
            const article = await extractNewsData(urls2[productLink], browser);

            Object.defineProperties(article, {
                date: {
                    value: article.date || 'N/A',
                    writable: false,
                },
                headline: {
                    value: article.headline || 'N/A',
                    writable: false,
                },
                /* keypoints: {
                    value: (article.keypoints || 'N/A')
                        .replace(/ZINGER KEY POINTS/, "")
                        .replace(/\n/g, " ")
                        .replace(/’/g, "'"),
                    writable: false,
                }, */
                body: {
                    value: (article.body || 'N/A')
                        .replace(/\n/g, " ") // line skip --> space char
                        .replace(/Loading...  /g, "") // loading text --> nothing
                        .replace(/’/g, "'") // weird apostrophe --> normal one
                        .replace(/‘/g, "'") // weird apostrophe --> normal one
                        .replace(/\"/g, "") // backslash ( \ ) --> nothing
                        .replace(/ /g, " ") // weird space ( ) --> normal space char
                        .replace(/–/g, "") // weird dash ( – ) --> normal space char
                        // .replace(/:/g, "") // column ( : ) --> normal space char
                        // .replace(/;/g, "") // semi-column ( ; ) --> normal space char
                        .replace(/|/g, "") // semi-column ( | ) --> normal space char
                        .replace(/  /g, " "), // double space ( | ) --> single space char
                        // .replace(/,/g, " ") // comma ( , ) --> nothing
                        // .replace(/./g, " ") // period ( . ) --> nothing
                        // .replace(/'/g, " "), // regular apostrophe ( ' ) --> nothing
                    writable: false,
                },
            });
            if (Object.prototype.hasOwnProperty('error')) {
                console.log("Article not pushed")
                !scrapedData.push(article);

            } else {
                console.log("Pushed 1 more article");
                scrapedData.push(article);
            }
        }

        // close the browser instance
        await browser.close()

        // return the scrapedData array with all of the data from each of the articles
        return scrapedData;

    } catch (err) {
        console.log("Error:", err);
    }
}

// Function to save data to JSON file
const saveToJSON = (data, filename) => {
    fs.writeFile(filename, JSON.stringify(data, null, 2), err => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log('Successfully wrote to', filename);
        }
    });
}

exports.scrap = scrap;

scrap("https://www.lavoz.com.ar")
    .then(data => {
        saveToJSON(data, 'scraped-news.json');
    });