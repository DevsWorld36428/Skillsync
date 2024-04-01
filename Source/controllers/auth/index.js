/**
 * @author      Junming
 * @published   Mar 31, 2024
 * @description Library to manage all kinds of token in this project
 */
const jwt = require('jsonwebtoken')
const httpCode = require('../../resource/httpCode')

require('dotenv').config()

/**
 * Function to create Token for authentication
 * @param {ID} Int
 * @param {Name} String
 */
const pushToken = (ID, Email) => {
  const timestamp = new Date().getTime()
  const payload = {
    id: ID, 
    email: Email ? Email: '',
    iat: timestamp
  }
  return jwt.sign(payload, process.env.TOKEN_PRIVATE_KEY)
}

module.exports = {
  pushToken
}