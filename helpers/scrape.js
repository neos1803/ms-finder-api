class Scrape {
  static scrapeTextOrAttr ($, e, find, attr = false, attrValue = null) {
    if (attr) {
      return $(e)
        .find(find)
        .attr(attrValue)
    }
    return $(e)
      .find(find)
      .text()
  }
  
  static async autoScroll(page) {
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        let total_height = 0;
        let distance = 100;
  
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          total_height+=distance;
  
  
          if (total_height >= scrollHeight) {
            clearInterval(timer),
            resolve()
          }
        }, 400);
      });
    });
  }

}

module.exports = Scrape;