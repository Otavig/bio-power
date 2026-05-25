const efetuarCompraModel = require("../models/efetuarCompraModels");
const pedidoCompraModels = require("../models/pedidoCompraModels");
const produtoModels = require("../models/produtoModels");

class efetuarCompraController {
  async cadastrar(req, res) {
    console.log("Pedidos de compra para serem realizados", req.body);
    let ok = false;
    let msg = "";

    if (req.body.length > 0) {
      let pedidoCompra = new pedidoCompraModels();
      let pedidoId = await pedidoCompra.gravar();
      pedidoCompra.pedidoValorTotal = 0;
      if (pedidoId) {
        let produtoModels = new produtoModels();
        for (let i = 0; i < req.body.length; i++) {
          let produtoPedido = await produtoModels.buscarProduto(req.body[i].id);
          let item = new efetuarCompraModel();
          item.pedidoId = pedidoId;
          item.produtoId = produtoPedido.produtoId;
          item.pedidoItemQuantidade = req.body[i].quantidade;
          item.pedidoItemValor = produtoPedido.produtoValor;
          item.pedidoItemValorTotal =
            item.pedidoItemQuantidade * item.pedidoItemValor;
          await item.registrarCompra();
          pedidoCompra.pedidoValorTotal += item.pedidoItemValorTotal;
        }

        await pedidoCompra.atualizar();
        ok = true;
        msg = "Pedido gerado com sucesso!";
      } else {
        msg = "Erro ao gerar pedido.";
      }
    } else {
      msg = "Nenhum produto enviado!";
    }

    res.send({ ok, msg });
  }

  abrirTela(req, res) {
    res.render("recebimento");
  }
}

module.exports = efetuarCompraController;
