const Database = require('../db/database');
const conexao = new Database();

class PagamentoModel {

    #pagamentoId;
    #pedidoId;
    #metodo;
    #valor;
    #status;
    #codigoPix;
    #dataPagamento;

    get pagamentoId() { return this.#pagamentoId; } set pagamentoId(id) { this.#pagamentoId = id; }
    get pedidoId() { return this.#pedidoId; } set pedidoId(id) { this.#pedidoId = id; }
    get metodo() { return this.#metodo; } set metodo(metodo) { this.#metodo = metodo; }
    get valor() { return this.#valor; } set valor(valor) { this.#valor = valor; }
    get status() { return this.#status; } set status(status) { this.#status = status; }
    get codigoPix() { return this.#codigoPix; } set codigoPix(pix) { this.#codigoPix = pix; }
    get dataPagamento() { return this.#dataPagamento; } set dataPagamento(data) { this.#dataPagamento = data; }

    constructor(pagamentoId, pedidoId, metodo, valor, status, codigoPix, dataPagamento) {
        this.#pagamentoId = pagamentoId;
        this.#pedidoId = pedidoId;
        this.#metodo = metodo;
        this.#valor = valor;
        this.#status = status;
        this.#codigoPix = codigoPix;
        this.#dataPagamento = dataPagamento;
    }

    async gravar() {
        if (this.#pagamentoId == 0) {

            let sql = "INSERT INTO tb_pagamento (ped_id, pag_metodo, pag_valor, pag_status, pag_codigo_pix, pag_data) VALUES (?, ?, ?, ?, ?, NOW())";
            let valores = [this.#pedidoId, this.#metodo, this.#valor, this.#status, this.#codigoPix];
            
            return await conexao.ExecutaComandoNonQuery(sql, valores);
        } else {

            let sql = "UPDATE tb_pagamento SET pag_status = ? WHERE pag_id = ?";
            let valores = [this.#status, this.#pagamentoId];
            
            return await conexao.ExecutaComandoNonQuery(sql, valores) > 0;
        }
    }

    async buscarPorId(id) {
        let sql = 'SELECT * FROM tb_pagamento WHERE pag_id = ?';
        let valores = [id];
        var rows = await conexao.ExecutaComando(sql, valores);

        let pagamento = null;
        if (rows.length > 0) {
            var row = rows[0];
            pagamento = new PagamentoModel(
                row['pag_id'], row['ped_id'], row['pag_metodo'], 
                row['pag_valor'], row['pag_status'], row['pag_codigo_pix'], row['pag_data']
            );
        }
        return pagamento;
    }

    async listarPagamentos() {
        let sql = 'SELECT * FROM tb_pagamento ORDER BY pag_id DESC';
        var rows = await conexao.ExecutaComando(sql);
        let listaRetorno = [];

        for (let row of rows) {
            listaRetorno.push(new PagamentoModel(
                row['pag_id'], row['ped_id'], row['pag_metodo'], 
                row['pag_valor'], row['pag_status'], row['pag_codigo_pix'], row['pag_data']
            ));
        }
        return listaRetorno;
    }

    toJSON() {
        return {
            id: this.#pagamentoId,
            pedidoId: this.#pedidoId,
            metodo: this.#metodo,
            valor: this.#valor,
            status: this.#status
        };
    }
}

module.exports = PagamentoModel;