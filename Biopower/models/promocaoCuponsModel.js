const Database = require("../utils/database");

class PromocaoCuponsModel {
    #pro_id;
    #pro_nome;
    #pro_descricao;
    #pro_data_inicio;
    #pro_data_fim;
    #pro_percentual;
    #pro_status;
    #pro_automatico;
    #pro_dias_vencimento;
    #db = new Database();

    constructor(pro_id, pro_nome, pro_descricao, pro_data_inicio, pro_data_fim, pro_percentual, pro_status, pro_automatico = 0, pro_dias_vencimento = null) {
        this.#pro_id = pro_id;
        this.#pro_nome = pro_nome;
        this.#pro_descricao = pro_descricao;
        this.#pro_data_inicio = pro_data_inicio;
        this.#pro_data_fim = pro_data_fim;
        this.#pro_percentual = pro_percentual;
        this.#pro_status = pro_status;
        this.#pro_automatico = Number(pro_automatico || 0);
        this.#pro_dias_vencimento = pro_dias_vencimento !== null && pro_dias_vencimento !== undefined
            ? Number(pro_dias_vencimento)
            : null;
    }

    async garantirColunasAutomaticas() {
        const colunas = await this.#db.ExecutaComando("SHOW COLUMNS FROM tb_Promocoes;", []);
        const nomes = new Set(colunas.map(coluna => coluna.Field));

        if (!nomes.has("pro_automatico")) {
            await this.#db.ExecutaComandoNonQuery(
                "ALTER TABLE tb_Promocoes ADD COLUMN pro_automatico TINYINT(1) NOT NULL DEFAULT 0 AFTER pro_status;",
                []
            );
        }

        if (!nomes.has("pro_dias_vencimento")) {
            await this.#db.ExecutaComandoNonQuery(
                "ALTER TABLE tb_Promocoes ADD COLUMN pro_dias_vencimento INT NULL AFTER pro_automatico;",
                []
            );
        }
    }

    #normalizarDiasAutomatico() {
        if (!this.#pro_automatico) return null;
        const diasPermitidos = [30, 60, 90];
        const dias = Number(this.#pro_dias_vencimento);
        if (!diasPermitidos.includes(dias)) {
            throw new Error("Selecione um prazo automático válido: 30, 60 ou 90 dias.");
        }
        return dias;
    }

    async aplicarAutomatico() {
        const dias = this.#normalizarDiasAutomatico();
        if (!dias) return 0;

        const percentual = Number(String(this.#pro_percentual || 0).replace(",", "."));
        if (!percentual || percentual <= 0) {
            throw new Error("Informe um percentual maior que zero para aplicar o desconto automático.");
        }

        const resultado = await this.#db.ExecutaComandoNonQuery(
            `
            UPDATE tb_Produtos
            SET pro_porcentagem_promocao = ?
            WHERE pro_id IN (
                SELECT produto_id FROM (
                    SELECT DISTINCT lot_id_produto AS produto_id
                    FROM tb_Lotes_Estoque
                    WHERE lot_quantidade_atual > 0
                      AND lot_data_validade BETWEEN CURRENT_DATE() AND DATE_ADD(CURRENT_DATE(), INTERVAL ? DAY)
                ) produtos_promocao
            )
              AND COALESCE(pro_porcentagem_promocao, 0) = 0;
            `,
            [percentual, dias]
        );

        return resultado;
    }

    async buscarCupons() {
        await this.garantirColunasAutomaticas();
        const sql = "SELECT * FROM tb_Promocoes;";
        const linhas = await this.#db.ExecutaComando(sql, []);

        return linhas.map(linha => ({
            pro_id: linha["pro_id"],
            pro_nome: linha["pro_nome"],
            pro_descricao: linha["pro_descricao"],
            pro_data_inicio: linha["pro_data_inicio"],
            pro_data_fim: linha["pro_data_fim"],
            pro_percentual: linha["pro_percentual"],
            pro_status: linha["pro_status"], // Retorna o status para o front se precisar
            pro_automatico: Number(linha["pro_automatico"] || 0),
            pro_dias_vencimento: linha["pro_dias_vencimento"]
        }));
    }

    async buscarCupomAtivoPorCodigo(codigo) {
        await this.garantirColunasAutomaticas();
        const codigoNormalizado = String(codigo || "").trim();
        if (!codigoNormalizado) return null;

        const sql = `
            SELECT *
            FROM tb_Promocoes
            WHERE LOWER(pro_nome) = LOWER(?)
              AND pro_status = 1
              AND CURRENT_DATE() BETWEEN pro_data_inicio AND pro_data_fim
            LIMIT 1;
        `;
        const linhas = await this.#db.ExecutaComando(sql, [codigoNormalizado]);
        const linha = Array.isArray(linhas) ? linhas[0] : null;
        if (!linha) return null;

        return {
            pro_id: linha["pro_id"],
            pro_nome: linha["pro_nome"],
            pro_descricao: linha["pro_descricao"],
            pro_data_inicio: linha["pro_data_inicio"],
            pro_data_fim: linha["pro_data_fim"],
            pro_percentual: Number(linha["pro_percentual"] || 0),
            pro_status: linha["pro_status"],
            pro_automatico: Number(linha["pro_automatico"] || 0),
            pro_dias_vencimento: linha["pro_dias_vencimento"]
        };
    }

    async excluirCupom() {
        await this.garantirColunasAutomaticas();
        const sql = "UPDATE tb_Promocoes SET pro_status = 0 WHERE pro_id = ?;";
        
        await this.#db.ExecutaComandoNonQuery(sql, [this.#pro_id]);
        return true;
    }

    async criarCupons() {
        await this.garantirColunasAutomaticas();
        const diasAutomatico = this.#normalizarDiasAutomatico();
        const sqlCheck = "SELECT COUNT(*) AS total FROM tb_Promocoes WHERE pro_nome = ? AND pro_status = 1;";
        const resultadoCheck = await this.#db.ExecutaComando(sqlCheck, [this.#pro_nome]);
        
        if (resultadoCheck && resultadoCheck[0] && resultadoCheck[0].total > 0) {
            throw new Error("Já existe um cupom ativo com este código!");
        }

        const sqlInsert = `
        INSERT INTO tb_Promocoes (
            pro_nome, pro_descricao, pro_data_inicio, pro_data_fim, pro_percentual, pro_status, pro_automatico, pro_dias_vencimento
        ) VALUES (?, ?, ?, ?, ?, 1, ?, ?)
        `;

        const valores = [
            this.#pro_nome,
            this.#pro_descricao,
            this.#pro_data_inicio,
            this.#pro_data_fim,
            this.#pro_percentual,
            this.#pro_automatico ? 1 : 0,
            diasAutomatico,
        ];

        await this.#db.ExecutaComandoNonQuery(sqlInsert, valores);
        await this.aplicarAutomatico();
        return true;
    }

    async atualizarCupom() {
        await this.garantirColunasAutomaticas();
        const diasAutomatico = this.#normalizarDiasAutomatico();
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
            SET pro_nome = ?, pro_descricao = ?, pro_data_inicio = ?, pro_data_fim = ?, pro_percentual = ?, pro_status = ?, pro_automatico = ?, pro_dias_vencimento = ?
            WHERE pro_id = ?;
        `;
        const valores = [
            this.#pro_nome,
            this.#pro_descricao,
            this.#pro_data_inicio,
            this.#pro_data_fim,
            this.#pro_percentual,
            this.#pro_status ?? 1, 
            this.#pro_automatico ? 1 : 0,
            diasAutomatico,
            this.#pro_id
        ];

        await this.#db.ExecutaComandoNonQuery(sql, valores);
        if (Number(this.#pro_status ?? 1) !== 0) {
            await this.aplicarAutomatico();
        }
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

    get pro_automatico() { return this.#pro_automatico; }
    set pro_automatico(value) { this.#pro_automatico = Number(value || 0); }

    get pro_dias_vencimento() { return this.#pro_dias_vencimento; }
    set pro_dias_vencimento(value) { this.#pro_dias_vencimento = value !== null && value !== undefined ? Number(value) : null; }

    toJSON() {
        return {
            pro_id: this.#pro_id,
            pro_nome: this.#pro_nome,
            pro_descricao: this.#pro_descricao,
            pro_data_inicio: this.#pro_data_inicio,
            pro_data_fim: this.#pro_data_fim,
            pro_percentual: this.#pro_percentual,
            pro_status: this.#pro_status,
            pro_automatico: this.#pro_automatico,
            pro_dias_vencimento: this.#pro_dias_vencimento
        };
    }
}

module.exports = PromocaoCuponsModel;
