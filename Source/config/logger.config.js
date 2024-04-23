/**
 * @author      Junming
 * @published   April 10, 2024
 * @description Libarary to config all logging info
 */

const winston = require('winston')
const config = require('./config')

// Define a custom log format
const enumeratedErrorFormat = winston.format((info) => {
  if (info instanceof Error) Object.assign(info, { message: info.stack })

  return info
})

// Create logger 
const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info', // Specifie the minimum level of logs to be recorded
  // Define the log message format
  format: winston.format.combine(
    enumeratedErrorFormat(), // Ensure if the log message is an error
    config.env === 'development'
      ? winston.format.colorize()
      : winston.format.uncolorize(),

    winston.format.timestamp(), // Add a timestamp to each log message
    winston.format.splat(),  // Interpolate variables into log messages
    winston.format.printf(({ level, message }) => `${level} : ${message}`) // Specifie the final format of the log message
  ),
  // Specifie where the log messages should be sent
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error']
    }),
  ],
})

module.exports = logger