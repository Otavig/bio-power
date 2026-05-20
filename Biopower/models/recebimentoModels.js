const Database = require("../utils/database");

const banco = new Database();

class RecebimentoModels {

    #db;

    constructor(){
        this.#db = banco;
    }

    async registrarRecebimento(){

        const sql = `INSERT INTO tb_Lotes_Estoque(lot_id_produto, lot_qtd, lot_data_validade, lot_num_lote) VALUES(?, ?, ?, ?)`;

        return await this.#db.ExecutaComando(sql, [
            produtoId,
            quantidade,
            dataValidade,
            numeroLote
        ]);
    }

}

module.exports = RecebimentoModels;