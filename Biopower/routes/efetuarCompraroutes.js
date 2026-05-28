const express = require("express");
const router = express.Router();
const efetuarCompraController = require("../controllers/efetuarCompracontroller");

const controller = new efetuarCompraController();

router.post("/recebimento-compra", controller.cadastrar);
router.get("/recebimento-compra", controller.abrirTela);

module.exports = router;
