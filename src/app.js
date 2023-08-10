const express = require('express')
const morgan = require('morgan')
const { default: helmet} = require('helmet')
const app = express()

// init middleware
app.ues(morgan("dev"))
app.use(helmet())


// init db

// init routes

// handling error

module.exports = app