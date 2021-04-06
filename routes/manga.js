const express = require('express');
const router = express.Router();

const MangaController = require('../controllers/MangaController');

router
  .get('/:name', MangaController.index)
  .get('/tokopedia/:name', MangaController.getFromOneWeb)
  .get('/shopee/:name', MangaController.getFromOneWeb)
  .get('/bukalapak/:name', MangaController.getFromOneWeb)

module.exports = router;