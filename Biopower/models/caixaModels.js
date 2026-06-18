const Database = require("../utils/database");
const banco = new Database();

class CaixaModels {
  #db;
  #cxId;
  #cxIdResponsavel;
  #cxDataAbertura;
  #cxDataFechamento;
  #cxValorTotal;
  get cxId() {
    return this.#cxId;
  }

  set cxId(value) {
    this.#cxId = value;
  }

  get cxIdResponsavel() {
    return this.#cxIdResponsavel;
  }

  set cxIdResponsavel(value) {
    this.#cxIdResponsavel = value;
  }

  get cxDataAbertura() {
    return this.#cxDataAbertura;
  }

  set cxDataAbertura(value) {
    this.#cxDataAbertura = value;
  }

  get cxDataFechamento() {
    return this.#cxDataFechamento;
  }

  set cxDataFechamento(value) {
    this.#cxDataFechamento = value;
  }

  get cxValorTotal() {
    return this.#cxValorTotal;
  }

  set cxValorTotal(value) {
    this.#cxValorTotal = value;
  }


  constructor(
    cxId = null,
    cxIdResponsavel = null,
    cxDataAbertura = null,
    cxDataFechamento = null,
    cxValorTotal = null
  ) {
    this.#db = banco;
    this.#cxId = cxId;
    this.#cxIdResponsavel = cxIdResponsavel;
    this.#cxDataAbertura = cxDataAbertura;
    this.#cxDataFechamento = cxDataFechamento;
    this.#cxValorTotal = cxValorTotal;
  }

  get db() {
    return this.#db;
  }}

module.exports = CaixaModels;
