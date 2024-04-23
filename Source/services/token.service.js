/**
 * @author      Junming
 * @published   April 11, 2024
 * @description Service to manage all kinds of token in this project
 */

const jwt = require('jsonwebtoken')
const config = require('../config/config')

/**
 * Function to create Token for both authentication and authorization
 * @param {int} ID
 * @param {Object} user - user information saved into database
 * @returns
 */
const generateAuthToken = async (user) => {
  const timestamp = new Date().getTime()
  const payload = {
    id: user,
    type: 'Auth',
    iat: timestamp,
  }
  return jwt.sign(payload, config.jwt.secret)
}

/**
 * Function to create token for OTP One-Time-Password
 * @param {String} email 
 * @param {Number} code 
 * @returns 
 */
const generateOtpToken = async (user) => {
  const timestamp = new Date().getTime()
  const payload = {
    id: user,
    type: 'OTP',
    iat: timestamp,
  }
  return jwt.sign(payload, config.jwt.secret)
}

module.exports = {
  generateAuthToken,
  generateOtpToken
}