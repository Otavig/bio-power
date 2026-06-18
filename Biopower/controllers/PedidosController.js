const VendasModels = require("../models/vendasModels");

class PedidosController {
  constructor() {
    this.vendasModel = new VendasModels();
  }

  async meusPedidos(req, res) {
    if (!req.session?.user) {
      return res.redirect("/login");
    }

    try {
      const pedidos = await this.vendasModel.listarPorClienteComItens(req.session.user.id);
      return res.render("pedidos", {
        layout: true,
        pedidos,
      });
    } catch (err) {
      console.error("Erro ao listar pedidos do cliente:", err);
      return res.render("pedidos", {
        layout: true,
        pedidos: [],
        erro: "Nao foi possivel carregar seus pedidos.",
      });
    }
  }

  async confirmarEntrega(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");

    if (!req.session?.user) {
      if (wantsJson) return res.status(401).json({ ok: false, msg: "Faça login para continuar." });
      return res.redirect("/login");
    }

    const pedidoId = Number(req.params.id);
    if (!pedidoId || Number.isNaN(pedidoId)) {
      const msg = "Pedido invalido.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/pedidos?flash=pedido-invalido");
    }

    try {
      const atualizado = await this.vendasModel.confirmarEntregaCliente(
        pedidoId,
        req.session.user.id
      );

      if (!atualizado) {
        const msg = "Pedido nao encontrado para este usuario.";
        if (wantsJson) return res.status(404).json({ ok: false, msg });
        return res.redirect("/pedidos?flash=pedido-nao-encontrado");
      }

      if (wantsJson) {
        return res.json({ ok: true, msg: "Entrega confirmada." });
      }
    } catch (err) {
      console.error("Erro ao confirmar entrega:", err);
      const msg = err.message || "Erro ao confirmar entrega.";
      if (wantsJson) return res.status(500).json({ ok: false, msg });
      return res.redirect("/pedidos?flash=entrega-erro");
    }

    return res.redirect("/pedidos?flash=entrega-confirmada");
  }

  async confirmarPagamento(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");

    if (!req.session?.user) {
      if (wantsJson) return res.status(401).json({ ok: false, msg: "Faça login para continuar." });
      return res.redirect("/login");
    }

    const pedidoId = Number(req.params.id);
    if (!pedidoId || Number.isNaN(pedidoId)) {
      const msg = "Pedido invalido.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/pedidos?flash=pedido-invalido");
    }

    try {
      const atualizado = await this.vendasModel.confirmarPagamentoCliente(
        pedidoId,
        req.session.user.id
      );

      if (!atualizado) {
        const msg = "Pedido pendente nao encontrado para este usuario.";
        if (wantsJson) return res.status(404).json({ ok: false, msg });
        return res.redirect("/pedidos?flash=pagamento-nao-encontrado");
      }

      if (wantsJson) {
        return res.json({ ok: true, msg: "Pagamento confirmado." });
      }
    } catch (err) {
      console.error("Erro ao confirmar pagamento:", err);
      const msg = err.message || "Erro ao confirmar pagamento.";
      if (wantsJson) return res.status(500).json({ ok: false, msg });
      return res.redirect("/pedidos?flash=pagamento-erro");
    }

    return res.redirect("/pedidos?flash=pagamento-confirmado");
  }
}

module.exports = PedidosController;
