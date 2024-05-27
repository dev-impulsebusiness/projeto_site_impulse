const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.create = async (req, res) => {
  const {
    nome,
    telefone,
    email,
    vagaEscolhida,
    nivelAtual,
    pretensao,
    motivo,
    anexo,
  } = req.body;

  if (
    !nome ||
    !telefone ||
    !email ||
    !vagaEscolhida ||
    !nivelAtual ||
    !pretensao
  ) {
    return res.status(400).json({
      mensagem: "Um ou mais campos obrigatórios não enviados!"
    });
  }

  try {
    const novoCandidato = await prisma.trabalheConosco.create({
      data: {
        nome,
        telefone,
        email,
        vagaEscolhida,
        nivelAtual,
        pretensao,
        motivo,
        anexo,
      },
    });
    res
      .status(200)
      .json({ mensagem: "Candidato cadastrado com sucesso!", novoCandidato });
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

exports.searchAll = async (req, res) => {
  try {
    const candidatos = await prisma.trabalheConosco.findMany();
    /* Removido no dia 27-04-2023 para corrigir erro ao carregar página com todos os usuáios.
    if (candidatos.length < 1) {
      return res.status(404).json({ message: "Dados Não Encontrados" });
    }*/
    res.status(200).json({ candidatos });
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

exports.searchById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ mensagem: "Id é requerido!" });
  }

  const id_ = parseInt(id);
  try {
    const candidato = await prisma.trabalheConosco.findMany({
      where: {
        id: id_,
      },
    });

    if (candidato.length < 1) {
      res.status(404).json({ mensagem: "Candidato não encontrado!" });
    } else {
      res.status(200).json({ candidato });
    }
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

exports.searchByNameOrJobs = async (req, res) => {
  const { nome, vagaEscolhida } = req.query;

  try {
    const candidatos = await prisma.trabalheConosco.findMany({
      where: {
        nome: {
          contains: nome || "",
        },
        vagaEscolhida: {
          contains: vagaEscolhida || "",
        },
      },
    });

    if (candidatos.length === 0) {
      return res.status(404).json({ mensagem: "Nenhum candidato encontrado!" });
    }

    res.status(200).json({ candidatos });
  } catch (err) {
    console.error(err);
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
    const recursoExcluido = await prisma.trabalheConosco.delete({
      where: {
        id: id_,
      },
    });

    res.status(200).json({ mensagem: "Recurso removido com sucesso!"});
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

exports.createObs = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ mensagem: "Id é requerido!" });
  }
  const candidatoId = parseInt(id);

  const { softskills, score } = req.body;
  if (!softskills || !score) {
    return res
      .status(400)
      .json({ mensagem: "Softskill e Score são requeridos!" });
  }

  try {
    const candidato = await prisma.trabalheConosco.findFirst({
      where: {
        id: candidatoId,
      },
    });

    if (!candidato) {
      return res.status(404).json({ mensagem: "Candidato não cadastrado!" });
    }

    const salvarObs = await prisma.scores.create({
      data: {
        score,
        softskills,
        TrabalheConosco: {
          connect: {
            id: candidato.id,
          },
        },
      },
    });

    res.status(200).json({ salvarObs });
  } catch (err) {
    console.error(err);
    res.status(500).end()
  }
};

exports.searchAllObs = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      mensagem: "Id é requerido!",
    });
  }
  const candidatoId = parseInt(id);

  try {
    const scores = await prisma.scores.findMany({
      where: {
        fk_candidatoId: candidatoId,
      },
    });

    if (scores.length < 1) {
      return res
        .status(404)
        .json({ mensagem: "Não existem observações para o candidato informado!" });
    }

    res.status(200).json({ scores });
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

exports.searchObsById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ mensagem: "Id é requerido!" });
  }
  const candidatoId = parseInt(id);

  const { idObs } = req.params;
  if (!idObs) {
    return res
      .status(400)
      .json({ mensagem: "Score é requerido!" });
  }

  const idObservacao = parseInt(idObs);

  try {
    const observacao = await prisma.scores.findFirst({
      where: {
        id: idObservacao,
        fk_candidatoId: candidatoId,
      },
    });

    if (!observacao) {
      res.status(404).json({ mensagem: "Observação não encontrada!" });
    } else {
      res.status(200).json({ observacao });
    }
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

exports.updateOne = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensagem: "Id é requerido!" });
  }

  const {
    cargo, departamento, comentario
  } = req.body;

  if (
    !comentario && !cargo && !departamento
  ) {
    return res.status(400).json({
      mensagem: "Um ou mais campos obrigatórios não enviados!"
    });
  }

  const id_ = parseInt(id);

  try {
    const candidatoAtualizado = await prisma.trabalheConosco.update({
      where: {
        id: id_,
      },
      data: {
        cargo, departamento, comentario
      },
    });
    res
      .status(200)
      .json({ mensagem: "Candidato editado com sucesso!", candidatoAtualizado });
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

exports.deleteObsOne = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ mensagem: "Id é requerido!" });
  }
  const candidatoId = parseInt(id);

  const { idObs } = req.params;
  if (!idObs) {
    return res
      .status(400)
      .json({ mensagem: "Id Observação é requerida!" });
  }

  const idObservacao = parseInt(idObs);

  try {
    const recursoExcluido = await prisma.scores.delete({
      where: {
        id: idObservacao
      },
    });

    res.status(200).json({
      success: true,
      mensagem: "Recurso removido com sucesso!"
    });
  } catch (err) {
    console.error(err);
    res.status(500).end()
  }
};
