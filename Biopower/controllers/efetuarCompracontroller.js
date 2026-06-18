const efetuarCompraModel = require("../models/efetuarCompraModels");
const pedidoCompraModels = require("../models/pedidoCompraModels");
const produtosModels = require("../models/produtosModels");

class efetuarCompraController {
  async cadastrar(req, res) {
    console.log("Pedidos de compra para serem realizados", req.body);
    let ok = false;
    let msg = "";

    if (req.body.length > 0) {
      let pedidoCompra = new pedidoCompraModels();
      pedidoCompra.pedIdFornecedor = Number(req.body.fornecedorId || req.body[0]?.fornecedorId || 1);
      pedidoCompra.pedIdResponsavel = Number(req.session?.usuario?.usu_id || req.session?.usuario?.id || 1);
      let pedidoId = await pedidoCompra.gravar();
      pedidoCompra.pedidoValorTotal = 0;
      if (pedidoId) {
        let produtosModel = new produtosModels();
        for (let i = 0; i < req.body.length; i++) {
          let produtoPedido = await produtosModel.buscarProduto(req.body[i].id || req.body[i].produtoId);
          if (!produtoPedido) continue;

          let item = new efetuarCompraModel();
          item.pedidoId = pedidoId;
          item.produtoId = produtoPedido.produtoId;
          item.pedidoItemQuantidade = Number(req.body[i].quantidade || 1);
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
