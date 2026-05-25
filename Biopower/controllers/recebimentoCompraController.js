const pedidoCompraModels = require("../models/pedidoCompraModels");
const produtoModels = require("../models/produtoModels");
const efetuarCompraModel = require("../models/efetuarCompraModels");

class recebimentoCompraController {
  async cadastrar(req, res) {
    console.log("Compras recebidas:", req.body);

    let ok = false;
    let msg = "";

    let pedidoId = req.body.pedidoId;

    if (pedidoId > 0) {
      let itensPedidoCompraModels = new efetuarCompraModels();

      let itens = await itensPedidoCompraModels.buscarItensPedido(pedidoId);

      if (itens.length > 0) {
        let produtoModels = new produtoModels();
        for (let i = 0; i < itens.length; i++) {
          let produto = await produtoModels.buscarProduto(itens[i].produtoId);

          produto.produtoQuantidade += itens[i].pedidoItemQuantidade;
          await produto.atualizar();
        }
        let pedidoCompra = new pedidoCompraModels();

        pedidoCompra.pedidoId = pedidoId;
        pedidoCompra.pedidoStatus = "Recebido";
        await pedidoCompra.atualizar();

        ok = true;
        msg = "Compra recebida com sucesso!";
      } else {
        msg = "Nenhum item encontrado para o pedido.";
      }
    } else {
      msg = "ID do pedido inválido.";
    }
    res.send({ ok, msg });
  }
  abrirTela(req, res) {
    res.render("recebimento");
  }
}

module.exports = recebimentoCompraController;
