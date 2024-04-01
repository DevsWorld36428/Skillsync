/**
 * @author      Junming
 * @published   Mar 31, 2024
 * @description Router for authentication and authorization
 */

const bcrypt = require("bcryptjs")
const router = require('express').Router()
const httpCode = require('../resource/httpCode')

const { log, error } = require('../libs')
const { pushToken } = require('../controllers/auth')

const { Customer, Teammate } = require('../model')

/**
 * Router to sign up
 * @param { email } string
 * @param { password } string
 */
router.post('/signup', async (req, res) => {
  try {
    // Checking if the request is valid
    if (!req.body.email || !req.body.password) {
      res.status(httpCode.FORBIDDEN).send({ message: "Forbidden request" })
      return
    }
    let email = req.body.email
    let password = req.body.password

    email = email.toLowerCase()

    const existingUser = await Customer.findOne({ Email: email })

    if (existingUser) {
      return res.status(httpCode.DUPLICATED).send({ message: "The user is already existed" })
    }

    //Calculating the hash string against requested password
    let salt = await bcrypt.genSalt(10)
    let hashed_password = await bcrypt.hash(password, salt)

    const newCustomer = new Customer({ Email: email, Password: hashed_password })

    await newCustomer.save()

    res.status(httpCode.SUCCESS).send({ message: 'Successfully signed up' })

    log(`New customer registered with Email: ${newCustomer.Email}`)

  } catch (err) {
    error(`while signing up ${err}`)
    res.status(httpCode.SERVER_ERROR).send({ message: "Server error" })
  }
})

/**
 * Router for sign in
 * @param { email } string
 * @param { password } string
 * @return { ID: string, token: string }
 */
router.post('/signin', async (req, res) => {
  try {
    // Checking if the request is valid
    if (!req.body.email || !req.body.password) {
      return res.status(httpCode.FORBIDDEN).send({ message: 'Forbidden request' })
    }

    let Email = req.body.email
    let Password = req.body.password
    
    const user = await Customer.findOne({ Email })
    if (!user) return res.status(httpCode.NOT_MATCHED).send({ message: "User not found" })

    const isMatch = await bcrypt.compare(Password, user.Password)
    if (!isMatch) return res.status(httpCode.INVALID_MSG).send({ message: 'Invalid credential' })

    res.status(httpCode.SUCCESS).send({ ID: user._id, Token: `Bearer ${await pushToken({ ID: user._id, Email: user.Email })}`})

    log(`${user.Email} sigined in`)

  } catch (err) {
    error(`while signing in ${err}`)
    return res.status(httpCode.SERVER_ERROR).send("Server error")
  }
})

module.exports = router