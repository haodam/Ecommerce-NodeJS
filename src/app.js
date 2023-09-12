
require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const { default: helmet} = require('helmet');
const compression = require('compression');
const app = express();

// init middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
//console.log(`Process::`, process.env)

// init db
require('./dbs/init.mongodb')
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()
// init routes

app.use('/', require('./routers'))


// handling error
// app.use((req, res, next) => {
//     const error = new Error('Not Found')
//     error.status = 404
//     next(error)
// })

// app.use((error,req, res, next) => {
//     error.status = 404
//     return res.status().json({
        
//     })
// })


module.exports = app;