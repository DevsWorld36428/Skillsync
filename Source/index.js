/**
 * @title       LoL League of Legends
 * @version     1.0.0
 * @author      Junming
 * @published   Mar 31, 2024
 * @description It is connecting customers with their teammates in game League of Legends
 */

// Loading required dependencies
const express = require("express")
const app = express()
const http = require("http").Server(app)
const bodyParser = require("body-parser")
const passport = require('passport')

require('dotenv').config()

// Loading pre-defined methids & values
const Route = require('./routes')
const { log, error } = require("./libs")
const { ROOT } = require("./resource/const")
const { init } = require('./model')

init() //Connecting to database

// Configure process
process.env.tmp = `${ROOT}\\tmp`
process.env.temp = `${ROOT}\\tmp`

// Running the http-server
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  next()
})

//Listening port...
http.listen(process.env.APP_PORT) ?
  log(`http-server is running on port ${process.env.APP_PORT}`) :
  (error(`failed to run http-server. Check its configuration and if the port is busy now`),
    process.exit())

app.use('/', Route) //Running all its routes

// Biding passport into service for authentication
app.use(passport.initialize())
require('./middlewares/passport')(passport)

