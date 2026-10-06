const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

// Definimos la ruta POST para el login
router.post("/", loginController.login);

module.exports = router;
