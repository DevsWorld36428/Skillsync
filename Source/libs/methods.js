/**
 * @author      Junming
 * @published   April 1, 2024
 * @description Library of the methods used in the back-end
 * @methods
 ** getCode: To get 6 digit code
 ** setSMTP: Configuration for connecting with SMTP server
 */


const nodemailer = require("nodemailer")

const { log, error } = require("./")

require('dotenv').config()

/**
 * Function to get 6 digit code
 * @return generated code
 */
const getCode = () => Math.floor(100000 + Math.random() * 900000)

/**
 * Configuration for connecting with SMTP server
 */
const setSMTP = async () => {
  try {
    const transporter = await nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 567,
      secure: false,
      auth: {
        user: `${process.env.SMTP_AUTH_EMAIL}`,
        pass: `${process.env.SMTP_AUTH_EMAIL_PASSWORD}`
      }
    })

    log(`Successfull SMTP server configuration`)
    return transporter
  } catch (err) {
    error(`while configurating SMTP server ${err}`)
    return null
  }
}

module.exports = {
  getCode, setSMTP
}