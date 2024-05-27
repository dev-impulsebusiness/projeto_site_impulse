const express = require("express");
const routes = express.Router();

const controller_funcionarios = require("../controllers/controller_Funcionarios");
const controller_clientes = require("../controllers/controller_Clientes");
const controller_produtos = require("../controllers/controller_Produtos");
const controller_aquisicoes = require("../controllers/controller_Aquisicoes");
const controller_usuarios = require("../controllers/controller_Usuarios");
const controller_login = require("../controllers/controller_Login");
const controller_form1 = require("../controllers/controller_Formulario1");
const controller_form2 = require("../controllers/controller_Formulario2");
const controller_acessos = require("../controllers/controller_Acessos");
const controller_roles = require('../controllers/controller_Roles');
const controller_permissions = require('../controllers/controller_Permissions');
const controller_acl = require('../controllers/controller_AccessControlList');
const controller_trabalheConosco = require("../controllers/controller_TrabalheConosco");
const controller_recuperarSenha = require("../controllers/controller_RecuperacaoDeSenha");
const controller_pipefy = require("../controllers/controller_Pipefy");
const controller_criarAlgoJuntos = require("../controllers/controller_CriarAlgoJuntos");
const controller_cargo = require("../controllers/controller_Cargo");
const controller_departamento = require("../controllers/controller_Departamento");
const controller_omie = require('../controllers/controller_Omie');
const controller_notificacao = require("../controllers/controller_Notificacoes");

const middleware_autenticacao = require("../middlewares/middleware_autenticacao");
const midlleware_RolePermission = require("../middlewares/middleware_roles");

// Testes


//Rotas de Notificação
routes.post("/notificacao",middleware_autenticacao.auth,(req, res, next)=>{
        req.permission = "CriarNotificacao"
        next()},midlleware_RolePermission.verificaRole, controller_notificacao.createNotification);
routes.post("/notificacaoAgendada",middleware_autenticacao.auth,(req, res, next)=>{
        req.permission = "CriarNotificacao"
        next()},midlleware_RolePermission.verificaRole, controller_notificacao.createNotificationScheduled);
routes.get("/notificacoes",middleware_autenticacao.auth, controller_notificacao.searchNotification); 
routes.post("/notificacaoCheck",middleware_autenticacao.auth, controller_notificacao.checkNotification);

// Rotas de Roles e Permissions
routes.get("/", controller_funcionarios.welcome);
routes.put("/editRole",middleware_autenticacao.auth,(req, res, next)=>{
        req.permission = "EditarRole"
        next()},midlleware_RolePermission.verificaRole, controller_acl.editRoles);

// Rotas de Captura do Site
routes.post("/nov0l34d", controller_criarAlgoJuntos.criarCard)

// Rota de Recuperação de Senhas 
routes.post("/recuperarSenha", controller_recuperarSenha.index);
routes.post("/cadastrarNovaSenha", controller_recuperarSenha.updatePassword);

// Rotas Para Dash Pipefy
routes.get("/pipefy",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarDashboardPipefy"
    next()},midlleware_RolePermission.verificaRole, controller_pipefy.run);

// Rotas de Funcionários
routes.post("/funcionarios",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "CriarFuncionario"
    next()},midlleware_RolePermission.verificaRole, controller_funcionarios.create);
routes.get("/funcionarios",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarFuncionario"
    next()},midlleware_RolePermission.verificaRole, controller_funcionarios.searchAll);
routes.get("/funcionarios/:nomeFuncionario",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarFuncionario"
    next()},midlleware_RolePermission.verificaRole, controller_funcionarios.search);
routes.get("/funcionarios/buscar/:id",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarFuncionario"
    next()},midlleware_RolePermission.verificaRole, controller_funcionarios.search_Id);
routes.put("/funcionarios/:id",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "EditarFuncionario"
    next()},midlleware_RolePermission.verificaRole, controller_funcionarios.updateOne);
routes.delete("/funcionarios/:id",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "ApagarFuncionario"
    next()},midlleware_RolePermission.verificaRole, controller_funcionarios.deleteOne);

//Rotas de Clientes
routes.post("/clientes",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "CriarClientes"
    next()},midlleware_RolePermission.verificaRole, controller_clientes.create);
routes.get("/clientes",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarClientes"
    next()},midlleware_RolePermission.verificaRole, controller_clientes.searchAll);
routes.get("/clientes/:id",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarClientes"
    next()},midlleware_RolePermission.verificaRole, controller_clientes.search);
routes.put("/clientes/:id",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "EditarClientes"
    next()},midlleware_RolePermission.verificaRole, controller_clientes.updateOne);
routes.delete("/clientes/:id",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "ApagarClientes"
    next()},midlleware_RolePermission.verificaRole, controller_clientes.deleteOne);

//Rotas de Servicos/produtos
routes.post("/servicos",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "CriarProdutos"
    next()},midlleware_RolePermission.verificaRole, controller_produtos.create);
routes.get("/servicos",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarProdutos"
    next()},midlleware_RolePermission.verificaRole, controller_produtos.searchAll);
routes.get("/servicos/:id",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarProdutos"
    next()},midlleware_RolePermission.verificaRole, controller_produtos.searchId);
routes.put("/servicos/:id",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "EditarProdutos"
    next()},midlleware_RolePermission.verificaRole, controller_produtos.updateOne);
routes.delete("/servicos/:id",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "ApagarProdutos"
    next()},midlleware_RolePermission.verificaRole, controller_produtos.deleteOne);

//Rotas de Aquisições/clienteservicos
routes.post("/clienteservicos",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "CriarClienteServico"
    next()},midlleware_RolePermission.verificaRole, controller_aquisicoes.create);
routes.get("/clienteservicos",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarClienteServico"
    next()},midlleware_RolePermission.verificaRole, controller_aquisicoes.searchAll);
routes.get("/clienteservicos/fk/:id",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarClienteServico"
    next()},midlleware_RolePermission.verificaRole, controller_aquisicoes.searchIdFk);
routes.get("/clienteservicos/:id",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarClienteServico"
    next()},midlleware_RolePermission.verificaRole, controller_aquisicoes.searchId);
routes.put("/clienteservicos/:id",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "EditarClienteServico"
    next()},midlleware_RolePermission.verificaRole, controller_aquisicoes.updateOne);
routes.delete("/clienteservicos/:id",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "ApagarClienteServico"
    next()},midlleware_RolePermission.verificaRole, controller_aquisicoes.deleteOne);

// Rotas de Usuários
routes.post("/user/create", controller_usuarios.createUser);

routes.get("/search/users",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarUsuario"
    next()}, midlleware_RolePermission.verificaRole, controller_usuarios.searchUsers);

routes.get("/user/:id",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarUsuario"
    next()}, midlleware_RolePermission.verificaRole, controller_usuarios.searchUsersById);

routes.put("/user/edit",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "EditarUsuario"
    next()}, controller_usuarios.editFunc);
//EditarUsuario

// Rota de Autenticação
routes.post("/auth", controller_login.autenticaUsuario);

//Rotas de Formulários
routes.post("/formularios/form1",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "CriarFormularioNPS"
    next()},midlleware_RolePermission.verificaRole, controller_form1.create);
routes.post("/formularios/form1/buscar",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarFormularioNPS"
    next()},midlleware_RolePermission.verificaRole, controller_form1.searchOne);
routes.post("/formularios/form2",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "CriarFormularioEmpresa"
    next()},midlleware_RolePermission.verificaRole, controller_form2.create);
routes.post("/formularios/form2/buscar",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarFormularioEmpresa"
    next()},midlleware_RolePermission.verificaRole, controller_form2.search);
routes.get("/formularios/relatorio",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarRelatorioFormularioNPS"
    next()},midlleware_RolePermission.verificaRole, controller_form1.relatorio);
routes.get('/formularios/form1/informacoes',middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarFormularioNPS"
    next()},midlleware_RolePermission.verificaRole, controller_form1.formulariosSearch);
routes.get('/formularios/form1/:id',middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarFormularioNPS"
    next()},midlleware_RolePermission.verificaRole, controller_form1.formulariosSearchById);

// Rotas de Acessos/acessossites
routes.post("/acessossites",middleware_autenticacao.auth, (req, res, next)=>{
    req.permission = "CriarAcesso"
    next()},midlleware_RolePermission.verificaRole,controller_acessos.create);

routes.get("/acessossites",middleware_autenticacao.auth, (req, res, next)=>{
    req.permission = "BuscarAcesso"
    next()},midlleware_RolePermission.verificaRole,controller_acessos.searchAll);

routes.get("/acessossites/:id",middleware_autenticacao.auth, (req, res, next)=>{
    req.permission = "BuscarAcesso"
    next()}, controller_acessos.searchId);
routes.put("/acessossites/:id",middleware_autenticacao.auth, (req, res, next)=>{
    req.permission = "EditarAcesso"
    next()},midlleware_RolePermission.verificaRole, controller_acessos.updateOne);
routes.delete("/acessossites/:id",middleware_autenticacao.auth, (req, res, next)=>{
    req.permission = "ApagarAcesso"
    next()},midlleware_RolePermission.verificaRole, controller_acessos.deleteOne);

//Rotas de Candidatos
routes.post("/candidatos", controller_trabalheConosco.create);
routes.get("/candidatos",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarTrabalheConosco"
    next()},midlleware_RolePermission.verificaRole, controller_trabalheConosco.searchAll);
routes.get("/candidatos/nomeouvaga",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarTrabalheConosco"
    next()},midlleware_RolePermission.verificaRole, controller_trabalheConosco.searchByNameOrJobs);
routes.get("/candidatos/buscar/:id",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarTrabalheConosco"
    next()},midlleware_RolePermission.verificaRole, controller_trabalheConosco.searchById);
routes.put("/candidatos/:id",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "EditarTrabalheConosco"
    next()},midlleware_RolePermission.verificaRole, controller_trabalheConosco.updateOne);
routes.delete("/candidatos/:id",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "ApagarTrabalheConosco"
    next()},midlleware_RolePermission.verificaRole, controller_trabalheConosco.deleteOne);

//Subrotas de observações com vinculo a candidatos.
routes.post("/candidatos/:id/obs",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "CriarComentarioTrabalheConosco"
    next()},midlleware_RolePermission.verificaRole, controller_trabalheConosco.createObs);
routes.get("/candidatos/:id/obs",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarComentarioTrabalheConosco"
    next()},midlleware_RolePermission.verificaRole, controller_trabalheConosco.searchAllObs);
routes.get("/candidatos/:id/obs/:idObs",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarComentarioTrabalheConosco"
    next()},midlleware_RolePermission.verificaRole, controller_trabalheConosco.searchObsById);
routes.put("/candidatos/:id/obs/:idObs",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "EditarComentarioTrabalheConosco"
    next()},midlleware_RolePermission.verificaRole, controller_trabalheConosco.updateOne);
routes.delete("/candidatos/:id/obs/:idObs",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "ApagarComentarioTrabalheConosco"
    next()},midlleware_RolePermission.verificaRole, controller_trabalheConosco.deleteObsOne);

// Rotas de Cargo
routes.get("/buscar/cargo",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarCargo"
    next()},midlleware_RolePermission.verificaRole, controller_cargo.searchAll);

routes.get("/buscar/cargo/:id", middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarCargo"
    next()},midlleware_RolePermission.verificaRole, controller_cargo.searchById);

routes.post("/criar/cargo", middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "CriarCargo"
    next()},midlleware_RolePermission.verificaRole, controller_cargo.create);

routes.put("/editar/cargo", middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "EditarCargo"
    next()},midlleware_RolePermission.verificaRole, controller_cargo.update);

routes.delete("/delete/cargo/:id", middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "ApagarCargo"
    next()},midlleware_RolePermission.verificaRole, controller_cargo.delete);

// Rotas de Departamento
routes.get("/buscar/departamento",middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarDepartamento"
    next()},midlleware_RolePermission.verificaRole, controller_departamento.searchAll);

routes.get("/buscar/departamento/:id", middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarDepartamento"
    next()},midlleware_RolePermission.verificaRole, controller_departamento.searchById);

routes.post("/criar/departamento", middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "CriarDepartamento"
    next()},midlleware_RolePermission.verificaRole, controller_departamento.create);

routes.put("/editar/departamento", middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "EditarDepartamento"
    next()},midlleware_RolePermission.verificaRole, controller_departamento.update);

routes.delete("/delete/departamento/:id", middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "ApagarDepartamento"
    next()},midlleware_RolePermission.verificaRole, controller_departamento.delete);

    // Rotas do Omie
routes.get("/omie/indicadores", middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarDashboardOmie"
    next()},midlleware_RolePermission.verificaRole, controller_omie.getDistinctIndicadores);

routes.get("/omie/mesref", middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarDashboardOmie"
    next()},midlleware_RolePermission.verificaRole, controller_omie.getDistinctMesRef);

routes.get("/omie/indicadores/mes", middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarDashboardOmie"
    next()},midlleware_RolePermission.verificaRole, controller_omie.searchByMesRef);

routes.get("/omie/relatorio", middleware_autenticacao.auth,(req, res, next)=>{
    req.permission = "BuscarDashboardOmie"
    next()},midlleware_RolePermission.verificaRole, controller_omie.searchByIntervalo);


module.exports = routes;
