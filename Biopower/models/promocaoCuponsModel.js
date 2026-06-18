const Database = require("../utils/database");

class PromocaoCuponsModel {
    #pro_id;
    #pro_nome;
    #pro_descricao;
    #pro_data_inicio;
    #pro_data_fim;
    #pro_percentual;
    #pro_status;
    #db = new Database();

    constructor(pro_id, pro_nome, pro_descricao, pro_data_inicio, pro_data_fim, pro_percentual, pro_status) {
        this.#pro_id = pro_id;
        this.#pro_nome = pro_nome;
        this.#pro_descricao = pro_descricao;
        this.#pro_data_inicio = pro_data_inicio;
        this.#pro_data_fim = pro_data_fim;
        this.#pro_percentual = pro_percentual;
        this.#pro_status = pro_status;
    }

    async buscarCupons() {
        const sql = "SELECT * FROM tb_Promocoes;";
        const linhas = await this.#db.ExecutaComando(sql, []);

        return linhas.map(linha => ({
            pro_id: linha["pro_id"],
            pro_nome: linha["pro_nome"],
            pro_descricao: linha["pro_descricao"],
            pro_data_inicio: linha["pro_data_inicio"],
            pro_data_fim: linha["pro_data_fim"],
            pro_percentual: linha["pro_percentual"],
            pro_status: linha["pro_status"] // Retorna o status para o front se precisar
        }));
    }

    async excluirCupom() {
        const sql = "UPDATE tb_Promocoes SET pro_status = 0 WHERE pro_id = ?;";
        
        await this.#db.ExecutaComandoNonQuery(sql, [this.#pro_id]);
        return true;
    }

    async criarCupons() {
        const sqlCheck = "SELECT COUNT(*) AS total FROM tb_Promocoes WHERE pro_nome = ? AND pro_status = 1;";
        const resultadoCheck = await this.#db.ExecutaComando(sqlCheck, [this.#pro_nome]);
        
        if (resultadoCheck && resultadoCheck[0] && resultadoCheck[0].total > 0) {
            throw new Error("Já existe um cupom ativo com este código!");
        }

        const sqlInsert = `
        INSERT INTO tb_Promocoes (
            pro_nome, pro_descricao, pro_data_inicio, pro_data_fim, pro_percentual, pro_status
        ) VALUES (?, ?, ?, ?, ?, 1)
        `;

        const valores = [
            this.#pro_nome,
            this.#pro_descricao,
            this.#pro_data_inicio,
            this.#pro_data_fim,
            this.#pro_percentual,
        ];

        await this.#db.ExecutaComandoNonQuery(sqlInsert, valores);
        return true;
    }

    async atualizarCupom() {
        const sqlCheck = `
            SELECT COUNT(*) AS total 
            FROM tb_Promocoes 
            WHERE pro_nome = ? AND pro_status = 1 AND pro_id != ?;
        `;
        const resultadoCheck = await this.#db.ExecutaComando(sqlCheck, [this.#pro_nome, this.#pro_id]);

        if (resultadoCheck && resultadoCheck[0] && resultadoCheck[0].total > 0) {
            throw new Error("Não é possível atualizar ou reativar. Já existe outro cupom ativo com este código!");
        }

        const sql = `
            UPDATE tb_Promocoes 
            SET pro_nome = ?, pro_descricao = ?, pro_data_inicio = ?, pro_data_fim = ?, pro_percentual = ?, pro_status = ?
            WHERE pro_id = ?;
        `;
        const valores = [
            this.#pro_nome,
            this.#pro_descricao,
            this.#pro_data_inicio,
            this.#pro_data_fim,
            this.#pro_percentual,
            this.#pro_status ?? 1, 
            this.#pro_id
        ];

        await this.#db.ExecutaComandoNonQuery(sql, valores);
        return true;
    }

    // GETTERS E SETTERS
    get pro_id() { return this.#pro_id; }
    set pro_id(value) { this.#pro_id = value; }

    get pro_nome() { return this.#pro_nome; }
    set pro_nome(value) { this.#pro_nome = value; }

    get pro_descricao() { return this.#pro_descricao; }
    set pro_descricao(value) { this.#pro_descricao = value; }

    get pro_data_inicio() { return this.#pro_data_inicio; }
    set pro_data_inicio(value) { this.#pro_data_inicio = value; }

    get pro_data_fim() { return this.#pro_data_fim; }
    set pro_data_fim(value) { this.#pro_data_fim = value; }

    get pro_percentual() { return this.#pro_percentual; }
    set pro_percentual(value) { this.#pro_percentual = value; }

    get pro_status() { return this.#pro_status; }
    set pro_status(value) { this.#pro_status = value; }

    toJSON() {
        return {
            pro_id: this.#pro_id,
            pro_nome: this.#pro_nome,
            pro_descricao: this.#pro_descricao,
            pro_data_inicio: this.#pro_data_inicio,
            pro_data_fim: this.#pro_data_fim,
            pro_percentual: this.#pro_percentual,
            pro_status: this.#pro_status
        };
    }
}

module.exports = PromocaoCuponsModel;