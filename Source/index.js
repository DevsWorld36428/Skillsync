/**
 * @title       Skillsync
 * @version     1.0.0
 * @author      Junming
 * @published   Mar 31, 2024
 * @description It is connecting customers with their teammates in game League of Legends
 */

// Loading required dependencies
const mongoose = require('mongoose')
const config = require('./config/config')
const logger = require('./config/logger.config')
const Socket = require('./middlewares/socket.middleware')
const { app } = require('./app')

let server

// Connecting to database
mongoose.set("strictQuery", false)
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info("Connected to Database");
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`)
  })
  Socket(server)
})

// Function to gracefully close the server and exit the process
const exitHeader = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
      process.exit(1)
    })
  } else process.exit(1)
}

// Handler for unexpected errors
const unexpectedErrorHandler = (err) => {
  logger.error(err)
  exitHeader()
}

// Handling uncaught exceptions and unhandled rejections
process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

// Handling SIGTERM signal to close the server
process.on('SIGTERM', () => {
  logger.info('SIGTERM Received')

  if (server) server.close()
})
