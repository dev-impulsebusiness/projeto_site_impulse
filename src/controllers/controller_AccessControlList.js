const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.editRoles = async (req, res) => {
    const { role, id } = req.body
        if(!role || !id){
            res.status(400).json({message: "Dados Inválidos"})
        }
    try{
        const usuarioEdit = await prisma.UsersRoles.update({
            where:{
                fk_UserId: Number(id)
            },
            data: {
                fk_RoleId: Number(role)
            }
        })
        
        res.status(200).json(usuarioEdit)

    } catch (err){
        console.error(err);
        res.status(500).end()
    }
}


exports.execute = async (req, res) => {
    const {userId, idPermissions} = req.body;
    
    try {
        // Busca as permissoes atreladas a este usuário
        const usuario = await prisma.usersPermissions.findMany({
            where:{
                fk_UserId: userId
            }
        })

        if(!usuario){
            return res.status(400).json({message: "Usuário não existe"})
        }
        
        // Excluir os registros viculados ao usuário
        usuario.map(async (registro) => {
            await prisma.usersPermissions.deleteMany({
                where:{
                    id: {
                        in: registro.id
                    }
                }
            })  
        })

        function criaRegistro(fk_User, fk_Perm){
            return {
                fk_UserId: fk_User,
                fk_PermissionId: fk_Perm
            }
        }
        const data = []
        idPermissions.map(idPermission => {
            data.push(criaRegistro(userId,idPermission))
        })

        // cria as novas permissoes
        
        const relacoes = await prisma.usersPermissions.createMany({
            data: data
        })
        
        res.status(200).json(data)

    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
}