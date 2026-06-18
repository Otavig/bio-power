const Database = require("../utils/database");

const banco = new Database();

class ItensVendaModels {
  #itvId;
  #itvIdVenda;
  #itvIdProduto;
  #itvQuantidade;
  #itvSubtotal;
  #itvValorUnitario;
  #db;
  get itvId() {
    return this.#itvId;
  }

  set itvId(value) {
    this.#itvId = value;
  }

  get itvIdVenda() {
    return this.#itvIdVenda;
  }

  set itvIdVenda(value) {
    this.#itvIdVenda = value;
  }

  get itvIdProduto() {
    return this.#itvIdProduto;
  }

  set itvIdProduto(value) {
    this.#itvIdProduto = value;
  }

  get itvQuantidade() {
    return this.#itvQuantidade;
  }

  set itvQuantidade(value) {
    this.#itvQuantidade = value;
  }

  get itvSubtotal() {
    return this.#itvSubtotal;
  }

  set itvSubtotal(value) {
    this.#itvSubtotal = value;
  }

  get itvValorUnitario() {
    return this.#itvValorUnitario;
  }

  set itvValorUnitario(value) {
    this.#itvValorUnitario = value;
  }

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
