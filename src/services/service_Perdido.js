//Acrescentado fetch e dependência paga que seja possível carregar os dados no servidor.
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.valuesPerdido = async () => {
    const phasePerdidoId = "310751593"

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
                "query": `{ phase ( id: ${phasePerdidoId}) { cards {edges { node { fields { name value }}}}cards_count}}`,
                }),
            }
        )

        const dadosCards = await cards.json()
        const allCards = dadosCards.data.phase.cards.edges
        const quantidadeDeClientes = dadosCards.data.phase.cards_count

        const faseOportunidade =[]
        const faseCaptura =[]
        const faseContato = []
        const faseApresentacao = []
        const faseProposta = []
        const faseContatoFuturo = []
        
        allCards.map((obj) => {
                obj.node.fields.map((object)=>{
                    if(object.value === "Proposta"){
                        faseProposta.push(object.value)
                    } if(object.value === "Apresentação"){
                        faseApresentacao.push(object.value)
                    } if(object.value === "Oportunidade"){
                        faseOportunidade.push(object.value)
                    } if(object.value === "Contato futuro"){
                        faseContatoFuturo.push(object.value)
                    } if(object.value === "Contato"){
                        faseContato.push(object.value)
                    } if(object.value === "Captura / chatbot"){
                        faseCaptura.push(object.value)
                    }
                })
        })

        const motivosDePerda01 = []
        const motivosDePerda02 = []
        const motivosDePerda03 = []
        const motivosDePerda04 = []
        const motivosDePerda05 = []
        const motivosDePerda06 = []
        const motivosDePerda07 = []
        const motivosDePerda08 = []
        const motivosDePerda09 = []
        const motivosDePerda10 = []
        const motivosDePerda11 = []
        const motivosDePerda12 = []
        const motivosDePerda13 = []
        const motivosDePerda14 = []
        const motivosDePerda15 = []
        const motivosDePerda16 = []
        const motivosDePerda17 = []

        allCards.map((obj) => {
            obj.node.fields.map((object)=>{
                if(object.value === "O - Oportunidade descartada"){
                    motivosDePerda01.push(object.value)
                } if(object.value === "O - Empresa não tinha o perfil"){
                    motivosDePerda02.push(object.value)
                } if(object.value === "O - Perdeu o tempo da oportunidade"){
                    motivosDePerda03.push(object.value)
                } if(object.value === "C - Não respondeu mais"){
                    motivosDePerda04.push(object.value)
                } if(object.value === "C - Não estava qualificado"){
                    motivosDePerda05.push(object.value)
                } if(object.value === "C - Percepção de não ser um potencial"){
                    motivosDePerda06.push(object.value)
                } if(object.value === "A - Lead não estava tão bem qualificado"){
                    motivosDePerda07.push(object.value)
                } if(object.value === "A - Não tinha orçamento"){
                    motivosDePerda08.push(object.value)
                } if(object.value === "A - Foi percebido que não seria cliente ideal"){
                    motivosDePerda09.push(object.value)
                } if(object.value === "A - Não foi possível resolver necessidade"){
                    motivosDePerda10.push(object.value)
                } if(object.value === "P - Pesquisou apenas o preço"){
                    motivosDePerda11.push(object.value)
                } if(object.value === "P - Comprou do concorrente"){
                    motivosDePerda12.push(object.value)
                } if(object.value === "P - Desistiu do projeto"){
                    motivosDePerda13.push(object.value)
                } if(object.value === "P - Sem resposta"){
                    motivosDePerda14.push(object.value)
                } if(object.value === "P - Achou caro"){
                    motivosDePerda15.push(object.value)
                } if(object.value === "P - Demora na decisão"){
                    motivosDePerda16.push(object.value)
                } if(object.value === "P - Demora na proposta"){
                    motivosDePerda17.push(object.value)
                }
            })
        })
        
        return {
            quantidadeFaseOportunidade: faseOportunidade.length,
            quantidadeFaseCaptura: faseCaptura.length,
            quantidadeFaseContato: faseContato.length,
            quantidadeFaseApresentacao: faseApresentacao.length,
            quantidadeFaseProposta: faseProposta.length,
            quantidadeFaseContatoFuturo: faseContatoFuturo.length,
            quantidadeDeClientes: quantidadeDeClientes,
            quantidadeOjecoes01: motivosDePerda01.length,
            quantidadeOjecoes02: motivosDePerda02.length,
            quantidadeOjecoes03: motivosDePerda03.length,
            quantidadeOjecoes04: motivosDePerda04.length,
            quantidadeOjecoes05: motivosDePerda05.length,
            quantidadeOjecoes06: motivosDePerda06.length,
            quantidadeOjecoes07: motivosDePerda07.length,
            quantidadeOjecoes08: motivosDePerda08.length,
            quantidadeOjecoes09: motivosDePerda09.length,
            quantidadeOjecoes10: motivosDePerda10.length,
            quantidadeOjecoes11: motivosDePerda11.length,
            quantidadeOjecoes12: motivosDePerda12.length,
            quantidadeOjecoes13: motivosDePerda13.length,
            quantidadeOjecoes14: motivosDePerda14.length,
            quantidadeOjecoes15: motivosDePerda15.length,
            quantidadeOjecoes16: motivosDePerda16.length,
            quantidadeOjecoes17: motivosDePerda17.length,
        }
        
    } catch (err){
        console.log(err)
    }
}
