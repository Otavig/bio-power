const Database = require("../utils/database");
const banco = new Database();

class DevolucoesModels {
  #db;
  #devId;
  #devIdVenda;
  #devMotivo;
  #devStatusId;
  get devId() {
    return this.#devId;
  }

  set devId(value) {
    this.#devId = value;
  }

  get devIdVenda() {
    return this.#devIdVenda;
  }

  set devIdVenda(value) {
    this.#devIdVenda = value;
  }

  get devMotivo() {
    return this.#devMotivo;
  }

  set devMotivo(value) {
    this.#devMotivo = value;
  }

  get devStatusId() {
    return this.#devStatusId;
  }

  set devStatusId(value) {
    this.#devStatusId = value;
  }


  constructor(
    devId = null,
    devIdVenda = null,
    devMotivo = null,
    devStatusId = null
  ) {
    this.#db = banco;
    this.#devId = devId;
    this.#devIdVenda = devIdVenda;
    this.#devMotivo = devMotivo;
    this.#devStatusId = devStatusId;
  }

  get db() {
    return this.#db;
  }}

module.exports = DevolucoesModels;
