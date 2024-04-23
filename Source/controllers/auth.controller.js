/**
 * @author      Junming
 * @published   April 11, 2924
 * @description Auth Controller for authentication & authorization
 */

const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')
const nodemailer = require('nodemailer')
const logger = require('../config/logger.config')
const config = require('../config/config')
const { getCode } = require('../utils/methods')
const {
  userService, authService, tokenService,
} = require('../services')

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body)

  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Successfully signed up'
  })
  logger.info(`New user created with ${user.email}`)
})

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body
  let user = await authService.loginUserWithEmailandPassword(email, password)

  if (!user || !(Object.keys(user).length > 0)) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ code: httpStatus.BAD_REQUEST, message: 'No User Existing' })
  }
  user = user.toJSON()

  const token = await tokenService.generateAuthToken({ ID: user._id, email: user.email, role: user.role })

  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    user,
    token: `Bearer ${token}`,
    message: 'Successfully signed in',
  })
  logger.info(`New ${user.role} logged in - ${user.email}`)
})

const forgotPassword = catchAsync(async (req, res) => {
  const email = req.body.email
  const code = await getCode()
  let user = await userService.getUserByEmail(email)

  if (!user) return res
    .status(httpStatus.BAD_REQUEST)
    .send({ code: httpStatus.BAD_REQUEST, message: 'Email not found' })

  const transport = nodemailer.createTransport(config.email.smtp)

  if (!transport) return res
    .status(httpStatus.INTERNAL_SERVER_ERROR)
    .send({ code: httpStatus.INTERNAL_SERVER_ERROR, message: 'Server error' })

  // Email configuration
  const mailOptions = {
    from: `${config.email.from}`,
    to: email,
    subject: 'Reset Password Code',
    text: `Your password reset code is: ${code}`
  }

  // Send email with reset code
  transport.sendMail(mailOptions, async (err, info) => {
    if (err) {
      logger.error(`while sending email ${err}`)
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ code: httpStatus.INTERNAL_SERVER_ERROR, message: 'Server error' });
    }

    // Get token generated with email, code, time
    const token = await tokenService.generateOtpToken({ ID: user._id, email: user.email, code })

    res.status(httpStatus.OK).send({ 
      code: httpStatus.OK, 
      token: `Bearer ${token}`, 
      message: 'Reset code sent to your Email' 
    })
    logger.info(`Reset code sent to ${email}, ${info.response}`)
  })

})

const verifyOtp = catchAsync(async (req, res) => {
  const { token, code } = req.body
  const newToken = await authService.verifyOtp(token, code)

  res.status(httpStatus.OK).send({ 
    code: httpStatus.OK, 
    token: `Bearer ${newToken}`, 
    message: 'Reset password code is verified' 
  })
})

const resetPassword = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body
  await authService.resetPassword(token, newPassword)

  res.status(httpStatus.OK).send({ 
    code: httpStatus.OK, 
    message: 'Reset password successfully' 
  })
})

module.exports = {
  register, 
  login, 
  forgotPassword, 
  verifyOtp, 
  resetPassword
}