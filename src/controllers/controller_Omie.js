const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getDistinctIndicadores = async (req, res) => {
    try {
        const indicadoresDistintos = await prisma.omie.findMany({
            distinct: ['indicador'],
            select: {
                indicador: true,
            },
        })
        res.status(200).json(indicadoresDistintos)
    } catch (error) {
        console.error(error)
        res.status(500).end()
    }
}

exports.getDistinctMesRef = async (req, res) => {
    try {
        const mesRefDistintos = await prisma.omie.findMany({
            distinct: ['mesref'],
            select: {
                mesref: true
            },
        })
        res.status(200).json(mesRefDistintos)
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}

exports.searchByMesRef = async (req, res) => {
    const { mesref } = req.query

    if (!mesref) {
        res.status(400).json({ mensagem: "Mês é requerido!" })
    }

    try {
        const dados = await prisma.omie.findMany({
            where: {
                mesref: {
                    contains: mesref,
                },
            },
        });

        const dadosFiltrados = dados.map((campo) => ({
            indicador: campo.indicador,
            valor: campo.valor,
            mesref: campo.mesref
        }));

        res.status(200).json({
            dadosFiltrados
        });
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}


exports.searchByIntervalo = async (req, res) => {
    const { indicador, mesref_inicio, mesref_fim } = req.query;

    if (!indicador || !mesref_inicio || !mesref_fim) {
        res.status(400).json({ mensagem: "Um ou mais campos obrigatórios não enviados!" });
    }

    try {
        const dados = await prisma.$queryRaw`SELECT * FROM omie 
                                     WHERE indicador = ${indicador}
                                     AND mesref >= ${mesref_inicio}
                                     AND mesref <= ${mesref_fim}
                                     ORDER BY mesref ASC`

        const dadosString = dados.map(item => {
            const newItem = { ...item };
            Object.entries(newItem).forEach(([key, value]) => {
                if (typeof value === 'bigint') {
                    newItem[key] = Number(value);
                }
            });
            return newItem;
        });

        res.status(200).json(dadosString);

    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
};