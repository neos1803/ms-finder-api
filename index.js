require('dotenv').config();

const express = require('express');
const mangaRoute = require('./routes/manga');

const app = express();

const port = process.env.PORT | 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/', mangaRoute);

app.get('/', (req, res) => {
  res.json(`It's up`);
});

app.listen(port, process.env.base, () => console.log(`Aired on port ${port}`));