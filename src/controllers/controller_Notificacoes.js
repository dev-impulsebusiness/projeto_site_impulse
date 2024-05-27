const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createNotification = async (req, res) => {
  const { titulo, conteudo, usuarios } = req.body;
  const id = req.sub;
  const dados = []

  if(!conteudo){
    res.status(400).json({mensagem: "Campo de conteúdo é obrigatório!"});
  }

  try {
    const notificacao = await prisma.notificacao.create({
      data: {
        titulo,
        conteudo,
        Usuario:{
          connect:{
            id: Number(id)
          }
        }
      }
    })
    const idNotificacao = Number(notificacao.id)

    usuarios.map((id) => {
      dados.push({fk_UserId: Number(id), fk_NotfId: idNotificacao, check: false})
    })

    const controleNotificacao = await prisma.controleNotificacoes.createMany({
      data: dados
    })

    res.status(200).json({notificacao, controleNotificacao})
    
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};

exports.searchNotification = async (req, res) => {
  const id = req.sub;
  const dataAtual = new Date
  const [dataEdit,] = dataAtual.toISOString().split("T")
  const [ano,mes,dia] = dataEdit.split("-")
  
  
  try {
    const notificacoesDisponiveis = await prisma.controleNotificacoes.findMany({
      where:{
        fk_UserId: Number(id),
        check: false
      },
      include:{
        Notificacao: true
      }
    })

    const notificacoesDisponiveisAgendadas = await prisma.controleNotificacoesAgendadas.findMany({
      where:{
        fk_UserId: Number(id),
        check: false,
        NotificacaoAgendada: {
          dataAgendada: {
            lte: new Date(`${ano}-${mes}-${dia}T00:00:00.000Z`)
          }
        }
      },
      include:{
        NotificacaoAgendada: true
      }
    })

    res.status(200).json({notificacoesDisponiveis, notificacoesDisponiveisAgendadas})

  } catch(err) {
    console.log(err);
    res.status(500).end();
  }
};

exports.checkNotification = async (req, res) => {
  const {id} = req.body
  const dataAtual = new Date
  const [dataEdit,] = dataAtual.toISOString().split("T")
  const [ano,mes,dia] = dataEdit.split("-")
  
  try {
    const notificacaoVisualizada = await prisma.controleNotificacoes.updateMany({
      where:{
        fk_UserId: Number(id)
      },
      data: {
        check: true
      }
    })

    const notificacaoVisualizadaAgendadas = await prisma.controleNotificacoesAgendadas.updateMany({
      where:{
        fk_UserId: Number(id),
        NotificacaoAgendada:{
          dataAgendada:{
            lte: new Date(`${ano}-${mes}-${dia}T00:00:00.000Z`)
          }
        }
      },
      data: {
        check: true
      }
    })
    
    res.status(200).json({notificacaoVisualizada, notificacaoVisualizadaAgendadas})

  } catch(err) {
    console.log(err);
    res.status(500).end();
  }
}

//Notificações Agendadas

exports.createNotificationScheduled = async (req, res) => {
  const { titulo, conteudo, usuarios, dataAgendada } = req.body;
  const id = req.sub;
  const dados = []

  if(!conteudo){
    res.status(400).json({mensagem: "Campo de conteúdo é obrigatório!"});
  }

  try {
    const notificacao = await prisma.notificacaoAgendada.create({
      data: {
        titulo,
        conteudo,
        Usuario:{
          connect:{
            id: Number(id)
          }
        },
        dataAgendada: `${dataAgendada}T00:00:00.000Z`
      }
    })

    const idNotificacao = Number(notificacao.id)

    usuarios.map((id) => {
      dados.push({fk_UserId: Number(id), fk_NotAgendadafId: idNotificacao, check: false})
    })

    const controleNotificacao = await prisma.controleNotificacoesAgendadas.createMany({
      data: dados
    })

    res.status(200).json({notificacao, controleNotificacao})
    
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};