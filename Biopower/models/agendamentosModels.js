const Database = require("../utils/database");
const banco = new Database();

class AgendamentosModels {
  #ageId;
  #ageIdCliente;
  #ageIdProfissional;
  #ageDataAgendamento;
  #ageValorTotal;
  #ageObservacoes;

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
}

module.exports = AgendamentosModels;
