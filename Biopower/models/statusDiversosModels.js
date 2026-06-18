const Database = require("../utils/database");
const banco = new Database();

class StatusDiversosModels {
  #db;
  #staId;
  #staDominio;
  #staCodigo;
  #staDescricao;
  get staId() {
    return this.#staId;
  }

  set staId(value) {
    this.#staId = value;
  }

  get staDominio() {
    return this.#staDominio;
  }

  set staDominio(value) {
    this.#staDominio = value;
  }

  get staCodigo() {
    return this.#staCodigo;
  }

  set staCodigo(value) {
    this.#staCodigo = value;
  }

  get staDescricao() {
    return this.#staDescricao;
  }

  set staDescricao(value) {
    this.#staDescricao = value;
  }


  constructor(
    staId = null,
    staDominio = null,
    staCodigo = null,
    staDescricao = null
  ) {
    this.#db = banco;
    this.#staId = staId;
    this.#staDominio = staDominio;
    this.#staCodigo = staCodigo;
    this.#staDescricao = staDescricao;
  }

  get db() {
    return this.#db;
  }}

module.exports = StatusDiversosModels;
