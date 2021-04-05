const axios = require('axios').default;
const cheerio = require('cheerio');

class MangaController {

  static async index(req, res) {
    const request = await axios.get("https://www.tokopedia.com/search?navsource=home&sc=3309&source=universe&st=product&q=yokohama%20shopping%20blog");
    const $ = cheerio.load(request.data);

    const product = $(".css-1g20a2m")
    product.each((i, e) => {
      const links = $(e)
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

      console.log(store_name);
    });
  }

  static async search(req, res) {

  }

  static async get(req, res) {

  }

}

module.exports = MangaController;