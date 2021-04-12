const express = require('express');
const router = express.Router();

const MangaController = require('../controllers/MangaController');

router
  /**
   * @swagger
   * /{name}:
   *   get:
   *     tags:
   *       - All Product Info
   *     summary: Retrieve manga products from tokopedia, shopee and bukalapak in one hit.
   *     description: Retrieve information about given name of product in object data. All products information is retrieved from tokopedia, shopee and bukalapak in one hit.
   *     parameters:
   *       - in: path
   *         name: name
   *         required: true
   *         description: Name of the desired product
   *         example: Attack on Titan
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A list of manga products grouped in an object divided into three key/value pairs.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: object
   *                   properties:
   *                     tokopedia:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           product:
   *                             type: object
   *                             properties:
   *                               name:
   *                                 type: string
   *                                 description: Product's Name
   *                                 example: Attack on Titan Vol 1
   *                               price:
   *                                 type: string
   *                                 description: Product's Price
   *                                 example: 85000
   *                           link:
   *                             type: string
   *                             description: Product's Website Link
   *                             example: tokopedia.com/Attack on Titan
   *                           store:
   *                             type: object
   *                             properties:
   *                               name:
   *                                 type: string
   *                                 description: Product's Seller
   *                                 example: Comic Shop
   *                               location:
   *                                 type: string
   *                                 description: Product's Seller Location
   *                                 example: Kab. Kudus
   *                     shopee:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           product:
   *                             type: object
   *                             properties:
   *                               name:
   *                                 type: string
   *                                 description: Product's Name
   *                                 example: Attack on Titan Vol 1
   *                               price:
   *                                 type: string
   *                                 description: Product's Price
   *                                 example: 85000
   *                           link:
   *                             type: string
   *                             description: Product's Website Link
   *                             example: tokopedia.com/Attack on Titan
   *                           store:
   *                             type: object
   *                             properties:
   *                               name:
   *                                 type: string
   *                                 description: Product's Seller
   *                                 example: Comic Shop
   *                               location:
   *                                 type: string
   *                                 description: Product's Seller Location
   *                                 example: Kab. Kudus
   *                     bukalapak:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           product:
   *                             type: object
   *                             properties:
   *                               name:
   *                                 type: string
   *                                 description: Product's Name
   *                                 example: Attack on Titan Vol 1
   *                               price:
   *                                 type: string
   *                                 description: Product's Price
   *                                 example: 85000
   *                           link:
   *                             type: string
   *                             description: Product's Website Link
   *                             example: tokopedia.com/Attack on Titan
   *                           store:
   *                             type: object
   *                             properties:
   *                               name:
   *                                 type: string
   *                                 description: Product's Seller
   *                                 example: Comic Shop
   *                               location:
   *                                 type: string
   *                                 description: Product's Seller Location
   *                                 example: Kab. Kudus
   */
  .get('/:name', MangaController.index)
  /**
   * @swagger
   * /store/{url}:
   *   get:
   *     tags:
   *       - All Product Info
   *     summary: Retrieve manga products from tokopedia, shopee and bukalapak in one hit.
   *     description: Retrieve information about given name of product in object data. All products information is retrieved from tokopedia, shopee and bukalapak in one hit.
   *     parameters:
   *       - in: path
   *         name: url
   *         required: true
   *         description: Name of the ecommerce url
   *         example: Tokopedia, Shopee, BukaLapak
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A list of manga products grouped in an object divided into three key/value pairs.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: object
   *                   properties:
   *                     tokopedia:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           product:
   *                             type: object
   *                             properties:
   *                               name:
   *                                 type: string
   *                                 description: Product's Name
   *                                 example: Attack on Titan Vol 1
   *                               price:
   *                                 type: string
   *                                 description: Product's Price
   *                                 example: 85000
   *                           link:
   *                             type: string
   *                             description: Product's Website Link
   *                             example: tokopedia.com/Attack on Titan
   *                           store:
   *                             type: object
   *                             properties:
   *                               name:
   *                                 type: string
   *                                 description: Product's Seller
   *                                 example: Comic Shop
   *                               location:
   *                                 type: string
   *                                 description: Product's Seller Location
   *                                 example: Kab. Kudus
   */
  .get('/store/:url', MangaController.getFromOneWeb)

module.exports = router;