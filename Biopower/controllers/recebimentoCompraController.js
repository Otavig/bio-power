const pedidoCompraModels = require("../models/pedidoCompraModels");
const efetuarCompraModels = require("../models/efetuarCompraModels");
const Database = require("../utils/database");

const banco = new Database();

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
        for (let i = 0; i < itens.length; i++) {
          await banco.ExecutaComandoNonQuery(
            `INSERT INTO tb_Lotes_Estoque
              (lot_id_produto, lot_numero_lote, lot_quantidade_atual, lot_data_validade)
             VALUES (?, ?, ?, ?)`,
            [
              itens[i].produtoId,
              req.body.numeroLote || `PED-${pedidoId}-PROD-${itens[i].produtoId}`,
              Number(itens[i].pedidoItemQuantidade || 0),
              req.body.dataValidade || "2099-12-31",
            ],
          );
        }
        let pedidoCompra = new pedidoCompraModels();

        pedidoCompra.pedId = pedidoId;
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
