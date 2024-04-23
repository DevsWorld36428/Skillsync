/**
 * @author      Junming
 * @published   April 9, 2024
 * @description Middleware to validate data before processing
 */

const Joi = require('joi')
const httpStatus = require('http-status')
const pick = require('../utils/pick')
const ApiError = require('../utils/apiError')

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ["params", "query", "body"])
  const obj = pick(req, Object.keys(validSchema))
  
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(obj)

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ")
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage))
    }
    Object.assign(req, value)
    return next()
}

module.exports = validate