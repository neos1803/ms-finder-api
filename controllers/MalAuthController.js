const puppeteer = require("puppeteer");
const crypto =  require("crypto");
const responses = require("../helpers/responses");
require("dotenv").config();

class MalAuthController {

  static async login(req, res) {
    try {
      const code_challenge = crypto.randomBytes(64).toString("hex");
      const code_verifier = code_challenge;

      const browser =  await puppeteer.launch({
        headless: true,
      });

      const page = await browser.newPage();
      page.setViewport({
        width: 1366,
        height: 768
      });

      const url = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&code_challenge=${code_challenge}&state=RequestID42`;

      await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");
      await page.goto(url, {
        waitUntil: 'domcontentloaded'
      });
      await page.waitForTimeout(1000);
      await page.click("#loginUserName");
      await page.keyboard.type(process.env.MAL_USERNAME);
      await page.click("#login-password");
      await page.keyboard.type(process.env.MAL_PASSWORD);
      await page.click("#content > div > section.sec-local-login > form > div > p:nth-child(7) > input")
      await page.waitForTimeout(1000);
      await page.goto(url, {
        waitUntil: 'domcontentloaded'
      });
      await page.waitForSelector("#content > div > div > div > form > input.submit-block__button.button.button--primary.btn-recaptcha-submit");
      await page.click("#content > div > div > div > form > input.submit-block__button.button.button--primary.btn-recaptcha-submit");
      await page.waitForTimeout(1000);
      await page.waitForNavigation();

      const url_code = page.url().replace("https://twitter.com/_NandaPurba_?", "").replace("&state=RequestID42", "").replace("code=", "")
      
      return res.status(200).json(responses("200", "Success", { url_code }));
    } catch (error) {
      return res.status(500).json(responses("500", error.message, null));
    }
  }

}

module.exports = MalAuthController;