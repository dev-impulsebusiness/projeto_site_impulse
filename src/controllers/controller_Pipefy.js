const {valuesOportunidades} = require('../services/service_Oportunidades')
const {valuesCapturas} = require('../services/service_Capturas')
const {valuesContato} = require('../services/service_Contato')
const {valuesApresentacao} = require('../services/service_Apresentacao')
const {valueProposta} = require('../services/service_Proposta')
const {valuesContatoFuturo} = require('../services/service_ContatoFuturo')
const {valuesFechado} = require('../services/service_Fechado')
const {valuesPerdido} = require('../services/service_Perdido')

exports.run = async (req, res) => {

    try{
        const oportunidade = await valuesOportunidades();
        const capturas = await valuesCapturas();
        const contato = await valuesContato();
        const apresentacao = await valuesApresentacao();
        const proposta = await valueProposta();
        const contatoFuturo = await valuesContatoFuturo();
        const fechado = await valuesFechado();
        const perdido = await valuesPerdido();

        const totalClientes = oportunidade.quantidadeDeClientes + capturas.quantidadeDeClientes + contato.quantidadeDeClientes + apresentacao.quantidadeDeClientes +proposta.quantidadeDeClientes +contatoFuturo.quantidadeDeClientes +fechado.quantidadeDeClientes + perdido.quantidadeDeClientes

        const calcContato = totalClientes - oportunidade.quantidadeDeClientes - capturas.quantidadeDeClientes - perdido.quantidadeFaseOportunidade - perdido.quantidadeFaseCaptura

        const calcApst = calcContato - perdido.quantidadeFaseContato -  contato.quantidadeDeClientes

        const calcProp = calcApst - perdido.quantidadeFaseApresentacao - apresentacao.quantidadeDeClientes

        const calpFechado = calcProp - proposta.quantidadeDeClientes - contatoFuturo.quantidadeDeClientes - perdido.quantidadeFaseProposta - perdido.quantidadeFaseContatoFuturo 	

        const conversao_Final = (fechado.quantidadeDeClientes / totalClientes) *100
        
        const conversao_Opt_Cont = (calcContato / totalClientes) *100

        const conversao_Cont_Apst = (calcApst / calcContato) *100

        const conversao_Apst_Prop = (calcProp / calcApst) *100

        const conversao_Prop_Fechamento = (calpFechado / calcProp) *100


        const financeiroVendidoImplantacao = fechado.valorImplementacao
        const financeiroVendidoRecorrencia = fechado.valorRecorrencia

        const financeiroMesaImplantacao = proposta.valorImplementacao + contatoFuturo.valorImplementacao
        const financeiroMesaRecorrencia = proposta.valorRecorrencia + contatoFuturo.valorRecorrencia

        const ticketMedioImplantacao = fechado.valorImplementacao / fechado.quantidadeDeClientes
        const ticketMedioRecorrencia = fechado.valorRecorrencia / fechado.quantidadeDeClientes

        /* const resultsQuantidades = {
        oportunidade: oportunidade.quantidadeDeClientes,
        capturas: capturas.quantidadeDeClientes,
        contato: contato.quantidadeDeClientes,
        apresentacao: apresentacao.quantidadeDeClientes,
        proposta: proposta.quantidadeDeClientes,
        contatoFuturo: contatoFuturo.quantidadeDeClientes,
        fechado: fechado.quantidadeDeClientes,
        perdido: perdido.quantidadeDeClientes,
        total: totalClientes,
        }

        const resultsConversao = {
        Conversao_OP_Cont: `${conversao_Opt_Cont.toFixed(2)} %`,
        Conversao_Cont_Apst: `${conversao_Cont_Apst.toFixed(2)} %`,
        Conversao_Apst_Prop: `${conversao_Apst_Prop.toFixed(2)} %`,
        Conversao_Prop_Fechamento: `${conversao_Prop_Fechamento.toFixed(2)} %`,
        ConversaoFinal: `${conversao_Final.toFixed(2)} %`
        }

        const financeiro = {
        VendidoImplantacao: `R$ ${financeiroVendidoImplantacao.toFixed(2)}`,
        VendidoRecorrencia: `R$ ${financeiroVendidoRecorrencia.toFixed(2)}`,
        EmMesaImplantacao: `R$ ${financeiroMesaImplantacao.toFixed(2)}`,
        EmMesaRecorrencia: `R$ ${financeiroMesaRecorrencia.toFixed(2)}`,
        }

        const tickets = {
        ticketMedioImplantacao: `R$ ${ticketMedioImplantacao.toFixed(2)}`,
        ticketMedioRecorrencia: `R$ ${ticketMedioRecorrencia.toFixed(2)}`
        }

        const motivosDePerda = {
                quantidadeOjecoes01: perdido.quantidadeOjecoes01,
                quantidadeOjecoes02: perdido.quantidadeOjecoes02,
                quantidadeOjecoes03: perdido.quantidadeOjecoes03,
                quantidadeOjecoes04: perdido.quantidadeOjecoes04,
                quantidadeOjecoes05: perdido.quantidadeOjecoes05,
                quantidadeOjecoes06: perdido.quantidadeOjecoes06,
                quantidadeOjecoes07: perdido.quantidadeOjecoes07,
                quantidadeOjecoes08: perdido.quantidadeOjecoes08,
                quantidadeOjecoes09: perdido.quantidadeOjecoes09,
                quantidadeOjecoes10: perdido.quantidadeOjecoes10,
                quantidadeOjecoes11: perdido.quantidadeOjecoes11,
                quantidadeOjecoes12: perdido.quantidadeOjecoes12,
                quantidadeOjecoes13: perdido.quantidadeOjecoes13,
                quantidadeOjecoes14: perdido.quantidadeOjecoes14,
                quantidadeOjecoes15: perdido.quantidadeOjecoes15,
                quantidadeOjecoes16: perdido.quantidadeOjecoes16,
                quantidadeOjecoes17: perdido.quantidadeOjecoes17,
        } */

        res.status(200).json({
                oportunidade: oportunidade.quantidadeDeClientes,
                capturas: capturas.quantidadeDeClientes,
                contato: contato.quantidadeDeClientes,
                apresentacao: apresentacao.quantidadeDeClientes,
                proposta: proposta.quantidadeDeClientes,
                contatoFuturo: contatoFuturo.quantidadeDeClientes,
                fechado: fechado.quantidadeDeClientes,
                perdido: perdido.quantidadeDeClientes,
                total: totalClientes,
                Conversao_OP_Cont: `${conversao_Opt_Cont.toFixed(2)} %`,
                Conversao_Cont_Apst: `${conversao_Cont_Apst.toFixed(2)} %`,
                Conversao_Apst_Prop: `${conversao_Apst_Prop.toFixed(2)} %`,
                Conversao_Prop_Fechamento: `${conversao_Prop_Fechamento.toFixed(2)} %`,
                ConversaoFinal: `${conversao_Final.toFixed(2)} %`,
                VendidoImplantacao: `R$ ${financeiroVendidoImplantacao.toFixed(2)}`,
                VendidoRecorrencia: `R$ ${financeiroVendidoRecorrencia.toFixed(2)}`,
                EmMesaImplantacao: `R$ ${financeiroMesaImplantacao.toFixed(2)}`,
                EmMesaRecorrencia: `R$ ${financeiroMesaRecorrencia.toFixed(2)}`,
                ticketMedioImplantacao: `R$ ${ticketMedioImplantacao.toFixed(2)}`,
                ticketMedioRecorrencia: `R$ ${ticketMedioRecorrencia.toFixed(2)}`,
                quantidadeOjecoes01: perdido.quantidadeOjecoes01,
                quantidadeOjecoes02: perdido.quantidadeOjecoes02,
                quantidadeOjecoes03: perdido.quantidadeOjecoes03,
                quantidadeOjecoes04: perdido.quantidadeOjecoes04,
                quantidadeOjecoes05: perdido.quantidadeOjecoes05,
                quantidadeOjecoes06: perdido.quantidadeOjecoes06,
                quantidadeOjecoes07: perdido.quantidadeOjecoes07,
                quantidadeOjecoes08: perdido.quantidadeOjecoes08,
                quantidadeOjecoes09: perdido.quantidadeOjecoes09,
                quantidadeOjecoes10: perdido.quantidadeOjecoes10,
                quantidadeOjecoes11: perdido.quantidadeOjecoes11,
                quantidadeOjecoes12: perdido.quantidadeOjecoes12,
                quantidadeOjecoes13: perdido.quantidadeOjecoes13,
                quantidadeOjecoes14: perdido.quantidadeOjecoes14,
                quantidadeOjecoes15: perdido.quantidadeOjecoes15,
                quantidadeOjecoes16: perdido.quantidadeOjecoes16,
                quantidadeOjecoes17: perdido.quantidadeOjecoes17,

        })
    } catch (err){
        console.error(err)
        res.status(500).end()
    }
}