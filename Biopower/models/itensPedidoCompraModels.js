const database = require("../infra/database");

const banco = new database();

class itensPedidoCompraModels {
  #produtoId;
  #pedidoId;
  #pedidoItemQuantidade;
  #pedidoItemValor;
  #pedidoItemDataValidade;
  #pedidoItemValorTotal;

  get produtoId() {
    return this.#produtoId;
  }
  set produtoId(value) {
    this.#produtoId = value;
  }

  get pedidoId() {
    return this.#pedidoId;
  }
  set pedidoId(value) {
    this.#pedidoId = value;
  }

  get pedidoItemQuantidade() {
    return this.#pedidoItemQuantidade;
  }
  set pedidoItemQuantidade(value) {
    this.#pedidoItemQuantidade = value;
  }

  get pedidoItemValor() {
    return this.#pedidoItemValor;
  }
  set pedidoItemValor(value) {
    this.#pedidoItemValor = value;
  }

  get pedidoItemDataValidade() {
    return this.#pedidoItemDataValidade;
  }
  set pedidoItemDataValidade(value) {
    this.#pedidoItemDataValidade = value;
  }

  get pedidoItemValorTotal() {
    return this.#pedidoItemValorTotal;
  }
  set pedidoItemValorTotal(value) {
    this.#pedidoItemValorTotal = value;
  }

  constructor(
    produtoId,
    pedidoId,
    pedidoItemQuantidade,
    pedidoItemValor,
    pedidoItemDataValidade,
    pedidoItemValorTotal,
  ) {
    this.#produtoId = produtoId;
    this.#pedidoId = pedidoId;
    this.#pedidoItemQuantidade = pedidoItemQuantidade;
    this.#pedidoItemValor = pedidoItemValor;
    this.#pedidoItemDataValidade = pedidoItemDataValidade;
    this.#pedidoItemValorTotal = pedidoItemValorTotal;
  }

  async atualizar() {
    let sql = `
        UPDATE produto
        SET produtoQuantidade = ?
        WHERE produtoId = ?
    `;

    return await banco.ExecutaComandoNonQuery(sql, [
      this.produtoQuantidade,
      this.produtoId,
    ]);
  }
}
