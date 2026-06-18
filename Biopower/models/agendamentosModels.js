const Database = require("../utils/database");
const banco = new Database();

class AgendamentosModels {
  #createdAt;
  #updatedAt;
  #ageId;
  #ageIdCliente;
  #ageIdProfissional;
  #ageDataAgendamento;
  #ageValorTotal;
  #ageObservacoes;
  get ageId() {
    return this.#ageId;
  }

  set ageId(value) {
    this.#ageId = value;
  }

  get ageIdCliente() {
    return this.#ageIdCliente;
  }

  set ageIdCliente(value) {
    this.#ageIdCliente = value;
  }

  get ageIdProfissional() {
    return this.#ageIdProfissional;
  }

  set ageIdProfissional(value) {
    this.#ageIdProfissional = value;
  }

  get ageDataAgendamento() {
    return this.#ageDataAgendamento;
  }

  set ageDataAgendamento(value) {
    this.#ageDataAgendamento = value;
  }

  get ageValorTotal() {
    return this.#ageValorTotal;
  }

  set ageValorTotal(value) {
    this.#ageValorTotal = value;
  }

  get ageObservacoes() {
    return this.#ageObservacoes;
  }

  set ageObservacoes(value) {
    this.#ageObservacoes = value;
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
    ageId = null,
    ageIdCliente = null,
    ageIdProfissional = null,
    ageDataAgendamento = null,
    ageValorTotal = 0,
    ageObservacoes = null
  ) {
    this.#ageId = ageId;
    this.#ageIdCliente = ageIdCliente;
    this.#ageIdProfissional = ageIdProfissional;
    this.#ageDataAgendamento = ageDataAgendamento;
    this.#ageValorTotal = ageValorTotal;
    this.#ageObservacoes = ageObservacoes;
  }

  get ageId() {
    return this.#ageId;
  }

  set ageId(value) {
    this.#ageId = value;
  }

  get ageIdCliente() {
    return this.#ageIdCliente;
  }

  set ageIdCliente(value) {
    this.#ageIdCliente = value;
  }

  get ageIdProfissional() {
    return this.#ageIdProfissional;
  }

  set ageIdProfissional(value) {
    this.#ageIdProfissional = value;
  }

  get ageDataAgendamento() {
    return this.#ageDataAgendamento;
  }

  set ageDataAgendamento(value) {
    this.#ageDataAgendamento = value;
  }

  get ageValorTotal() {
    return this.#ageValorTotal;
  }

  set ageValorTotal(value) {
    this.#ageValorTotal = value;
  }

  get ageObservacoes() {
    return this.#ageObservacoes;
  }

  set ageObservacoes(value) {
    this.#ageObservacoes = value;
  }

  async listar() {
    const sql = "SELECT * FROM tb_agendamentos ORDER BY age_data_agendamento DESC";
    const rows = await banco.ExecutaComando(sql);
    const lista = [];

    for (let i = 0; i < rows.length; i++) {
      lista.push(
        new AgendamentosModels(
          rows[i]["age_id"],
          rows[i]["age_id_cliente"],
          rows[i]["age_id_profissional"],
          rows[i]["age_data_agendamento"],
          rows[i]["age_valor_total"],
          rows[i]["age_observacoes"]
        )
      );
    }

    return lista;
  }

  async criar({ clienteId, profissionalId, dataAgendamento, valorTotal = 0, observacoes = null }) {
    const sql = `
      INSERT INTO tb_agendamentos (age_id_cliente, age_id_profissional, age_data_agendamento, age_valor_total, age_observacoes)
      VALUES (?, ?, ?, ?, ?)
    `;
    return banco.ExecutaComandoLastInserted(sql, [
      Number(clienteId),
      Number(profissionalId),
      dataAgendamento,
      Number(valorTotal || 0),
      observacoes,
    ]);
  }

  async atualizar({ agendamentoId, acrescimoValor = 0, observacoes = null }) {
    if (!agendamentoId || (acrescimoValor === 0 && observacoes === null)) return null;

    const updates = [];
    const params = [];

    if (Number(acrescimoValor)) {
      updates.push("age_valor_total = COALESCE(age_valor_total, 0) + ?");
      params.push(Number(acrescimoValor));
    }

    if (observacoes !== null && observacoes !== undefined) {
      updates.push("age_observacoes = ?");
      params.push(observacoes);
    }

    if (!updates.length) return null;

    const sql = `
      UPDATE tb_agendamentos
      SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE age_id = ?;
    `;

    params.push(agendamentoId);
    return banco.ExecutaComandoNonQuery(sql, params);
  }

  async buscarPorId(id) {
    if (!id) return null;
    const sql = `
      SELECT
        age_id AS id,
        age_valor_total AS valorTotal,
        age_observacoes AS observacoes,
        age_data_agendamento AS dataAgendamento
      FROM tb_agendamentos
      WHERE age_id = ?
      LIMIT 1;
    `;
    const rows = await banco.ExecutaComando(sql, [id]);
    if (!rows || !rows.length) return null;
    return {
      id: rows[0].id,
      valorTotal: Number(rows[0].valorTotal || 0),
      observacoes: rows[0].observacoes,
      dataAgendamento: rows[0].dataAgendamento,
    };
  }
}

module.exports = AgendamentosModels;
