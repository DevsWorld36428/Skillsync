/**
 * @author    Junming
 * @published Mar 31, 2024
 * @description
 ** It's a library to bind passport library into service for authentication
 */

const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const config = require('../config/config')
const ApiError = require('../utils/apiError')
const httpStatus = require("http-status")
const { getUserByEmail } = require("../services/user.service")

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret
}

module.exports = (passport, res) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      const curTime = new Date().getTime()
      if (!jwt_payload.id.role || !jwt_payload.type) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid token')
      }
    
      if (jwt_payload.id.role !== 'Admin') {
        let user = await getUserByEmail(jwt_payload.id.email)
        user = JSON.parse(JSON.stringify(user))

        if (!user) return done(null, false)
      }

      let expireTime = jwt_payload.type === 'Auth'
        ? config.jwt.accessExpirationMinutes * 60 * 1000
        : config.otp.expirationTime * 60 * 1000
      
      if (curTime - jwt_payload.iat > expireTime) // if token time is expired
        return done(null, { status: httpStatus.FORBIDDEN, payload: jwt_payload })
        
      else // if not
        return done(null, { status: httpStatus.OK, payload: jwt_payload })
    })
  )
}