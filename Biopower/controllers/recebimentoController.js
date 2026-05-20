const RecebimenroModels = require("../models/recebimentoModels");

class RecebimentoController {
  async cadastrar(req, res) {
    try {
      const { produtoId, quantidade, dataValidade, numeroLote } = req.body;

      const model = new RecebimenroModels();
    //   await model.registrarRecebimento(
    //     produtoId,
    //     quantidade,
    //     dataValidade,
    //     numeroLote,
    //   );

    console.log("Recebimento registrado:", {
        produtoId,
        quantidade,
        dataValidade,
        numeroLote,
    });

      res.send("Recebimento registrado com sucesso!");
    } catch (error) {
      res.send("Erro ao registrar recebimento.");
    }
  }

  abrirTela(req, res) {
    res.render("recebimento");
  }
}

module.exports = RecebimentoController;
