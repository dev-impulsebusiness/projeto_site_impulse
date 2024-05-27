const { PrismaClient } = require("@prisma/client");
const {randomBytes, createHash} = require("crypto");
const axios = require('axios');
//const nodemailer = require('nodemailer');

const prisma = new PrismaClient();

function criaHash(senha){
    return createHash('sha256').update(senha).digest('hex');
}

/* async function sendMail(email, token){
    const transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth:{
            user: 'contato.impulsebusiness@gmail.com',
            pass: 'xmloubtruuqukegv'
        }
    });

    await transport.sendMail({
        from: 'Impulse Bussine <contato.impulsebusiness@gmail.com>',
        to: [`${email}`, 'danielsarmento14@gmail.com'],
        subject: `Recuperação de Senha`,
        html: `<html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Credenciais Solicitadas</title>
            <style>        
                html {font-size: 50%; font-family: Arial, Helvetica, sans-serif; text-align: center;}        
                h1 {font-size: 1rem; padding: 30px; color: black; text-align: center;}        
                h2 {color: green; font-size: 1rem; text-align: center;}        
                h3 {color: black; font-size: 1rem; text-align: center; margin-bottom: 10px;}        
                img { display: block; margin: auto; width: 200px}    
            </style> 
        </head>
        <body>
            <img src="https://impulsebusiness.com.br/wp-content/uploads/2023/03/Group.svg">    
            <h1>Você esqueceu sua senha?</h1>    
            <h3>Este é seu token de verificação:</h3>    
            <h2>${token}</h2>
             
        </body>
        </html>`,
        text: `Sugestão do cliente: ${email}`
        
    })
} */

exports.index = async (req, res) => {
    const {email} = req.body
    try{
        const funcionario = await prisma.employee.findUnique({
            where:{
                email
            }
        })
        const users = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!users){
            res.status(400).json({mensagem: "Usuário não existe!"})
        }
        const tokenDeRecuperacao = randomBytes(15).toString("hex")
        const dateNow = new Date()
        dateNow.setHours(dateNow.getHours() + 1)

        await prisma.user.update({
            where:{
                id: users.id
            },
            data: {
                passwordResetToken: tokenDeRecuperacao,
                passwordResetExpires: dateNow
            }
        })
        //sendMail(user.email, tokenDeRecuperacao)
        const disparoWhats = await axios.post('https://api.zenvia.com/v2/channels/whatsapp/messages', {
            from: '558399088426',
            to: `${funcionario.telefoneWapp}`,
            contents: [
                {
                    type: 'template',
                    templateId: 'c6440332-0d0c-4757-82b6-4eb505044e5d',
                    fields: {
                        nome: `${funcionario.nome}`,
                        token: `${tokenDeRecuperacao}`
                    }
                }
            ]
        }, {
            headers: {
                'X-API-TOKEN': "vPfmlPQdR4qympVsDJQIoW7zT-tzZU7Pwuq4",
                'Content-Type': 'application/json',
            },
        });

        res.json({mensagem: "Token de verificação enviado para o celular cadastrado!"})

    }catch (err){
        console.log(err)
        res.status(500).end()
    }
}

exports.updatePassword = async (req, res) => {
    //console.time('speed');
    const {email, token, newPassword} = req.body;
    const newPasswordCrypto = criaHash(newPassword)

    if(!email || !token || !newPassword){
        res.json({mensagem: "Um ou mais campos obrigatórios não enviados!"})
    }

    try{
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user){
            return res.json({mensagem: "Usuário não existe!"})
        } 
        if(user.passwordResetToken !== token){
            return res.status(200).json({mensagem: "Token inválido!"})
        } 
        if(user.senha === newPasswordCrypto){
           return res.json({mensagem: "A senha não pode ser igual a anteriro!"})
        }
        
        await prisma.user.update({
            where:{
                email
            },
            data: {
                senha: newPasswordCrypto
            }
        })

        res.json({mensagem: "Senha atualizada com sucesso!"})
        //console.timeEnd('speed')

    } catch(err) {
        console.log(err)
        res.status(500).end()
    }
}
