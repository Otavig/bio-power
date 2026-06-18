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

  async criar({ clienteId, valorTotal, status = "aguardando", desconto = 0, data = null }) {
    if (!clienteId || valorTotal === undefined || valorTotal === null) return null;

    const sql = `
      INSERT INTO tb_Vendas
        (ven_id_cliente, ven_data, ven_valor_total, ven_status, ven_desconto)
      VALUES (?, ?, ?, ?, ?);
    `;

    return this.#db.ExecutaComandoLastInserted(sql, [
      Number(clienteId),
      data || new Date().toISOString().slice(0, 10),
      Number(valorTotal),
      status,
      Number(desconto || 0),
    ]);
  }
}

module.exports = VendasModels;
