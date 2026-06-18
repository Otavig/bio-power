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

  async criar({ vendaId, produtoId, quantidade, precoUnitario, valorTotal }) {
    if (!vendaId || !produtoId || !quantidade || quantidade <= 0) return null;
    const total = Number(valorTotal ?? (Number(quantidade) * Number(precoUnitario || 0)));
    const sql = `
      INSERT INTO tb_Itens_Venda
        (itv_id_venda, itv_id_produto, itv_quantidade, itv_subtotal, itv_valor_unitario)
      VALUES (?, ?, ?, ?, ?);
    `;
    return this.#db.ExecutaComandoLastInserted(sql, [
      Number(vendaId),
      Number(produtoId),
      Number(quantidade),
      total,
      Number(precoUnitario || 0),
    ]);
  }
}

module.exports = ItensVendaModels;
