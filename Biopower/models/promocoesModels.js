const Database = require("../utils/database");
const banco = new Database();

class PromocoesModels {
  #db;
  #proId;
  #proNome;
  #proDescricao;
  #proDataInicio;
  #proDataFim;
  #proPercentual;
  get proId() {
    return this.#proId;
  }

  set proId(value) {
    this.#proId = value;
  }

  get proNome() {
    return this.#proNome;
  }

  set proNome(value) {
    this.#proNome = value;
  }

  get proDescricao() {
    return this.#proDescricao;
  }

  set proDescricao(value) {
    this.#proDescricao = value;
  }

  get proDataInicio() {
    return this.#proDataInicio;
  }

  set proDataInicio(value) {
    this.#proDataInicio = value;
  }

  get proDataFim() {
    return this.#proDataFim;
  }

  set proDataFim(value) {
    this.#proDataFim = value;
  }

  get proPercentual() {
    return this.#proPercentual;
  }

  set proPercentual(value) {
    this.#proPercentual = value;
  }


  constructor(
    proId = null,
    proNome = null,
    proDescricao = null,
    proDataInicio = null,
    proDataFim = null,
    proPercentual = null
  ) {
    this.#db = banco;
    this.#proId = proId;
    this.#proNome = proNome;
    this.#proDescricao = proDescricao;
    this.#proDataInicio = proDataInicio;
    this.#proDataFim = proDataFim;
    this.#proPercentual = proPercentual;
  }

  get db() {
    return this.#db;
  }}

module.exports = PromocoesModels;
