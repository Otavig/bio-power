const Database = require("../utils/database");

const banco = new Database();

class ItensVendaModels {
  #db;

  constructor() {
    this.#db = banco;
  }

  async criar({ vendaId, produtoId, quantidade, precoUnitario, loteId = null }) {
    if (!vendaId || !produtoId || !quantidade || quantidade <= 0) return null;
    const sql = `
      INSERT INTO tb_Itens_Venda
        (ite_id_venda, ite_id_produto, ite_quantidade, ite_preco_unitario, ite_id_lote)
      VALUES (?, ?, ?, ?, ?);
    `;
    return this.#db.ExecutaComandoLastInserted(sql, [
      Number(vendaId),
      Number(produtoId),
      Number(quantidade),
      Number(precoUnitario || 0),
      loteId || null,
    ]);
  }
}

module.exports = ItensVendaModels;
