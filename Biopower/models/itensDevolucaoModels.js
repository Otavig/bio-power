const Database = require("../utils/database");
const banco = new Database();

class ItensDevolucaoModels {
  #db;
  #itdId;
  #itdIdDev;
  #itdIdProduto;
  #itdQuantidade;
  #itdSubtotal;
  #itdValorUnitario;
  get itdId() {
    return this.#itdId;
  }

  set itdId(value) {
    this.#itdId = value;
  }

  get itdIdDev() {
    return this.#itdIdDev;
  }

  set itdIdDev(value) {
    this.#itdIdDev = value;
  }

  get itdIdProduto() {
    return this.#itdIdProduto;
  }

  set itdIdProduto(value) {
    this.#itdIdProduto = value;
  }

  get itdQuantidade() {
    return this.#itdQuantidade;
  }

  set itdQuantidade(value) {
    this.#itdQuantidade = value;
  }

  get itdSubtotal() {
    return this.#itdSubtotal;
  }

  set itdSubtotal(value) {
    this.#itdSubtotal = value;
  }

  get itdValorUnitario() {
    return this.#itdValorUnitario;
  }

  set itdValorUnitario(value) {
    this.#itdValorUnitario = value;
  }


  constructor(
    itdId = null,
    itdIdDev = null,
    itdIdProduto = null,
    itdQuantidade = null,
    itdSubtotal = null,
    itdValorUnitario = null
  ) {
    this.#db = banco;
    this.#itdId = itdId;
    this.#itdIdDev = itdIdDev;
    this.#itdIdProduto = itdIdProduto;
    this.#itdQuantidade = itdQuantidade;
    this.#itdSubtotal = itdSubtotal;
    this.#itdValorUnitario = itdValorUnitario;
  }

  get db() {
    return this.#db;
  }}

module.exports = ItensDevolucaoModels;
