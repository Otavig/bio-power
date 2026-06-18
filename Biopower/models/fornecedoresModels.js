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

  async garantirVinculoUsuario() {
    try {
      await this.#db.ExecutaComando(
        `ALTER TABLE tb_Fornecedores
         ADD COLUMN for_usu_id INT NULL UNIQUE AFTER for_id`,
        []
      );
    } catch (err) {
      if (!String(err?.message || "").includes("Duplicate column name")) {
        throw err;
      }
    }

    try {
      await this.#db.ExecutaComando(
        `ALTER TABLE tb_Fornecedores
         ADD CONSTRAINT fk_fornecedor_usuario
         FOREIGN KEY (for_usu_id) REFERENCES tb_Usuarios (usu_id)
         ON DELETE SET NULL
         ON UPDATE CASCADE`,
        []
      );
    } catch (err) {
      const message = String(err?.message || "");
      if (!message.includes("Duplicate") && !message.includes("errno: 121")) {
        throw err;
      }
    }
  }

  async listar() {
    await this.garantirVinculoUsuario();

    const sql = `
      SELECT
        f.for_id AS id,
        f.for_razao_social AS nome,
        f.for_nome_fantasia AS nomeFantasia,
        f.for_cnpj AS cnpj,
        f.for_email AS email,
        f.for_telefone AS telefone,
        f.for_razao_social AS razaoSocial,
        f.for_usu_id AS usuarioId,
        u.usu_ativo AS usuarioAtivo
      FROM tb_Fornecedores f
      LEFT JOIN tb_Usuarios u ON u.usu_id = f.for_usu_id
      ORDER BY f.for_razao_social
    `;
    return this.#db.ExecutaComando(sql, []);
  }

  async buscarPorCnpj(cnpj) {
    const sql = `
      SELECT for_id AS id
      FROM tb_Fornecedores
      WHERE REPLACE(REPLACE(REPLACE(for_cnpj, '.', ''), '/', ''), '-', '') = ?
      LIMIT 1
    `;
    const rows = await this.#db.ExecutaComando(sql, [cnpj]);
    return rows[0] || null;
  }

  async buscarPorUsuarioId(usuarioId) {
    await this.garantirVinculoUsuario();

    const sql = `
      SELECT
        for_id AS id,
        for_razao_social AS nome,
        for_nome_fantasia AS nomeFantasia,
        for_cnpj AS cnpj,
        for_email AS email
      FROM tb_Fornecedores
      WHERE for_usu_id = ?
      LIMIT 1
    `;
    const rows = await this.#db.ExecutaComando(sql, [Number(usuarioId)]);
    return rows[0] || null;
  }

  async criar({
    usuarioId,
    nomeFantasia,
    cnpj,
    email,
    telefone,
    razaoSocial,
  }) {
    await this.garantirVinculoUsuario();

    const sql = `
      INSERT INTO tb_Fornecedores (
        for_usu_id,
        for_nome_fantasia,
        for_cnpj,
        for_email,
        for_telefone,
        for_razao_social
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    return this.#db.ExecutaComandoLastInserted(sql, [
      usuarioId,
      nomeFantasia || null,
      cnpj,
      email || null,
      telefone || null,
      razaoSocial,
    ]);
  }
}

module.exports = FornecedoresModels;
