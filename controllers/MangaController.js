const axios = require('axios').default;
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const responses = require('../helpers/responses');
const Scrape = require('../helpers/scrape');
const urls_object = require('../helpers/urls');
const scrapeTextOrAttr = Scrape.scrapeTextOrAttr;
const autoScroll = Scrape.autoScroll;

class MangaController {

  static async index(req, res) {
    try {
      const urls = [
        `https://www.tokopedia.com/search?navsource=home&sc=3309&source=universe&st=product&q=${req.params.name.replace(/\s/g, '%20')}`,
        `https://www.bukalapak.com/c/hobi-koleksi/buku/komik?search%5Bkeywords%5D=${req.params.name.replace(/\s/g, '%20')}`,
        `https://shopee.co.id/search?facet=16895%2C16893&keyword=${req.params.name.replace(/\s/g, '%20')}`
      ];
  
      const browser =  await puppeteer.launch({
        headless: true,
      });
  
      const page = await browser.newPage();
      page.setViewport({
        width: 1366,
        height: 768
      });
  
      const obj = {};
      for (let i = 0; i < urls.length; i++) {
        await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");
        await page.goto(urls[i], {
          waitUntil: 'domcontentloaded'
        });
  
        await page.evaluate('window.scrollTo(0,99999)');
        await page.waitForTimeout(1000);
        
        if (page.url().includes("tokopedia")) {
          const content = await page.content();
          const $ = cheerio.load(content);
          let tokopedia = [];
          const product = $(".css-1g20a2m");
          product.each((_, e) => {
            let content_obj = {};
            const link = $(e)
              .find(".css-1ehqh5q > a")
              .attr("href")
    
            const title = $(e)
              .find(".css-7fmtuv > a > .css-18c4yhp")
              .text()
              .trim();
  
            const price = $(e)
              .find(".css-7fmtuv > a > .css-rhd610")
              .text()
              .trim()
  
            const location = $(e)
              .find(".css-7fmtuv > a > .css-vogbyu > .css-9dkp4i > .css-1pznt2j > span[class='css-4pwgpi']")
              .map((i, v) => {
                let store_location = $(v).text().trim()
                return store_location
              })
              .get(0);
  
            const store_name = $(e)
              .find(".css-7fmtuv > a > .css-vogbyu > .css-9dkp4i > .css-1pznt2j > span[class='css-4pwgpi']")
              .map((i, v) => {
                let name = $(v).text().trim()
                return name
              })
              .get(1);
  
            content_obj.product = Object({
              name: title,
              price
            })
  
            content_obj.link = link;
  
            content_obj.store = Object({
              name: store_name,
              location
            })
            tokopedia.push(content_obj)
          });
          obj.tokopedia = tokopedia;
        }

        if (page.url().includes("shopee")) {
          let shopee = [];
          const selector = "div[class='col-xs-2-4 shopee-search-item-result__item']";
          await page.waitForTimeout(1000);
          await page.evaluate(async (sel) => {
            for (const search of Array.from(document.querySelectorAll(sel))) {
              search.scrollIntoView();
              await new Promise((resolve) => { setTimeout(resolve, 2000) })
            }
          }, selector)
          await page.waitForTimeout(1000);
          const content = await page.content();
          const $ = cheerio.load(content);
          const products = $("div[class='col-xs-2-4 shopee-search-item-result__item']");
          products.each((_, e) => {
            const find = {
              title: "a > ._35LNwy > div[class='fBhek2 _2xt0JJ'] > ._1ObP5d > ._1nHzH4 > .PFM7lj > div[class='yQmmFK _1POlWt _36CEnF']",
              price: "a > ._35LNwy > div[class='fBhek2 _2xt0JJ'] > ._1ObP5d > ._32hnQt > div[class='WTFwws _1lK1eK _5W0f35'] > span[class='_29R_un']",
              location: "a > ._35LNwy > div[class='fBhek2 _2xt0JJ'] > ._1ObP5d > ._2CWevj",
              link: "a"
            };
            let content_obj = {};
            content_obj.product = Object({
              name: scrapeTextOrAttr($, e, find.title, false),
              price: scrapeTextOrAttr($, e, find.price, false),
            })

            content_obj.link = `shopee.co.id${scrapeTextOrAttr($, e, find.link, true, "href")}`;

            content_obj.store = scrapeTextOrAttr($, e, find.location, false);
            shopee.push(content_obj);
          });
          obj.shopee = shopee;
        }

        if (page.url().includes("bukalapak")) {
          let bukalapak = [];
          const selector = "div[class='bl-flex-item mb-8']";
          await page.waitForTimeout(1000);
          await page.evaluate(async (sel) => {
            for (const search of Array.from(document.querySelectorAll(sel))) {
              search.scrollIntoView();
              await new Promise((resolve) => { setTimeout(resolve, 2000) })
            }
          }, selector)
          await page.waitForTimeout(1000);
          const content = await page.content();
          const $ = cheerio.load(content);
          const products = $("div[class='bl-flex-item mb-8'] > div[class='bl-product-card te-product-card'] > div[class='bl-product-card__wrapper']");
          products.each((_, e) => {
            const find = {
              title_or_link: ".bl-product-card__description > .bl-product-card__description-name > p > a",
              price: ".bl-product-card__description-price > p",
              location: ".bl-product-card__description-store > span[class='mr-4 bl-product-card__location bl-text bl-text--body-small bl-text--subdued bl-text--ellipsis__1']",
              store_name: ".bl-product-card__description-store > span[class='bl-product-card__store bl-text bl-text--body-small bl-text--subdued bl-text--ellipsis__1']",
              // link: ".bl-product-card__description > p > a"
            };
            let content_obj = {};
            content_obj.product = Object({
              name: scrapeTextOrAttr($, e, find.title_or_link, false).trim(),
              price: scrapeTextOrAttr($,e, find.price, false).trim()
            });

            content_obj.link = scrapeTextOrAttr($, e, find.title_or_link, true, "href");

            content_obj.store = Object({
              name: scrapeTextOrAttr($, e, find.store_name, false).trim(),
              location: scrapeTextOrAttr($, e, find.location, false).trim()
            });

            bukalapak.push(content_obj);

          })
          obj.bukalapak = bukalapak;
        }
        
      }
  
      return res.status(200).json(responses("200", "Success", obj));
    } catch (error) {
      return res.status(400).json(responses("400", error.message))
    }
  }

  static async getStore(req, res) {

  }

  static async getProductInfo(req, res) {

  }

  static async getFromOneWeb(req, res) {
    try {
      const url = Object.keys(urls_object).find(e => e == req.params.url.toLowerCase());
      if (!url) {
        throw new Error("Url masih belum tersedia");
      }

      if (req.query.name == undefined) {
        throw new Error("Nama product tidak boleh kosong")
      }

      const browser =  await puppeteer.launch({
        headless: true,
      });
  
      const page = await browser.newPage();
      page.setViewport({
        width: 1366,
        height: 768
      });

      const query_page = req.query.page && req.query.page > 0? parseInt(req.query.page): 1;
      let target_url = "";
      if (req.params.url == "tokopedia") target_url = urls_object[url] + req.query.name.replace(/\s/g, '%20') + `&page=${query_page}`;

      await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");
      await page.goto(target_url, {
        waitUntil: 'domcontentloaded'
      });
      await autoScroll(page);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: './any.png', fullPage: true });
  
      const obj = {};
      if (req.params.url == "tokopedia") {
        const content = await page.content();
        const $ = cheerio.load(content);
        let tokopedia = [];
        const items_info = $(".css-rjanld > .css-83m8v3 > .css-8j9pkz").text().trim().split(" ");
        const total_items = items_info[7].replace(".", "");
        const total_pages = Math.ceil(items_info[7].replace(".", "")/(items_info[3] - items_info[1] + 1));
        const products = $(".css-1g20a2m");
        products.each((_, e) => {
          const find = {
            title: ".css-7fmtuv > a > .css-18c4yhp",
            link: ".css-1ehqh5q > a",
            price: ".css-7fmtuv > a > .css-rhd610",
            location: ".css-7fmtuv > a > .css-vogbyu > .css-9dkp4i > .css-1pznt2j > span[class='css-4pwgpi']",
            store_name: ".css-7fmtuv > a > .css-vogbyu > .css-9dkp4i > .css-1pznt2j > span[class='css-4pwgpi']"
          }
          let content_obj = {};
          content_obj.product = Object({
            name: scrapeTextOrAttr($, e, find.title, false),
            price: scrapeTextOrAttr($, e, find.price, false),
          });

          content_obj.link = scrapeTextOrAttr($, e, find.link, true, "href");
          
          content_obj.store = Object({
            name: $(e).find(find.store_name).map((_, v) => $(v).text().trim()).get(1),
            location: $(e).find(find.location).map((_, v) => $(v).text().trim()).get(0)
          })
          tokopedia.push(content_obj);
        });

        obj.tokopedia = {
          total_pages,
          total_items,
          current_items: tokopedia.length,
          tokopedia
        };

        return res.status(200).json(responses("200", "Success", obj));
      }

      if (req.params.url == "shopee") {
        let shopee = [];
        const selector = "div[class='col-xs-2-4 shopee-search-item-result__item']";
        await page.waitForTimeout(1000);
        await page.evaluate(async (sel) => {
          for (const search of Array.from(document.querySelectorAll(sel))) {
            search.scrollIntoView();
            await new Promise((resolve) => { setTimeout(resolve, 2000) })
          }
        }, selector)
        await page.waitForTimeout(1000);
        const content = await page.content();
        const $ = cheerio.load(content);
        const products = $("div[class='col-xs-2-4 shopee-search-item-result__item']");
        products.each((_, e) => {
          const find = {
            title: "a > ._35LNwy > div[class='fBhek2 _2xt0JJ'] > ._1ObP5d > ._1nHzH4 > .PFM7lj > div[class='yQmmFK _1POlWt _36CEnF']",
            price: "a > ._35LNwy > div[class='fBhek2 _2xt0JJ'] > ._1ObP5d > ._32hnQt > div[class='WTFwws _1lK1eK _5W0f35'] > span[class='_29R_un']",
            location: "a > ._35LNwy > div[class='fBhek2 _2xt0JJ'] > ._1ObP5d > ._2CWevj",
            link: "a"
          };
          let content_obj = {};
          content_obj.product = Object({
            name: scrapeTextOrAttr($, e, find.title, false),
            price: scrapeTextOrAttr($, e, find.price, false),
          });

          content_obj.link = `shopee.co.id${scrapeTextOrAttr($, e, find.link, true, "href")}`;

          content_obj.store = scrapeTextOrAttr($, e, find.location, false);
          shopee.push(content_obj);
        });
        obj.shopee = shopee;

        return res.status(200).json(responses("200", "Success", obj));
      }

      if (req.params.url = "bukalapak") {
        let bukalapak = [];
        const selector = "div[class='bl-flex-item mb-8']";
        await page.waitForTimeout(1000);
        await page.evaluate(async (sel) => {
          for (const search of Array.from(document.querySelectorAll(sel))) {
            search.scrollIntoView();
            await new Promise((resolve) => { setTimeout(resolve, 2000) })
          }
        }, selector)
        await page.waitForTimeout(1000);
        const content = await page.content();
        const $ = cheerio.load(content);
        const products = $("div[class='bl-flex-item mb-8'] > div[class='bl-product-card te-product-card'] > div[class='bl-product-card__wrapper']");
        products.each((_, e) => {
          const find = {
            title_or_link: ".bl-product-card__description > .bl-product-card__description-name > p > a",
            price: ".bl-product-card__description-price > p",
            location: ".bl-product-card__description-store > span[class='mr-4 bl-product-card__location bl-text bl-text--body-small bl-text--subdued bl-text--ellipsis__1']",
            store_name: ".bl-product-card__description-store > span[class='bl-product-card__store bl-text bl-text--body-small bl-text--subdued bl-text--ellipsis__1']",
            // link: ".bl-product-card__description > p > a"
          };
          let content_obj = {};
          content_obj.product = Object({
            name: scrapeTextOrAttr($, e, find.title_or_link, false).trim(),
            price: scrapeTextOrAttr($,e, find.price, false).trim()
          });

          content_obj.link = scrapeTextOrAttr($, e, find.title_or_link, true, "href");

          content_obj.store = Object({
            name: scrapeTextOrAttr($, e, find.store_name, false).trim(),
            location: scrapeTextOrAttr($, e, find.location, false).trim()
          });

          bukalapak.push(content_obj);

        })
        obj.bukalapak = bukalapak;

        return res.status(200).json(responses("200", "Success", obj));
      }

    } catch (error) {
      return res.status(500).json(responses("500", error.message, []))
    }
  }

}

module.exports = MangaController;