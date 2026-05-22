const express = require("express");
const router = express.Router();
const efetuarCompraController = require("../controllers/efetuarCompracontroller");

const controller = new efetuarCompraController();

router.post("/efetuar-compra", controller.cadastrar);

module.exports = router;
