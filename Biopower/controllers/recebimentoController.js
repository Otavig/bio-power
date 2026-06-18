const ProdutosModels = require("../models/produtosModels");
const VendasModels = require("../models/vendasModels");
const ItensVendaModels = require("../models/itensVendaModels");
const FluxoCaixaModels = require("../models/fluxoCaixaModels");
const EntregaModels = require("../models/entregaModels");
const StatusDiversosModels = require("../models/statusDiversosModels");

function normalizarCep(cep) {
  return String(cep || "").replace(/\D/g, "").slice(0, 8);
}

function normalizarMetodoPagamento(metodo) {
  const mapa = {
    credito: "CREDITO",
    cartao_credito: "CREDITO",
    debito: "DEBITO",
    cartao_debito: "DEBITO",
    pix: "PIX",
    boleto: "BOLETO",
  };

  const chave = String(metodo || "").trim().toLowerCase();
  return mapa[chave] || String(metodo || "CREDITO").trim().toUpperCase();
}

class RecebimentoController {
  recebView(req, res) {
    if (!req.session?.user) return res.redirect("/login");
    res.render("recebimento", { layout: true });
  }

  async gravar(req, res) {
    let ok = false;
    let msg = "";

    const itens = Array.isArray(req.body) ? req.body : req.body.itens;
    const entrega = Array.isArray(req.body) ? null : req.body.entrega;
    const metodoPagamentoCodigo = normalizarMetodoPagamento(Array.isArray(req.body) ? null : req.body.metodoPagamento);
    const clienteId = req.session?.user?.id;

    if (!clienteId) {
      return res.send({ ok, msg: "Faça login para finalizar a compra." });
    }

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.send({ ok, msg: "Nenhum produto enviado!" });
    }

    try {
      const produtoModel = new ProdutosModels();
      const vendaModel = new VendasModels();
      const itemVendaModel = new ItensVendaModels();
      const fluxoCaixaModel = new FluxoCaixaModels();
      const entregaModel = new EntregaModels();
      const statusDiversosModel = new StatusDiversosModels();
      const itensVenda = [];
      let valorTotal = 0;
      const metodoPagamento = await statusDiversosModel.buscarPorDominioCodigo("venda_metodo_pagamento", metodoPagamentoCodigo);

      if (!metodoPagamento) {
        throw new Error("Metodo de pagamento invalido.");
      }

      const dadosEntrega = {
        cep: normalizarCep(entrega?.cep),
        endereco: String(entrega?.endereco || "").trim(),
        numero: String(entrega?.numero || "").trim() || null,
        complemento: String(entrega?.complemento || "").trim() || null,
        bairro: String(entrega?.bairro || "").trim(),
        cidade: String(entrega?.cidade || "").trim(),
        uf: String(entrega?.uf || "").trim().toUpperCase()
      };

      if (
        dadosEntrega.cep.length !== 8 ||
        dadosEntrega.endereco.length < 3 ||
        dadosEntrega.bairro.length < 2 ||
        dadosEntrega.cidade.length < 2 ||
        dadosEntrega.uf.length !== 2
      ) {
        throw new Error("Informe os dados de entrega.");
      }

      for (let i = 0; i < itens.length; i++) {
        const itemCarrinho = itens[i];
        const dadosProduto = await produtoModel.buscarPorId(itemCarrinho.id);

        if (!dadosProduto) {
          throw new Error(`Produto ${itemCarrinho.id} não encontrado.`);
        }

        const quantidade = Number(itemCarrinho.quantidade || 1);
        if (!Number.isInteger(quantidade) || quantidade <= 0) {
          throw new Error(`Quantidade inválida para o produto ${dadosProduto.nome}.`);
        }

        const estoque = await produtoModel.consultarEstoque(itemCarrinho.id);
        if (estoque < quantidade) {
          throw new Error(`Estoque insuficiente para ${dadosProduto.nome}. Disponível: ${estoque}.`);
        }

        const valorUnitario = Number(dadosProduto.precoNumber ?? dadosProduto.preco ?? itemCarrinho.preco ?? 0);
        const subtotal = Number((quantidade * valorUnitario).toFixed(2));
        valorTotal += subtotal;

        itensVenda.push({
          produtoId: dadosProduto.id,
          quantidade,
          valorUnitario,
          subtotal,
        });
      }

      const vendaId = await vendaModel.criar({
        clienteId,
        valorTotal: Number(valorTotal.toFixed(2)),
        status: "AGUARDANDO",
        statusId: 17,
        metodoPagamentoId: metodoPagamento.id,
        desconto: 0,
      });

      if (!vendaId) {
        throw new Error("Não foi possível registrar a venda.");
      }

      await entregaModel.criar({
        vendaId,
        cep: dadosEntrega.cep,
        endereco: dadosEntrega.endereco,
        numero: dadosEntrega.numero,
        complemento: dadosEntrega.complemento,
        bairro: dadosEntrega.bairro,
        cidade: dadosEntrega.cidade,
        uf: dadosEntrega.uf
      });

      for (let i = 0; i < itensVenda.length; i++) {
        const item = itensVenda[i];

        await itemVendaModel.criar({
          vendaId,
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: item.valorUnitario,
          valorTotal: item.subtotal,
        });

        await produtoModel.baixarEstoque(item.produtoId, item.quantidade);
      }

      await fluxoCaixaModel.registrarReceitaVenda({
        vendaId,
        valor: Number(valorTotal.toFixed(2)),
        descricao: `Receita da venda #${vendaId}`,
        dataMovimentacao: new Date().toISOString().slice(0, 10),
      });

      ok = true;
      msg = "Venda registrada com sucesso!";
      return res.send({ ok, msg, vendaId });
    } catch (erro) {
      msg = erro.message;
      return res.send({ ok, msg });
    }
  }

  async validarEstoque(req, res) {
    const itens = Array.isArray(req.body) ? req.body : req.body.itens;

    if (!req.session?.user) {
      return res.status(401).send({ ok: false, msg: "Faça login para continuar.", itens: [] });
    }

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.send({ ok: false, msg: "Nenhum produto enviado!", itens: [] });
    }

    try {
      const produtoModel = new ProdutosModels();
      const resultado = [];
      let ok = true;

      for (let i = 0; i < itens.length; i++) {
        const item = itens[i];
        const produto = await produtoModel.buscarPorId(item.id);
        const solicitado = Number(item.quantidade || 1);
        const estoque = await produtoModel.consultarEstoque(item.id);
        const disponivel = !!produto && solicitado > 0 && estoque >= solicitado;

        if (!disponivel) ok = false;

        resultado.push({
          id: item.id,
          nome: produto?.nome || item.nome || `Produto ${item.id}`,
          solicitado,
          estoque,
          disponivel,
        });
      }

      return res.send({
        ok,
        msg: ok ? "Estoque disponível." : "Há produtos sem estoque suficiente.",
        itens: resultado,
      });
    } catch (erro) {
      return res.send({ ok: false, msg: erro.message, itens: [] });
    }
  }
}

module.exports = RecebimentoController;
