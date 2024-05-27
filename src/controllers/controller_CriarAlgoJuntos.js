const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.criarCard = async (req, res) => {
    const { nome, telefone, email, cargo, faturamentoAnual, descricao, notificacoes} = req.body;
    const data = new Date
    const dataAtual = data.toISOString()
    try{
        const pipeId = "301622022"
        const phaseCapturasId = "310785032"
        

        const novoCardOportunidade = await fetch('https://api.pipefy.com/graphql',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyIjp7ImlkIjozMDIxNTk5NTQsImVtYWlsIjoiZGFuaWVsLmltcHVsc2ViQGdtYWlsLmNvbSIsImFwcGxpY2F0aW9uIjozMDAyMTcyNTB9fQ.OPT1Bn55gTEq7IMaJdTkdYuGf5vufNlnDKXYGzsnYEXz4Ny1zB6mXQZN5at4EpPbCH_THZXMoAcsyS1eDvOHwA"
                },
                body: JSON.stringify({
                            "query": `mutation{ createCard (input: {pipe_id:${pipeId}  phase_id:${phaseCapturasId}  fields_attributes: [
                                {field_id: "empresa", field_value: "${nome} - ${dataAtual}"},
                                {field_id: "por_onde_veio_esse_contato", field_value: "Página de captura do site"}, 
                                {field_id: "necessidade_da_empresa", field_value: "Resumo: \n Telefone: ${telefone} \n Email: ${email} \n Faturamento: ${faturamentoAnual} \n Cargo: ${cargo} \n Descrição: ${descricao} \n Deseja Notificações: ${notificacoes}"}, 
                                {field_id: "prioridade", field_value: "Alta"},
                                {field_id: "situa_o_da_oportunidade", field_value: "Em Aberto"}
                                ]
                                }) 
                                { card {id title }}}`
                })
        });

        const novoCardOportunidadeJSON = novoCardOportunidade.json()
        res.status(200).json({mensagem: "Sucesso!"})

    } catch (err) {
        console.error(err);
        res.status(500).end();
      }
}