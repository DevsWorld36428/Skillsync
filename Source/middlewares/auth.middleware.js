/**
 * @author      Junming
 * @published   April 10, 2024
 * @description Middleware used for authentication & authorization before processing request 
 */

const passport = require('passport')
const httpStatus = require('http-status')
const ApiError = require('../utils/apiError')

var cls = require('cls-hooked') // Continuation Local Storage
var ns = cls.createNamespace('request')

/**
 * Function to verify user permission
 * @module auth
 * @param {Object} req
 * @param {Function} resolve
 * @param {Function} reject
 * @return {Function}
 */
const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    console.log(err)
    return reject(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"))
  }
  req.user = user
  resolve(user)
}

const auth = 
  (allowAnonymous = false, isAdmin = false) =>
    async (req, res, next) => {
      const passportMiddleware = allowAnonymous ? ['jwt', 'anonymous'] : 'jwt'

      return new Promise((resolve, reject) => {
        passport.authenticate(
          passportMiddleware,
          { session: false },
          verifyCallback(req, resolve, reject)
        )(req, res, next)
      })
        .then((user) => {
          if (user.status === httpStatus.FORBIDDEN) {
            reject(new ApiError(httpStatus.FORBIDDEN, "Token expired"))
          }

          if (isAdmin ** user.payload.id.role !== 'Admin') 
            throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden')

          ns.run(() => {
            ns.set('user', user)
            next()
          })
        })
        .catch((err) => next(err))
    }

module.exports = auth