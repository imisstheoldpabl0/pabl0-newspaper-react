const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

// Function to extract news data
const extractNewsData = async (url, browser) => {
    try {
        const newsData = {};
        const page = await browser.newPage();
        await page.goto(url);

        newsData['date'] = await page.$eval(".date", date => date.innerHTML);
        newsData['headline'] = await page.$eval(".font-caladea-regular", headline => headline.innerText);
        newsData['body'] = await page.$eval(".body", p => p.innerText);
        newsData['img'] = await page.$eval(".story-promo figure img", img => img.src);

        await page.close();
        return newsData;

    } catch (err) {
        console.error(`Error on page ${url}:`, err.message);
        return { error: err.message }; // Capture only the error message
    }
};

// Function to scrape the website
const scrap = async (url) => {
    const scrapedData = [];

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url);

        const webElement = ".story-card-entire-link";
        const urls = await page.$$eval(webElement, links => links.map(link => link.href));
        console.log(`Found urls: ${urls.length}`, urls);

        const urlsToProcess = urls.slice(0, 20); // Limit the number of links to process

        for (let link of urlsToProcess) {
            const article = await extractNewsData(link, browser);
            if (!article.error) {
                scrapedData.push(article);
                console.log(`Successfully scraped: ${link}`);
            } else {
                console.log(`Skipped article due to error: ${article.error}`);
            }
        }

        await browser.close();
    } catch (err) {
        console.error("Scraping failed:", err.message);
    }

    return scrapedData;
};

// Function to save data to a JSON file
const saveToJSON = (data, filename) => {
    const filePath = path.join(__dirname, filename);
    fs.writeFile(filePath, JSON.stringify(data, null, 2), err => {
        if (err) {
            console.error('Error writing to file', err.message);
        } else {
            console.log('Successfully wrote to', filename);
        }
    });
};

scrap("https://www.lavoz.com.ar")
    .then(data => {
        saveToJSON(data, 'scraped-news.json');
    });
