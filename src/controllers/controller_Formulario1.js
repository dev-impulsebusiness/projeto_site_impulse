const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const dataAtual = new Date
const [dataEdit,] = dataAtual.toISOString().split("T")
const [ano,mes,] = dataEdit.split("-")

exports.create = async (req, res) => {
    const { email, question1, question2, question3, question4, question5, question6, question7, question8, question9} = req.body;
    const dataAtual = new Date
    const [dataEdit,] = dataAtual.toISOString().split("T")
    const [ano,mes,] = dataEdit.split("-")
    if(!email){
        return res.status(400).json({mensagem: "Email é requerido!"})
    }
    
    try{
      const formularioPreenchido = await prisma.form1.findMany({
        where: {
          email: email,
          created_at:{
            gte: new Date(`${ano}-${mes}-01T00:00:00.000Z`),
            lte: new Date(`${ano}-${mes}-31T00:00:00.000Z`)
          }
        }
      })
      if(formularioPreenchido.length > 0){
        return res.status(401).json({mensagem: "Usuário já respondeu ao formulário este mês!"})
      }
        const funcionario = await prisma.employee.findMany({
            where: {
                email: email
            }
        });

        if(funcionario.length < 1){
            return res.status(404).json({mensagem: 'Email não cadastrado'})
        }
        let fk_employeedId = funcionario[0].id;
  
        const form1 = await prisma.form1.create({
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
                Employee: {
                    connect:{
                            id: fk_employeedId
                    }
                }
            }
        });
        res.status(200).json({form1})

    }catch (err){
        console.error(err)
        res.status(500).end()
    }
}

exports.searchOne = async (req, res) => {
    const { email } = req.body;
    
    if(!email){
        return res.status(400).json({mensagem: "Email é requerido!"})
    }

    try{
        const form1 = await prisma.form1.findMany({
            where: {
                email
            }
        });
        
        return res.status(200).json({form1})

    } catch (err){
        console.error(err)
        res.status(500).end()
    }
}

exports.relatorio = async (req, res) => {
    const { dataInicio, dataFim } = req.query;
    const funcionarioId = req.query.funcionarioId ? parseInt(req.query.funcionarioId) : undefined;
    const question = req.query.question ? parseInt(req.query.question) : undefined;
  
    try {
      const whereClause = {
        AND: [
          { created_at: { gte: dataInicio } },
          { created_at: { lt: dataFim} }
        ]
      };
  
      if (funcionarioId) {
        whereClause.AND.push({ fk_employeeId: funcionarioId });
      }
  
      const respostasFormulario1 = await prisma.form1.findMany({
        where: whereClause
      });
  
      const questionNumbers = question ? [question] : [1, 2, 3, 4, 5, 6, 7, 8];
  
      const result = questionNumbers.reduce((acc, questionNumber) => {
        const questionKey = `question${questionNumber}`;
  
        const questionScores = respostasFormulario1.map(
          respostaFormulario => parseInt(respostaFormulario[questionKey])
        );
  
        const maxScore = Math.max(...questionScores);
        const minScore = Math.min(...questionScores);
  
        const totalScore = questionScores.reduce((sum, score) => sum + score, 0);
        const averageScore = totalScore / questionScores.length;
        const scoreCounts = questionScores.reduce((counts, score) => {
          counts[score] = (counts[score] || 0) + 1;
          return counts;
        }, {});
  
        acc[questionKey] = {
          maxScore,
          minScore,
          totalScore,
          averageScore,
          scoreCounts
        };
  
        return acc;
      }, {});
  
      return res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).end()
    }
}

//"/formularios?mes=janeiro&ano=2023"
exports.formulariosSearch = async (req, res) => {
  const {mes, ano} = req.query
  
  const dataAtual = new Date
  const [dataEdit,] = dataAtual.toISOString().split("T")
  const [year,month,] = dataEdit.split("-")

  const numberYear = Number(year)
  
  try {
    if(!mes && !ano){
      const formularios = await prisma.form1.findMany();
      console.log('Não Filtrou')
      const data = await buscarFormularios(formularios)
      return res.status(200).json(data)
    }

    if(mes && ano){
      const formularios = await prisma.form1.findMany({
        where: {
          created_at:{
            gte: new Date(`${ano}-${mes}-01T00:00:00.000Z`),
            lte: new Date(`${ano}-${mes}-31T00:00:00.000Z`)
          }
        }
      })
      console.log('Enviou Mês e Ano')
      const data = await buscarFormularios(formularios)
      return res.status(200).json(data)
    }

    if(mes && !ano){
      const formularios = await prisma.form1.findMany({
        where: {
          created_at:{
            gte: new Date(`2000-${mes}-01T00:00:00.000Z`),
            lte: new Date(`${numberYear}-${mes}-31T00:00:00.000Z`)
          }
        }
      });
      console.log('Enviou Apenas Mês')
      const data = await buscarFormularios(formularios)
      return res.status(200).json(data)
    }

    if(!mes && ano){
      const formularios = await prisma.form1.findMany({
        where: {
          created_at:{
            gte: new Date(`${ano}-01-01T00:00:00.000Z`),
            lte: new Date(`${ano}-12-31T00:00:00.000Z`)
          }
        }
      });
      console.log('Enviou Apenas Ano')
      const data = await buscarFormularios(formularios)
      return res.status(200).json(data)
    }

  } catch (err){
    console.log(err);
    res.status(500).end()
  }
}

async function buscarFormularios (formularios) {
  const meses = {
    Jan : "Janeiro",
    Feb : "Fevereiro",
    Mar : "Março",
    Apr : "Abril",
    May : "Maio",
    Jun : "Junho",
    Jul : "Julho",
    Aug : "Agosto",
    Sep : "Setembro",
    Oct : "Outubro",
    Nov : "Novembro",
    Dec : "Dezembro"
  }

  let funcionarios = [];
  let data = [];
  let anos = [];

  //Buscando os Anos dos Registros
  formularios.map((form) => {
    let text = String(form.created_at)
    const [, , ,year,] = text.split(" ")
    if(!anos.includes(year)){
      anos.push(year)
    }
  })

  //Salvando os funcionários no array funcionarios
  await Promise.all(
    formularios.map(async (obj) => {
      //console.log(obj)
    const func = await prisma.employee.findFirst({
      where:{
        id: obj.fk_employeeId
      },
      include:{
        cargo: true,
        departamento: true
      }
    })
    let mes = String(obj.created_at)
    const [, mesObtido,] = mes.split(" ")
    funcionarios.push({idFuncionario: func.id, nome: func.nome ,cargo: func.cargo.nome, departamento: func.departamento.nome, idFormulario: obj.id, mes:meses[mesObtido]})
  }));
  
  
  return {anos, funcionarios}
}

exports.formulariosSearchById = async (req, res) => {
  const {id} = req.params
  const _id = Number(id)

  try{
    const formulario = await prisma.form1.findUnique({
      where:{
        id: _id
      }
    })
    res.status(200).json(formulario)
  } catch (err){
    console.log(err)
    res.status(500).end()
  }
}