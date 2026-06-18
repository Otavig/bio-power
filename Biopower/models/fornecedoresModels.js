const Database = require("../utils/database");

const banco = new Database();

class FornecedoresModels {
  #forId;
  #forNomeFantasia;
  #forCnpj;
  #forEmail;
  #forTelefone;
  #forRazaoSocial;
  #db;
  get forId() {
    return this.#forId;
  }

  set forId(value) {
    this.#forId = value;
  }

  get forNomeFantasia() {
    return this.#forNomeFantasia;
  }

  set forNomeFantasia(value) {
    this.#forNomeFantasia = value;
  }

  get forCnpj() {
    return this.#forCnpj;
  }

  set forCnpj(value) {
    this.#forCnpj = value;
  }

  get forEmail() {
    return this.#forEmail;
  }

  set forEmail(value) {
    this.#forEmail = value;
  }

  get forTelefone() {
    return this.#forTelefone;
  }

  set forTelefone(value) {
    this.#forTelefone = value;
  }

  get forRazaoSocial() {
    return this.#forRazaoSocial;
  }

  set forRazaoSocial(value) {
    this.#forRazaoSocial = value;
  }

  constructor() {
    this.#db = banco;
  }

  async listar() {
    const sql = `SELECT for_id AS id, for_razao_social AS nome FROM tb_Fornecedores ORDER BY for_razao_social`;
    return this.#db.ExecutaComando(sql, []);
  }
}

module.exports = FornecedoresModels;