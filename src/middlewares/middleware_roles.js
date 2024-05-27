const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.verificaRole = async (req, res, next) => {
    const permission = req.permission;
    const id = req.sub;
    const id_ = Number(id)
    
    try{
        const roleUser = await prisma.usersRoles.findFirst({
            where:{
                fk_UserId: id_
            }
        })
        if(!roleUser){
            return res.status(404).json({mensagem: "Não autorizado!"})
        }
        const rolePermission = await prisma.rolesPermissions.findMany({
            where: {
                fk_RoleId: roleUser.fk_RoleId
            }
        })
        const permissoes = [];
        rolePermission.map((obj) => {
            permissoes.push(obj.fk_PermissionId)
        })

        const namePermissions = await prisma.permissions.findMany({
            where: {
                id: {
                    in: permissoes
                }
            }
        })

        const namePermissoes = []
        namePermissions.map((obj) => {
            namePermissoes.push(obj.nome)
        })

        if(namePermissoes.includes(permission)){
            next()
        } else {
            return res.status(401).json({mensagem: "Não autorizado!"})
        }
        
    } catch (err) {
        console.log(err)
        res.status(500).end()
    }
}