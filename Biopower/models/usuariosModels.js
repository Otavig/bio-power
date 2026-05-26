const Database = require("../utils/database");
const banco = new Database();

class UsuariosModels {
  #usuId;
  #usuNome;
  #usuSobrenome;
  #usuEmail;
  #usuSenha;
  #usuCpfCnpj;

  #usuTelefone;
  #usuDataNascimento;
  #usuEstadoCivil;

  #usuCep;
  #usuLogradouro;
  #usuNumero;
  #usuBairro;
  #usuCidade;
  #usuUf;
  #usuComplemento;

  #usuGenero;
  #usuTypeId;
  #usuAtivo;

  constructor(
    usuNome,
    usuSobrenome,
    usuEmail,
    usuSenha,
    usuCpfCnpj,

    usuTelefone,
    usuDataNascimento,
    usuEstadoCivil,

    usuCep,
    usuLogradouro,
    usuNumero,
    usuBairro,
    usuCidade,
    usuUf,
    usuComplemento,

    usuGenero,
    usuTypeId,
    usuAtivo = 1,
    usuId = null,
  ) {
    this.#usuId = usuId;
    this.#usuNome = usuNome;
    this.#usuSobrenome = usuSobrenome;
    this.#usuEmail = usuEmail;
    this.#usuSenha = usuSenha;
    this.#usuCpfCnpj = usuCpfCnpj;

    this.#usuTelefone = usuTelefone;
    this.#usuDataNascimento = usuDataNascimento;
    this.#usuEstadoCivil = usuEstadoCivil;

    this.#usuCep = usuCep;
    this.#usuLogradouro = usuLogradouro;
    this.#usuNumero = usuNumero;
    this.#usuBairro = usuBairro;
    this.#usuCidade = usuCidade;
    this.#usuUf = usuUf;
    this.#usuComplemento = usuComplemento;

    this.#usuGenero = usuGenero;
    this.#usuTypeId = usuTypeId;
    this.#usuAtivo = usuAtivo;
  }

  get usuId() {
    return this.#usuId;
  }

  set usuId(usuId) {
    this.#usuId = usuId;
  }

  get usuNome() {
    return this.#usuNome;
  }

  set usuNome(usuNome) {
    this.#usuNome = usuNome;
  }

  get usuSobrenome() {
    return this.#usuSobrenome;
  }

  set usuSobrenome(usuSobrenome) {
    this.#usuSobrenome = usuSobrenome;
  }

  get usuEmail() {
    return this.#usuEmail;
  }

  set usuEmail(usuEmail) {
    this.#usuEmail = usuEmail;
  }

  get usuSenha() {
    return this.#usuSenha;
  }

  set usuSenha(usuSenha) {
    this.#usuSenha = usuSenha;
  }

  get usuCpfCnpj() {
    return this.#usuCpfCnpj;
  }

  set usuCpfCnpj(usuCpfCnpj) {
    this.#usuCpfCnpj = usuCpfCnpj;
  }

  get usuTelefone() {
    return this.#usuTelefone;
  }

  set usuTelefone(usuTelefone) {
    this.#usuTelefone = usuTelefone;
  }

  get usuDataNascimento() {
    return this.#usuDataNascimento;
  }

  set usuDataNascimento(usuDataNascimento) {
    this.#usuDataNascimento = usuDataNascimento;
  }

  get usuEstadoCivil() {
    return this.#usuEstadoCivil;
  }

  set usuEstadoCivil(usuEstadoCivil) {
    this.#usuEstadoCivil = usuEstadoCivil;
  }

  get usuCep() {
    return this.#usuCep;
  }

  set usuCep(usuCep) {
    this.#usuCep = usuCep;
  }

  get usuLogradouro() {
    return this.#usuLogradouro;
  }

  set usuLogradouro(usuLogradouro) {
    this.#usuLogradouro = usuLogradouro;
  }

  get usuNumero() {
    return this.#usuNumero;
  }

  set usuNumero(usuNumero) {
    this.#usuNumero = usuNumero;
  }

  get usuBairro() {
    return this.#usuBairro;
  }

  set usuBairro(usuBairro) {
    this.#usuBairro = usuBairro;
  }

  get usuCidade() {
    return this.#usuCidade;
  }

  set usuCidade(usuCidade) {
    this.#usuCidade = usuCidade;
  }

  get usuUf() {
    return this.#usuUf;
  }

  set usuUf(usuUf) {
    this.#usuUf = usuUf;
  }

  get usuComplemento() {
    return this.#usuComplemento;
  }

  set usuComplemento(usuComplemento) {
    this.#usuComplemento = usuComplemento;
  }

  get usuGenero() {
    return this.#usuGenero;
  }

  set usuGenero(usuGenero) {
    this.#usuGenero = usuGenero;
  }

  get usuTypeId() {
    return this.#usuTypeId;
  }

  set usuTypeId(usuTypeId) {
    this.#usuTypeId = usuTypeId;
  }

  get usuAtivo() {
    return this.#usuAtivo;
  }

  set usuAtivo(usuAtivo) {
    this.#usuAtivo = usuAtivo;
  }

  async listar() {
    const sql = "select * from tb_Usuarios";
    const rows = await banco.ExecutaComando(sql);

    const lista = [];

    for (let i = 0; i < rows.length; i++) {
      const usuarios = new UsuariosModels(
        rows[i]["usu_nome"],
        rows[i]["usu_sobrenome"],
        rows[i]["usu_email"],
        rows[i]["usu_senha"],
        rows[i]["usu_cpf_cnpj"],

        rows[i]["usu_telefone"],
        rows[i]["usu_data_nascimento"],
        rows[i]["usu_estado_civil"],

        rows[i]["usu_cep"],
        rows[i]["usu_logradouro"],
        rows[i]["usu_numero"],
        rows[i]["usu_bairro"],
        rows[i]["usu_cidade"],
        rows[i]["usu_uf"],
        rows[i]["usu_complemento"],

        rows[i]["usu_genero"],
        rows[i]["usu_typ_id"],
        rows[i]["usu_ativo"],
        rows[i]["usu_id"],
      );

      lista.push(usuarios);
    }

    return lista;
  }

  async buscarPorId(id) {
    const sql = "select * from tb_Usuarios where usu_id = ?";
    const rows = await banco.ExecutaComando(sql, [id]);

    if (rows.length === 0) return null;

    const u = rows[0];

    return new UsuariosModels(
      u["usu_nome"],
      u["usu_sobrenome"],
      u["usu_email"],
      u["usu_senha"],
      u["usu_cpf_cnpj"],

      u["usu_telefone"],
      u["usu_data_nascimento"],
      u["usu_estado_civil"],

      u["usu_cep"],
      u["usu_logradouro"],
      u["usu_numero"],
      u["usu_bairro"],
      u["usu_cidade"],
      u["usu_uf"],
      u["usu_complemento"],

      u["usu_genero"],
      u["usu_typ_id"],
      u["usu_ativo"],
      u["usu_id"],
    );
  }

  async criar({
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
    ativo = 1,
  }) {
    const sql = `
      insert into tb_Usuarios
      (
        usu_nome,
        usu_sobrenome,
        usu_email,
        usu_senha,
        usu_cpf_cnpj,

        usu_telefone,
        usu_data_nascimento,
        usu_estado_civil,

        usu_cep,
        usu_logradouro,
        usu_numero,
        usu_bairro,
        usu_cidade,
        usu_uf,
        usu_complemento,

        usu_genero,
        usu_typ_id,
        usu_ativo
      )

      values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const novoId = await banco.ExecutaComandoLastInserted(sql, [
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
    ]);

    return novoId;
  }

  async atualizar(id, usuario) {
    const campos = [];
    const valores = [];

    if (usuario.nome !== undefined) {
      campos.push("usu_nome = ?");
      valores.push(usuario.nome);
    }

    if (usuario.sobrenome !== undefined) {
      campos.push("usu_sobrenome = ?");
      valores.push(usuario.sobrenome);
    }

    if (usuario.email !== undefined) {
      campos.push("usu_email = ?");
      valores.push(usuario.email);
    }

    if (
      usuario.senha !== undefined &&
      usuario.senha !== null &&
      usuario.senha !== ""
    ) {
      campos.push("usu_senha = ?");
      valores.push(usuario.senha);
    }

    if (usuario.cpfCnpj !== undefined) {
      campos.push("usu_cpf_cnpj = ?");
      valores.push(usuario.cpfCnpj);
    }

    if (usuario.telefone !== undefined) {
      campos.push("usu_telefone = ?");
      valores.push(usuario.telefone);
    }

    if (usuario.dataNascimento !== undefined) {
      campos.push("usu_data_nascimento = ?");
      valores.push(usuario.dataNascimento);
    }

    if (usuario.estadoCivil !== undefined) {
      campos.push("usu_estado_civil = ?");
      valores.push(usuario.estadoCivil);
    }

    if (usuario.cep !== undefined) {
      campos.push("usu_cep = ?");
      valores.push(usuario.cep);
    }

    if (usuario.logradouro !== undefined) {
      campos.push("usu_logradouro = ?");
      valores.push(usuario.logradouro);
    }

    if (usuario.numero !== undefined) {
      campos.push("usu_numero = ?");
      valores.push(usuario.numero);
    }

    if (usuario.bairro !== undefined) {
      campos.push("usu_bairro = ?");
      valores.push(usuario.bairro);
    }

    if (usuario.cidade !== undefined) {
      campos.push("usu_cidade = ?");
      valores.push(usuario.cidade);
    }

    if (usuario.uf !== undefined) {
      campos.push("usu_uf = ?");
      valores.push(usuario.uf);
    }

    if (usuario.complemento !== undefined) {
      campos.push("usu_complemento = ?");
      valores.push(usuario.complemento);
    }

    if (usuario.genero !== undefined) {
      campos.push("usu_genero = ?");
      valores.push(usuario.genero);
    }

    if (usuario.typeId !== undefined) {
      campos.push("usu_typ_id = ?");
      valores.push(usuario.typeId);
    }

    if (usuario.ativo !== undefined) {
      campos.push("usu_ativo = ?");
      valores.push(usuario.ativo);
    }

    if (campos.length === 0) return false;

    const sql = `update tb_Usuarios set ${campos.join(", ")} where usu_id = ?`;

    valores.push(id);

    return banco.ExecutaComandoNonQuery(sql, valores);
  }

  async desativar(id) {
    const sql = "update tb_Usuarios set usu_ativo = 0 where usu_id = ?";

    return banco.ExecutaComandoNonQuery(sql, [id]);
  }

  async login() {
    const sql = `
      select *
      from tb_Usuarios
      where usu_email = ?
      and usu_senha = ?
      and usu_ativo = 1
    `;

    const rows = await banco.ExecutaComando(sql, [
      this.#usuEmail,
      this.#usuSenha,
    ]);

    if (rows.length > 0) {
      const usuario = new UsuariosModels(
        rows[0]["usu_nome"],
        rows[0]["usu_sobrenome"],
        rows[0]["usu_email"],
        rows[0]["usu_senha"],
        rows[0]["usu_cpf_cnpj"],

        rows[0]["usu_telefone"],
        rows[0]["usu_data_nascimento"],
        rows[0]["usu_estado_civil"],

        rows[0]["usu_cep"],
        rows[0]["usu_logradouro"],
        rows[0]["usu_numero"],
        rows[0]["usu_bairro"],
        rows[0]["usu_cidade"],
        rows[0]["usu_uf"],
        rows[0]["usu_complemento"],

        rows[0]["usu_genero"],
        rows[0]["usu_typ_id"],
        rows[0]["usu_ativo"],
        rows[0]["usu_id"],
      );

      return usuario;
    } else {
      return null;
    }
  }
}

module.exports = UsuariosModels;
