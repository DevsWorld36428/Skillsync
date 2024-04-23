/**
 * @author      Junming
 * @published   April 12, 2024
 * @description Service library for socket event
 */

const logger = require('../config/logger.config')
const socketEvent = require('../utils/socketEvents')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const httpStatus = require('http-status')
const { userService } = require('.')
const { Users, Sockets } = require('../utils/global')

/**
 * Function to check if the tokein is expired
 * @param {Object} socket  
 * @param {Object} data
 * @param {String} event 
 */
const isExpired = async (socket, data, event) => {
  try {
    let token = data.token.slice(7)
    let user = jwt.verify(token, config.jwt.secret)
    let curTime = new Date().getTime()
    let expireTime = config.jwt.accessExpirationMinutes * 60 * 1000
    
    if (curTime - user.iat > expireTime) {
      socket.emit(socketEvent.EXPIRED, { data, event })
      return { user, expired: true }

    } else return { user, expired: false }

  } catch (err) {
    logger.error(`while checking token expiration ${err}`)
    return null
  }
}

/**
 * Save new registered user in Global variable
 */
const userRegister = async () => {
  try {
    let newUser = await userService.getLastUser()
    if (newUser) {
      newUser = { ...newUser.toObject(), Socket: null }
      Users.push(newUser) //ADD new user
    }
  } catch (err) {
    logger.error(`user register failed ${err}`)
  }
}

/**
 * Enable logged user for real-time communication
 * @param {Object} socket 
 * @param {Object} res
 */
const userLogged = async (socket, res) => {
  try {
    if (Users.length > 0) {
      //Find index of the logged user in Users array
      let loggedUserPos = Users.findIndex(user => user._id.toString() === res.user.id.ID)
      if (loggedUserPos !== -1) {
        Users[loggedUserPos].Socket = socket.id
        Sockets.push(socket)
      }
    }
  } catch (err) {
    logger.error(`while handling logged user ${err}`)
    socket.emit(socketEvent.SERVER_ERROR, httpStatus.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Send order to selected teammate
 * @param {Object} socket 
 * @param {Object} data 
 * @param {Object} res
 */
const newOrder = async (socket, data, res) => {
  try {
    Users.forEach(item => {
      if (item._id.toString() === data.TeammateID && item.role === 'Teammate' && item.Socket) {
        Sockets.forEach(sck => {
          if (sck.id === item.Socket)
            return sck.emit(socketEvent.NEW_ORDER, { Sender: data.Sender, SenderID: res.user.id.ID, GameMode: data.GameMode })
        })
      }
    })
  } catch (err) {
    logger.error(`while sending order ${err.stack}`)
    socket.emit(socketEvent.SERVER_ERROR, httpStatus.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Accept order by a teammate received new order
 * @param {Object} socket 
 * @param {Object} data 
 * @param {Object} res
 */
const acceptOrder = async (socket, data, res) => {
  try {
    //Find selected teammate among all teammates
    Users.forEach(item => {

      if (item._id.toString() === data.CustomerID && item.role === 'Customer' && item.Socket) {

        Sockets.forEach(sck => {
          if (sck.id === item.Socket)
            return sck.emit(socketEvent.ACCEPT_ORDER, { SenderID: res.user.id.ID })
        })
      }
    })

  } catch (err) {
    logger.error(`while accepting the order ${err}`)
    socket.emit(socketEvent.SERVER_ERROR, httpStatus.INTERNAL_SERVER_ERROR)
  }
}

const userLogout = async (socket) => {
  try {
    let UserPos = Users.findIndex(item => item.Socket === socket.id)
    if (UserPos !== -1) Users[UserPos].Socket = null //disable the user in real-time communication
    else {
      UserPos = Users.findIndex(item => item.Socket === socket.id) //Find in Teammates
      if (UserPos !== -1) Users[UserPos].Socket = null
    }

    //Find index of logged out socket in Gloabal variable, Sockets
    let index = Sockets.findIndex(sck => sck.id === socket.id)

    if (index !== -1) Sockets.splice(index, 1)
  } catch (err) {
    logger.error(`while handling logout event ${err}`)
    socket.emit(socketEvent.SERVER_ERROR, httpStatus.INTERNAL_SERVER_ERROR)
  }
}

const disconnect = async (socket) => {
  try {
    //Find index of disconnected user in Gloabal variable, first in Customers
    let disConnectedUserPos = Users.findIndex(item => item.Socket === socket.id)

    if (disConnectedUserPos !== -1) {
      Users[disConnectedUserPos].Socket = null //disable the user in real-time communication
    } else {
      disConnectedUserPos = Users.findIndex(item => item.Socket === socket.id) //Find in Teammates
      if (disConnectedUserPos !== -1) Users[disConnectedUserPos].Socket = null
    }

    //Find index of disconnected socket in Gloabal variable, Sockets
    let index = Sockets.findIndex(sck => sck.id === socket.id)
    if (index !== -1) Sockets.splice(index, 1)
  } catch (err) {
    logger.error(`while handling disconnect event ${err}`)
    socket.emit(socketEvent.SERVER_ERROR, httpStatus.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  isExpired,
  userRegister,
  userLogged,
  newOrder,
  acceptOrder,
  userLogout,
  disconnect
}