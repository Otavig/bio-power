const Database = require("../utils/database");
const banco = new Database();

class EntregaModels {
  #db;
  #entId;
  #entIdVenda;
  #entEndereco;
  #entStatus;
  #entDataEntrega;
  get entId() {
    return this.#entId;
  }

  set entId(value) {
    this.#entId = value;
  }

  get entIdVenda() {
    return this.#entIdVenda;
  }

  set entIdVenda(value) {
    this.#entIdVenda = value;
  }

  get entEndereco() {
    return this.#entEndereco;
  }

  set entEndereco(value) {
    this.#entEndereco = value;
  }

  get entStatus() {
    return this.#entStatus;
  }

  set entStatus(value) {
    this.#entStatus = value;
  }

  get entDataEntrega() {
    return this.#entDataEntrega;
  }

  set entDataEntrega(value) {
    this.#entDataEntrega = value;
  }


  constructor(
    entId = null,
    entIdVenda = null,
    entEndereco = null,
    entStatus = null,
    entDataEntrega = null
  ) {
    this.#db = banco;
    this.#entId = entId;
    this.#entIdVenda = entIdVenda;
    this.#entEndereco = entEndereco;
    this.#entStatus = entStatus;
    this.#entDataEntrega = entDataEntrega;
  }

  get db() {
    return this.#db;
  }

  async criar({
    vendaId,
    cep,
    endereco,
    numero = null,
    complemento = null,
    bairro,
    cidade,
    uf,
    status = "pendente",
    dataEntrega = null
  }) {
    const sql = `
      INSERT INTO tb_Entrega
        (ent_id_venda, ent_cep, ent_endereco, ent_numero, ent_complemento, ent_bairro, ent_cidade, ent_uf, ent_status, ent_data_entrega)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
      vendaId,
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
      status,
      dataEntrega
    ];

    return this.#db.ExecutaComandoLastInserted(sql, valores);
  }
}

module.exports = EntregaModels;
