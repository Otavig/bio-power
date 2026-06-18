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
