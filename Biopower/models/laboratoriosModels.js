const Database = require("../utils/database");
const banco = new Database();

class LaboratoriosModels {
  #db;
  #labId;
  #labNome;
  get labId() {
    return this.#labId;
  }

  set labId(value) {
    this.#labId = value;
  }

  get labNome() {
    return this.#labNome;
  }

  set labNome(value) {
    this.#labNome = value;
  }


  constructor(
    labId = null,
    labNome = null
  ) {
    this.#db = banco;
    this.#labId = labId;
    this.#labNome = labNome;
  }

  get db() {
    return this.#db;
  }

  async listar() {
    const sql = "SELECT lab_id AS id, lab_nome AS nome FROM tb_Laboratorios ORDER BY lab_nome";
    return this.#db.ExecutaComando(sql, []);
  }
}

module.exports = LaboratoriosModels;
