const express = require("express")

const server = express()

server.all("/", (req, res) => {
    res.send("Las Doncellas están despiertas.")
})

function keepAlive() {
    server.listen(3000, () => {
        console.log('Servidor listo')
    })
}

module.exports = keepAlive