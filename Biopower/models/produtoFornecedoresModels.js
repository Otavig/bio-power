const Database = require("../utils/database");
const banco = new Database();

class ProdutoFornecedoresModels {
  #db;
  #pfIdProduto;
  #pfIdFornecedor;
  #pfPrecoCompra;
  get pfIdProduto() {
    return this.#pfIdProduto;
  }

  set pfIdProduto(value) {
    this.#pfIdProduto = value;
  }

  get pfIdFornecedor() {
    return this.#pfIdFornecedor;
  }

  set pfIdFornecedor(value) {
    this.#pfIdFornecedor = value;
  }

  get pfPrecoCompra() {
    return this.#pfPrecoCompra;
  }

  set pfPrecoCompra(value) {
    this.#pfPrecoCompra = value;
  }


  constructor(
    pfIdProduto = null,
    pfIdFornecedor = null,
    pfPrecoCompra = null
  ) {
    this.#db = banco;
    this.#pfIdProduto = pfIdProduto;
    this.#pfIdFornecedor = pfIdFornecedor;
    this.#pfPrecoCompra = pfPrecoCompra;
  }

  get db() {
    return this.#db;
  }}

module.exports = ProdutoFornecedoresModels;
