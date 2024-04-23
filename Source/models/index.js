/**
 * @author      Junming
 * @published   Mar 31, 2024
 * @description Root for all models in this server
 */

const mongoosePaginate = require('mongoose-paginate-v2')
const mongoose = require('mongoose-fill')

module.exports.User = require('./user.model')(mongoose, mongoosePaginate)