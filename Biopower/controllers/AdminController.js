const UsuariosModels = require("../models/usuariosModels");
const ProdutosModels = require("../models/produtosModels");
const LotesEstoqueModels = require("../models/lotesEstoqueModels");
const ServicosModels = require("../models/servicosModels");
const ItensServicosModels = require("../models/itensServicosModels");
const TypeUsuariosModels = require("../models/typeUserModels");

const STATUS_SERVICOS = [
  "pendente",
  "aprovado",
  "finalizado",
  "cancelado",
];

class AdminController {
  constructor() {
    this.produtosModel = new ProdutosModels();
    this.lotesModel = new LotesEstoqueModels();
    this.servicosModel = new ServicosModels();
    this.servicosContratadosModel = new ItensServicosModels();
  }

  async dashboard(req, res) {
    let listaUsuarios = [];
    let listaTipos = [];
    let products = [];
    let services = [];
    let servicosContratados = [];
    try {
      const usuariosModel = new UsuariosModels();
      listaUsuarios = await usuariosModel.listar();
    } catch (err) {
      console.error("Erro ao listar usuÃ¡rios:", err);
      listaUsuarios = [];
    }

    try {
      const typesUsuariosModel = new TypeUsuariosModels();
      listaTipos = await typesUsuariosModel.listarTiposUsuarios();
    } catch (err) {
      console.error("Erro ao listar tipos de usuÃ¡rios:", err);
      listaTipos = [];
    }

    try {
      products = await this.produtosModel.listarParaInterface();
    } catch (err) {
      console.error("Erro ao listar produtos:", err);
      products = [];
    }

    try {
      services = await this.servicosModel.listar();
    } catch (err) {
      console.error("Erro ao listar serviÃ§os:", err);
      services = [];
    }

    try {
      const itens = await this.servicosContratadosModel.listarTodos();
      const mapa = new Map();

      for (const item of itens) {
        const chave = String(item.agendamentoId || item.id);
        if (!mapa.has(chave)) {
          mapa.set(chave, {
            id: item.id,
            agendamentoId: item.agendamentoId || null,
            status: item.status,
            valorTotal: 0,
            dataAtualizacao: item.dataAtualizacao,
            dataAgendamento: item.dataAgendamento,
            observacoes: item.observacoes,
            clienteNome: item.clienteNome,
            clienteEmail: item.clienteEmail,
            profissionalNome: item.profissionalNome,
            servicos: [],
          });
        }

        const grupo = mapa.get(chave);
        grupo.valorTotal += Number(item.valorTotal || 0);
        grupo.servicos.push({
          nome: item.servicoNome,
          quantidade: Number(item.quantidade || 0),
          valorUnitario: Number(item.valorUnitario || 0),
        });
      }

      servicosContratados = Array.from(mapa.values());
    } catch (err) {
      console.error("Erro ao listar servicos contratados:", err);
      servicosContratados = [];
    }

    res.render("dashboard/dashboard", {
      layout: false,
      user: req.session.user,
      products,
      listaUsuarios,
      listaTipos,
      services,
      servicosContratados,
      statusServicos: STATUS_SERVICOS,
      flash: req.query.flash || null,
    });
  }

  async createUser(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const { nome, email, senha, cpfCnpj, typeId, ativo } = req.body;

    if (!nome || !email || !senha || !typeId) {
      const msg = "Campos obrigatorios: nome, email, senha e perfil.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=usuario-erro#users");
    }

    try {
      const usuariosModel = new UsuariosModels();
      await usuariosModel.criar({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: senha.trim(),
        cpfCnpj: cpfCnpj?.trim() || null,
        typeId: Number(typeId),
        ativo: Number(ativo ?? 1),
      });
      if (wantsJson) return res.json({ ok: true, msg: "Usuario cadastrado." });
    } catch (err) {
      console.error("Erro ao criar usuario:", err);
      const msg = "Erro ao cadastrar usuario.";
      if (wantsJson) return res.status(500).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=usuario-erro#users");
    }

    return res.redirect("/dashboard?flash=usuario-adicionado#users");
  }

  async updateUser(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const id = parseInt(req.params.id, 10);
    const { nome, email, senha, cpfCnpj, typeId, ativo } = req.body;

    if (Number.isNaN(id)) {
      const msg = "Usuario invalido.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=usuario-erro#users");
    }

    try {
      const usuariosModel = new UsuariosModels();
      await usuariosModel.atualizar(id, {
        nome: nome?.trim(),
        email: email?.trim()?.toLowerCase(),
        senha: senha?.trim(),
        cpfCnpj: cpfCnpj?.trim() || null,
        typeId: typeId !== undefined ? Number(typeId) : undefined,
        ativo: ativo !== undefined ? Number(ativo) : undefined,
      });
      if (wantsJson) return res.json({ ok: true, msg: "Usuario atualizado." });
    } catch (err) {
      console.error("Erro ao atualizar usuario:", err);
      const msg = "Erro ao atualizar usuario.";
      if (wantsJson) return res.status(500).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=usuario-erro#users");
    }

    return res.redirect("/dashboard?flash=usuario-atualizado#users");
  }

  async deleteUser(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      const msg = "Usuario invalido.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=usuario-erro#users");
    }

    try {
      const usuariosModel = new UsuariosModels();
      await usuariosModel.desativar(id);
      if (wantsJson) return res.json({ ok: true, msg: "Usuario desativado." });
    } catch (err) {
      console.error("Erro ao desativar usuario:", err);
      const msg = "Erro ao desativar usuario.";
      if (wantsJson) return res.status(500).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=usuario-erro#users");
    }

    return res.redirect("/dashboard?flash=usuario-desativado#users");
  }

  async addProduct(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const { nome, preco, credito, categoria, marca, sabor } = req.body;

    if (!nome || !preco || !categoria) {
      const msg = "Campos obrigatÃ³rios: nome, preÃ§o e categoria.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=produto-erro#products");
    }

    try {
      await this.produtosModel.criarProduto({
        nome,
        descricao: sabor || credito || null,
        preco,
        categoriaNome: categoria,
        marcaNome: marca,
        descontoPercentual: 0,
      });
      if (wantsJson) return res.json({ ok: true, msg: "Produto cadastrado com sucesso!" });
    } catch (err) {
      console.error("Erro ao adicionar produto:", err);
      if (wantsJson) return res.status(500).json({ ok: false, msg: "Erro ao cadastrar produto." });
    }

    return res.redirect("/dashboard?flash=produto-adicionado#products");
  }

  async updateStock(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const produtoId = parseInt(req.params.id, 10);
    const quantidade = Number(req.body?.quantidade ?? req.body?.qtd ?? req.body?.quantidadeAtualizada);

    if (Number.isNaN(produtoId) || Number.isNaN(quantidade)) {
      const msg = "Produto ou quantidade invÃ¡lida.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=estoque-erro#stock");
    }

    try {
      const novoTotal = await this.lotesModel.ajustarEstoqueManual(produtoId, quantidade);
      if (wantsJson) return res.json({ ok: true, msg: "Estoque atualizado.", total: novoTotal });
    } catch (err) {
      console.error("Erro ao atualizar estoque:", err);
      if (wantsJson) return res.status(500).json({ ok: false, msg: "Erro ao atualizar estoque." });
      return res.redirect("/dashboard?flash=estoque-erro#stock");
    }

    return res.redirect("/dashboard?flash=estoque-atualizado#stock");
  }

  async deleteProduct(req, res) {
    const id = parseInt(req.params.id, 10);
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    if (!Number.isNaN(id)) {
      try {
        await this.produtosModel.deletarProduto(id);
        if (wantsJson) return res.json({ ok: true, msg: "Produto excluÃ­do." });
      } catch (err) {
        console.error("Erro ao excluir produto:", err);
        if (wantsJson) return res.status(500).json({ ok: false, msg: "Erro ao excluir produto." });
      }
    }
    return res.redirect("/dashboard#products");
  }

  async listServices(req, res) {
    try {
      const services = await this.servicosModel.listar();
      return res.json({ ok: true, data: services });
    } catch (err) {
      console.error("Erro ao listar serviÃ§os:", err);
      return res.status(500).json({ ok: false, msg: "Erro ao listar serviÃ§os." });
    }
  }

  async createService(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const { nome, descricao, preco } = req.body;

    if (!nome || preco === undefined || preco === null || preco === "") {
      const msg = "Campos obrigatÃ³rios: nome e preÃ§o.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=servico-erro#services");
    }

    try {
      await this.servicosModel.criar({ nome, descricao, preco });
      if (wantsJson) return res.json({ ok: true, msg: "ServiÃ§o cadastrado." });
    } catch (err) {
      console.error("Erro ao criar serviÃ§o:", err);
      if (wantsJson) return res.status(500).json({ ok: false, msg: "Erro ao cadastrar serviÃ§o." });
      return res.redirect("/dashboard?flash=servico-erro#services");
    }

    return res.redirect("/dashboard?flash=servico-adicionado#services");
  }

  async updateService(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const id = parseInt(req.params.id, 10);
    const { nome, descricao, preco } = req.body;

    if (Number.isNaN(id)) {
      const msg = "ServiÃ§o invÃ¡lido.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=servico-erro#services");
    }

    try {
      await this.servicosModel.atualizar(id, { nome, descricao, preco });
      if (wantsJson) return res.json({ ok: true, msg: "ServiÃ§o atualizado." });
    } catch (err) {
      console.error("Erro ao atualizar serviÃ§o:", err);
      if (wantsJson) return res.status(500).json({ ok: false, msg: "Erro ao atualizar serviÃ§o." });
      return res.redirect("/dashboard?flash=servico-erro#services");
    }

    return res.redirect("/dashboard?flash=servico-atualizado#services");
  }

  async deleteService(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      const msg = "ServiÃ§o invÃ¡lido.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=servico-erro#services");
    }

    try {
      await this.servicosModel.deletar(id);
      if (wantsJson) return res.json({ ok: true, msg: "ServiÃ§o excluÃ­do." });
    } catch (err) {
      console.error("Erro ao excluir serviÃ§o:", err);
      if (wantsJson) return res.status(500).json({ ok: false, msg: "Erro ao excluir serviÃ§o." });
      return res.redirect("/dashboard?flash=servico-erro#services");
    }

    return res.redirect("/dashboard?flash=servico-excluido#services");
  }

  async listContractedServices(req, res) {
    const { status } = req.query;
    const filtroStatus = STATUS_SERVICOS.includes(status) ? status : null;

    try {
      const data = await this.servicosContratadosModel.listarTodos({ status: filtroStatus });
      return res.json({ ok: true, data });
    } catch (err) {
      console.error("Erro ao listar serviÃ§os contratados:", err);
      return res.status(500).json({ ok: false, msg: "Erro ao listar serviÃ§os contratados." });
    }
  }

  async updateContractedServiceStatus(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const id = parseInt(req.params.id, 10);
    const { status, observacoes } = req.body;

    if (Number.isNaN(id)) {
      const msg = "ServiÃ§o contratado invÃ¡lido.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=servico-contrato-erro#services");
    }

    if (!STATUS_SERVICOS.includes(status)) {
      const msg = "Status invÃ¡lido.";
      if (wantsJson) return res.status(400).json({ ok: false, msg, statusPermitidos: STATUS_SERVICOS });
      return res.redirect("/dashboard?flash=servico-contrato-erro#services");
    }

    try {
      await this.servicosContratadosModel.atualizarStatus(id, { status, observacoes });
      if (wantsJson) return res.json({ ok: true, msg: "Status atualizado." });
    } catch (err) {
      console.error("Erro ao atualizar status do serviÃ§o contratado:", err);
      if (wantsJson) return res.status(500).json({ ok: false, msg: "Erro ao atualizar status." });
      return res.redirect("/dashboard?flash=servico-contrato-erro#services");
    }

    return res.redirect("/dashboard?flash=servico-contrato-atualizado#services");
  }
}

module.exports = AdminController;

