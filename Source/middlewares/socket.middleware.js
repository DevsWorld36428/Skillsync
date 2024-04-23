/**
 * @author      Junming
 * @published   April 3, 2024
 * @description Socket server and processor of all events
 */

const httpStatus = require('http-status')
const socketEvent = require('../utils/socketEvents')
const logger = require('../config/logger.config')
const config = require('../config/config')

const { userService, socketService } = require('../services')
const { Users } = require('../utils/global')

module.exports = async (http) => {
  const io = require("socket.io")(http, {
    cors: {
      origin: config.frontend_url,
    }
  })

  let users = await userService.getUsers()

  // Put teammates into Global Variable to check if teammates are enable or not
  users.map(item => Users.push({ ...item.toObject(), Scoket: null }))

  // Open socket connectiion once socket is created from fron-end
  io.on(socketEvent.CONNECTION, (socket) => {
    logger.info('Socket connected')

    socket.emit(socketEvent.REFRESH) //Event launcher to check earlier logged users

    //Event Handler to add new user into Global variable, Customers
    socket.on(socketEvent.USER_REGISTER, socketService.userRegister)

    /**
     * Event Handler to enable the new logged user
     * @param {Object} data required token
     */
    socket.on(socketEvent.USER_LOGGED, async (data) => {
      if (!data.token) return socket.emit(socketEvent.FORBIDDEN, httpStatus.FORBIDDEN)
      let res = await socketService.isExpired(socket, data, socketEvent.USER_LOGGED)

      if (!res) return socket.emit(socketEvent.FORBIDDEN, httpStatus.FORBIDDEN)
      if (!res.expired) socketService.userLogged(socket, res)
    })

    /**
     * Event Handler to receive order from customer and send the order to the teammate
     * @param {Object} data required token, teammate's ID, game-mode
     */
    socket.on(socketEvent.NEW_ORDER, async (data) => {
      if (!data.token || !data.TeammateID || !data.GameMode)
        return socket.emit(socketEvent.FORBIDDEN, httpStatus.FORBIDDEN)

      let res = await socketService.isExpired(socket, data, socketEvent.NEW_ORDER)
      
      if (!res) return socket.emit(socketEvent.FORBIDDEN, httpStatus.FORBIDDEN)

      if (!res.expired) socketService.newOrder(socket, data, res)
    })

    /**
     * Event Handler to accept one order by teammate
     * @param {Object} data required token, Customer's ID
     */
    socket.on(socketEvent.ACCEPT_ORDER, async (data) => {
      if (!data.token || !data.CustomerID)
        return socket.emit(socketEvent.FORBIDDEN, httpStatus.FORBIDDEN)

      let res = await socketService.isExpired(socket, data, socketEvent.ACCEPT_ORDER)

      if (!res) return socket.emit(socketEvent.FORBIDDEN, httpStatus.FORBIDDEN)
      if (!res.expired) await socketService.acceptOrder(socket, data, res)
    })

    /**
     * Event Handler to disable logged out user
     */
    socket.on(socketEvent.USER_LOGOUT, async () => await socketService.userLogout(socket))

    /**
     * Event Handler to disable disconnected user
     */
    socket.on(socketEvent.DISCONNECT, async () => await socketService.disconnect(socket))
  })
}