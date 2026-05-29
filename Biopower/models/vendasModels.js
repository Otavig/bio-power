const Database = require("../utils/database");

const banco = new Database();

class VendasModels {
  #db;

  constructor() {
    this.#db = banco;
  }

  async criar({ clienteId, valorTotal, statusId = 18, metodoPagamentoId = 13, enderecoEntrega = null, frete = 0 }) {
    if (!clienteId || valorTotal === undefined || valorTotal === null) return null;

    const sql = `
      INSERT INTO tb_Vendas
        (ven_id_cliente, ven_valor_total, ven_status_id, ven_metodo_pagamento_id, ven_endereco_entrega, ven_frete)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    return this.#db.ExecutaComandoLastInserted(sql, [
      Number(clienteId),
      Number(valorTotal),
      Number(statusId),
      Number(metodoPagamentoId),
      enderecoEntrega || null,
      Number(frete || 0),
    ]);
  }
}

module.exports = VendasModels;
