/**
 * @author Junming
 * @published Mar 31, 2024
 * @description
 ** It's a library to bind passport library into service for authentication
 */

const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const httpCode = require("../../resource/httpCode")

require('dotenv').config()

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_PRIVATE_KEY
}

module.exports = (passport, res) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      const curTime = new Date().getTime();
      expireTime = jwt_payload.id.Name === process.env.ADMIN_IDENTIFY
        ? process.env.ADMIN_AUTH_TOKEN_EXPIRE_TIME
        : process.env.AUTH_TOKEN_EXPIRE_TIME

      if (curTime - jwt_payload.iat > expireTime) {
        // if token time is expired
        return done(null, { status: httpCode.TOKEN_EXPIRED, payload: jwt_payload })
      } else {
        // if not
        return done(null, { status: httpCode.SUCCESS, payload: jwt_payload })
      }
    })
  )
}