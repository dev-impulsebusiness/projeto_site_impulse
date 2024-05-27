const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createRole = async (req, res) =>{
    const {nome, descricao} = req.body;

    try{
        const existRole = await prisma.roles.findMany({
            where: {
                nome
            }
        });

        if(existRole.length > 0){
            return res.status(200).json({mensagem:"Role já cadastrada!"})
        }

        const newRole = await prisma.roles.create({
            data:{
                nome, descricao
            }
        })

        res.json(newRole);

    } catch(err) {
        console.error(err);
        res.status(500).end()
    }    
}