const Database = require("../utils/database");
const banco = new Database();

class ItensPromocaoModels {
  #db;
  #itpId;
  #itpIdProduto;
  #itpIdLote;
  #itpValorDesconto;
  get itpId() {
    return this.#itpId;
  }

  set itpId(value) {
    this.#itpId = value;
  }

  get itpIdProduto() {
    return this.#itpIdProduto;
  }

  set itpIdProduto(value) {
    this.#itpIdProduto = value;
  }

  get itpIdLote() {
    return this.#itpIdLote;
  }

  set itpIdLote(value) {
    this.#itpIdLote = value;
  }

  get itpValorDesconto() {
    return this.#itpValorDesconto;
  }

  set itpValorDesconto(value) {
    this.#itpValorDesconto = value;
  }


  constructor(
    itpId = null,
    itpIdProduto = null,
    itpIdLote = null,
    itpValorDesconto = null
  ) {
    this.#db = banco;
    this.#itpId = itpId;
    this.#itpIdProduto = itpIdProduto;
    this.#itpIdLote = itpIdLote;
    this.#itpValorDesconto = itpValorDesconto;
  }

  get db() {
    return this.#db;
  }}

module.exports = ItensPromocaoModels;
