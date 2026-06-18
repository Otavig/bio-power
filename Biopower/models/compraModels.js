const Database = require("../utils/database");
const banco = new Database();

class CompraModels {
  #db;
  #comId;
  #comIdFornecedor;
  #comData;
  #comValorTotal;
  #comStatus;
  get comId() {
    return this.#comId;
  }

  set comId(value) {
    this.#comId = value;
  }

  get comIdFornecedor() {
    return this.#comIdFornecedor;
  }

  set comIdFornecedor(value) {
    this.#comIdFornecedor = value;
  }

  get comData() {
    return this.#comData;
  }

  set comData(value) {
    this.#comData = value;
  }

  get comValorTotal() {
    return this.#comValorTotal;
  }

  set comValorTotal(value) {
    this.#comValorTotal = value;
  }

  get comStatus() {
    return this.#comStatus;
  }

  set comStatus(value) {
    this.#comStatus = value;
  }


  constructor(
    comId = null,
    comIdFornecedor = null,
    comData = null,
    comValorTotal = null,
    comStatus = null
  ) {
    this.#db = banco;
    this.#comId = comId;
    this.#comIdFornecedor = comIdFornecedor;
    this.#comData = comData;
    this.#comValorTotal = comValorTotal;
    this.#comStatus = comStatus;
  }

  get db() {
    return this.#db;
  }

  async listarComItens(fornecedorId = null) {
    const params = [];
    const filtroFornecedor = fornecedorId ? "WHERE c.com_id_fornecedor = ?" : "";
    if (fornecedorId) params.push(Number(fornecedorId));

    const sql = `
      SELECT
        c.com_id AS compraId,
        c.com_id_fornecedor AS fornecedorId,
        c.com_data AS data,
        c.com_valor_total AS valorTotal,
        c.com_status AS status,
        COALESCE(f.for_nome_fantasia, f.for_razao_social, 'Fornecedor nao informado') AS fornecedorNome,
        f.for_email AS fornecedorEmail,
        f.for_cnpj AS fornecedorCnpj,
        i.itc_id AS itemId,
        i.itc_id_produto AS produtoId,
        i.itc_quantidade AS quantidade,
        i.itc_valor_unitario AS valorUnitario,
        COALESCE(p.pro_nome, 'Produto nao encontrado') AS produtoNome
      FROM tb_Compra c
      LEFT JOIN tb_Fornecedores f ON f.for_id = c.com_id_fornecedor
      LEFT JOIN tb_Itens_Compra i ON i.itc_id_compra = c.com_id
      LEFT JOIN tb_Produtos p ON p.pro_id = i.itc_id_produto
      ${filtroFornecedor}
      ORDER BY c.com_id ASC, i.itc_id ASC
    `;

    const rows = await this.#db.ExecutaComando(sql, params);
    const compras = new Map();

    for (const row of rows) {
      const compraId = Number(row.compraId);

      if (!compras.has(compraId)) {
        compras.set(compraId, {
          id: compraId,
          fornecedorId: row.fornecedorId,
          fornecedorNome: row.fornecedorNome,
          fornecedorEmail: row.fornecedorEmail,
          fornecedorCnpj: row.fornecedorCnpj,
          data: row.data,
          valorTotal: Number(row.valorTotal || 0),
          status: row.status,
          itens: [],
        });
      }

      if (row.itemId) {
        const quantidade = Number(row.quantidade || 0);
        const valorUnitario = Number(row.valorUnitario || 0);

        compras.get(compraId).itens.push({
          id: row.itemId,
          produtoId: row.produtoId,
          nome: row.produtoNome,
          quantidade,
          valorUnitario,
          subtotal: Number((quantidade * valorUnitario).toFixed(2)),
        });
      }
    }

    return Array.from(compras.values());
  }

  async criarComItens({ fornecedorId, itens, status = "pendente", data = null }) {
    const fornecedorIdNumero = Number(fornecedorId);
    const itensNormalizados = Array.isArray(itens) ? itens : [];

    if (!fornecedorIdNumero || itensNormalizados.length === 0) return null;

    const valorTotal = itensNormalizados.reduce((total, item) => {
      return total + Number(item.quantidade || 0) * Number(item.valorUnitario || 0);
    }, 0);

    if (valorTotal <= 0) return null;

    const compraId = await this.#db.ExecutaComandoLastInserted(
      `INSERT INTO tb_Compra (com_id_fornecedor, com_data, com_valor_total, com_status)
       VALUES (?, ?, ?, ?)`,
      [
        fornecedorIdNumero,
        data || new Date().toISOString().slice(0, 10),
        Number(valorTotal.toFixed(2)),
        status,
      ]
    );

    for (const item of itensNormalizados) {
      await this.#db.ExecutaComando(
        `INSERT INTO tb_Itens_Compra (itc_id_compra, itc_id_produto, itc_quantidade, itc_valor_unitario)
         VALUES (?, ?, ?, ?)`,
        [
          compraId,
          Number(item.produtoId),
          Number(item.quantidade),
          Number(item.valorUnitario),
        ]
      );
    }

    return compraId;
  }

  async atualizarStatus(compraId, novoStatus) {
    const sql = `UPDATE tb_Compra SET com_status = ? WHERE com_id = ?`;
    return this.#db.ExecutaComandoNonQuery(sql, [novoStatus, Number(compraId)]);
  }
}

module.exports = CompraModels;
