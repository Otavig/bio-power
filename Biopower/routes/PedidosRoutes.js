const express = require("express");
const PedidosController = require("../controllers/PedidosController");

const router = express.Router();
const controller = new PedidosController();

router.get("/pedidos", (req, res, next) => {
  Promise.resolve(controller.meusPedidos(req, res)).catch(next);
});

router.post("/pedidos/:id/confirmar-entrega", (req, res, next) => {
  Promise.resolve(controller.confirmarEntrega(req, res)).catch(next);
});

router.post("/pedidos/:id/confirmar-pagamento", (req, res, next) => {
  Promise.resolve(controller.confirmarPagamento(req, res)).catch(next);
});

module.exports = router;
