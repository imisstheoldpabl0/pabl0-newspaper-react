const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path")

// extractNewsData() will extract the information from each product
const extractNewsData = async (url, browser) => {
    try {
        const newsData = {}
        const page = await browser.newPage()
        await page.goto(url)

        // let dashSplit = this.document.location.href.split('/')
        // let siteName = dashSplit[3]

        // document.querySelector(".ellipsis > .ellipsis").innerText
        // document.querySelector(".story-heading").innerText
        // document.querySelector(".story-content").innerText
        // document.querySelector(".fluidbox__wrap > img").src
        // this.document.location.href

        newsData['publication_date'] = await page.$eval('.ellipsis.ellipsis[itemprop="datePublished"]', element => element.getAttribute('content'));
        newsData['title'] = await page.$eval(".story-heading", title => title.innerText);
        newsData['body'] = await page.$eval(".story-content", p => p.innerText);
        newsData['featured_image_url'] = await page.$eval(".story-header figure img", img => img.src);
        newsData['article_url'] = await page.evaluate(() => document.location.href);
        newsData['category'] = await page.evaluate(() => document.location.href.split('/')[3]);

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
        const webElement = (".card-title > a")

        // save all urls by mapping over all elements that meet the selector characteristics
        const urls = await page.$$eval(`${webElement}`, rest => rest.map(a => a.href));

        // delete duplicates
        //const urls = await tmpurls.filter((link, index) => { return tmpurls.indexOf(link) === index })

        console.log(`Found urls: ${urls.length}`, urls)

        // choose how many links to extract (urls.length selects all found links)
        // const urls2 = urls.slice(0, urls.length);
        const urlsToProcess = urls.slice(0, 5);
        console.log(`${urlsToProcess.length} selected links`);

        // iterate over the found links list and edit each object to clean up the information received
        for (let link of urlsToProcess) {
            const article = await extractNewsData(link, browser);
            if (!article.error) {
                Object.defineProperties(article, {
                    publication_date: {
                        value: (article.publication_date || 'N/A'),
                        writable: false,
                    },
                    title: {
                        value: (article.title || 'N/A')
                            .replace(/\"/g, ""), // line skip --> space char
                        writable: false,
                    },
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
                    featured_image_url: {
                        value: (article.featured_image_url || 'N/A'),
                        writable: false,
                    },
                    article_url: {
                        value: (article.article_url || 'N/A'),
                        writable: false,
                    },
                    category: {
                        value: (article.category || 'N/A'),
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

scrap("https://www.diariodemocracia.com/policiales/")
    .then(data => {
        saveToJSON(data, 'scraped-news.json');
    });