/**
 * @author      Junming
 * @published   Mar 31, 2024
 * @description Default router of this project
 */

const router = require('express').Router()

const auth = require('./auth.router')

router.use('/auth', auth)

module.exports = router