const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.create = async (req, res) => {
    const { email, question1, question2, question3, question4, question5, question6, question7, question8, question9, question10} = req.body;
    if(!email){
        return res.status(400).json({mensagem: "Email é requerido!"})
    }

    try{
        const funcionario = await prisma.employee.findMany({
            where: {
                email: email
            }
        });
        
        if(funcionario.length < 1){
            return res.status(404).json({mensagem: 'Email não cadastrado'})
        }
        console.log(funcionario)
        let fk_employeedId = funcionario[0].id;

        const form2 = await prisma.form2.create({
            data: {
                email, 
                question1, 
                question2, 
                question3, 
                question4, 
                question5, 
                question6, 
                question7, 
                question8, 
                question9,
                question10, 
                Employee: {
                    connect:{
                            id: fk_employeedId
                    }
                }
            }
        });
        res.json({form2})

    }catch (err){
        console.error(err)
        res.status(500).end()
    }
}

exports.search = async (req, res) => {
    const { email } = req.body;
    if(!email){
        return res.status(400).json({mensagem: "Email é requerido!"})
    }

    try{
        const form2 = await prisma.form2.findMany({
            where: {
                email: email
            }
        });

        return res.status(200).json({form2})

    } catch (err){
        console.error(err)
        res.status(500).end()
    }
}