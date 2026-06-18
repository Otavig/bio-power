const Database = require("../utils/database");

const banco = new Database();

class VendasModels {
  #venId;
  #venIdCliente;
  #venData;
  #venValorTotal;
  #venStatus;
  #venDesconto;
  #createdAt;
  #updatedAt;
  #db;

  get venId() {
    return this.#venId;
  }

  set venId(value) {
    this.#venId = value;
  }

  get venIdCliente() {
    return this.#venIdCliente;
  }

  set venIdCliente(value) {
    this.#venIdCliente = value;
  }

  get venData() {
    return this.#venData;
  }

  set venData(value) {
    this.#venData = value;
  }

  get venValorTotal() {
    return this.#venValorTotal;
  }

  set venValorTotal(value) {
    this.#venValorTotal = value;
  }

  get venStatus() {
    return this.#venStatus;
  }

  set venStatus(value) {
    this.#venStatus = value;
  }

  get venDesconto() {
    return this.#venDesconto;
  }

  set venDesconto(value) {
    this.#venDesconto = value;
  }

  get createdAt() {
    return this.#createdAt;
  }

  set createdAt(value) {
    this.#createdAt = value;
  }

  get updatedAt() {
    return this.#updatedAt;
  }

  set updatedAt(value) {
    this.#updatedAt = value;
  }

  constructor() {
    this.#db = banco;
  }

  async colunaExiste(nomeColuna) {
    const sql = `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'tb_Vendas'
        AND COLUMN_NAME = ?
      LIMIT 1
    `;
    const rows = await this.#db.ExecutaComando(sql, [nomeColuna]);
    return Array.isArray(rows) && rows.length > 0;
  }

  async garantirCamposStatusPagamento() {
    const temStatusId = await this.colunaExiste("ven_status_id");
    const temMetodoPagamentoId = await this.colunaExiste("ven_metodo_pagamento_id");

    if (!temStatusId) {
      await this.#db.ExecutaComando(
        "ALTER TABLE tb_Vendas ADD COLUMN ven_status_id int NOT NULL DEFAULT 17 AFTER ven_status",
        []
      );
    }

    if (!temMetodoPagamentoId) {
      await this.#db.ExecutaComando(
        "ALTER TABLE tb_Vendas ADD COLUMN ven_metodo_pagamento_id int DEFAULT NULL AFTER ven_desconto",
        []
      );
    }

    await this.#db.ExecutaComando(
      "UPDATE tb_status_diversos SET sta_descricao = 'Venda entregue' WHERE sta_dominio = 'venda_status' AND UPPER(sta_codigo) = 'ENTREGUE'",
      []
    );

    await this.#db.ExecutaComando(
      "INSERT INTO tb_status_diversos (sta_dominio, sta_codigo, sta_descricao) SELECT 'venda_status', 'ENTREGUE', 'Venda entregue' WHERE NOT EXISTS (SELECT 1 FROM tb_status_diversos WHERE sta_dominio = 'venda_status' AND UPPER(sta_codigo) = 'ENTREGUE')",
      []
    );

    await this.#db.ExecutaComando(
      `UPDATE tb_Vendas
       SET ven_status_id = CASE UPPER(ven_status)
         WHEN 'PAGO' THEN 18
         WHEN 'CANCELADO' THEN 19
         WHEN 'ENTREGUE' THEN 20
         ELSE 17
       END
       WHERE ven_status_id IS NULL OR ven_status_id = 0`,
      []
    );
  }

  normalizarStatusPadrao(status, statusId = null) {
    const porId = {
      17: "AGUARDANDO",
      18: "PAGO",
      19: "CANCELADO",
      20: "ENTREGUE",
    };

    if (statusId && porId[Number(statusId)]) return porId[Number(statusId)];
    return String(status || "AGUARDANDO").trim().toUpperCase();
  }

  obterStatusIdPadrao(status, statusId = null) {
    if (statusId) return Number(statusId);

    const porCodigo = {
      AGUARDANDO: 17,
      AGUARDANDO_PAGAMENTO: 17,
      PAGO: 18,
      CANCELADO: 19,
      ENTREGUE: 20,
    };

    return porCodigo[this.normalizarStatusPadrao(status)] || 17;
  }

  async criar({ clienteId, valorTotal, status = "AGUARDANDO", statusId = null, metodoPagamentoId = null, desconto = 0, data = null }) {
    if (!clienteId || valorTotal === undefined || valorTotal === null) return null;

    await this.garantirCamposStatusPagamento();

    const statusCodigo = this.normalizarStatusPadrao(status, statusId);
    const statusDiversoId = this.obterStatusIdPadrao(statusCodigo, statusId);

    const sql = `
      INSERT INTO tb_Vendas
        (ven_id_cliente, ven_data, ven_valor_total, ven_status, ven_status_id, ven_desconto, ven_metodo_pagamento_id)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    return this.#db.ExecutaComandoLastInserted(sql, [
      Number(clienteId),
      data || new Date().toISOString().slice(0, 10),
      Number(valorTotal),
      statusCodigo,
      statusDiversoId,
      Number(desconto || 0),
      metodoPagamentoId ? Number(metodoPagamentoId) : null,
    ]);
  }

  async listarComItens() {
    await this.garantirCamposStatusPagamento();

    const sql = `
      SELECT
        v.ven_id AS vendaId,
        v.ven_id_cliente AS clienteId,
        v.ven_data AS data,
        v.ven_valor_total AS valorTotal,
        v.ven_status AS status,
        v.ven_status_id AS statusId,
        v.ven_desconto AS desconto,
        v.ven_metodo_pagamento_id AS metodoPagamentoId,
        v.created_at AS criadoEm,
        v.updated_at AS atualizadoEm,
        COALESCE(u.usu_nome, 'Cliente nao informado') AS clienteNome,
        u.usu_email AS clienteEmail,
        sv.sta_codigo AS statusCodigo,
        sv.sta_descricao AS statusDescricao,
        mp.sta_codigo AS metodoPagamentoCodigo,
        mp.sta_descricao AS metodoPagamentoDescricao,
        i.itv_id AS itemId,
        i.itv_id_produto AS produtoId,
        i.itv_quantidade AS quantidade,
        i.itv_subtotal AS subtotal,
        i.itv_valor_unitario AS valorUnitario,
        COALESCE(p.pro_nome, 'Produto nao encontrado') AS produtoNome
      FROM tb_Vendas v
      LEFT JOIN tb_Usuarios u ON u.usu_id = v.ven_id_cliente
      LEFT JOIN tb_status_diversos sv ON sv.sta_id = v.ven_status_id AND sv.sta_dominio = 'venda_status'
      LEFT JOIN tb_status_diversos mp ON mp.sta_id = v.ven_metodo_pagamento_id AND mp.sta_dominio = 'venda_metodo_pagamento'
      LEFT JOIN tb_Itens_Venda i ON i.itv_id_venda = v.ven_id
      LEFT JOIN tb_Produtos p ON p.pro_id = i.itv_id_produto
      ORDER BY v.ven_id ASC, i.itv_id ASC
    `;

    const rows = await this.#db.ExecutaComando(sql, []);
    const vendas = new Map();

    for (const row of rows) {
      const vendaId = Number(row.vendaId);

      if (!vendas.has(vendaId)) {
        vendas.set(vendaId, {
          id: vendaId,
          clienteId: row.clienteId,
          clienteNome: row.clienteNome,
          clienteEmail: row.clienteEmail,
          data: row.data,
          valorTotal: Number(row.valorTotal || 0),
          status: row.statusCodigo || row.status,
          statusId: row.statusId,
          statusDescricao: row.statusDescricao,
          desconto: Number(row.desconto || 0),
          metodoPagamentoId: row.metodoPagamentoId,
          metodoPagamentoCodigo: row.metodoPagamentoCodigo,
          metodoPagamentoDescricao: row.metodoPagamentoDescricao,
          criadoEm: row.criadoEm,
          atualizadoEm: row.atualizadoEm,
          itens: [],
        });
      }

      if (row.itemId) {
        vendas.get(vendaId).itens.push({
          id: row.itemId,
          produtoId: row.produtoId,
          nome: row.produtoNome,
          quantidade: Number(row.quantidade || 0),
          valorUnitario: Number(row.valorUnitario || 0),
          subtotal: Number(row.subtotal || 0),
        });
      }
    }

    return Array.from(vendas.values());
  }

  async atualizarStatus(vendaId, statusId) {
    await this.garantirCamposStatusPagamento();

    const statusRows = await this.#db.ExecutaComando(
      `SELECT sta_id AS id, sta_codigo AS codigo, sta_descricao AS descricao
       FROM tb_status_diversos
       WHERE sta_id = ? AND sta_dominio = 'venda_status'
       LIMIT 1`,
      [Number(statusId)]
    );

    if (!Array.isArray(statusRows) || statusRows.length === 0) {
      throw new Error("Status de venda invalido.");
    }

    const status = statusRows[0];
    await this.#db.ExecutaComando(
      "UPDATE tb_Vendas SET ven_status_id = ?, ven_status = ? WHERE ven_id = ?",
      [Number(status.id), status.codigo, Number(vendaId)]
    );

    return status;
  }
}

module.exports = VendasModels;
