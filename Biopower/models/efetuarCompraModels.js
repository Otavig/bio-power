const Database = require("../utils/database");

const banco = new Database();

class efetuarCompraModels {

    #produtoId;
    #quantidade;
    #dataValidade;
    #numeroLote;

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

    get dataValidade() {
        return this.#dataValidade;
    }
    set dataValidade(value) {
        this.#dataValidade = value;
    }

    get numeroLote() {
        return this.#numeroLote;
    }
    set numeroLote(value) {
        this.#numeroLote = value;
    }

    constructor(produtoId, quantidade, dataValidade, numeroLote){
        this.#produtoId = produtoId;
        this.#quantidade = quantidade;
        this.#dataValidade = dataValidade;
        this.#numeroLote = numeroLote;
    }

    async registrarCompra(){

        let sql = `INSERT INTO tb_Lotes_Estoque(lot_id_produto, lot_qtd, lot_data_validade, lot_num_lote) VALUES(?, ?, ?, ?)`;

        let valores = [this.#produtoId, this.#quantidade, this.#dataValidade, this.#numeroLote];    

        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

}

module.exports = efetuarCompraModels;