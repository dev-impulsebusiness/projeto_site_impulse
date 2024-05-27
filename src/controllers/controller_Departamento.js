const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.create = async (req, res) => {
  const { nome, descricao } = req.body;
  if (!nome) {
    res.status(400).json({ mensagem: "Nome é requerido!" });
  }

  try {
    const data = {nome}
    if(descricao){
      data.descricao = descricao
    }
    const deps = [];
    const departamentosExistentes = await prisma.departamento.findMany();
    departamentosExistentes.map((dep) => {
      if(dep.nome == nome){
        deps.push(dep)
      }
    })

    if(deps.length > 0){
      return res.status(409).json({mensagem: "Nome de departamento já cadastrado"})
    } else {
      const departamentos = await prisma.departamento.create({
        data
      });
      return res.status(200).json(departamentos);
    }

  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

exports.searchAll = async (req, res) => {
  try {
    const departamentos = await prisma.departamento.findMany();

    res.status(200).json(departamentos);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

exports.searchById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ mensagem: "Id é requerido!" });
  }
  try {
    const departamento = await prisma.departamento.findUnique({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json(departamento);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

exports.update = async (req, res) => {
  const { id, nome, descricao } = req.body;
  if (!id || !nome) {
    res.status(400).json({ mensagem: "Id e nome são requeridos!" });
  }
  try {
    const data = {id, nome}
    if(descricao){
      data.descricao = descricao
    }
    const departamento = await prisma.departamento.update({
      where: {
        id: Number(id),
      },
      data,
    });

    res.status(200).json(departamento);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  if(!id){
    res.status(400).json({mensagem: "Id é requerido!"})
  }
  try {
    await prisma.departamento.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({mensagem: "Departamento removido com sucesso!"});
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};
