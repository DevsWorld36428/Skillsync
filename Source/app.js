/**
 * @author Junming
 * @published April 11, 2024
 * @description Library to configure and initialize this server
 */

const express = require('express')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const mongoSaitize = require('express-mongo-sanitize')
const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const passport = require('passport')
const passportMiddleware = require('./middlewares/passport.middleware')
const httpStatus = require('http-status')
const config = require('./config/config')
const morgan = require('./config/morgan.config')
const ApiError = require('./utils/apiError')
const expressOasGenerator = require('express-oas-generator')
const httpContext = require('express-http-context')
const AnnoymousStrategy = require('passport-anonymous')
const { errorConverter, errorHandler } = require('./middlewares/error.middleware')

const app = express()

// Setup for handling OpenAPI specification generation for responses
expressOasGenerator.handleResponses(app, {})

// Apply Morgan middleware for logging HTTP requests and responses
if (config.env != 'test') {
  app.use(morgan.successHandler)
  app.use(morgan.errorHandler)
}
app.use(httpContext.middleware) // Middleware to manage HTTP context

app.use(helmet()) // Helmet middleware for securing HTTP headers
app.use(
  cors({
    origin: '*',
  })
)

// Middleware for parsing JSON and URL-encoded request bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(mongoSaitize()) // Middleware for sanitizing user input to prevent MongoDB injection attacks
app.use(compression()) // Compression middleware for compressing response data

// Initialize Passport middleware and apply Anonymous authentication strategy
app.use(passport.initialize())
passport.use(new AnnoymousStrategy())
passportMiddleware(passport)
 
app.use(cookieParser()) // Cookie parser middleware for parsing cookies
// Middleware to set Cross-Origin-Resource-Policy header for all responses
app.all('*', (req, res, next) => {
  res.header(
    'Cross-Origin-Resource-Policy',
    "same-site | same-origin | cross-origin",
  )
  next()
})

const routes = require('./routes')
app.use('/api/v1', routes)

// Middleware to handle 404 errors by responding with a "Not Found" message
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not Found'))
})

// Middleware for converting errors to a standard format
app.use(errorConverter)

// Error handler middleware for sending appropriate responses
app.use(errorHandler) 
expressOasGenerator.handleRequests() // Setup for handling OpenAPI specification generation for requests

module.exports = { app, }