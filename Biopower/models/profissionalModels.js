const Database = require("../utils/database");
const banco = new Database();

class ProfissionalModels {
  #db;
  #proId;
  #proIdUsuario;
  get proId() {
    return this.#proId;
  }

  set proId(value) {
    this.#proId = value;
  }

  get proIdUsuario() {
    return this.#proIdUsuario;
  }

  set proIdUsuario(value) {
    this.#proIdUsuario = value;
  }


  constructor(
    proId = null,
    proIdUsuario = null
  ) {
    this.#db = banco;
    this.#proId = proId;
    this.#proIdUsuario = proIdUsuario;
  }

  get db() {
    return this.#db;
  }}

module.exports = ProfissionalModels;
