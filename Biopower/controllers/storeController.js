const ProdutosModels = require("../models/produtosModels");
const CategoriasModels = require("../models/categoriasModels");

const produtosModel = new ProdutosModels();
const categoriasModel = new CategoriasModels();

class storeController {
  async store(req, res) {
    let products = [];
    let categorias = [];

    try {
      products = await produtosModel.listarParaInterface();
    } catch (err) {
      console.error("Erro ao listar produtos da loja:", err);
      products = [];
    }

    try {
      categorias = await categoriasModel.listar();
    } catch (err) {
      console.error("Erro ao listar categorias da loja:", err);
      categorias = [];
    }

    res.render("store", { products, categorias });
  }
}

module.exports = storeController;
