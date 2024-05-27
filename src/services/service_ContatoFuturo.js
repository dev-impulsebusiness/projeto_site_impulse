//Acrescentado fetch e dependência paga que seja possível carregar os dados no servidor.
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.valuesContatoFuturo = async () => {
    const phaseContatoFuturoId = "310785087"

    try{
        const cards = await fetch(
            "https://api.pipefy.com/graphql",
            {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                'Authorization': "Bearer Ji6ZzpeBWxRHQ1QRcor8",
                },
                body: JSON.stringify({
                "query": `{ phase ( id: ${phaseContatoFuturoId}) { cards {edges { node { fields { name value }}}}cards_count}}`,
                }),
            }
        )

        const dadosCards = await cards.json()
        const allCards = dadosCards.data.phase.cards.edges
        const quantidadeDeClientes = dadosCards.data.phase.cards_count
        const valoresPropostaImplementacao =[]
        const valoresPropostaRecorrencia = []

        allCards.map((obj) => {
            obj.node.fields.map((object)=>{
                if(object.name === "Valor da implementação"){
                    valoresPropostaImplementacao.push(object.value)
                } if(object.name === "Valor recorrente da proposta"){
                    valoresPropostaRecorrencia.push(object.value)
                }
            })
        })
        
        const somaPropostaImplementacao = valoresPropostaImplementacao.reduce((acumulador, valorAtual) => {
            const numero = Number(valorAtual.replace(".", "").replace(",", "."));
            return acumulador + numero
        }, 0)

        const somaPropostaRecorrencia = valoresPropostaRecorrencia.reduce((acumulador, valorAtual) => {
            const numero = Number(valorAtual.replace(".", "").replace(",", "."));
            return acumulador + numero
        }, 0)
        
        return {
            valorImplementacao: somaPropostaImplementacao,
            valorRecorrencia: somaPropostaRecorrencia,
            quantidadeDeClientes: quantidadeDeClientes
        };
    
    } catch (err){
        console.log(err)
    }
}

//valuesContatoFuturo()
