const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.create = async (req, res) => {
  const {
    nome,
    cnpj,
    razaoSocial,
    endereco,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    cep,
    emailResponsavel,
    nomeResponsavel,
    telefoneResponsavel,
    situacao
  } = req.body;

  if( !nome || 
      !cnpj ||
      !razaoSocial || 
      !emailResponsavel ||
      !nomeResponsavel || 
      !situacao){
        return res.status(400).json({mensagem: "Um ou mais campos obrigatórios não enviados!"})
  }

  try{
    const newClient = await prisma.client.create({
      data:{
        nome,
        cnpj,
        razaoSocial,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        emailResponsavel,
        nomeResponsavel,
        telefoneResponsavel,
        situacao
      }
    })
    res.status(200).json({mensagem: "Cliente cadastrado com sucesso!", newClient});

  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

exports.searchAll = async (req, res) => {

  try{
    const clients = await prisma.client.findMany();
    res.status(200).json({clients})
    
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

exports.search = async (req, res) => {
  const {id} = req.params;
  if(!id){
    return res.status(400).json({mensagem: "Id é requerido!"})
  }

  const id_ = parseInt(id);
  try{
    const client = await prisma.client.findMany({
      where: {
        id: id_
      },
    });

    res.status(200).json({client})
    
    
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

exports.updateOne = async (req, res) => {
    const { id } = req.params;
    const {
      nome,
      cnpj,
      razaoSocial,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      emailResponsavel,
      nomeResponsavel,
      telefoneResponsavel,
      situacao
    } = req.body;

    if( !nome || 
        !cnpj ||
        !razaoSocial || 
        !emailResponsavel ||
        !nomeResponsavel || 
        !situacao){
          return res.status(400).json({mensagem: "Um ou mais campos obrigatórios não enviados!"})
    }
    if(!id){
      return res.status(400).json({mensagem: "Id é requerido!"})
    }

    const id_ = parseInt(id);

  try{
    const clientUpdate = await prisma.client.update({
      where:{
        id: id_
      },
      data:{
        nome,
        cnpj,
        razaoSocial,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        emailResponsavel,
        nomeResponsavel,
        telefoneResponsavel,
        situacao
      }
    });
    res.status(200).json({mensagem: 'Cliente editado com sucesso!', clientUpdate });
  }catch (err) {
    console.error(err);
    res.status(500).end();
  }
};


exports.deleteOne = async (req, res) => {
  const { id } = req.params;
  if(!id){
    return res.status(400).json({mensagem: "Id é requerido!"})
  }

  try {
    await prisma.client.delete({
      where: {
        id: Number(id)
      },
    });

    res.status(200).json({mensagem: 'Cliente removido com sucesso!'});

  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};