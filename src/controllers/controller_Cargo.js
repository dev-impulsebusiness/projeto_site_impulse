const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.create = async (req, res) => {
    const {nome, descricao} = req.body;
    if(!nome){
        res.status(400).json({mensagem: "Campo nome é requerido!"})
    }

    try{
        const data = {nome};
        if(descricao){
            data.descricao = descricao
        }
        const cargoExistente = [];
        const cargosExistentes = await prisma.cargo.findMany();
        cargosExistentes.map((obj) => {
            if(obj.nome == nome){
                cargoExistente.push(obj)
            }
        })

        if(cargoExistente.length > 0){
            return res.status(409).json({mensagem: "Nome de cargo já cadastrado"})
        } else{
            const cargo = await prisma.cargo.create({
                data
            });
    
            return res.status(200).json(cargo)
        }

    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
}

exports.searchAll = async (req, res) => {
    try{
        const cargos = await prisma.cargo.findMany()
        
        res.status(200).json(cargos)

    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
}

exports.searchById = async (req, res) => {
    const {id} = req.params
    if(!id){
        res.status(400).json({mensagem: "Id é requerido!"})
    }
    try{
        const cargo = await prisma.cargo.findUnique({
            where: {
                id: Number(id)
            }
        })

        res.status(200).json(cargo)

    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
}

exports.update = async (req, res) => {
    const {id, nome, descricao} = req.body;
    if(!id || !nome){
        res.status(400).json({mensagem: "Id e nome são requeridos!"})
    }
    try{
        const data = {nome};
        if(descricao){
            data.descricao = descricao
        }
        const cargo = await prisma.cargo.update({
            where: {
                id: Number(id)
            },
            data
        })

        res.status(200).json(cargo)

    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
}

exports.delete = async (req, res) => {
    const {id} = req.params;
    if(!id){
        res.status(400).json({mensagem: "Id é requerido!"})
    }
    try{
        await prisma.cargo.delete({
            where: {
                id: Number(id)
            }
        })

        res.status(200).json({mensagem: "Cargo removido com sucesso!"})

    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
}