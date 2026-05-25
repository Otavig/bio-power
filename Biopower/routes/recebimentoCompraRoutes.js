const express = require("express");
const router = express.Router();
const recebimentoCompraController = require("../controllers/recebimentoCompraController");

const controller = new recebimentoCompraController();

router.post("/receber-compra", controller.cadastrar);
router.get("/receber-compra", controller.abrirTela);

module.exports = router;