const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.create = async (req, res) => {
    const {
        pastaCliente, 
        nomeServico, 
        dataAdquirido, 
        dataPrevista,
        dataFinalizada, 
        situacao,
        valorMensal,
        descricao,
        fk_clientId
    } = req.body;
        
    if( 
        !fk_clientId){
            return res.status(400).json({mensagem: "Id do cliente é requerido!"})
    }
    const id = parseInt(fk_clientId);
    try{
            const client = await prisma.client.findMany({
                where: {
                  id: id
                },
            });

            if(client.length < 1){
                return res.status(404).json({mensagem: "Cliente não encontrado!"})
            }

            const aquisicaoCadastrada = await prisma.acquisition.create({
                data: {
                    pastaCliente, 
                    nomeServico, 
                    dataAdquirido, 
                    dataPrevista,
                    dataFinalizada, 
                    situacao,
                    valorMensal,
                    descricao,
                    fk_clientId
                }
            });
            res.status(200).json({
                aquisicaoCadastrada
            })
    } catch(err){
            console.log(err)
            res.status(500).end();
    }
};

exports.searchId = async (req, res) => {
    const {id} = req.params;
    if(!id){
        return res.status(400).json({mensagem: "Id é requerido!"})
    }
    const id_ = parseInt(id);

    try{
        const aquisicao = await prisma.acquisition.findMany({
            where: {
                id: id_
            },
            include:{
                client: true
            }
        })
        
        res.status(200).json({
            aquisicao
        });

     }catch(err){
        console.log(err)
        res.status(500).end();
    } 
};

exports.searchIdFk = async (req, res) => {
    const {id} = req.params;
    if(!id){
        return res.status(400).json({mensagem: "Id é requerido!"})
    }
    const id_ = parseInt(id);

    try{
        const aquisicao = await prisma.acquisition.findMany({
            where: {
                fk_clientId: id_
            },
            include: {
                client: true
            }
        })
        
        res.status(200).json({
            aquisicao
        });

     }catch(err){
        console.log(err)
        res.status(500).end();
    } 
};

exports.searchAll = async (req, res) => {
     try{
        const aquisicoes = await prisma.acquisition.findMany({
            include:{
                client: true
            }
        });
        
        res.status(200).json({
            aquisicoes
        });
        
     }catch(err){
        console.log(err)
        res.status(500).end();
    } 
};

exports.updateOne = async (req, res) => {
    const {id} = req.params;
    if(!id){
        return res.status(400).json({mensagem: "Id é requerido!"})
    }

    const {
        pastaCliente, 
        nomeServico, 
        dataAdquirido, 
        dataPrevista,
        dataFinalizada, 
        situacao,
        valorMensal,
        descricao,
        fk_clientId
    } = req.body;

    const id_ = parseInt(id);
    try{
        const aquisicao = await prisma.acquisition.update({
            where:{
                id:id_
            },
            data: {
                pastaCliente, 
                nomeServico, 
                dataAdquirido, 
                dataPrevista,
                dataFinalizada, 
                situacao,
                valorMensal,
                descricao,
                fk_clientId
            }
        });
    res.status(200).json({aquisicao});

    }catch (err) {
        console.log(err)
        res.status(500).end();
    }
};

exports.deleteOne = async (req, res) => {
    const {id} = req.params;
    if(!id){
        return res.status(400).json({mensagem: "Id é requerido!"})
    }
    
    const id_ = parseInt(id);
    try{
        const produtoDeletado = await prisma.acquisition.delete({
            where: {
                id: id_
            },
        })
        res.status(204).json({mensagem: "Recurso Deletado", produtoDeletado})
    } catch (err) {
        console.log(err)
        res.status(500).end();
    }
};