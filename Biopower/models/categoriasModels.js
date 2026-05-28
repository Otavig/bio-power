const Database = require("../utils/database");

const banco = new Database();

class CategoriasModels {
  #db;

  constructor() {
    this.#db = banco;
  }

  async listar() {
    const sql = `SELECT cat_id AS id, cat_nome AS nome FROM tb_Categorias ORDER BY cat_nome`;
    return this.#db.ExecutaComando(sql, []);
  }
}

module.exports = CategoriasModels;
