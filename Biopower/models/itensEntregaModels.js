const Database = require("../utils/database");
const banco = new Database();

class ItensEntregaModels {
  #db;
  #iteId;
  #iteIdEntrega;
  #iteIdLote;
  #iteIdProduto;
  #iteQuantidade;
  #iteSubTotal;
  get iteId() {
    return this.#iteId;
  }

  set iteId(value) {
    this.#iteId = value;
  }

  get iteIdEntrega() {
    return this.#iteIdEntrega;
  }

  set iteIdEntrega(value) {
    this.#iteIdEntrega = value;
  }

  get iteIdLote() {
    return this.#iteIdLote;
  }

  set iteIdLote(value) {
    this.#iteIdLote = value;
  }

  get iteIdProduto() {
    return this.#iteIdProduto;
  }

  set iteIdProduto(value) {
    this.#iteIdProduto = value;
  }

  get iteQuantidade() {
    return this.#iteQuantidade;
  }

  set iteQuantidade(value) {
    this.#iteQuantidade = value;
  }

  get iteSubTotal() {
    return this.#iteSubTotal;
  }

  set iteSubTotal(value) {
    this.#iteSubTotal = value;
  }


  constructor(
    iteId = null,
    iteIdEntrega = null,
    iteIdLote = null,
    iteIdProduto = null,
    iteQuantidade = null,
    iteSubTotal = null
  ) {
    this.#db = banco;
    this.#iteId = iteId;
    this.#iteIdEntrega = iteIdEntrega;
    this.#iteIdLote = iteIdLote;
    this.#iteIdProduto = iteIdProduto;
    this.#iteQuantidade = iteQuantidade;
    this.#iteSubTotal = iteSubTotal;
  }

  get db() {
    return this.#db;
  }}

module.exports = ItensEntregaModels;
