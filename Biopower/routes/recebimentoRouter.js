const express = require("express");
const RecebimentoController = require("../controllers/recebimentoController");

const recebimentoRouter = express.Router();

let ctrl = new RecebimentoController();
recebimentoRouter.get('/', ctrl.recebView)
recebimentoRouter.post('/validar-estoque', ctrl.validarEstoque);
recebimentoRouter.post('/gravar', ctrl.gravar);

module.exports = recebimentoRouter;
