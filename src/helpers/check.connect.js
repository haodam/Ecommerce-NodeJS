'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000


// count Connect
const countConnection =  () =>{
    const numconnection = mongoose.connections.length
    console.log(`Number of connections:: ${numconnection}`)
}

// check over load
const checkOverload = () =>{
    setInterval ( () => {
        const numconnection = mongoose.connections.length
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Example maxium number of connections based on number osf cores
        const maxConnections = numCores * 5

        console.log(`Active connections: ${numconnection}`)
        console.log(`Memory usage:: ${memoryUsage / 1024 /1024} MB`)

        if ( numconnection > maxConnections){
            console.log(`Connection overload detected!`)

        }

    }, _SECONDS)
}
module.exports ={
    countConnection,
    checkOverload
}
