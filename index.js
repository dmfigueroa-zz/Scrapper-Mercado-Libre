const puppeteer = require('puppeteer');

const SEARCH_TERM = 'portátiles';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`https://mercadolibre.com.co/`, { waitUntil: 'domcontentloaded' });
    
    await page.type('.nav-search-input', SEARCH_TERM);
    await page.click('.nav-search-btn');

    await page.waitForNavigation({ waitUntil: 'domcontentloaded'});

    const products = await page.evaluate(() => {
        const productNodes = Array.from(document.querySelectorAll('.ui-search-result'));
        return productNodes.map(el => ({
            name: el.querySelector('.ui-search-item__title')?.innerText,
            regularPrice: +el.querySelector('.ui-search-price__original-value .price-tag-fraction')?.innerText?.replace(/\./g, ""),
            price: +el.querySelector('.ui-search-price__second-line .price-tag-fraction')?.innerText?.replace(/\./g, ""),
        })).slice(0, 15);
    });
    
    let sortedProducts = products.sort((a,b) => a.price - b.price); 

    console.log(sortedProducts);

    await browser.close();

})();