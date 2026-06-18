const Database = require("../utils/database");
const banco = new Database();

class FluxoCaixaModels {
  #db;
  #fluId;
  #fluTipoId;
  #fluValor;
  #fluDataMovimentacao;
  #fluDescricao;
  #fluOrigemId;
  #fluOrigemTipo;
  #fluIdCaixa;
  get fluId() {
    return this.#fluId;
  }

  set fluId(value) {
    this.#fluId = value;
  }

  get fluTipoId() {
    return this.#fluTipoId;
  }

  set fluTipoId(value) {
    this.#fluTipoId = value;
  }

  get fluValor() {
    return this.#fluValor;
  }

  set fluValor(value) {
    this.#fluValor = value;
  }

  get fluDataMovimentacao() {
    return this.#fluDataMovimentacao;
  }

  set fluDataMovimentacao(value) {
    this.#fluDataMovimentacao = value;
  }

  get fluDescricao() {
    return this.#fluDescricao;
  }

  set fluDescricao(value) {
    this.#fluDescricao = value;
  }

  get fluOrigemId() {
    return this.#fluOrigemId;
  }

  set fluOrigemId(value) {
    this.#fluOrigemId = value;
  }

  get fluOrigemTipo() {
    return this.#fluOrigemTipo;
  }

  set fluOrigemTipo(value) {
    this.#fluOrigemTipo = value;
  }

  get fluIdCaixa() {
    return this.#fluIdCaixa;
  }

  set fluIdCaixa(value) {
    this.#fluIdCaixa = value;
  }


  constructor(
    fluId = null,
    fluTipoId = null,
    fluValor = null,
    fluDataMovimentacao = null,
    fluDescricao = null,
    fluOrigemId = null,
    fluOrigemTipo = null,
    fluIdCaixa = null
  ) {
    this.#db = banco;
    this.#fluId = fluId;
    this.#fluTipoId = fluTipoId;
    this.#fluValor = fluValor;
    this.#fluDataMovimentacao = fluDataMovimentacao;
    this.#fluDescricao = fluDescricao;
    this.#fluOrigemId = fluOrigemId;
    this.#fluOrigemTipo = fluOrigemTipo;
    this.#fluIdCaixa = fluIdCaixa;
  }

  get db() {
    return this.#db;
  }}

module.exports = FluxoCaixaModels;
