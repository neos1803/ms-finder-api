const axios = require('axios').default;
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

class MangaController {

  static async index(req, res) {
    const browser =  await puppeteer.launch({
      headless: true,
    })

    const page = await browser.newPage();
    page.setViewport({
      width: 1366,
      height: 768
    });
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");
    await page.goto(`https://www.tokopedia.com/search?navsource=home&sc=3309&source=universe&st=product&q=${req.params.name.replace(/\s/g, '%20')}`, {
      waitUntil: 'domcontentloaded'
    });

    await page.evaluate('window.scrollTo(0,99999)');
    await page.waitForTimeout(1000);
    const content = await page.content();
    const $ = cheerio.load(content);

    // const request = await axios.get("https://www.tokopedia.com/search?navsource=home&sc=3309&source=universe&st=product&q=yokohama%20shopping%20blog");
    // const $ = cheerio.load(request.data);

    const product = $(".css-1g20a2m");
    product.each((i, e) => {
      const links = $(e)
        .find(".css-1ehqh5q > a")
        .attr("href")
      links_arr.push(links);

      const title = $(e)
        .find(".css-7fmtuv > a > .css-18c4yhp")
        .text()
        .trim();
      
      title_arr.push(title_arr);

      const price = $(e)
        .find(".css-7fmtuv > a > .css-rhd610")
        .text()
        .trim()

      price_arr.push(price);

      const location = $(e)
        .find(".css-7fmtuv > a > .css-vogbyu > .css-9dkp4i > .css-1pznt2j > span[class='css-4pwgpi']")
        .map((i, v) => {
          let store_location = $(v).text().trim()
          return store_location
        })
        .get(0);
      
      location_arr.push(location);

      const store_name = $(e)
        .find(".css-7fmtuv > a > .css-vogbyu > .css-9dkp4i > .css-1pznt2j > span[class='css-4pwgpi']")
        .map((i, v) => {
          let name = $(v).text().trim()
          return name
        })
        .get(1);

      store_arr.push(store_name);
    });
    obj.links = links_arr;
    obj.price = price_arr;
    obj.title = title_arr;
    obj.location = location_arr;
    obj.store = store_arr;
    return res.send(obj);
  }

  static async getStore(req, res) {

  }

  static async getProductInfo(req, res) {

  }

  static async getFromOneWeb(req, res) {
    
  }

}

module.exports = MangaController;