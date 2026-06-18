const Database = require("../utils/database");
const banco = new Database();

class DescartesModels {
  #db;
  #desId;
  #desIdLote;
  #desIdProduto;
  #desQuantidade;
  #desMotivo;
  #desIdResponsavel;
  #desData;
  get desId() {
    return this.#desId;
  }

  set desId(value) {
    this.#desId = value;
  }

  get desIdLote() {
    return this.#desIdLote;
  }

  set desIdLote(value) {
    this.#desIdLote = value;
  }

  get desIdProduto() {
    return this.#desIdProduto;
  }

  set desIdProduto(value) {
    this.#desIdProduto = value;
  }

  get desQuantidade() {
    return this.#desQuantidade;
  }

  set desQuantidade(value) {
    this.#desQuantidade = value;
  }

  get desMotivo() {
    return this.#desMotivo;
  }

  set desMotivo(value) {
    this.#desMotivo = value;
  }

  get desIdResponsavel() {
    return this.#desIdResponsavel;
  }

  set desIdResponsavel(value) {
    this.#desIdResponsavel = value;
  }

  get desData() {
    return this.#desData;
  }

  set desData(value) {
    this.#desData = value;
  }


  constructor(
    desId = null,
    desIdLote = null,
    desIdProduto = null,
    desQuantidade = null,
    desMotivo = null,
    desIdResponsavel = null,
    desData = null
  ) {
    this.#db = banco;
    this.#desId = desId;
    this.#desIdLote = desIdLote;
    this.#desIdProduto = desIdProduto;
    this.#desQuantidade = desQuantidade;
    this.#desMotivo = desMotivo;
    this.#desIdResponsavel = desIdResponsavel;
    this.#desData = desData;
  }

  get db() {
    return this.#db;
  }}

module.exports = DescartesModels;
