const Database = require("../utils/database");
const banco = new Database();

class PedidoCompraModels {
  #db;
  #pedId;
  #pedIdFornecedor;
  #pedIdResponsavel;
  #pedDataPedido;
  #pedDataEntregaPrevista;
  #pedStatusId;
  #createdAt;
  #updatedAt;
  get pedId() {
    return this.#pedId;
  }

  set pedId(value) {
    this.#pedId = value;
  }

  get pedIdFornecedor() {
    return this.#pedIdFornecedor;
  }

  set pedIdFornecedor(value) {
    this.#pedIdFornecedor = value;
  }

  get pedIdResponsavel() {
    return this.#pedIdResponsavel;
  }

  set pedIdResponsavel(value) {
    this.#pedIdResponsavel = value;
  }

  get pedDataPedido() {
    return this.#pedDataPedido;
  }

  set pedDataPedido(value) {
    this.#pedDataPedido = value;
  }

  get pedDataEntregaPrevista() {
    return this.#pedDataEntregaPrevista;
  }

  set pedDataEntregaPrevista(value) {
    this.#pedDataEntregaPrevista = value;
  }

  get pedStatusId() {
    return this.#pedStatusId;
  }

  set pedStatusId(value) {
    this.#pedStatusId = value;
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


  constructor(
    pedId = null,
    pedIdFornecedor = null,
    pedIdResponsavel = null,
    pedDataPedido = null,
    pedDataEntregaPrevista = null,
    pedStatusId = null,
    createdAt = null,
    updatedAt = null
  ) {
    this.#db = banco;
    this.#pedId = pedId;
    this.#pedIdFornecedor = pedIdFornecedor;
    this.#pedIdResponsavel = pedIdResponsavel;
    this.#pedDataPedido = pedDataPedido;
    this.#pedDataEntregaPrevista = pedDataEntregaPrevista;
    this.#pedStatusId = pedStatusId;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  get db() {
    return this.#db;
  }

  async gravar() {
    const fornecedorId = Number(this.#pedIdFornecedor || 1);
    const responsavelId = Number(this.#pedIdResponsavel || 1);
    const statusId = Number(this.#pedStatusId || 21);

    const sql = `
      INSERT INTO tb_Pedidos_Compra
        (ped_id_fornecedor, ped_id_responsavel, ped_data_entrega_prevista, ped_status_id)
      VALUES (?, ?, ?, ?)
    `;

    const pedidoId = await this.#db.ExecutaComandoLastInserted(sql, [
      fornecedorId,
      responsavelId,
      this.#pedDataEntregaPrevista || null,
      statusId,
    ]);

    this.#pedId = pedidoId;
    return pedidoId;
  }

  async atualizar() {
    if (!this.#pedId) return false;

    const statusEntrada = String(this.pedidoStatus || this.#pedStatusId || "").toUpperCase();
    let statusId = Number(this.#pedStatusId || 21);

    if (statusEntrada === "RECEBIDO" || statusEntrada === "RECEBIDA") statusId = 22;
    if (statusEntrada === "CANCELADO" || statusEntrada === "CANCELADA") statusId = 23;

    return this.#db.ExecutaComandoNonQuery(
      "UPDATE tb_Pedidos_Compra SET ped_status_id = ? WHERE ped_id = ?",
      [statusId, this.#pedId],
    );
  }
}

module.exports = PedidoCompraModels;
