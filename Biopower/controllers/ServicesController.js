const ServicosModels = require("../models/servicosModels");
const ItensServicosModels = require("../models/itensServicosModels");
const AgendamentosModels = require("../models/agendamentosModels");
const UsuariosModels = require("../models/usuariosModels");

class ServicesController {
  constructor() {
    this.servicosModel = new ServicosModels();
    this.contratosModel = new ItensServicosModels();
    this.agendamentosModel = new AgendamentosModels();
    this.usuariosModel = new UsuariosModels();
  }

  async page(req, res) {
    let services = [];
    let meusServicos = [];
    const user = req.session.user;

    try {
      services = await this.servicosModel.listar();
    } catch (err) {
      console.error("Erro ao listar servicos:", err);
      services = [];
    }

    if (user) {
      try {
        const itens = await this.contratosModel.listarPorCliente(user.id);
        const mapa = new Map();

        for (const item of itens) {
          const chave = `${item.agendamentoId || item.dataAgendamento}|${item.profissionalNome}`;
          if (!mapa.has(chave)) {
            mapa.set(chave, {
              agendamentoId: item.agendamentoId || null,
              dataAgendamento: item.dataAgendamento,
              profissionalNome: item.profissionalNome,
              status: item.status,
              valorTotal: 0,
              servicos: [],
            });
          }

          const grupo = mapa.get(chave);
          grupo.servicos.push({
            nome: item.servicoNome,
            quantidade: Number(item.quantidade || 0),
          });
          grupo.valorTotal += Number(item.valorTotal || 0);
        }

        meusServicos = Array.from(mapa.values());
      } catch (err) {
        console.error("Erro ao listar servicos contratados:", err);
        meusServicos = [];
      }
    }

    res.render("services", { layout: true, services, meusServicos });
  }

  async contratar(req, res) {
    const user = req.session.user;
    if (!user) return res.status(401).json({ ok: false, msg: "Faca login para contratar um servico." });

    const { servicoId, observacoes } = req.body;
    const id = parseInt(servicoId, 10);
    if (Number.isNaN(id)) return res.status(400).json({ ok: false, msg: "Servico invalido." });

    try {
      const servico = await this.servicosModel.buscarPorId(id);
      if (!servico) return res.status(404).json({ ok: false, msg: "Servico nao encontrado." });

      const usuarios = await this.usuariosModel.listar();
      const profissional = usuarios.find((u) => Number(u.usuTypeId) === 2 && Number(u.usuAtivo) === 1);
      if (!profissional) {
        return res.status(400).json({ ok: false, msg: "Nenhum profissional ativo disponivel no momento." });
      }

      const agora = new Date();
      const dataAgendamento = new Date(agora.getTime() + 60 * 60 * 1000);
      const dataAgendamentoSql = dataAgendamento.toISOString().slice(0, 19).replace("T", " ");
      const preco = Number(servico.preco || 0);

      const agendamentoId = await this.agendamentosModel.criar({
        clienteId: user.id,
        profissionalId: profissional.usuId,
        dataAgendamento: dataAgendamentoSql,
        valorTotal: preco,
        observacoes: observacoes || null,
      });

      await this.contratosModel.criar({
        clienteId: user.id,
        profissionalId: profissional.usuId,
        servicoId: id,
        agendamentoId,
        status: "pendente",
        valorUnitario: preco,
        quantidade: 1,
        valorTotal: preco,
      });

      return res.json({ ok: true, msg: "Solicitacao registrada." });
    } catch (err) {
      console.error("Erro ao contratar servico:", err);
      return res.status(500).json({ ok: false, msg: "Erro ao registrar solicitacao." });
    }
  }

  async schedulePage(req, res) {
    const user = req.session.user;
    if (!user) return res.redirect("/login");

    let services = [];
    let profissionais = [];

    try {
      services = await this.servicosModel.listar();
      const usuarios = await this.usuariosModel.listar();
      profissionais = usuarios
        .filter((u) => Number(u.usuTypeId) === 2 && Number(u.usuAtivo) === 1)
        .map((u) => ({ id: u.usuId, nome: u.usuNome }));
    } catch (err) {
      console.error("Erro ao carregar tela de agendamento:", err);
    }

    const preselectedServiceId = Number(req.query?.serviceId || 0) || null;
    return res.render("services-schedule", { layout: true, services, profissionais, preselectedServiceId });
  }

  async finalizarAgendamento(req, res) {
    const user = req.session.user;
    if (!user) return res.status(401).json({ ok: false, msg: "Faca login para continuar." });

    const { dataAgendamento, profissionalId, observacoes, itens } = req.body;
    const profissionalIdNum = Number(profissionalId);

    if (!dataAgendamento || !profissionalIdNum || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ ok: false, msg: "Dados de agendamento invalidos." });
    }

    try {
      const profissionais = (await this.usuariosModel.listar()).filter(
        (u) => Number(u.usuTypeId) === 2 && Number(u.usuAtivo) === 1
      );
      const profissionalExiste = profissionais.some((p) => Number(p.usuId) === profissionalIdNum);
      if (!profissionalExiste) return res.status(400).json({ ok: false, msg: "Profissional invalido." });

      const itensNormalizados = [];
      let totalGeral = 0;

      for (const item of itens) {
        const servicoId = Number(item.servicoId);
        const quantidade = Number(item.quantidade || 1);
        if (!servicoId || quantidade <= 0) continue;

        const servico = await this.servicosModel.buscarPorId(servicoId);
        if (!servico) continue;

        const valorUnitario = Number(servico.preco || 0);
        const valorTotal = valorUnitario * quantidade;
        totalGeral += valorTotal;

        itensNormalizados.push({
          servicoId,
          quantidade,
          valorUnitario,
          valorTotal,
        });
      }

      if (!itensNormalizados.length) {
        return res.status(400).json({ ok: false, msg: "Nenhum item valido para agendar." });
      }

      const agendamentoId = await this.agendamentosModel.criar({
        clienteId: user.id,
        profissionalId: profissionalIdNum,
        dataAgendamento,
        valorTotal: totalGeral,
        observacoes: observacoes || null,
      });

      for (const item of itensNormalizados) {
        await this.contratosModel.criar({
          clienteId: user.id,
          profissionalId: profissionalIdNum,
          servicoId: item.servicoId,
          agendamentoId,
          status: "pendente",
          valorUnitario: item.valorUnitario,
          quantidade: item.quantidade,
          valorTotal: item.valorTotal,
        });
      }

      return res.json({ ok: true, msg: "Agendamento realizado com sucesso." });
    } catch (err) {
      console.error("Erro ao finalizar agendamento:", err);
      return res.status(500).json({ ok: false, msg: "Erro ao finalizar agendamento." });
    }
  }
}

module.exports = ServicesController;
