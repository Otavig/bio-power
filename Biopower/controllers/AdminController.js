const UsuariosModels = require("../models/usuariosModels");
const ProdutosModels = require("../models/produtosModels");
const CategoriasModels = require("../models/categoriasModels");
const LaboratoriosModels = require("../models/laboratoriosModels");
const FornecedoresModels = require("../models/fornecedoresModels");
const LotesEstoqueModels = require("../models/lotesEstoqueModels");
const ServicosModels = require("../models/servicosModels");
const ItensServicosModels = require("../models/itensServicosModels");
const AgendamentosModels = require("../models/agendamentosModels");
const VendasModels = require("../models/vendasModels");
const ItensVendaModels = require("../models/itensVendaModels");
const TypeUsuariosModels = require("../models/typeUserModels");
const Database = require("../utils/database");
const { PdfGenerator } = require("../utils/pdfGenerator")

const STATUS_SERVICOS = [
  "pendente",
  "aprovado",
  "finalizado",
  "cancelado",
];

class AdminController {
  constructor() {
    this.produtosModel = new ProdutosModels();
    this.categoriasModel = new CategoriasModels();
    this.laboratoriosModel = new LaboratoriosModels();
    this.fornecedoresModel = new FornecedoresModels();
    this.usuariosModel = new UsuariosModels();
    this.lotesModel = new LotesEstoqueModels();
    this.servicosModel = new ServicosModels();
    this.servicosContratadosModel = new ItensServicosModels();
    this.agendamentosModel = new AgendamentosModels();
    this.vendasModel = new VendasModels();
    this.itensVendaModel = new ItensVendaModels();
    this.database = new Database();
  }

  async dashboard(req, res) {
    let listaUsuarios = [];
    let listaTipos = [];
    let products = [];
    let services = [];
    let servicosContratados = [];
    let categorias = [];
    let laboratorios = [];
    let fornecedores = [];
    let clientes = [];
    try {
      const usuariosModel = new UsuariosModels();
      listaUsuarios = await usuariosModel.listar();
    } catch (err) {
      console.error("Erro ao listar usuários:", err);
      listaUsuarios = [];
    }

    try {
      const typesUsuariosModel = new TypeUsuariosModels();
      listaTipos = await typesUsuariosModel.listarTiposUsuarios();
    } catch (err) {
      console.error("Erro ao listar tipos de usuários:", err);
      listaTipos = [];
    }

    try {
      products = await this.produtosModel.listarParaInterface();
    } catch (err) {
      console.error("Erro ao listar produtos:", err);
      products = [];
    }

    try {
      categorias = await this.categoriasModel.listar();
    } catch (err) {
      console.error("Erro ao listar categorias:", err);
      categorias = [];
    }

    try {
      laboratorios = await this.laboratoriosModel.listar();
    } catch (err) {
      console.error("Erro ao listar laboratórios:", err);
      laboratorios = [];
    }

    try {
      fornecedores = await this.fornecedoresModel.listar();
      console.log("DEBUG - Fornecedores carregados:", fornecedores);
    } catch (err) {
      console.error("Erro ao listar fornecedores:", err);
      fornecedores = [];
    }

    try {
      clientes = await this.usuariosModel.listarClientes();
      console.log("DEBUG - Clientes carregados:", clientes);
    } catch (err) {
      console.error("Erro ao listar clientes:", err);
      clientes = [];
    }

    try {
      services = await this.servicosModel.listar();
    } catch (err) {
      console.error("Erro ao listar serviços:", err);
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

    let tiposDespesa = [];
    let tiposReceita = [];
    try {
      const sqlDesp = "SELECT DISTINCT f.flu_descricao AS descricao FROM tb_Fluxo_Caixa f INNER JOIN tb_status_diversos s ON s.sta_id = f.flu_tipo_id WHERE s.sta_codigo = 'DESPESA' AND f.flu_descricao IS NOT NULL ORDER BY f.flu_descricao;";
      const sqlRec = "SELECT DISTINCT f.flu_descricao AS descricao FROM tb_Fluxo_Caixa f INNER JOIN tb_status_diversos s ON s.sta_id = f.flu_tipo_id WHERE s.sta_codigo = 'RECEITA' AND f.flu_descricao IS NOT NULL ORDER BY f.flu_descricao;";
      const resDesp = await this.database.ExecutaComando(sqlDesp, []);
      const resRec = await this.database.ExecutaComando(sqlRec, []);
      tiposDespesa = Array.isArray(resDesp) ? resDesp.map(r => r.descricao) : [];
      tiposReceita = Array.isArray(resRec) ? resRec.map(r => r.descricao) : [];
    } catch (err) {
      console.error("Erro ao carregar tipos de fluxo (despesa/receita):", err);
      tiposDespesa = [];
      tiposReceita = [];
    }

    res.render("dashboard/dashboard", {
      layout: false,
      user: req.session.user,
      products,
      listaUsuarios,
      categorias,
      laboratorios,
      fornecedores,
      clientes,
      listaTipos,
      services,
      servicosContratados,
      statusServicos: STATUS_SERVICOS,
      tiposDespesa,
      tiposReceita,
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

  async createCategory(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const { nome } = req.body;

    if (!nome || !nome.trim()) {
      const msg = "Informe o nome da categoria.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=categoria-erro#categories");
    }

    try {
      await this.categoriasModel.criar({ nome: nome.trim() });
      if (wantsJson) return res.json({ ok: true });
    } catch (err) {
      console.error("Erro ao criar categoria:", err);
      if (wantsJson) return res.status(500).json({ ok: false, msg: "Erro ao cadastrar categoria." });
      return res.redirect("/dashboard?flash=categoria-erro#categories");
    }

    return res.redirect("/dashboard#categories");
  }

  async updateCategory(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const id = parseInt(req.params.id, 10);
    const { nome } = req.body;

    if (Number.isNaN(id)) {
      const msg = "Categoria inválida.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=categoria-erro#categories");
    }

    if (!nome || !nome.trim()) {
      const msg = "Informe o nome da categoria.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=categoria-erro#categories");
    }

    try {
      await this.categoriasModel.atualizar(id, { nome: nome.trim() });
      if (wantsJson) return res.json({ ok: true });
    } catch (err) {
      console.error("Erro ao atualizar categoria:", err);
      if (wantsJson) return res.status(500).json({ ok: false, msg: "Erro ao atualizar categoria." });
      return res.redirect("/dashboard?flash=categoria-erro#categories");
    }

    return res.redirect("/dashboard#categories");
  }

  async deleteCategory(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      const msg = "Categoria inválida.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=categoria-erro#categories");
    }

    try {
      const produtosVinculados = await this.categoriasModel.contarProdutosVinculados(id);
      if (produtosVinculados > 0) {
        const msg = "Esta categoria possui produto cadastrado e não pode ser excluída.";
        if (wantsJson) return res.status(409).json({ ok: false, msg, produtosVinculados });
        return res.redirect("/dashboard?flash=categoria-vinculada-produto#categories");
      }

      await this.categoriasModel.deletar(id);
      if (wantsJson) return res.json({ ok: true });
    } catch (err) {
      console.error("Erro ao excluir categoria:", err);
      if (wantsJson) return res.status(500).json({ ok: false, msg: "Erro ao excluir categoria." });
      return res.redirect("/dashboard?flash=categoria-erro#categories");
    }

    return res.redirect("/dashboard#categories");
  }

  async addProduct(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const { nome, preco, categoria, marca, sabor, desconto } = req.body;

    if (!nome || !preco || !categoria) {
      const msg = "Campos obrigatórios: nome, preço e categoria.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=produto-erro#products");
    }

    try {
      await this.produtosModel.criarProduto({
        nome: nome.trim(),
        descricao: sabor?.trim() || null,
        imagem: req.file?.buffer || null,
        preco,
        categoriaId: categoria,
        laboratorioId: marca,
        descontoPercentual: desconto,
      });

      if (wantsJson) return res.json({ ok: true });
    } catch (err) {
      console.error("Erro ao adicionar produto:", err);
      if (wantsJson) return res.status(500).json({ ok: false, msg: "Erro ao cadastrar produto." });
    }

    return res.redirect("/dashboard#products");
  }

  async updateProduct(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const id = parseInt(req.params.id, 10);
    const { nome, preco, categoria, marca, sabor, desconto } = req.body;

    if (Number.isNaN(id)) {
      const msg = "Produto inválido.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=produto-erro#products");
    }

    if (!nome || !preco || !categoria) {
      const msg = "Campos obrigatórios: nome, preço e categoria.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=produto-erro#products");
    }

    try {
      await this.produtosModel.atualizarProduto(id, {
        nome: nome.trim(),
        descricao: sabor?.trim() || null,
        imagem: req.file?.buffer || null,
        preco,
        categoriaId: categoria,
        laboratorioId: marca,
        descontoPercentual: desconto,
      });

      if (wantsJson) return res.json({ ok: true });
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
      if (wantsJson) return res.status(500).json({ ok: false, msg: "Erro ao atualizar produto." });
    }

    return res.redirect("/dashboard#products");
  }

  async updateStock(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const produtoId = parseInt(req.params.id, 10);
    const quantidade = Number(req.body?.quantidade ?? req.body?.qtd ?? req.body?.quantidadeAtualizada);

    if (Number.isNaN(produtoId) || Number.isNaN(quantidade)) {
      const msg = "Produto ou quantidade inválida.";
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
        const vendasVinculadas = await this.produtosModel.contarVendasVinculadas(id);
        if (vendasVinculadas > 0) {
          const msg = "Este produto já está cadastrado em uma venda e não pode ser excluído.";
          if (wantsJson) return res.status(409).json({ ok: false, msg, vendasVinculadas });
          return res.redirect("/dashboard?flash=produto-vinculado-venda#products");
        }

        await this.produtosModel.deletarProduto(id);
        if (wantsJson) return res.json({ ok: true, msg: "Produto excluído." });
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
      console.error("Erro ao listar serviços:", err);
      return res.status(500).json({ ok: false, msg: "Erro ao listar serviços." });
    }
  }

  async createService(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const { nome, descricao, preco } = req.body;

    if (!nome || preco === undefined || preco === null || preco === "") {
      const msg = "Campos obrigatórios: nome e preço.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=servico-erro#services");
    }

    try {
      await this.servicosModel.criar({ nome, descricao, preco });
      if (wantsJson) return res.json({ ok: true, msg: "Serviço cadastrado." });
    } catch (err) {
      console.error("Erro ao criar serviço:", err);
      if (wantsJson) return res.status(500).json({ ok: false, msg: "Erro ao cadastrar serviço." });
      return res.redirect("/dashboard?flash=servico-erro#services");
    }

    return res.redirect("/dashboard?flash=servico-adicionado#services");
  }

  async updateService(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const id = parseInt(req.params.id, 10);
    const { nome, descricao, preco } = req.body;

    if (Number.isNaN(id)) {
      const msg = "Serviço inválido.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=servico-erro#services");
    }

    try {
      await this.servicosModel.atualizar(id, { nome, descricao, preco });
      if (wantsJson) return res.json({ ok: true, msg: "Serviço atualizado." });
    } catch (err) {
      console.error("Erro ao atualizar serviço:", err);
      if (wantsJson) return res.status(500).json({ ok: false, msg: "Erro ao atualizar serviço." });
      return res.redirect("/dashboard?flash=servico-erro#services");
    }

    return res.redirect("/dashboard?flash=servico-atualizado#services");
  }

  async deleteService(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      const msg = "Serviço inválido.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=servico-erro#services");
    }

    try {
      await this.servicosModel.deletar(id);
      if (wantsJson) return res.json({ ok: true, msg: "Serviço excluído." });
    } catch (err) {
      console.error("Erro ao excluir serviço:", err);
      if (wantsJson) return res.status(500).json({ ok: false, msg: "Erro ao excluir serviço." });
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
      console.error("Erro ao listar serviços contratados:", err);
      return res.status(500).json({ ok: false, msg: "Erro ao listar serviços contratados." });
    }
  }

  async exportReportPdf(req, res) {
    const tipoRelatorio = String(req.query.report || "").trim();
    const periodo = Number(req.query.period) || 30;
    const filtro = {
      tipoProduto: String(req.query.productType || "").trim(),
      movimento: String(req.query.movementType || "").trim().toLowerCase(),
      item: String(req.query.itemType || "").trim(),
      tipoDespesa: String(req.query.expenseType || "").trim(),
      fornecedor: String(req.query.supplier || "").trim(),
      tipoReceita: String(req.query.revenueType || "").trim(),
      cliente: String(req.query.client || "").trim(),
    };

    const relatorio = await this._montarRelatorio(tipoRelatorio, periodo, filtro);
    if (!relatorio) {
      return res.status(400).send("Relatório inválido.");
    }

    const content = this._montarConteudoPdf(relatorio);

    try {
      const pdfGenerator = new PdfGenerator(content, {
        author: "BioPower",
        margin: 40,
      });
      const pdfBuffer = await pdfGenerator.gerar();
      const filename = `${tipoRelatorio.replace(/[^a-z0-9]+/gi, "-") || "relatorio"}.pdf`;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      return res.send(pdfBuffer);
    } catch (err) {
      console.error("Erro ao gerar PDF do relatório:", err);
      return res.status(500).send("Erro ao gerar relatório.");
    }
  }

  _montarConteudoPdf(relatorio) {
    return {
      title: relatorio.title,
      subtitle: relatorio.subtitle,
      filters: relatorio.filters,
      columns: relatorio.columns,
      rows: relatorio.rows.map((row) => {
        return Object.fromEntries(relatorio.columns.map((column) => [column.key, row[column.key] ?? ""]));
      }),
      footer: "BioPower - Relatório gerado automaticamente",
    };
  }

  async _montarRelatorio(tipoRelatorio, periodo, filtro) {
    const filters = [{ label: "Período", value: `${periodo} dias` }];
    const subtitle = `Período: próximos ${periodo} dias`;
    let rows = [];
    let columns = [];

    if (tipoRelatorio === "products") {
      const titulo = "Produtos Próximos ao Vencimento";
      this._adicionarFiltro(filters, "Tipo de produto", filtro.tipoProduto);
      rows = await this._buscarProdutosVencimento(periodo, filtro.tipoProduto);
      columns = [
        { key: "produto", label: "Produto", width: 140 },
        { key: "categoria", label: "Categoria", width: 90 },
        { key: "lote", label: "Lote", width: 70 },
        { key: "quantidade", label: "Quantidade", width: 60 },
        { key: "validade", label: "Validade", width: 70 },
      ];
      return { title: titulo, subtitle, filters, rows, columns };
    }

    if (tipoRelatorio === "inventory") {
      const titulo = "Relatório de Estoque";
      this._adicionarFiltro(filters, "Movimento", filtro.movimento);
      this._adicionarFiltro(filters, "Tipo", filtro.item);
      rows = await this._buscarMovimentacoesEstoque(periodo, filtro.movimento, filtro.item);
      columns = [
        { key: "produto", label: "Produto", width: 140 },
        { key: "movimento", label: "Movimento", width: 80 },
        { key: "quantidade", label: "Quantidade", width: 60 },
        { key: "data", label: "Data", width: 80 },
        { key: "categoria", label: "Categoria", width: 90 },
      ];
      return { title: titulo, subtitle, filters, rows, columns };
    }

    if (tipoRelatorio === "payables") {
      const titulo = "Relatório de Contas a Pagar";
      this._adicionarFiltro(filters, "Tipo de despesa", filtro.tipoDespesa);
      this._adicionarFiltro(filters, "Fornecedor", filtro.fornecedor);
      rows = await this._buscarContasAPagar(periodo, filtro.tipoDespesa, filtro.fornecedor);
      columns = [
        { key: "descricao", label: "Descrição", width: 160 },
        { key: "valor", label: "Valor", width: 70 },
        { key: "data", label: "Data", width: 80 },
        { key: "fornecedor", label: "Fornecedor", width: 100 },
      ];
      return { title: titulo, subtitle, filters, rows, columns };
    }

    if (tipoRelatorio === "receivables") {
      const titulo = "Relatório de Contas a Receber";
      this._adicionarFiltro(filters, "Tipo de receita", filtro.tipoReceita);
      this._adicionarFiltro(filters, "Cliente", filtro.cliente);
      rows = await this._buscarContasAReceber(periodo, filtro.tipoReceita, filtro.cliente);
      columns = [
        { key: "descricao", label: "Descrição", width: 160 },
        { key: "valor", label: "Valor", width: 70 },
        { key: "data", label: "Data", width: 80 },
        { key: "cliente", label: "Cliente", width: 100 },
      ];
      return { title: titulo, subtitle, filters, rows, columns };
    }

    return null;
  }

  _adicionarFiltro(filters, label, valor) {
    if (valor) {
      filters.push({ label, value: valor });
    }
  }

  _normalizePeriod(period) {
    const value = Number(period);
    if (Number.isNaN(value) || value <= 0) return 30;
    if ([30, 60, 90].includes(value)) return value;
    return 90;
  }

  async _buscarProdutosVencimento(periodo, tipoProduto) {
    // RF_S1: próximos ao vencimento a partir de HOJE.
    // (Ex.: se hoje é dia 31, inclui o vencimento do mês seguinte dentro do intervalo.)
    const sql =
      "SELECT p.pro_nome AS produto, c.cat_nome AS categoria, l.lot_numero_lote AS lote, l.lot_quantidade_atual AS quantidade, DATE_FORMAT(l.lot_data_validade, '%d/%m/%Y') AS validade " +
      "FROM tb_Lotes_Estoque l " +
      "INNER JOIN tb_Produtos p ON p.pro_id = l.lot_id_produto " +
      "LEFT JOIN tb_Categorias c ON c.cat_id = p.pro_id_categoria " +
      "WHERE l.lot_data_validade BETWEEN CURRENT_DATE() " +
      "AND DATE_ADD(CURRENT_DATE(), INTERVAL ? DAY) ";

    const params = [periodo];

    let sqlFinal = sql;
    if (tipoProduto) {
      sqlFinal += "AND c.cat_nome LIKE ? ";
      params.push("%" + tipoProduto + "%");
    }

    sqlFinal += "ORDER BY l.lot_data_validade ASC, p.pro_nome ASC;";
    return this.database.ExecutaComando(sqlFinal, params);
  }

  async _buscarMovimentacoesEstoque(periodo, movimento, item) {
    var sql = "";
    var params = [];
    var productFilter = "";

    if (item) {
      productFilter = "AND c.cat_nome LIKE ? ";
    }

    if (movimento !== "saida") {
      sql += "SELECT p.pro_nome AS produto, 'Entrada' AS movimento, l.lot_quantidade_atual AS quantidade, DATE_FORMAT(l.lot_data_entrada, '%d/%m/%Y') AS data, COALESCE(c.cat_nome, 'N/D') AS categoria " +
        "FROM tb_Lotes_Estoque l " +
        "INNER JOIN tb_Produtos p ON p.pro_id = l.lot_id_produto " +
        "LEFT JOIN tb_Categorias c ON c.cat_id = p.pro_id_categoria " +
        "WHERE DATE(l.lot_data_entrada) BETWEEN CURRENT_DATE() AND DATE_ADD(CURRENT_DATE(), INTERVAL ? DAY) " +
        productFilter;
      params.push(periodo);
      if (item) {
        params.push("%" + item + "%");
      }
    }

    if (movimento !== "entrada") {
      if (sql) {
        sql += " UNION ALL ";
      }
      sql += "SELECT p.pro_nome AS produto, 'Saída' AS movimento, i.ite_quantidade AS quantidade, DATE_FORMAT(v.ven_data_venda, '%d/%m/%Y') AS data, COALESCE(c.cat_nome, 'N/D') AS categoria " +
        "FROM tb_Itens_Venda i " +
        "INNER JOIN tb_Vendas v ON v.ven_id = i.ite_id_venda " +
        "INNER JOIN tb_Produtos p ON p.pro_id = i.ite_id_produto " +
        "LEFT JOIN tb_Categorias c ON c.cat_id = p.pro_id_categoria " +
        "WHERE DATE(v.ven_data_venda) BETWEEN CURRENT_DATE() AND DATE_ADD(CURRENT_DATE(), INTERVAL ? DAY) " +
        productFilter;
      params.push(periodo);
      if (item) {
        params.push("%" + item + "%");
      }
    }

    sql += " ORDER BY data ASC, produto ASC;";
    return this.database.ExecutaComando(sql, params);
  }

  async _buscarContasAPagar(periodo, tipoDespesa, fornecedor) {
    var sql = "SELECT f.flu_descricao AS descricao, f.flu_valor AS valor, DATE_FORMAT(f.flu_data_movimentacao, '%d/%m/%Y') AS data, COALESCE(fo.for_razao_social, 'N/D') AS fornecedor " +
      "FROM tb_Fluxo_Caixa f " +
      "INNER JOIN tb_status_diversos s ON s.sta_id = f.flu_tipo_id " +
      "LEFT JOIN tb_Fornecedores fo ON fo.for_id = f.flu_origem_id AND f.flu_origem_tipo = 'fornecedor' " +
      "WHERE s.sta_codigo = 'DESPESA' " +
      "AND DATE(f.flu_data_movimentacao) BETWEEN CURRENT_DATE() AND DATE_ADD(CURRENT_DATE(), INTERVAL ? DAY) ";
    var params = [periodo];

    if (tipoDespesa) {
      sql += "AND f.flu_descricao LIKE ? ";
      params.push("%" + tipoDespesa + "%");
    }
    if (fornecedor) {
      sql += "AND fo.for_razao_social LIKE ? ";
      params.push("%" + fornecedor + "%");
    }

    sql += "ORDER BY f.flu_data_movimentacao ASC;";
    return this.database.ExecutaComando(sql, params);
  }

  async _buscarContasAReceber(periodo, tipoReceita, cliente) {
    var sql = "SELECT f.flu_descricao AS descricao, f.flu_valor AS valor, DATE_FORMAT(f.flu_data_movimentacao, '%d/%m/%Y') AS data, COALESCE(u.usu_nome, 'N/D') AS cliente " +
      "FROM tb_Fluxo_Caixa f " +
      "INNER JOIN tb_status_diversos s ON s.sta_id = f.flu_tipo_id " +
      "LEFT JOIN tb_Usuarios u ON u.usu_id = f.flu_origem_id AND f.flu_origem_tipo = 'cliente' " +
      "WHERE s.sta_codigo = 'RECEITA' " +
      "AND DATE(f.flu_data_movimentacao) BETWEEN CURRENT_DATE() AND DATE_ADD(CURRENT_DATE(), INTERVAL ? DAY) ";
    var params = [periodo];

    if (tipoReceita) {
      sql += "AND f.flu_descricao LIKE ? ";
      params.push("%" + tipoReceita + "%");
    }
    if (cliente) {
      sql += "AND u.usu_nome LIKE ? ";
      params.push("%" + cliente + "%");
    }

    sql += "ORDER BY f.flu_data_movimentacao ASC;";
    return this.database.ExecutaComando(sql, params);
  }

  _formatCurrency(value) {
    const number = Number(value || 0);
    return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  _formatDate(value) {
    if (!value) return "";
    return new Date(value).toLocaleDateString("pt-BR");
  }

  async updateContractedServiceStatus(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");
    const id = parseInt(req.params.id, 10);
    const { status, observacoes } = req.body;

    if (Number.isNaN(id)) {
      const msg = "Serviço contratado inválido.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/dashboard?flash=servico-contrato-erro#services");
    }

    if (!STATUS_SERVICOS.includes(status)) {
      const msg = "Status inválido.";
      if (wantsJson) return res.status(400).json({ ok: false, msg, statusPermitidos: STATUS_SERVICOS });
      return res.redirect("/dashboard?flash=servico-contrato-erro#services");
    }

    try {
      const contrato = await this.servicosContratadosModel.buscarPorId(id);
      if (!contrato) {
        const msg = "Serviço contratado não encontrado.";
        if (wantsJson) return res.status(404).json({ ok: false, msg });
        return res.redirect("/dashboard?flash=servico-contrato-erro#services");
      }

      const produtosBrutos = req.body.produtos;
      let produtos = [];

      if (Array.isArray(produtosBrutos)) {
        produtos = produtosBrutos;
      } else if (typeof produtosBrutos === "string" && produtosBrutos.trim()) {
        try {
          produtos = JSON.parse(produtosBrutos);
        } catch (err) {
          produtos = [];
        }
      } else if (produtosBrutos && typeof produtosBrutos === "object") {
        produtos = [produtosBrutos];
      }

      const produtosValidos = [];
      for (const item of produtos) {
        const produtoId = Number(item.produtoId);
        const quantidade = Number(item.quantidade || 0);
        if (!produtoId || quantidade <= 0) continue;

        const produto = await this.produtosModel.buscarPorId(produtoId);
        if (!produto) continue;

        const estoqueAtual = await this.lotesModel.obterEstoqueProduto(produtoId);
        if (estoqueAtual < quantidade) {
          const msg = `Estoque insuficiente para o produto ${produto.nome}.`;
          if (wantsJson) return res.status(400).json({ ok: false, msg });
          return res.redirect("/dashboard?flash=estoque-insuficiente#services");
        }

        const precoUnitario = Number(produto.precoNumber || 0);
        produtosValidos.push({ produtoId, quantidade, precoUnitario, valorTotal: precoUnitario * quantidade });
      }

      let vendaId = null;
      let vendaTotal = 0;

      if (status === "finalizado" && produtosValidos.length) {
        vendaTotal = produtosValidos.reduce((sum, item) => sum + item.valorTotal, 0);
        vendaId = await this.vendasModel.criar({
          clienteId: contrato.clienteId,
          valorTotal: vendaTotal,
          statusId: 18,
          metodoPagamentoId: 13,
          enderecoEntrega: null,
          frete: 0,
        });

        for (const item of produtosValidos) {
          await this.itensVendaModel.criar({
            vendaId,
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
          });
          await this.lotesModel.ajustarEstoqueManual(item.produtoId, -item.quantidade);
        }
      }

      await this.servicosContratadosModel.atualizarStatus(id, { status, observacoes });
      await this.agendamentosModel.atualizar({
        agendamentoId: contrato.agendamentoId,
        acrescimoValor: vendaTotal,
        observacoes,
      });

      let agendamentoAtualizado = null;
      try {
        agendamentoAtualizado = await this.agendamentosModel.buscarPorId(contrato.agendamentoId);
      } catch (e) {
        agendamentoAtualizado = null;
      }

      if (wantsJson) {
        const msg = `Status atualizado${vendaId ? " e venda registrada." : "."}`;
        return res.json({ ok: true, msg, vendaId: vendaId || null, vendaTotal: vendaTotal || 0, agendamento: agendamentoAtualizado });
      }
    } catch (err) {
      console.error("Erro ao atualizar status do serviço contratado:", err && err.stack ? err.stack : err);
      if (wantsJson) {
        const msg = err && err.message ? err.message : "Erro ao atualizar status.";
        return res.status(500).json({ ok: false, msg, error: String(err && err.stack ? err.stack.split('\n').slice(0,5).join('\n') : err) });
      }
      return res.redirect("/dashboard?flash=servico-contrato-erro#services");
    }

    return res.redirect("/dashboard?flash=servico-contrato-atualizado#services");
  }
}

module.exports = AdminController;

