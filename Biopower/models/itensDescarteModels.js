const Database = require("../utils/database");
const banco = new Database();

class ItensDescarteModels {
  #db;
  #idtId;
  #idtIdProduto;
  #idtIdResponsavel;
  #idtIdLote;
  #idtQuantidade;
  #idtMotivo;
  #idtValorUnitario;
  #idtData;
  get idtId() {
    return this.#idtId;
  }

  set idtId(value) {
    this.#idtId = value;
  }

  get idtIdProduto() {
    return this.#idtIdProduto;
  }

  set idtIdProduto(value) {
    this.#idtIdProduto = value;
  }

  get idtIdResponsavel() {
    return this.#idtIdResponsavel;
  }

  set idtIdResponsavel(value) {
    this.#idtIdResponsavel = value;
  }

  get idtIdLote() {
    return this.#idtIdLote;
  }

  set idtIdLote(value) {
    this.#idtIdLote = value;
  }

  get idtQuantidade() {
    return this.#idtQuantidade;
  }

  set idtQuantidade(value) {
    this.#idtQuantidade = value;
  }

  get idtMotivo() {
    return this.#idtMotivo;
  }

  set idtMotivo(value) {
    this.#idtMotivo = value;
  }

  get idtValorUnitario() {
    return this.#idtValorUnitario;
  }

  set idtValorUnitario(value) {
    this.#idtValorUnitario = value;
  }

  get idtData() {
    return this.#idtData;
  }

  set idtData(value) {
    this.#idtData = value;
  }


  constructor(
    idtId = null,
    idtIdProduto = null,
    idtIdResponsavel = null,
    idtIdLote = null,
    idtQuantidade = null,
    idtMotivo = null,
    idtValorUnitario = null,
    idtData = null
  ) {
    this.#db = banco;
    this.#idtId = idtId;
    this.#idtIdProduto = idtIdProduto;
    this.#idtIdResponsavel = idtIdResponsavel;
    this.#idtIdLote = idtIdLote;
    this.#idtQuantidade = idtQuantidade;
    this.#idtMotivo = idtMotivo;
    this.#idtValorUnitario = idtValorUnitario;
    this.#idtData = idtData;
  }

  get db() {
    return this.#db;
  }}

module.exports = ItensDescarteModels;
