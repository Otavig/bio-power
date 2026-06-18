const Database = require("../utils/database");

const banco = new Database();

class efetuarCompraModels {
  #produtoId;
  #quantidade;
  #dataValidade;
  #numeroLote;

  get produtoId() {
    return this.#produtoId;
  }
  set produtoId(value) {
    this.#produtoId = value;
  }

  get quantidade() {
    return this.#quantidade;
  }
  set quantidade(value) {
    this.#quantidade = value;
  }

  get dataValidade() {
    return this.#dataValidade;
  }
  set dataValidade(value) {
    this.#dataValidade = value;
  }

  get numeroLote() {
    return this.#numeroLote;
  }
  set numeroLote(value) {
    this.#numeroLote = value;
  }

  constructor(produtoId, quantidade, dataValidade, numeroLote) {
    this.#produtoId = produtoId;
    this.#quantidade = quantidade;
    this.#dataValidade = dataValidade;
    this.#numeroLote = numeroLote;
  }

  async registrarCompra() {
    if (this.pedidoId) {
      const sql = `
        INSERT INTO tb_Itens_Pedido_Compra
          (itp_id_pedido, itp_id_produto, itp_quantidade, itp_valor_unitario)
        VALUES (?, ?, ?, ?)
      `;

      return await banco.ExecutaComandoNonQuery(sql, [
        this.pedidoId,
        this.#produtoId || this.produtoId,
        this.#quantidade || this.pedidoItemQuantidade,
        this.pedidoItemValor || 0,
      ]);
    }

    let sql = `
      INSERT INTO tb_Lotes_Estoque
        (lot_id_produto, lot_numero_lote, lot_quantidade_atual, lot_data_validade)
      VALUES (?, ?, ?, ?)
    `;

    let valores = [
      this.#produtoId,
      this.#numeroLote || `LOTE-${Date.now()}`,
      this.#quantidade,
      this.#dataValidade || "2099-12-31",
    ];

    return await banco.ExecutaComandoNonQuery(sql, valores);
  }

  async buscarItensPedido(pedidoId) {
    let sql = `
        SELECT
          itp_id AS itemId,
          itp_id_pedido AS pedidoId,
          itp_id_produto AS produtoId,
          itp_quantidade AS pedidoItemQuantidade,
          itp_valor_unitario AS pedidoItemValor
        FROM tb_Itens_Pedido_Compra
        WHERE itp_id_pedido = ?
    `;

    let rows = await banco.ExecutaComando(sql, [pedidoId]);

    return rows;
  }
}

module.exports = efetuarCompraModels;
