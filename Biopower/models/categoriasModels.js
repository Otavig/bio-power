const Database = require("../utils/database");

const banco = new Database();

class CategoriasModels {
  #catId;
  #catNome;
  #db;
  get catId() {
    return this.#catId;
  }

  set catId(value) {
    this.#catId = value;
  }

  get catNome() {
    return this.#catNome;
  }

  set catNome(value) {
    this.#catNome = value;
  }

  constructor() {
    this.#db = banco;
  }

  async listar() {
    const sql = `SELECT cat_id AS id, cat_nome AS nome FROM tb_Categorias ORDER BY cat_nome`;
    return this.#db.ExecutaComando(sql, []);
  }

  async criar({ nome }) {
    const sql = "INSERT INTO tb_Categorias (cat_nome) VALUES (?)";
    return this.#db.ExecutaComandoLastInserted(sql, [nome]);
  }

  async atualizar(id, { nome }) {
    const sql = "UPDATE tb_Categorias SET cat_nome = ? WHERE cat_id = ?";
    return this.#db.ExecutaComandoNonQuery(sql, [nome, id]);
  }

  async contarProdutosVinculados(id) {
    const sql = "SELECT COUNT(*) AS total FROM tb_Produtos WHERE pro_id_categoria = ?";
    const rows = await this.#db.ExecutaComando(sql, [id]);
    return Number(rows?.[0]?.total || 0);
  }

  async deletar(id) {
    const sql = "DELETE FROM tb_Categorias WHERE cat_id = ?";
    return this.#db.ExecutaComandoNonQuery(sql, [id]);
  }
}

module.exports = CategoriasModels;
