/**
 * @author      Junming
 * @published   Mar 31, 2024
 * @description Model between backend & database
 * @methods
 ** init: Function to connect to MonoDB
 ** customerSchema: Function to create customers collection
 ** teammateSchema: Function to create teammates collection
 */

 const mongoose = require("mongoose")
 const { log, error } = require('../libs')

 require('dotenv').config()

 /**
  * Schema to create customers collection
  */
 const customerSchema = new mongoose.Schema({
  Email: { type: String, maxlength: 50 },
  Password: { type: String, maxlength: 100 },
  Ranking: { type: Number, default: null },
  TeammatesIDs: { type: [Number], default: [] },
 })

 /**
  * Schema to create teammates collection
  */
 const teammateSchema = new mongoose.Schema({
  Email: { type: String, maxlength: 50 },
  Password: { type: String, maxlength: 100 },
  Ranking: { type: Number, default: null },
  DiscordLink: { type: String, default: '' },
  CustomersIDs: { type: [Number], default: [] },
 })

 // Define models
 const Customer = mongoose.model('Customer', customerSchema)
 const Teammate = mongoose.model('Teammate', teammateSchema)

 /**
  * Function to connect to database while running the server
  */
 const init = async () => {
   try {
    await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)

    log('Connected to MongoDB')

   } catch (err) {
    error(`connecting to MongoDB: ${err}`)
    process.exit(1) // Exit the process if connection fails
   }
 }

 module.exports = {
  init, Customer, Teammate
 }