const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { createHash } = require('crypto');
const { sign } = require('jsonwebtoken');

function criaHash(senha){
    return createHash('sha256').update(senha).digest('hex');
}

exports.autenticaUsuario = async (req, res) => {
    const {email, senha} = req.body;
    const senhaCrypto = criaHash(senha)
    let role;
    
    if(!email || !senha){
        return res.status(400).json({mensagem: "Dados inválidos!"})
    }
    try{

        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            include: {
                UsersRoles: true
            }
        })

        if(!user){
            return res.status(404).json({mensagem: "Usuário não encontrado!"})
        }

        if(email === user.email && senhaCrypto === user.senha){
            // Gerar Token
            const token = sign(
                {
                    nome: user.nome,
                    email: user.email
                },
                process.env.JWT_SECRET,
                {
                    subject: `${user.id}`,
                    expiresIn: '10h'
                }
                
            )
            const roleMap = {
                1: "Admin",
                2: "FuncInicial",
                3: "Gerente",
                4: "FuncDev",
                5: "FuncRH",
                6: "FuncComercial",
                7: "FuncFinanceiro"
              };
              
            role = roleMap[user.UsersRoles.fk_RoleId];

            return res.status(200).json({
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: role,
                token: token
            })
        } else {
            return res.status(401).json({
                mensagem: "Email ou senha inválidos!"
              }); 
        }


    } catch (err) {
        console.error(err);
        res.status(500).end();
    }

    
}