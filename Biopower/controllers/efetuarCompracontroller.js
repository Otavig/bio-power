const efetuarCompraModel = require("../models/efetuarCompraModels");
const pedidoCompraModels = require("../models/pedidoCompraModels");
const produtosModels = require("../models/produtosModels");
const itensPedidoCompraModels = require("../models/itensPedidoCompraModels");

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

        for (let i = 0; i < req.body.produtos.length; i++) {
          let produto = req.body.produtos[i];

          let item = new itensPedidoCompraModels();

          item.pedidoId = pedidoId;
          item.produtoId = produto.id;
          item.quantidade = produto.quantidade;

          item.precoUnitario = 0;

          await item.gravar();
        }

        let produtosModels = new produtosModels();
        for (let i = 0; i < req.body.length; i++) {
          let produtoPedido = await produtosModels.buscarProduto(
            req.body[i].id,
          );
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
    res.render("efetuarCompra");
  }
}

module.exports = efetuarCompraController;
