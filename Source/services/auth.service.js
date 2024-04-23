const httpStatus = require('http-status')
const logger = require('../config/logger.config')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const ApiError = require('../utils/apiError')
const { userService } = require('../services')
const { generateOtpToken } = require('./token.service')

/**
 * Login with Email and Password
 * @param {String} email 
 * @param {String} password 
 */
const loginUserWithEmailandPassword = async (email, password) => {
  try {
    const user = await userService.getUserByEmail(email)

    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect Email or Password')
    }
    return user

  } catch (err) {
    logger.error(err.stack)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'login failed')
  }
}

const verifyOtp = async (token, code) => {
  try {
    let payload = jwt.verify(token.slice(7), config.jwt.secret)
    const user = await userService.getUserById(payload.id.ID)

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found")

    if (payload.id.code !== code)
      throw new ApiError(httpStatus.FORBIDDEN, "Invalide Code")

    // Get token generated with email, time
    const newToken = await generateOtpToken({ ID: user._id, email: user.email })
    return newToken

  } catch (err) {
    logger.error(err.stack)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Verify failed")
  }
}

/**
 * Reset password
 * @param {String} otp 
 * @param {String} newPassword 
 */
const resetPassword = async (token, newPassword) => {
  try {
    const payload = jwt.verify(token.slice(7), config.jwt.secret)
    const user = await userService.updateUserById(payload.id.ID, { password: newPassword })
    return user
    
  } catch (err) {
    logger.error(err.stack)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed")
  }
}

module.exports = {
  loginUserWithEmailandPassword,
  verifyOtp,
  resetPassword,
}