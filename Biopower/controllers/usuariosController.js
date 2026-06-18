const UsuariosModels = require("../models/usuariosModels");

class UsuariosController {
  async autentificacao(req, res) {
    res.render("autentificacao", { layout: false });
  }

  async login(req, res) {
    res.render("login", { layout: false, error: null, form: { email: "" } });
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

  async register(req, res) {
    res.render("register", { layout: false });
  }

  async registerPost(req, res) {
    const wantsJson = req.is("application/json") || req.headers.accept?.includes("application/json");

    const nome = (req.body.nome || "").trim();
    const sobrenome = (req.body.sobrenome || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const senha = (req.body.senha || "").trim();

    const cpf = (req.body.cpf || "").replace(/\D/g, "");
    const cep = (req.body.cep || "").replace(/\D/g, "");
    const cidade = (req.body.cidade || "").trim();
    const estado = (req.body.estado || "").trim();
    const bairro = (req.body.bairro || "").trim();
    const rua = (req.body.rua || "").trim();
    const numero = (req.body.numero || "").trim();
    const complemento = (req.body.complemento || "").trim();
    const data = (req.body.data || "").trim();
    const estadoCivil = (req.body.estadoCivil || "").trim();
    const genero = (req.body.genero || "").trim();

    // Neste projeto, a tabela tb_Usuarios tem apenas campos principais para criação.
    // Campos de endereço são coletados no front, mas ainda não persistidos aqui.
    // Mantemos o comportamento mínimo para garantir criação real.

    const fullName = [nome, sobrenome].filter(Boolean).join(" ");

    if (!fullName || !email || !senha) {
      const msg = "Campos obrigatorios: nome, email e senha.";
      if (wantsJson) return res.status(400).json({ ok: false, msg });
      return res.redirect("/register?error=" + encodeURIComponent(msg));
    }

    try {
      const usuariosModel = new UsuariosModels();

      // typeId: 3 = client (pelos métodos existentes: listarClientes usa usu_typ_id = 3)
      const createdId = await usuariosModel.criar({
        nome: fullName,
        email,
        senha,
        cpfCnpj: cpf || null,
        typeId: 3,
        ativo: 1,
      });

      // opcional: logar o usuário imediatamente (pelo loginPost que monta sessão)
      req.session.user = {
        id: createdId,
        email,
        role: "client",
        name: fullName,
        typeId: 3,
        roleDisplay: "Cliente",
      };

      return res.redirect("/");
    } catch (err) {
      console.error("Erro no registerPost:", err);
      const msg = "Erro ao cadastrar usuario.";
      if (wantsJson) return res.status(500).json({ ok: false, msg });
      return res.redirect("/register?error=" + encodeURIComponent(msg));
    }
  }

  async listarUsuarios(req, res) {
      let usuarios = new UsuariosModels();
      let listaUsuarios = await usuarios.listar();
      res.render("dashboard/dashboard", { layout: false, listaUsuarios, products: [], user: req.session.user, flash: null });
  }
}



module.exports = UsuariosController;