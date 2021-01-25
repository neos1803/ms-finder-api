const express = require('express');
const router = express.Router();

const MangaController = require('../controllers/MangaController');

router
  .get('/', MangaController.index)
  .post('/', MangaController.search)
  .get('/:name', MangaController.get)

module.exports = router;
