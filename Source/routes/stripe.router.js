/**
 * @author      Junming
 * @published   Mar 5, 2024
 * @description Router to handle payment method
 */

const router = require('express').Router()
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const httpCode = require('../resource/httpCode')

const { log, error } = require('../libs')

router.post('/payment/method/attach', async (req, res) => {
  if (!req.body.PaymentMethod || !req.body.CustomerID) return res.status(httpCode.FORBIDDEN).send({ message: 'Invalid Request' })

  const PaymentMethod = req.body.PaymentMethod
  const CustomerID = req.body.CustomerID

  try {
    const method = await attachMethod({ PaymentMethod, CustomerID })
    console.log(method)
    return res.status(httpCode.SUCCESS).send({ message: 'Successfully payment method attached' })

  } catch (err) {

    error(`while attaching payment method ${err}`)
    return res.status(httpCode.SERVER_ERROR).send({ message: 'Server error' })
  }

})

router.post('/payment/create', async (req, res) => {
  if (!req.body.PaymentMethod || !req.body.Amount || !req.body.Currency || !req.body.CustomerID)
    return res.status(httpCode.FORBIDDEN).send({ message: 'Invalid request' })

  const amount = req.body.Amount
  const currency = req.body.Currency
  const customerID = req.body.CustomerID

  try {
    const paymentIntent = await stripe.paymentIntent.create({
      amount, currency,
      customer: customerID,
      payment_method: 'manual'
    })

    return res.status(httpCode.SUCCESS).send({ message: 'Successfully created payment method', paymentIntent })

  } catch (err) {
    error(`while creating payment ${err}`)
    return res.status(httpCode.SERVER_ERROR).send({ message: 'Server error' })
  }
})

async function createStripeCustomer(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const Customer = await stripe.customers.create({
        email,
      });

      resolve(Customer);
    } catch (err) {
      reject(err);
    }
  });
}

async function attachMethod({ PaymentMethod, CustomerID }) {
  return new Promise(async (resolve, reject) => {
    try {
      const paymentMethodAttach = await stripe.paymentMethods.attach(PaymentMethod.id, {
        customer: CustomerID
      })
      resolve(paymentMethodAttach)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = router
module.exports = {
  createStripeCustomer
}
