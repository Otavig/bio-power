const express = require("express");
const router = express.Router();
const RecebimentoController = require("../controllers/recebimentoController");

const controller = new RecebimentoController();

router.post("/recebimento", controller.cadastrar);

module.exports = router;
