const database = require("../utils/database");

const banco = new database();

class pedidoCompraModels {

    #pedidoId;
    #fornecedorId;
    #responsavelId;
    #prazoEntrega;
    #statusId;

    get pedidoId() {
        return this.#pedidoId;
    }
    set pedidoId(value) {
        this.#pedidoId = value;
    }

    get fornecedorId() {
        return this.#fornecedorId;
    }
    set fornecedorId(value) {
        this.#fornecedorId = value;
    }

    get responsavelId() {
        return this.#responsavelId;
    }
    set responsavelId(value) {
        this.#responsavelId = value;
    }

    get prazoEntrega() {
        return this.#prazoEntrega;
    }
    set prazoEntrega(value) {
        this.#prazoEntrega = value;
    }

    get statusId() {
        return this.#statusId;
    }
    set statusId(value) {
        this.#statusId = value;
    }

    constructor(
    pedidoId,
    fornecedorId,
    responsavelId,
    prazoEntrega,
    statusId
){
    this.#pedidoId = pedidoId;
    this.#fornecedorId = fornecedorId;
    this.#responsavelId = responsavelId;
    this.#prazoEntrega = prazoEntrega;
    this.#statusId = statusId;
}

    async gravar() {

        let sql = `
            INSERT INTO tb_Pedidos_Compra
            (
                ped_id_fornecedor,
                ped_id_responsavel,
            )
            VALUES (?, ?)
        `;

        let result = await banco.ExecutaComandoNonQuery(
            sql,
            [
                this.#fornecedorId,
                this.#responsavelId,
            ]
        );

        return result.insertId;
    }
}

module.exports = pedidoCompraModels;