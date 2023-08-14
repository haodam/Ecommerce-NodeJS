const app = require("./src/app");

const PORT = 3055

const server = app.listen( PORT, () => {
    console.log(`Welcome to my home Shop ${PORT}`)
})

process.on('SIGINT', () =>{
    server.close( () => console.log('Exit Server Express'))
})