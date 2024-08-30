const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path")

// extractNewsData() will extract the information from each product
const extractNewsData = async (url, browser) => {
    try {
        const newsData = {}
        const page = await browser.newPage()
        await page.goto(url)

        newsData['date'] = await page.$eval(".date", date => date.innerHTML);
        newsData['headline'] = await page.$eval(".font-caladea-regular", headline => headline.innerText);
        newsData['body'] = await page.$eval(".body", p => p.innerText);
        newsData['img'] = await page.$eval(".story-promo figure img", img => img.src);

        await page.close();
        return newsData;

    }
    catch (err) {
        console.error(`Error on page ${url}:`, err.message);
        return { error: err.message }; // Capture only the error message
    }
};

// Function to scrap the website
const scrap = async (url) => {
    const scrapedData = []

    try {
        console.log("Opening the browser...");
        const browser = await puppeteer.launch({ headless: true })
        const page = await browser.newPage();
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
        const urlsToProcess = urls.slice(0, 200);
        console.log(`${urlsToProcess.length} selected links`);

        // iterate over the found links list and edit each object to clean up the information received
        for (let link of urlsToProcess) {
            const article = await extractNewsData(link, browser);
            if (!article.error) {
                Object.defineProperties(article, {
                    date: {
                        value: (article.date || 'N/A')
                        .replace(/,/g, ""), // line skip --> space char
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
                })
                scrapedData.push(article);
                console.log(`Successfully scraped: ${link}`);

            } else {
                console.log(`Skipped article due to error: ${article.error}`);
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
    const filePath = path.join(__dirname, filename);
    fs.writeFile(filePath, JSON.stringify(data, null, 2), err => {
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