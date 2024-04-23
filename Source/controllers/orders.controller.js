/**
 * @author      Junming
 * @published   April 9, 2024
 * @description Controllers to handle all the orders
 */

const { Order } = require('../models')

/**
 * Function to save new order from a customer
 * @param {String} customerID
 * @param {String} teammateID
 * @param {String} gameMode
 * @return {Object} new object created
 */
const saveOrder = async ({ customerID, teammateID, gameMode }) => {
  const order = new Order({ customerID, teammateID, gameMode })
  return order
}

/**
 * Function to update an order accepted by a teammate
 * @param {String} orderID
 * @return {Object} object updated
 */
const acceptOrder = async (orderID) => {
  let order = await Order.findOne({ _id: orderID })
  order.status = 2
  return order
}

/**
 * Function to update an order accepted by a teammate
 * @param {String} orderID
 * @return {Object} object updated
 */
const cancelOrder = async (orderID) => {
  let order = await Order.findOne({ _id: orderID })
  order.status = 3
  return order
}

/**
 * Function to update an order accepted by a teammate
 * @param {String} orderID
 * @return {Object} object updated
 */
const completedOrder = async (orderID) => {
  let order = await Order.findOne({ _id: orderID })
  order.status = 4
  return order
}

module.exports = {
  saveOrder, acceptOrder, cancelOrder, completedOrder
}