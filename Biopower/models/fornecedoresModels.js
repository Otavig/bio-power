const Database = require("../utils/database");

const banco = new Database();

class FornecedoresModels {
  #db;

  constructor() {
    this.#db = banco;
  }

  async listar() {
    const sql = `SELECT for_id AS id, for_razao_social AS nome FROM tb_Fornecedores ORDER BY for_razao_social`;
    return this.#db.ExecutaComando(sql, []);
  }
}

module.exports = FornecedoresModels;