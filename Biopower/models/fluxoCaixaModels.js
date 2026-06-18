const Database = require("../utils/database");
const banco = new Database();

class FluxoCaixaModels {
  #db;
  #fluId;
  #fluTipoId;
  #fluValor;
  #fluDataMovimentacao;
  #fluDescricao;
  #fluIdCaixa;
  get fluId() {
    return this.#fluId;
  }

  set fluId(value) {
    this.#fluId = value;
  }

  get fluTipoId() {
    return this.#fluTipoId;
  }

  set fluTipoId(value) {
    this.#fluTipoId = value;
  }

  get fluValor() {
    return this.#fluValor;
  }

  set fluValor(value) {
    this.#fluValor = value;
  }

  get fluDataMovimentacao() {
    return this.#fluDataMovimentacao;
  }

  set fluDataMovimentacao(value) {
    this.#fluDataMovimentacao = value;
  }

  get fluDescricao() {
    return this.#fluDescricao;
  }

  set fluDescricao(value) {
    this.#fluDescricao = value;
  }

  get fluIdCaixa() {
    return this.#fluIdCaixa;
  }

  set fluIdCaixa(value) {
    this.#fluIdCaixa = value;
  }


  constructor(
    fluId = null,
    fluTipoId = null,
    fluValor = null,
    fluDataMovimentacao = null,
    fluDescricao = null,
    fluIdCaixa = null
  ) {
    this.#db = banco;
    this.#fluId = fluId;
    this.#fluTipoId = fluTipoId;
    this.#fluValor = fluValor;
    this.#fluDataMovimentacao = fluDataMovimentacao;
    this.#fluDescricao = fluDescricao;
    this.#fluIdCaixa = fluIdCaixa;
  }

  get db() {
    return this.#db;
  }

  async criar({ tipoId, valor, dataMovimentacao = null, descricao = null, caixaId = null }) {
    if (!tipoId || valor === undefined || valor === null) return null;

    const sql = `
      INSERT INTO tb_Fluxo_Caixa
        (flu_tipo_id, flu_valor, flu_data_movimentacao, flu_descricao, flu_id_caixa)
      VALUES (?, ?, ?, ?, ?);
    `;

    return this.#db.ExecutaComandoLastInserted(sql, [
      Number(tipoId),
      Number(valor),
      dataMovimentacao || new Date().toISOString().slice(0, 10),
      descricao || null,
      caixaId || null,
    ]);
  }

  async vincularVenda({ fluxoId, vendaId }) {
    if (!fluxoId || !vendaId) return null;

    const sql = `
      INSERT INTO tb_Fluxo_Caixa_Venda
        (fcv_id_fluxo, fcv_id_venda)
      VALUES (?, ?);
    `;

    return this.#db.ExecutaComandoLastInserted(sql, [Number(fluxoId), Number(vendaId)]);
  }

  async vincularCompra({ fluxoId, compraId }) {
    if (!fluxoId || !compraId) return null;

    const sql = `
      INSERT INTO tb_Fluxo_Caixa_Compra
        (fcc_id_fluxo, fcc_id_compra)
      VALUES (?, ?);
    `;

    return this.#db.ExecutaComandoLastInserted(sql, [Number(fluxoId), Number(compraId)]);
  }

  async registrarReceitaVenda({ vendaId, valor, descricao = null, dataMovimentacao = null, caixaId = null }) {
    const fluxoId = await this.criar({
      tipoId: 8,
      valor,
      dataMovimentacao,
      descricao: descricao || `Receita da venda #${vendaId}`,
      caixaId,
    });

    if (!fluxoId) return null;
    await this.vincularVenda({ fluxoId, vendaId });
    return fluxoId;
  }

  async registrarDespesaCompra({ compraId, valor, descricao = null, dataMovimentacao = null, caixaId = null }) {
    const fluxoId = await this.criar({
      tipoId: 9,
      valor,
      dataMovimentacao,
      descricao: descricao || `Despesa da compra #${compraId}`,
      caixaId,
    });

    if (!fluxoId) return null;
    await this.vincularCompra({ fluxoId, compraId });
    return fluxoId;
  }
}

module.exports = FluxoCaixaModels;
