const express = require("express");
const recebController = require("../controllers/recebController");

const recebimentoRouter = express.Router();

let ctrl = new recebController();
recebimentoRouter.get('/', ctrl.recebView);

module.exports = recebimentoRouter;