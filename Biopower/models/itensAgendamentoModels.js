const Database = require("../utils/database");
const banco = new Database();

class ItensAgendamentoModels {
  #db;
  #itaId;
  #itaIdAgendamento;
  #itaIdProduto;
  #itaValorUnitario;
  #itaQuantidade;
  get itaId() {
    return this.#itaId;
  }

  set itaId(value) {
    this.#itaId = value;
  }

  get itaIdAgendamento() {
    return this.#itaIdAgendamento;
  }

  set itaIdAgendamento(value) {
    this.#itaIdAgendamento = value;
  }

  get itaIdProduto() {
    return this.#itaIdProduto;
  }

  set itaIdProduto(value) {
    this.#itaIdProduto = value;
  }

  get itaValorUnitario() {
    return this.#itaValorUnitario;
  }

  set itaValorUnitario(value) {
    this.#itaValorUnitario = value;
  }

  get itaQuantidade() {
    return this.#itaQuantidade;
  }

  set itaQuantidade(value) {
    this.#itaQuantidade = value;
  }


  constructor(
    itaId = null,
    itaIdAgendamento = null,
    itaIdProduto = null,
    itaValorUnitario = null,
    itaQuantidade = null
  ) {
    this.#db = banco;
    this.#itaId = itaId;
    this.#itaIdAgendamento = itaIdAgendamento;
    this.#itaIdProduto = itaIdProduto;
    this.#itaValorUnitario = itaValorUnitario;
    this.#itaQuantidade = itaQuantidade;
  }

  get db() {
    return this.#db;
  }}

module.exports = ItensAgendamentoModels;
