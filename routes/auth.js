const path = require("path");
const express = require("express");
const loginController = require("../controllers/auth");
const router = express.Router();

// /login/
router.get("/login", loginController.getLogin);

module.exports = router;
