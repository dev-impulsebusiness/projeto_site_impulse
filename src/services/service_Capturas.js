//Acrescentado fetch e dependência paga que seja possível carregar os dados no servidor.
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.valuesCapturas = async () => {
    const phaseCapturasId = "310785032"

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
                "query": `{ phase ( id: ${phaseCapturasId}) {cards_count}}`,
                }),
            }
        )

        const dadosCards = await cards.json()
        //const allCards = dadosCards.data.phase.cards.edges
        const quantidadeDeClientes = dadosCards.data.phase.cards_count

        return {

            quantidadeDeClientes: quantidadeDeClientes
        }
        
    } catch (err){
        console.log(err)
    }
}

//valuesCapturas()
