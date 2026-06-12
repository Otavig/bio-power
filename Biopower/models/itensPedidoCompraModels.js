const database = require("../utils/database");

const banco = new database();

class itensPedidoCompraModels {

    #pedidoId;
    #produtoId;
    #quantidade;
    #precoUnitario;

    get pedidoId() {
        return this.#pedidoId;
    }
    set pedidoId(value) {
        this.#pedidoId = value;
    }

    get produtoId() {
        return this.#produtoId;
    }
    set produtoId(value) {
        this.#produtoId = value;
    }

    get quantidade() {
        return this.#quantidade;
    }
    set quantidade(value) {
        this.#quantidade = value;
    }

    get precoUnitario() {
        return this.#precoUnitario;
    }
    set precoUnitario(value) {
        this.#precoUnitario = value;
    }

    constructor(
        pedidoId,
        produtoId,
        quantidade,
        precoUnitario
    ) {
        this.#pedidoId = pedidoId;
        this.#produtoId = produtoId;
        this.#quantidade = quantidade;
        this.#precoUnitario = precoUnitario;
    }

    async gravar() {

        let sql = `
            INSERT INTO tb_Itens_Pedido_Compra
            (
                ipc_id_pedido,
                ipc_id_produto,
                ipc_quantidade,
                ipc_preco_unitario
            )
            VALUES (?, ?, ?, ?)
        `;

        return await banco.ExecutaComandoNonQuery(
            sql,
            [
                this.#pedidoId,
                this.#produtoId,
                this.#quantidade,
                this.#precoUnitario
            ]
        );
    }
}

module.exports = itensPedidoCompraModels;