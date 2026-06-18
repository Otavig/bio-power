const Database = require("../utils/database");

const banco = new Database();

class ProdutosModels {
  #proId;
  #proNome;
  #proDescricao;
  #proImagem;
  #proPrecoVenda;
  #proPorcentagemPromocao;
  #proIdCategoria;
  #proIdLaboratorio;
  #createdAt;
  #updatedAt;
  #db;
  get proId() {
    return this.#proId;
  }

  set proId(value) {
    this.#proId = value;
  }

  get proNome() {
    return this.#proNome;
  }

  set proNome(value) {
    this.#proNome = value;
  }

  get proDescricao() {
    return this.#proDescricao;
  }

  set proDescricao(value) {
    this.#proDescricao = value;
  }

  get proImagem() {
    return this.#proImagem;
  }

  set proImagem(value) {
    this.#proImagem = value;
  }

  get proPrecoVenda() {
    return this.#proPrecoVenda;
  }

  set proPrecoVenda(value) {
    this.#proPrecoVenda = value;
  }

  get proPorcentagemPromocao() {
    return this.#proPorcentagemPromocao;
  }

  set proPorcentagemPromocao(value) {
    this.#proPorcentagemPromocao = value;
  }

  get proIdCategoria() {
    return this.#proIdCategoria;
  }

  set proIdCategoria(value) {
    this.#proIdCategoria = value;
  }

  get proIdLaboratorio() {
    return this.#proIdLaboratorio;
  }

  set proIdLaboratorio(value) {
    this.#proIdLaboratorio = value;
  }

  get createdAt() {
    return this.#createdAt;
  }

  set createdAt(value) {
    this.#createdAt = value;
  }

  get updatedAt() {
    return this.#updatedAt;
  }

  set updatedAt(value) {
    this.#updatedAt = value;
  }

  constructor() {
    this.#db = banco;
  }

  static #formatCurrency(valor) {
    const numero = Number(valor || 0);
    return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  static parseCurrencyToNumber(valor) {
    if (valor === undefined || valor === null) return 0;
    const normalizado = String(valor).replace(/[^\d,-]/g, "").replace(",", ".");
    const numero = parseFloat(normalizado);
    return Number.isNaN(numero) ? 0 : numero;
  }

  static #imageMimeFromBuffer(buffer) {
    if (!buffer || buffer.length < 4) return "image/jpeg";
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return "image/png";
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return "image/gif";
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) return "image/webp";
    return "image/jpeg";
  }

  static #imageDataUrl(buffer) {
    if (!buffer) return "/assets/imgs/product/default.png";
    const imageBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
    const mime = ProdutosModels.#imageMimeFromBuffer(imageBuffer);
    return `data:${mime};base64,${imageBuffer.toString("base64")}`;
  }

  async listarParaInterface() {
    const sql = `
      SELECT
        p.pro_id AS id,
        p.pro_nome AS nome,
        p.pro_descricao AS descricao,
        p.pro_imagem AS imagem,
        p.pro_preco_venda AS preco,
        p.pro_porcentagem_promocao AS desconto,
        p.pro_id_categoria AS categoriaId,
        p.pro_id_laboratorio AS laboratorioId,
        c.cat_nome AS categoria,
        l.lab_nome AS marca,
        COALESCE(le.estoque, 0) AS estoque
      FROM tb_Produtos p
      LEFT JOIN tb_Categorias c ON c.cat_id = p.pro_id_categoria
      LEFT JOIN tb_Laboratorios l ON l.lab_id = p.pro_id_laboratorio
      LEFT JOIN (
        SELECT lot_id_produto, SUM(lot_quantidade_atual) AS estoque
        FROM tb_Lotes_Estoque
        GROUP BY lot_id_produto
      ) le ON le.lot_id_produto = p.pro_id
      ORDER BY p.pro_nome;
    `;

    const rows = await this.#db.ExecutaComando(sql, []);

    return rows.map((row, index) => this.#mapRowToView(row, index));
  }

  #mapRowToView(row, index = 0) {
    const precoNumber = Number(row.preco || 0);
    const descontoNumero = Number(row.desconto || 0);
    const temDesconto = descontoNumero > 0;

    return {
      id: row.id,
      index,
      nome: row.nome,
      descricao: row.descricao,
      preco: ProdutosModels.#formatCurrency(precoNumber),
      precoNumber,
      categoria: row.categoria || "Sem categoria",
      categoriaId: row.categoriaId,
      marca: row.marca || "Sem marca",
      laboratorioId: row.laboratorioId,
      sabor: row.descricao || "Sem sabor",
      desconto: temDesconto ? `${descontoNumero}%` : "",
      descontoNumber: descontoNumero,
      credito: "",
      imagem: ProdutosModels.#imageDataUrl(row.imagem),
      alt: row.nome,
      estoque: Number(row.estoque || 0),
      estoqueMin: 10,
    };
  }

  async buscarPorId(id) {
    if (!id) return null;
    const sql = `
      SELECT
        p.pro_id AS id,
        p.pro_nome AS nome,
        p.pro_descricao AS descricao,
        p.pro_imagem AS imagem,
        p.pro_preco_venda AS preco,
        p.pro_porcentagem_promocao AS desconto,
        p.pro_id_categoria AS categoriaId,
        p.pro_id_laboratorio AS laboratorioId,
        c.cat_nome AS categoria,
        l.lab_nome AS marca
      FROM tb_Produtos p
      LEFT JOIN tb_Categorias c ON c.cat_id = p.pro_id_categoria
      LEFT JOIN tb_Laboratorios l ON l.lab_id = p.pro_id_laboratorio
      WHERE p.pro_id = ?
      LIMIT 1;
    `;

    const rows = await this.#db.ExecutaComando(sql, [id]);
    if (!rows.length) return null;
    return this.#mapRowToView(rows[0], 0);
  }

  async #buscarCategoriaIdPorNome(nome) {
    if (!nome) return null;
    const rows = await this.#db.ExecutaComando(
      "SELECT cat_id AS id FROM tb_Categorias WHERE cat_nome = ? LIMIT 1",
      [nome],
    );
    if (rows.length) return rows[0].id;
    const novoId = await this.#db.ExecutaComandoLastInserted(
      "INSERT INTO tb_Categorias (cat_nome) VALUES (?)",
      [nome],
    );
    return novoId;
  }

  async #resolverCategoriaId(categoriaId, categoriaNome) {
    const id = Number(categoriaId);
    if (Number.isInteger(id) && id > 0) return id;
    return this.#buscarCategoriaIdPorNome(categoriaNome);
  }

  async #buscarLaboratorioIdPorNome(nome) {
    if (!nome) return null;
    const rows = await this.#db.ExecutaComando(
      "SELECT lab_id AS id FROM tb_Laboratorios WHERE lab_nome = ? LIMIT 1",
      [nome],
    );
    if (rows.length) return rows[0].id;
    const novoId = await this.#db.ExecutaComandoLastInserted(
      "INSERT INTO tb_Laboratorios (lab_nome) VALUES (?)",
      [nome],
    );
    return novoId;
  }

  async #resolverLaboratorioId(laboratorioId, laboratorioNome) {
    const id = Number(laboratorioId);
    if (Number.isInteger(id) && id > 0) return id;
    return this.#buscarLaboratorioIdPorNome(laboratorioNome);
  }

  async criarProduto({ nome, descricao, imagem, preco, categoriaId, categoriaNome, laboratorioId, marcaNome, descontoPercentual }) {
    const precoNumero = ProdutosModels.parseCurrencyToNumber(preco);
    const categoriaIdResolvido = await this.#resolverCategoriaId(categoriaId, categoriaNome);
    const laboratorioIdResolvido = await this.#resolverLaboratorioId(laboratorioId, marcaNome);
    const descontoNum = Number(String(descontoPercentual || 0).replace(",", "."));

    const sql = `
      INSERT INTO tb_Produtos
        (pro_nome, pro_descricao, pro_imagem, pro_preco_venda, pro_id_categoria, pro_id_laboratorio, pro_porcentagem_promocao)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    return this.#db.ExecutaComandoLastInserted(sql, [
      nome,
      descricao || null,
      imagem || null,
      precoNumero,
      categoriaIdResolvido,
      laboratorioIdResolvido,
      descontoNum,
    ]);
  }

  async atualizarProduto(id, { nome, descricao, imagem, preco, categoriaId, categoriaNome, laboratorioId, marcaNome, descontoPercentual }) {
    const precoNumero = ProdutosModels.parseCurrencyToNumber(preco);
    const categoriaIdResolvido = await this.#resolverCategoriaId(categoriaId, categoriaNome);
    const laboratorioIdResolvido = await this.#resolverLaboratorioId(laboratorioId, marcaNome);
    const descontoNum = Number(String(descontoPercentual || 0).replace(",", "."));
    const campos = [
      "pro_nome = ?",
      "pro_descricao = ?",
      "pro_preco_venda = ?",
      "pro_id_categoria = ?",
      "pro_id_laboratorio = ?",
      "pro_porcentagem_promocao = ?",
    ];
    const valores = [
      nome,
      descricao || null,
      precoNumero,
      categoriaIdResolvido,
      laboratorioIdResolvido,
      descontoNum,
    ];

    if (imagem) {
      campos.splice(2, 0, "pro_imagem = ?");
      valores.splice(2, 0, imagem);
    }

    valores.push(id);
    return this.#db.ExecutaComandoNonQuery(`UPDATE tb_Produtos SET ${campos.join(", ")} WHERE pro_id = ?`, valores);
  }

  async deletarProduto(id) {
    if (!id) return false;
    return this.#db.ExecutaComandoNonQuery("DELETE FROM tb_Produtos WHERE pro_id = ?", [id]);
  }

  async baixarEstoque(produtoId, quantidadeComprada) {
    let quantidadeRestante = quantidadeComprada;

    const sqlBusca = `
      SELECT lot_id, lot_quantidade_atual 
      FROM tb_Lotes_Estoque 
      WHERE lot_id_produto = ? AND lot_quantidade_atual > 0
      ORDER BY lot_data_validade ASC
    `;
    const lotes = await this.#db.ExecutaComando(sqlBusca, [produtoId]);

    for (let i = 0; i < lotes.length; i++) {
        let lote = lotes[i];
        if (quantidadeRestante === 0) break;

        if (lote.lot_quantidade_atual >= quantidadeRestante) {
            const novaQuantidade = lote.lot_quantidade_atual - quantidadeRestante;
            await this.#db.ExecutaComando(
                `UPDATE tb_Lotes_Estoque SET lot_quantidade_atual = ? WHERE lot_id = ?`,
                [novaQuantidade, lote.lot_id]
            );
            quantidadeRestante = 0; 
        } else {
            quantidadeRestante -= lote.lot_quantidade_atual;
            await this.#db.ExecutaComando(
                `UPDATE tb_Lotes_Estoque SET lot_quantidade_atual = 0 WHERE lot_id = ?`,
                [lote.lot_id]
            );
        }
    }

    if (quantidadeRestante > 0) {
        throw new Error("Estoque insuficiente para o produto ID: " + produtoId);
    }
    
    return true;
  }

  async contarVendasVinculadas(id) {
    if (!id) return 0;
    const rows = await this.#db.ExecutaComando(
      "SELECT COUNT(*) AS total FROM tb_Itens_Venda WHERE itv_id_produto = ?",
      [id],
    );
    return Number(rows?.[0]?.total || 0);
  }
}

module.exports = ProdutosModels;
