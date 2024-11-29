// lambda/src/handlers/scraper/index.js
const axios = require('axios');
const cheerio = require('cheerio');

// Array to store scraped HTML
let scrapedPages = [];

exports.handler = async (event) => {
    try {
        const { url } = JSON.parse(event.body || '{}');

        if (!url) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'URL is required' })
            };
        }

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const html = $.html();

        scrapedPages.push(html);

        console.log('Scraped pages count:', scrapedPages.length);
        console.log('Latest scraped HTML:', html.substring(0, 500) + '...');

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Page scraped successfully',
                pagesScraped: scrapedPages.length,
                latestPagePreview: html.substring(0, 500) + '...'
            })
        };

    } catch (error) {
        console.error('Scraping error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to scrape the webpage',
                details: error.message
            })
        };
    }
};