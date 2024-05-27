const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const departamentoMap = {
  1: "Comercial",
  2: "Rh",
  3: "Administrativo",
  4: "Desenvolvimento",
  5: "Financeiro",
  6: "Marketing",
};

exports.welcome = (req, res) => {
  res.status(200).json({ API: "API Site Impulse" });
};

exports.create = async (req, res) => {
  const {
    nome,
    rg,
    cpf,
    dataNascimento,
    email,
    telefoneWapp,
    salario,
    codBanco,
    agenciaBanco,
    contaBanco,
    pixBanco,
    dataContratacao,
    modeloContratacao,
    nivel,
    estagio,
    escolaVinculo,
    horasAlocadas,
    dataDemissao,
    status,
    rua,
    numero,
    complemento,
    bairro,
    cidade,
    dia_pgto,
    estado,
    cep,
    departamentoId,
    cargoId
  } = req.body;

  if (
    !nome ||
    !cpf ||
    !dataNascimento ||
    !email ||
    !telefoneWapp ||
    !dataContratacao ||
    !modeloContratacao ||
    !horasAlocadas ||
    !status ||
    !rua ||
    !numero ||
    !bairro ||
    !cidade ||
    !estado ||
    !cep ||
    !departamentoId ||
    !cargoId
  ) {
    return res.status(400).json({ mensagem: "Um ou mais campos obrigatórios não enviados!" });
  }

  try {
    const verificaCadastro = await prisma.employee.findFirst({
      where:{
        OR: [
          {cpf}, {email}
        ]
      }
    })

    if(verificaCadastro){
      return res.status(409).json({ mensagem: "Dados já cadastrados!" });
    }

    const funcionarioCadastrado = await prisma.employee.create({
      data: {
        nome,
        rg,
        cpf,
        dataNascimento,
        email,
        telefoneWapp,
        salario,
        codBanco,
        agenciaBanco,
        contaBanco,
        pixBanco,
        dataContratacao,
        modeloContratacao,
        nivel,
        estagio,
        escolaVinculo,
        horasAlocadas,
        dataDemissao,
        status,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        dia_pgto,
        departamento: {
          connect: {
            id: Number(departamentoId),
          },
        },
        cargo: {
          connect: {
            id:Number(cargoId)
          }
        }
      },
    });
    res.status(200).json({
      mensagem: "Funcionário cadastrado com sucesso!",
      funcionarioCadastrado,
    });
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

exports.searchAll = async (req, res) => {
  try {
    const todos_funcionarios = await prisma.employee.findMany({
      include: {
        cargo: true,
        departamento: true
      }
    });

    res.status(200).json({
      todos_funcionarios,
    });
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

exports.search = async (req, res) => {
  const { nomeFuncionario } = req.params;

  if (!nomeFuncionario) {
    return res.status(404).json({ mensagem: "Nome é requerido!" });
  }
  try {
    const func = await prisma.employee.findMany({
      where: {
        nome: {
          startsWith: nomeFuncionario,
          mode: "insensitive",
        }
      },
      include:{
        cargo: true,
        departamento: true
      }
    });

    res.status(200).json({ func });
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

exports.search_Id = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ mensagem: "Id é requerido!" });
  }
  const id_ = parseInt(id);

  try {
    const func = await prisma.employee.findMany({
      where: {
        id: id_,
      },
      include:{
        cargo: true,
        departamento: true
      }
    });

    res.status(200).json({ func });
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

  const id_ = parseInt(id);
  const {
    nome,
    rg,
    cpf,
    dataNascimento,
    email,
    telefoneWapp,
    salario,
    codBanco,
    agenciaBanco,
    contaBanco,
    pixBanco,
    dataContratacao,
    modeloContratacao,
    nivel,
    estagio,
    escolaVinculo,
    horasAlocadas,
    dataDemissao,
    status,
    rua,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    cep,
    dia_pgto,
    departamentoId,
    cargoId
  } = req.body;

  if (!id) {
    return res.status(400).json({ mensagem: "Id é requerido!" });
  }

  if (
    !nome ||
    !cpf ||
    !dataNascimento ||
    !email ||
    !telefoneWapp ||
    !dataContratacao ||
    !modeloContratacao ||
    !horasAlocadas ||
    !status ||
    !rua ||
    !numero ||
    !bairro ||
    !cidade ||
    !estado ||
    !cep ||
    !departamentoId ||
    !cargoId
  ) {
    return res.status(400).json({ mensagem: "Um ou mais campos obrigatórios não enviados!" });
  }

  try {
    const func_edit = await prisma.employee.update({
      where: {
        id: id_,
      },
      data: {
        nome,
        rg,
        cpf,
        dataNascimento,
        email,
        telefoneWapp,
        salario,
        codBanco,
        agenciaBanco,
        contaBanco,
        pixBanco,
        dataContratacao,
        modeloContratacao,
        nivel,
        estagio,
        escolaVinculo,
        horasAlocadas,
        dataDemissao,
        status,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        dia_pgto,
        departamento: {
          connect: {
            id: Number(departamentoId),
          },
        },
        cargo: {
          connect: {
            id:Number(cargoId)
          }
        }
      },
    });

    res
      .status(200)
      .json({ mensagem: "Funcionário editado com sucesso!", func_edit });
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

  try {
    await prisma.employee.delete({
      where: {
        id: Number(id)
      },
    });

    res
      .status(200)
      .json({ mensagem: "Funcionário removido com sucesso!"});
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};
