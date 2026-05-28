const Database = require("../utils/database");

const banco = new Database();

class ItensServicosModels {
  #db;

  constructor() {
    this.#db = banco;
  }

  async criar({
    clienteId,
    profissionalId,
    servicoId,
    agendamentoId,
    status = "pendente",
    valorUnitario,
    quantidade = 1,
    valorTotal,
  }) {
    const totalCalculado =
      valorTotal !== undefined && valorTotal !== null
        ? Number(valorTotal)
        : Number(valorUnitario || 0) * Number(quantidade || 1);

    const sql = `
      INSERT INTO tb_itens_servicos
        (its_id_cliente, its_id_profissional, its_id_servico, its_id_agendamento, its_status, its_valor_unitario, its_quantidade, its_valor_total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    return this.#db.ExecutaComandoLastInserted(sql, [
      clienteId,
      profissionalId,
      servicoId,
      agendamentoId,
      status,
      Number(valorUnitario || 0),
      Number(quantidade || 1),
      totalCalculado,
    ]);
  }

  async listarPorCliente(clienteId) {
    if (!clienteId) return [];
    const sql = `
      SELECT
        i.its_id AS id,
        i.its_id_agendamento AS agendamentoId,
        i.its_status AS status,
        i.its_valor_unitario AS valorUnitario,
        i.its_quantidade AS quantidade,
        i.its_valor_total AS valorTotal,
        i.created_at AS dataCriacao,
        i.updated_at AS dataAtualizacao,
        s.ser_nome AS servicoNome,
        s.ser_descricao AS servicoDescricao,
        s.ser_preco AS servicoPreco,
        p.usu_nome AS profissionalNome,
        a.age_data_agendamento AS dataAgendamento
      FROM tb_itens_servicos i
      INNER JOIN tb_Servicos s ON s.ser_id = i.its_id_servico
      INNER JOIN tb_Usuarios p ON p.usu_id = i.its_id_profissional
      INNER JOIN tb_agendamentos a ON a.age_id = i.its_id_agendamento
      WHERE i.its_id_cliente = ?
      ORDER BY a.age_data_agendamento DESC;
    `;
    const rows = await this.#db.ExecutaComando(sql, [clienteId]);
    return rows.map((row) => ({
      id: row.id,
      agendamentoId: row.agendamentoId,
      status: row.status,
      valorUnitario: Number(row.valorUnitario || 0),
      quantidade: Number(row.quantidade || 0),
      valorTotal: Number(row.valorTotal || 0),
      dataCriacao: row.dataCriacao,
      dataAtualizacao: row.dataAtualizacao,
      servicoNome: row.servicoNome,
      servicoDescricao: row.servicoDescricao,
      servicoPreco: Number(row.servicoPreco || 0),
      profissionalNome: row.profissionalNome,
      dataAgendamento: row.dataAgendamento,
    }));
  }

  async listarTodos(filtro = {}) {
    const { status } = filtro;
    const params = [];
    const where = [];

    if (status) {
      where.push("i.its_status = ?");
      params.push(status);
    }

    const sql = `
      SELECT
        i.its_id AS id,
        i.its_status AS status,
        i.its_valor_unitario AS valorUnitario,
        i.its_quantidade AS quantidade,
        i.its_valor_total AS valorTotal,
        i.created_at AS dataCriacao,
        i.updated_at AS dataAtualizacao,
        s.ser_nome AS servicoNome,
        s.ser_descricao AS servicoDescricao,
        s.ser_preco AS servicoPreco,
        c.usu_id AS clienteId,
        c.usu_nome AS clienteNome,
        c.usu_email AS clienteEmail,
        p.usu_id AS profissionalId,
        p.usu_nome AS profissionalNome,
        a.age_id AS agendamentoId,
        a.age_data_agendamento AS dataAgendamento,
        a.age_observacoes AS observacoes
      FROM tb_itens_servicos i
      INNER JOIN tb_Servicos s ON s.ser_id = i.its_id_servico
      INNER JOIN tb_Usuarios c ON c.usu_id = i.its_id_cliente
      INNER JOIN tb_Usuarios p ON p.usu_id = i.its_id_profissional
      INNER JOIN tb_agendamentos a ON a.age_id = i.its_id_agendamento
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY a.age_data_agendamento DESC;
    `;

    const rows = await this.#db.ExecutaComando(sql, params);
    return rows.map((row) => ({
      id: row.id,
      status: row.status,
      valorUnitario: Number(row.valorUnitario || 0),
      quantidade: Number(row.quantidade || 0),
      valorTotal: Number(row.valorTotal || 0),
      dataCriacao: row.dataCriacao,
      dataAtualizacao: row.dataAtualizacao,
      servicoNome: row.servicoNome,
      servicoDescricao: row.servicoDescricao,
      servicoPreco: Number(row.servicoPreco || 0),
      clienteId: row.clienteId,
      clienteNome: row.clienteNome,
      clienteEmail: row.clienteEmail,
      profissionalId: row.profissionalId,
      profissionalNome: row.profissionalNome,
      agendamentoId: row.agendamentoId,
      dataAgendamento: row.dataAgendamento,
      observacoes: row.observacoes,
    }));
  }

  async atualizarStatus(id, { status }) {
    if (!id || !status) return null;

    const sql = `
      UPDATE tb_itens_servicos
      SET its_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE its_id = ?;
    `;

    return this.#db.ExecutaComandoNonQuery(sql, [status, id]);
  }
}

module.exports = ItensServicosModels;
