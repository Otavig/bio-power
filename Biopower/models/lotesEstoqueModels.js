const Database = require("../utils/database");

const banco = new Database();

class LotesEstoqueModels {
  #lotId;
  #lotIdProduto;
  #lotNumeroLote;
  #lotQuantidadeAtual;
  #lotDataValidade;
  #lotDataEntrada;
  #lotIdFornecedor;
  #createdAt;
  #updatedAt;
	#db;
  get lotId() {
    return this.#lotId;
  }

  set lotId(value) {
    this.#lotId = value;
  }

  get lotIdProduto() {
    return this.#lotIdProduto;
  }

  set lotIdProduto(value) {
    this.#lotIdProduto = value;
  }

  get lotNumeroLote() {
    return this.#lotNumeroLote;
  }

  set lotNumeroLote(value) {
    this.#lotNumeroLote = value;
  }

  get lotQuantidadeAtual() {
    return this.#lotQuantidadeAtual;
  }

  set lotQuantidadeAtual(value) {
    this.#lotQuantidadeAtual = value;
  }

  get lotDataValidade() {
    return this.#lotDataValidade;
  }

  set lotDataValidade(value) {
    this.#lotDataValidade = value;
  }

  get lotDataEntrada() {
    return this.#lotDataEntrada;
  }

  set lotDataEntrada(value) {
    this.#lotDataEntrada = value;
  }

  get lotIdFornecedor() {
    return this.#lotIdFornecedor;
  }

  set lotIdFornecedor(value) {
    this.#lotIdFornecedor = value;
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

	async obterEstoqueProduto(produtoId) {
		if (!produtoId) return 0;
		const rows = await this.#db.ExecutaComando(
			"SELECT COALESCE(SUM(lot_quantidade_atual), 0) AS estoque FROM tb_Lotes_Estoque WHERE lot_id_produto = ?",
			[produtoId],
		);
		return rows.length ? Number(rows[0].estoque || 0) : 0;
	}

	async ajustarEstoqueManual(produtoId, quantidade) {
		if (!produtoId) throw new Error("Produto inválido");
		const rows = await this.#db.ExecutaComando(
			"SELECT lot_id, lot_quantidade_atual FROM tb_Lotes_Estoque WHERE lot_id_produto = ? AND lot_numero_lote = 'AJUSTE-MANUAL' LIMIT 1",
			[produtoId],
		);

		if (rows.length) {
			const atual = Number(rows[0].lot_quantidade_atual || 0);
			const novoTotal = Math.max(atual + quantidade, 0);
			await this.#db.ExecutaComandoNonQuery(
				"UPDATE tb_Lotes_Estoque SET lot_quantidade_atual = ?, updated_at = CURRENT_TIMESTAMP WHERE lot_id = ?",
				[novoTotal, rows[0].lot_id],
			);
			return novoTotal;
		}

		const quantidadeInicial = Math.max(Number(quantidade) || 0, 0);
		await this.#db.ExecutaComandoLastInserted(
			"INSERT INTO tb_Lotes_Estoque (lot_id_produto, lot_numero_lote, lot_quantidade_atual, lot_data_validade) VALUES (?, 'AJUSTE-MANUAL', ?, '2099-12-31')",
			[produtoId, quantidadeInicial],
		);
		return quantidadeInicial;
	}

	async criarLoteInicial({ produtoId, quantidade = 0, numeroLote = null, dataValidade = null, fornecedorId = null }) {
		const produtoIdNumero = Number(produtoId);
		const quantidadeNumero = Number(quantidade || 0);
		if (!produtoIdNumero || quantidadeNumero <= 0) return null;

		const sql = `
			INSERT INTO tb_Lotes_Estoque
				(lot_id_produto, lot_numero_lote, lot_quantidade_atual, lot_data_validade, lot_id_fornecedor)
			VALUES (?, ?, ?, ?, ?);
		`;

		return this.#db.ExecutaComandoLastInserted(sql, [
			produtoIdNumero,
			numeroLote || `LOTE-${produtoIdNumero}`,
			quantidadeNumero,
			dataValidade || "2099-12-31",
			fornecedorId || null,
		]);
	}
}

module.exports = LotesEstoqueModels;
