require('dotenv').config();

const express = require('express');
const mangaRoute = require('./routes/manga');
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition =  {
  openapi: "3.0.0",
  info: {
    title: "Ecommerce Web Scraping API",
    version: "1.0.0",
    description: "This is an api to scrape several local ecommerce to get info about manga product",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "Purba",
      url: "https://twitter.com/_NandaPurba_",
      email: "nandawardipurba@gmail.com",
    },
  }
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();

const port = process.env.PORT | 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/', mangaRoute);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true
}));

app.get('/', (req, res) => {
  res.json(`It's up`);
});

app.listen(port, process.env.base, () => console.log(`Aired on port ${port}`));