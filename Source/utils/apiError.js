/**
 * @description Class extends the built-in Error class
 ** inherits all the properties and methods of the Error class and can also have its own additional properties and methods
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message) // Calls the constructor of the Error class with the provided message

    // Assigns the provided values to properties of the ApiError instance
    this.statusCode = statusCode
    this.isOperational = isOperational

    if (stack) this.stack = stack
    else Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = ApiError