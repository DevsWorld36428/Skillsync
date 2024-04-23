/**
 * @author      Junming
 * @published   April 11, 2024
 * @description Service for users integrating database directly
 */

const httpStatus = require('http-status')
const ApiError = require('../utils/apiError')
const { User } = require('../models')
const { ObjectId } = require('bson')

/**
 * Create a new user
 * @param {Object} userBody 
 * @returns {Promise<User>} 
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
  }

  const user = await User.create(userBody)
  return user
}

/* Get all registered users */
const getUsers = async () => await User.find({}, { _id: 1, email: 1, role: 1 })

/**
 * Get user by Email
 * @param {String} email 
 * @returns {Promise<User>} 
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email }).populate('profile.avatar')
}

/**
 * Get user by ID
 * @param {String} userId 
 * @returns {Promise<User>}
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId).populate("profile.avatar")
  return user;
}

/* Get last user */
const getLastUser = async () => await User.findOne({}, { _id: 1, email: 1, role: 1 }).sort({ _id: -1 })

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId)

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found")
  }

  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken")
  }

  Object.assign(user, updateBody)
  await user.save()
  return user
};

module.exports = {
  createUser,
  getUsers,
  getUserByEmail,
  getUserById,
  getLastUser,
  updateUserById
}