const { describe, before, after, it } = require("node:test")
const {strictEqual, deepStrictEqual} = require("node:assert")

describe("API Workflow", () => {
    let _server = {}

    before(async () => {
        _server = (require('../index')).servidor
        await new Promise (resolve => _server.once("listening", resolve))
    })

    after(done => _server.close(done)) 
    
    it("Should receive not authorized given wrong user or password", async () => {
        const data = {
            email: "danielsarmento14@gmail.com",
            senha: ""
        }
                
        const request = await fetch('http://localhost:3333/auth',{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        const response = await request.json()
        strictEqual(request.status, 400)
        deepStrictEqual(response, {error: "Dados inválidos", message: "Um ou mais campos estão inválidos"})
    })

    it("Should receive not authorized, given user or password invalid", async () => {
        const data = {
            email: "daniel.impulseb@gmail.com",
            senha: "12345"
        }
                
        const request = await fetch('http://localhost:3333/auth',{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        const response = await request.json()
        strictEqual(request.status, 401)
        deepStrictEqual(response, {message: "Email ou senha estão inválidos"})
    })
})