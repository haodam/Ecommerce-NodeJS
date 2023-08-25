const app = require("./src/app");

const PORT = process.env.DEV_APP_PORT

const server = app.listen( PORT, () => {
    console.log(`Welcome to my home Shop ${PORT}`)
})

process.on('SIGINT', () =>{
    server.close( () => console.log('Exit Server Express'))
})