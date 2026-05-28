const ProdutosModels = require("../models/produtosModels");

class recebController{
    recebView(req, res){
        let produtos = new ProdutosModels;
        let busca = produtos.buscarPorId;
        res.render('recebimento', {layout: true});
    }
}

module.exports = recebController;