const UsuariosModels = require("../models/usuariosModels");

class UsuariosController {

  async autentificacao(req, res) {
    res.render("Usuarios/autentificacao", { layout: false });
  }

  async login(req, res) {
    res.render("Usuarios/login", {
      layout: false,
      error: null,
      form: { email: "" },
    });
  }

  async loginPost(req, res) {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = (req.body.password || "").trim();

    try {
      const usuarioModel = new UsuariosModels();
      usuarioModel.usuEmail = email;
      usuarioModel.usuSenha = password;

      const usuario = await usuarioModel.login();

      if (!usuario) {
        return res.render("login", {
          layout: false,
          error: "Credenciais inválidas ou usuário inativo.",
          form: { email },
        });
      }

      // Roles em minúsculo para bater com o middleware ensureAdmin
      let role = "client";
      let roleDisplay = "Cliente";
      if (Number(usuario.usuTypeId) === 1) { role = "admin"; roleDisplay = "Administrador"; }
      else if (Number(usuario.usuTypeId) === 2) { role = "staff"; roleDisplay = "Funcionario"; }

      req.session.user = {
        id: usuario.usuId,
        email: usuario.usuEmail,
        role,
        name: usuario.usuNome,
        typeId: usuario.usuTypeId,
        roleDisplay,
      };

      const redirectTo = (role === "admin" || role === "staff") ? "/dashboard" : "/";
      return res.redirect(redirectTo);
    } catch (err) {
      console.error("Erro no login:", err);
      return res.render("login", {
        layout: false,
        error: "Erro ao autenticar. Tente novamente.",
        form: { email },
      });
    }
  }

  async logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/auth");
    });
  }

  async registerView(req, res) {
    let usuarios = new UsuariosModels();
    let listaUsuarios = await usuarios.listar();
    res.render("Usuarios/register", { layout: false, listaUsuarios });
  }

  async register(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");

    const {
      nome,
      sobrenome,
      email,
      senha,
      cpfCnpj,
        telefone,
      dataNascimento,
      estadoCivil,
      cep,
      logradouro,
      numero,
      bairro,
      cidade,
      uf,
      complemento,
      genero,
      typeId,
      ativo,
    } = req.body;

    const errors = {};

    if (!nome) errors.nome = "Informe o nome.";
    if (!sobrenome) errors.sobrenome = "Informe o sobrenome.";
    if (!email) errors.email = "Informe o e-mail.";
    if (!senha) errors.senha = "Informe a senha.";
    if (!cpfCnpj) errors.cpf = "Informe o CPF.";
    if (!telefone) errors.telefone = "Informe o telefone.";
    if (!dataNascimento) errors.data = "Informe a data de nascimento.";
    if (!estadoCivil && estadoCivil !== 0) errors.estadoCivil = "Selecione o estado civil.";
    if (!cep) errors.cep = "Informe o CEP.";
    if (!logradouro) errors.rua = "Informe o endereço.";
    if (!numero) errors.numero = "Informe o número.";
    if (!bairro) errors.bairro = "Informe o bairro.";
    if (!cidade) errors.cidade = "Informe a cidade.";
    if (!uf) errors.estado = "Selecione o estado.";
    if (!genero && genero !== 0) errors.genero = "Selecione o gênero.";
    if (!typeId) errors.typeId = "Informe o tipo de usuário.";

    if (Object.keys(errors).length > 0) {
      const payload = { ok: false, msg: "Preencha os campos obrigatórios.", errors };
      if (wantsJson) return res.status(400).json(payload);
      return res.redirect("/register");
    }

    try {
      const usuariosModel = new UsuariosModels();
      const novoId = await usuariosModel.criar({
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        email: email.trim().toLowerCase(),
        senha: senha.trim(),
        cpfCnpj: String(cpfCnpj).trim(),
        telefone: String(telefone).trim(),
        dataNascimento: dataNascimento,
        estadoCivil: Number(estadoCivil),
        cep: String(cep).trim(),
        logradouro: String(logradouro).trim(),
        numero: String(numero).trim(),
        bairro: String(bairro).trim(),
        cidade: String(cidade).trim(),
        uf: String(uf).trim().toUpperCase(),
        complemento: complemento?.trim() || null,
        genero: Number(genero),
        typeId: Number(typeId),
        ativo: Number(ativo ?? 1),
      });

      const payload = {
        ok: true,
        msg: "Cadastro realizado com sucesso.",
        id: novoId,
        redirectTo: "/login",
      };

      if (wantsJson) return res.status(201).json(payload);
      return res.redirect("/login");
    } catch (err) {
      console.error("Erro ao cadastrar usuário:", err);

      const payload = {
        ok: false,
        msg: "Erro ao cadastrar usuário.",
      };

      if (wantsJson) return res.status(500).json(payload);
      return res.redirect("/register");
    }
  }

  async listarUsuarios(req, res) {
      let usuarios = new UsuariosModels();
      let listaUsuarios = await usuarios.listar();
      res.render("dashboard/dashboard", { layout: false, listaUsuarios, products: [], user: req.session.user, flash: null });
  }

}


module.exports = UsuariosController;