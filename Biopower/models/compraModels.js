const Database = require("../utils/database");
const banco = new Database();

class CompraModels {
  #db;
  #comId;
  #comIdFornecedor;
  #comData;
  #comValorTotal;
  #comStatus;
  get comId() {
    return this.#comId;
  }

  set comId(value) {
    this.#comId = value;
  }

  get comIdFornecedor() {
    return this.#comIdFornecedor;
  }

  set comIdFornecedor(value) {
    this.#comIdFornecedor = value;
  }

  get comData() {
    return this.#comData;
  }

  set comData(value) {
    this.#comData = value;
  }

  get comValorTotal() {
    return this.#comValorTotal;
  }

  set comValorTotal(value) {
    this.#comValorTotal = value;
  }

  get comStatus() {
    return this.#comStatus;
  }

  set comStatus(value) {
    this.#comStatus = value;
  }


  constructor(
    comId = null,
    comIdFornecedor = null,
    comData = null,
    comValorTotal = null,
    comStatus = null
  ) {
    this.#db = banco;
    this.#comId = comId;
    this.#comIdFornecedor = comIdFornecedor;
    this.#comData = comData;
    this.#comValorTotal = comValorTotal;
    this.#comStatus = comStatus;
  }

  get db() {
    return this.#db;
  }}

module.exports = CompraModels;
