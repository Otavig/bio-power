const Database = require("../utils/database");
const banco = new Database();

class ClientesModels {
  async garantirTabela() {
    const sql = `
      CREATE TABLE IF NOT EXISTS tb_Cliente (
        cli_id INT AUTO_INCREMENT PRIMARY KEY,
        cli_usu_id INT NOT NULL UNIQUE,
        cli_sobrenome VARCHAR(120) NOT NULL,
        cli_genero VARCHAR(30) NOT NULL,
        cli_telefone VARCHAR(20) NOT NULL,
        cli_data_nascimento DATE NOT NULL,
        cli_estado_civil VARCHAR(30) NOT NULL,
        cli_cep VARCHAR(8) NOT NULL,
        cli_cidade VARCHAR(120) NOT NULL,
        cli_estado CHAR(2) NOT NULL,
        cli_bairro VARCHAR(120) NOT NULL,
        cli_rua VARCHAR(180) NOT NULL,
        cli_numero VARCHAR(20) NOT NULL,
        cli_complemento VARCHAR(120) NULL,
        cli_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        cli_updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_cliente_usuario
          FOREIGN KEY (cli_usu_id) REFERENCES tb_Usuarios (usu_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )
    `;

    await banco.ExecutaComando(sql, []);
  }

  async criar({
    usuarioId,
    sobrenome,
    genero,
    telefone,
    dataNascimento,
    estadoCivil,
    cep,
    cidade,
    estado,
    bairro,
    rua,
    numero,
    complemento = null,
  }) {
    await this.garantirTabela();

    const sql = `
      INSERT INTO tb_Cliente (
        cli_usu_id,
        cli_sobrenome,
        cli_genero,
        cli_telefone,
        cli_data_nascimento,
        cli_estado_civil,
        cli_cep,
        cli_cidade,
        cli_estado,
        cli_bairro,
        cli_rua,
        cli_numero,
        cli_complemento
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return banco.ExecutaComandoLastInserted(sql, [
      usuarioId,
      sobrenome,
      genero,
      telefone,
      dataNascimento,
      estadoCivil,
      cep,
      cidade,
      estado,
      bairro,
      rua,
      numero,
      complemento || null,
    ]);
  }
}

module.exports = ClientesModels;
