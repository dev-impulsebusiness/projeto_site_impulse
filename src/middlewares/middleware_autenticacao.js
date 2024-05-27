const { verify } = require('jsonwebtoken');

exports.auth = async (req, res, next) => {
    const authToken  = req.headers.authorization;

    //Verifica se o token foi enviado na requisição
    if(!authToken){
        return res.status(401).json({mensagem: "Token é requerido!"});
    }

    // Separar a palavra Bearer do token
    const [, token] = authToken.split(" ")

    try {
        const {sub} = verify(token, process.env.JWT_SECRET);
        req.sub = sub;
        return next()

    } catch (err){
        return res.status(401).json({mensagem: "Token inválido!"})
    }
}
