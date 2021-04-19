const express = require("express");
const MalAuthController = require("../controllers/MalAuthController");
const router = express.Router();

router
  .get("/", MalAuthController.login);

module.exports = router;