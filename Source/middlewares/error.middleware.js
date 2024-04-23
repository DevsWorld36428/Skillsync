/**
 * @author Junming
 * @published April 11, 2024
 * @description Middleware for error handling
 */

const mongoose = require('mongoose')
const httpStatus = require('http-status')
const config = require('../config/config')
const logger = require('../config/logger.config')
const ApiError = require('../utils/apiError')

/**
 * Error Converter to ApiError instance
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;

    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

/**
 * Error handler 
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err

  if (config.env === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
  }

  // Attach error messasge
  res.locals.errorMessage = err.message

  // Prepare response object
  const response = {
    code: statusCode,
    message,
    ...(config.env === "development" && { stack: err.stack }),
  };

  if (config.env === "development") {
    logger.error(err);
  }

  res.status(statusCode).send(response)
}

module.exports = {
  errorConverter, errorHandler
}