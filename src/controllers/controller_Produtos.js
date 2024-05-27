const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.create = async (req, res) => {
  const { nome, segmento, descricao } = req.body;
  if (!nome || !segmento) {
    return res.status(400).json({ mensagem: "Nome e Segmento são requeridos!" });
  }

  try {
    const produto = await prisma.product.create({
      data: {
        nome,
        segmento,
        descricao,
      },
    });

    res
      .status(200)
      .json({ mensagem: "Produto cadastrado com sucesso!", produto });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};

exports.searchAll = async (req, res) => {
  try {
    const produtos = await prisma.product.findMany();

    res.status(200).json({ produtos });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};

exports.searchId = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ mensagem: "Id é requerido!" });
  }

  const id_ = parseInt(id);
  try {
    const produtos = await prisma.product.findMany({
      where: {
        id: id_,
      },
    });
    res.status(200).json({ mensagem: "Produto cadastrado com sucesso!", produtos });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};

exports.updateOne = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ mensagem: "Id é requerido!" });
  }

  const { nome, segmento, descricao } = req.body;
  if (!nome || !segmento) {
    return res.status(400).json({ mensagem: "Nome e Segmento são requeridos!" });
  }

  const id_ = parseInt(id);
  try {
    const produtos = await prisma.product.update({
      where: {
        id: id_,
      },
      data: {
        nome,
        segmento,
        descricao,
      },
    });
    res.status(200).json({ mensagem: "Produto editado com sucesso!", produtos });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};

exports.deleteOne = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ mensagem: "Id é requerido!" });
  }

  const id_ = parseInt(id);
  try {
    await prisma.product.delete({
      where: {
        id: id_,
      },
    });
    res.status(200).json({ mensagem: "Recurso deletado!"});
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};
