const ProdutosModels = require("../models/produtosModels");

class recebController{
    recebView(req, res){
        let produtos = new ProdutosModels;
        let busca = produtos.buscarPorId;
        res.render('recebimento', {layout: true});
    }

async gravar(req, res) {
        let ok = false;
        let msg = "";
        
        if (req.body.length > 0) {
            try {
                let produtoModel = new ProdutosModels();
                
                let pedidoId = await produtoModel.baixarEstoque(); 
                
                if (pedidoId) {
                    for (let i = 0; i < req.body.length; i++) {
                        let itemCarrinho = req.body[i];
                        
                        let dadosProduto = await produtoModel.buscarPorId(itemCarrinho.id);
                        if (!dadosProduto) throw new Error(`Produto ${itemCarrinho.id} não encontrado.`);

                        await produtoModel.baixarEstoque(dadosProduto.id, itemCarrinho.quantidade);
                    }

                    ok = true;
                    msg = "Estoque atualizado com sucesso!";
                }
            } catch (erro) {
                ok = false;
                msg = erro.message;
            }
        } else {
            msg = "Nenhum produto enviado!";
        }
        res.send({ ok, msg });
    }
}

module.exports = recebController;