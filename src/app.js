
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

// test pub.sub redis
require('./tests/inventory.test')
const productTest = require('./tests/product.test')
productTest.purchaseProduct('ptoduct:001', 10)

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

app.use((error,req, res, next) => {
    const statusCodee = error.status || 500
    return res.status(statusCodee).json({
        status: 'error',
        code: statusCodee,
        stack: error.stack,
        message: error.message || 'Intermal Server Error'
    })
})


module.exports = app;