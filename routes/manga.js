const express = require('express');
const router = express.Router();

const MangaController = require('../controllers/MangaController');

router
  .get('/:name', MangaController.index)
  .get('/store/:url', MangaController.getFromOneWeb)

module.exports = router;