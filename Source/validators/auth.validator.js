const Joi = require('joi')
const { password } = require('./custom.validator')

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  })
}

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })
}

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
}

const verifyOtp = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    code: Joi.number().required(),
  })
}

const resetPassword = {
  body: Joi.object().keys({
    newPassword: Joi.string().required().custom(password),
    token: Joi.string().required(),
  }),
}

const changePassword = {
  body: Joi.object().keys({
    currentPassword: Joi.string().required().custom(password),
    newPassword: Joi.string().required().custom(password),
    token: Joi.string().required(),
  }),
}

module.exports = {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  changePassword,
}