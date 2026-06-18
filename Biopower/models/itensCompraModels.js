const Database = require("../utils/database");
const banco = new Database();

class ItensCompraModels {
  #db;
  #itcId;
  #itcIdCompra;
  #itcIdProduto;
  #itcQuantidade;
  #itcValorUnitario;
  get itcId() {
    return this.#itcId;
  }

  set itcId(value) {
    this.#itcId = value;
  }

  get itcIdCompra() {
    return this.#itcIdCompra;
  }

  set itcIdCompra(value) {
    this.#itcIdCompra = value;
  }

  get itcIdProduto() {
    return this.#itcIdProduto;
  }

  set itcIdProduto(value) {
    this.#itcIdProduto = value;
  }

  get itcQuantidade() {
    return this.#itcQuantidade;
  }

  set itcQuantidade(value) {
    this.#itcQuantidade = value;
  }

  get itcValorUnitario() {
    return this.#itcValorUnitario;
  }

  set itcValorUnitario(value) {
    this.#itcValorUnitario = value;
  }


  constructor(
    itcId = null,
    itcIdCompra = null,
    itcIdProduto = null,
    itcQuantidade = null,
    itcValorUnitario = null
  ) {
    this.#db = banco;
    this.#itcId = itcId;
    this.#itcIdCompra = itcIdCompra;
    this.#itcIdProduto = itcIdProduto;
    this.#itcQuantidade = itcQuantidade;
    this.#itcValorUnitario = itcValorUnitario;
  }

  get db() {
    return this.#db;
  }}

module.exports = ItensCompraModels;
