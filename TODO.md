# TODO - Register: criar conta ao submeter

- [ ] Entender como o backend recebe o POST do cadastro (rota e controller).

- [ ] Verificar se existe rota POST /register (ou similar) e se chama UsuariosModels.criar.
- [ ] Ajustar `Biopower/views/register.ejs` para enviar campos para o endpoint correto (ou criar hidden fields).
- [ ] Ajustar `Biopower/public/assets/js/screens/register.js` para não só validar, mas também efetuar o POST via fetch/faz form submit para a rota existente.
- [ ] Validar tratamento de erros/retorno após criação.
- [ ] Testar: cadastrar usuário com dados válidos e confirmar no banco.
- [x] Criar endpoint POST /register + controller registerPost.
- [x] Ajustar EJS para enviar action /register e adicionar name nos campos.
- [x] Ajustar front para permitir submit quando tudo estiver válido.


