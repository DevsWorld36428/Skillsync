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
const { getCode, setSMTP } = require('../libs/methods')
const { resetPasswordInfos } = require('../resource/global')

const { Customer, Teammate } = require('../model')

/**
 * Router to sign up
 * @param { Email } string
 * @param { Password } string
 */
router.post('/signup', async (req, res) => {
  try {
    // Checking if the request is valid
    if (!req.body.Email || !req.body.Password) {
      res.status(httpCode.FORBIDDEN).send({ message: "Invalid request" })
      return
    }
    let Email = req.body.Email.toLowerCase()
    let Password = req.body.Password

    const existingUser = await Customer.findOne({ Email })

    if (existingUser) {
      return res.status(httpCode.DUPLICATED).send({ message: "The user is already existed" })
    }

    //Calculating the hash string against requested password
    let salt = await bcrypt.genSalt(10)
    let hashed_password = await bcrypt.hash(Password, salt)

    const newCustomer = new Customer({ Email, Password: hashed_password })

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
 * @param { Email } string
 * @param { Password } string
 * @return | userID, Token
 */
router.post('/signin', async (req, res) => {
  try {
    // Checking if the request is valid
    if (!req.body.Email || !req.body.Password) {
      return res.status(httpCode.FORBIDDEN).send({ message: 'Invalid request' })
    }

    let Email = req.body.Email.toLowerCase()
    let Password = req.body.Password
    
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

/**
 * Router to send code for reset password
 * @param { Email } string
 * @return | reset code 
 */
router.post('/forgot-password', async (req, res) => {
  try {

    if (!req.body.Email) return res.status(httpCode.FORBIDDEN).send({ message: "Invalid request" })

    let Email = req.body.Email.toLowerCase()
    
    const user = await Customer.findOne({ Email })
    
    if (!user) return res.status(httpCode.NOT_MATCHED).send({ message: 'User not found' })

    const Code = await getCode()
    const RESET_PASSWORD_EXPIRED_TIME = 1000 * 60 * process.env.RESET_CODE_EXPIRED_TIME

    resetPasswordInfos.push({ Email, Code, ExpiresAt: Date.now() + RESET_PASSWORD_EXPIRED_TIME })

    // Email configuration
    const mailOptions = {
      from: `${process.env.SMTP_AUTH_EMAIL}`,
      to: Email,
      subject: 'Reset Password Code',
      text: `Your password reset code is: ${Code}`
    };

    const transporter = await setSMTP()
    if (!transporter) return res.status(httpCode.SERVER_ERROR).send({ message: 'Server error' })

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        error(`while sending email ${err}`)
        res.status(httpCode.SERVER_ERROR).send('Server error');
      } 

      res.status(httpCode.SUCCESS).send({ message: 'Reset code sent to your Email'})
      log(`Reset code sent to ${Email}, ${info.response}`)
    });

  } catch (err) {
    error(`while to send reset code ${err}`)
    return res.status(httpCode.SERVER_ERROR).send({ message: "Server error" })
  }
})

/**
 * Router to validate the reset-code
 * @param { Email } string
 * @param { Code } string | 6 digit code
 */
router.post('/validate-reset-code', (req, res) => {
  try {
    if (!req.body.Email || !req.body.Code) 
      return res.status(httpCode.FORBIDDEN).send({ message: "Invalid request" })
  
    const Email = req.body.Email.toLowerCase()
    const Code = req.body.Code
    const index = resetPasswordInfos.findIndex((item) => item.Email === Email)

    // Start checking if the code is valid or not
    if (index === -1 || resetPasswordInfos[index].Code !== Code || resetPasswordInfos[index].ExpiresAt < Date.now()) {
      if (index !== -1 && resetPasswordInfos[index].ExpiresAt < Date.now()) {
        resetPasswordInfos.splice(index, 1) 
        return res.status(httpCode.INVALID_MSG).send({ message: 'Expired code' })
      }

      return res.status(httpCode.INVALID_MSG).send({ message: 'Invalid code' })
    } // End checking if the code is valid or not

    resetPasswordInfos.splice(index, 1) // Remove the code in the ARRAY
    
    log(`Code valided for ${Email}`)
    res.status(httpCode.SUCCESS).send({ message: "Valid code" })

  } catch (err) {
    error(`validating reset code ${err}`)
    return res.status(httpCode.SERVER_ERROR).send({ message: 'Server error' })
  }
})

/**
 * Router to reset code
 * @param { Email } string
 * @param { newPassword } string
 */
router.post('/reset-password', async (req, res) => {
  try {
    if (!req.body.Email || !req.body.newPassword)
      return res.status(httpCode.FORBIDDEN).send({ message: 'Invalid request' })

    const Email = req.body.Email.toLowerCase()
    const newPassword = req.body.newPassword()

    let User = newCustomer.findOne({ Email })
    if (!User) return res.status(httpCode.NOT_MATCHED).send({ message: 'User not found' })

    let salt = await bcrypt.getSalt(10)
    let Password = await bcrypt.hash(newPassword, salt)

    User.Password = Password

    log(`${Email} reset password`)
    res.status(httpCode.SUCCESS).send({ message: 'Reset password successfully' })
    
  } catch (err) {
    error(`while resetting password ${err}`)
  }
})

module.exports = router