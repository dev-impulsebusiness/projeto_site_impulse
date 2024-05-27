const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { createHash } = require('crypto');

function criaHash(senha){
    return createHash('sha256').update(senha).digest('hex');
}

exports.createUser = async (req, res) => {
    const {nome, email, senha} = req.body;
    if( !nome || 
        !email ||
        !senha){
          return res.status(400).json({mensagem: "Um ou mais campos obrigatórios não enviados!"})
    }

    const senhaCrypto = criaHash(senha);
    
    try{
        const verificaEmail = await prisma.user.findUnique({
            where:{
                email
            }
        })
        
        if(verificaEmail){
            return res.status(409).json({mensagem: "Email já cadastrado!"})
        }
        const novoUsuario = await prisma.user.create({
            data: {
                nome, 
                email, 
                senha: senhaCrypto,
                UsersRoles: {
                    create: {
                        role:{
                            connect:{
                                id: 2
                            }
                        }
                    }
                }
            }
        })
        
        res.status(200).json({mensagem: "Usuário Cadastrado Com Sucesso!", novoUsuario})

    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
}

exports.searchUsers = async (req, res) => {
    const usuariosTratados = []
    let funcao;
    try{
        const usuarios = await prisma.user.findMany({
            include: {
                UsersRoles:true
            }
        })

        usuarios.map((obj) => {
            let funcao;
            if (obj.UsersRoles && obj.UsersRoles.fk_RoleId) {
              if(obj.UsersRoles.fk_RoleId == 1){
                  funcao = "Admin"
              } if(obj.UsersRoles.fk_RoleId == 2){
                  funcao = "FuncInicial"
              } if(obj.UsersRoles.fk_RoleId == 3){
                  funcao = "Gerente"
              } if(obj.UsersRoles.fk_RoleId == 4){
                  funcao = "FuncDev"
              } if(obj.UsersRoles.fk_RoleId == 5){
                  funcao = "FuncRH"
              } if(obj.UsersRoles.fk_RoleId == 6){
                  funcao = "FuncComercial"
              } if(obj.UsersRoles.fk_RoleId == 7){
                  funcao = "FuncFinanceiro"
              }
            }
            return usuariosTratados.push({
                id: obj.id,
                nome: obj.nome,
                email: obj.email,
                funcao: funcao
            })
          })
        res.status(200).json(usuariosTratados)
    } catch (err){
        console.error(err);
        res.status(500).end();
    }
}

exports.searchUsersById = async (req, res) => {
    const { id } = req.params
    let role;
    try{
        const usuario = await prisma.user.findUnique({
            where:{
                id : Number(id)
            },
            include: {
                UsersRoles:true
            }
        })
        const roleMap = {
            1: "Admin",
            2: "FuncInicial",
            3: "Gerente",
            4: "FuncDev",
            5: "FuncRH",
            6: "FuncComercial",
            7: "FuncFinanceiro"
          };
          
        role = roleMap[usuario.UsersRoles[0].fk_RoleId];
        res.status(200).json({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                funcao: role
        })

    } catch (err){
        console.error(err);
        res.status(500).end();
    }
}

exports.editFunc = async(req, res) => {
    const { id, nome, email } = req.body;
    try{
        const user = await prisma.user.update({
            where: {
                id
            },
            data:{
                nome,
                email
            }
        })
        res.status(200).json(user)
        
    } catch (err){
        console.error(err);
        res.status(500).end();
    }
}