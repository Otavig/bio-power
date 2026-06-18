const Database = require("../utils/database");
const banco = new Database();

class StatusDiversosModels {
  #db;
  #staId;
  #staDominio;
  #staCodigo;
  #staDescricao;
  get staId() {
    return this.#staId;
  }

  set staId(value) {
    this.#staId = value;
  }

  get staDominio() {
    return this.#staDominio;
  }

  set staDominio(value) {
    this.#staDominio = value;
  }

  get staCodigo() {
    return this.#staCodigo;
  }

  set staCodigo(value) {
    this.#staCodigo = value;
  }

  get staDescricao() {
    return this.#staDescricao;
  }

  set staDescricao(value) {
    this.#staDescricao = value;
  }


  constructor(
    staId = null,
    staDominio = null,
    staCodigo = null,
    staDescricao = null
  ) {
    this.#db = banco;
    this.#staId = staId;
    this.#staDominio = staDominio;
    this.#staCodigo = staCodigo;
    this.#staDescricao = staDescricao;
  }

  get db() {
    return this.#db;
  }

  async listarPorDominio(dominio) {
    const sql = `
      SELECT
        sta_id AS id,
        sta_dominio AS dominio,
        sta_codigo AS codigo,
        sta_descricao AS descricao
      FROM tb_status_diversos
      WHERE sta_dominio = ?
        AND NOT (sta_dominio = 'venda_metodo_pagamento' AND UPPER(sta_codigo) = 'BOLETO')
      ORDER BY sta_id ASC
    `;

    return this.#db.ExecutaComando(sql, [dominio]);
  }

  async buscarPorDominioCodigo(dominio, codigo) {
    if (dominio === "venda_metodo_pagamento" && String(codigo || "").toUpperCase() === "BOLETO") {
      return null;
    }

    const sql = `
      SELECT
        sta_id AS id,
        sta_dominio AS dominio,
        sta_codigo AS codigo,
        sta_descricao AS descricao
      FROM tb_status_diversos
      WHERE sta_dominio = ? AND UPPER(sta_codigo) = UPPER(?)
      LIMIT 1
    `;
    const rows = await this.#db.ExecutaComando(sql, [dominio, codigo]);
    return Array.isArray(rows) && rows.length ? rows[0] : null;
  }

  async garantirStatusVendaEntregue() {
    const existente = await this.buscarPorDominioCodigo("venda_status", "ENTREGUE");

    if (existente) {
      return this.#db.ExecutaComando(
        "UPDATE tb_status_diversos SET sta_descricao = 'Venda entregue' WHERE sta_id = ?",
        [existente.id]
      );
    }

    return this.#db.ExecutaComando(
      "INSERT INTO tb_status_diversos (sta_dominio, sta_codigo, sta_descricao) VALUES ('venda_status', 'ENTREGUE', 'Venda entregue')",
      []
    );
  }

  async removerMetodoPagamentoBoleto() {
    try {
      return await this.#db.ExecutaComandoNonQuery(
        "DELETE FROM tb_status_diversos WHERE sta_dominio = 'venda_metodo_pagamento' AND UPPER(sta_codigo) = 'BOLETO'",
        []
      );
    } catch (err) {
      console.warn("Nao foi possivel remover BOLETO de tb_status_diversos:", err.message);
      return false;
    }
  }

  async garantirStatusCompra() {
    const status = [
      ["PENDENTE", "Compra pendente"],
      ["RECEBIDO", "Compra recebida"],
      ["CANCELADO", "Compra cancelada"],
    ];

    for (const [codigo, descricao] of status) {
      const existente = await this.buscarPorDominioCodigo("compra_status", codigo);

      if (existente) {
        await this.#db.ExecutaComando(
          "UPDATE tb_status_diversos SET sta_descricao = ? WHERE sta_id = ?",
          [descricao, existente.id]
        );
      } else {
        await this.#db.ExecutaComando(
          "INSERT INTO tb_status_diversos (sta_dominio, sta_codigo, sta_descricao) VALUES ('compra_status', ?, ?)",
          [codigo, descricao]
        );
      }
    }
  }
}

module.exports = StatusDiversosModels;
