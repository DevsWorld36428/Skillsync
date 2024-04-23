/**
 * @author      Junming
 * @published   Mar 31, 2024
 * @description Router for authentication and authorization
 */

const router = require('express').Router()
const validate = require('../middlewares/validate.middleware')

const { authValidator } = require('../validators')
const { authController } = require('../controllers')

router.post('/register', validate(authValidator.register), authController.register)
router.post('/login', validate(authValidator.login), authController.login)
router.post('/forgot-password', validate(authValidator.forgotPassword), authController.forgotPassword)
router.post('/verifyOtp', validate(authValidator.verifyOtp), authController.verifyOtp)
router.post('/reset-password', validate(authValidator.resetPassword), authController.resetPassword)

module.exports = router
