const bcrypt = require('bcryptjs')
const validator = require('validator')
const softDelete = require('mongoose-delete')
const { toJSON } = require('./plugins')

module.exports = ({ Schema, model, Types }, mongoosePaginate) => {
  /**
   * Defines the Profile sub-schema
   */
  const ProfileSchema = new Schema(
    {
      avatar: {
        type: Schema.Types.ObjectId,
        ref: 'Media',
        default: null
      },
      notification: { type: Object, default: null },
    },
    { _id: false }
  )

  /**
   * Defines the User schema
   * @param {Object} options - Mongoose options
   * @param {Schema} Schema - Mongoose Schema constructor
   * @param {Function} model - Mongoose model function
   * @param {Types} Types - Mongoose Types
   * @param {Function} mongoosePaginate - Mongoose pagination plugin
   * @returns {Model} - User model
   */
  const UserSchema = new Schema(
    {
      email: {
        type: String,
        lowercase: true,
        trim: true,
        sparse: true,
        required: true,
        valdate(value) {
          if (value && !validator.isEmail(value)) throw new Error('Invalid Email')
        }
      },
      password: {
        type: String,
        trim: true,
        minlength: 8,
        validate(value) {
          if (!value.match(/\d/) || !value.match(/[a-z]/)) {
            throw new Error("Password must contain at least one letter and one number")

          } else if (!value.match(/[A-Z]/)) {
            throw new Error('Password must contain at least one uppercase')

          } else if (!value.match(/[!@#$%^&*()_+~]/)) {
            throw new Error('Password must contain at least a special symbol')
          }
        },
        private: true
      },
      username: { type: String, default: '', },
      discordUsername: { type: String, default: '' },
      profile: ProfileSchema,
      ranking: { type: Number, default: null },
      role: {
        type: String,
        enum: ["Customer", 'Teammate'],
        default: 'Customer'
      },
      address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' }
      },
      stripeCustomerId: { type: String, private: true, default: '' },
      partners: [{
        IDs: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        status: { type: Number, default: null }, // 1: favourite, 2: blocked
      }],
    }
  )

  UserSchema.index({ email: 1, deletedAt: 1 }, { unique: true })
  UserSchema.plugin(softDelete, {
    deletedBy: true,
    deletedAt: true,
    overrideMethods: 'all'
  })
  UserSchema.plugin(toJSON)
  UserSchema.plugin(mongoosePaginate)

  UserSchema.virtual('name').get(() => this.username)

  /**
   * Check if Email is taken
   * @param {String} email - The user's email
   * @param {ObjectId} [excludeUserId] - the id of the user to be excluded
   * @return {Promise<boolean>}
   */
  UserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } })
    return !!user
  }

  /**
   * Check if Username is taken
   * @param {String} username - The user's username
   * @param {ObjectId} [excludeUserId] - the id of the user to be excluded
   * @returns {Promise<boolean>}
   */
  UserSchema.statics.isUsernameTaken = async function (username, excludeUserId) {
    const user = await this.findOne({ username, _id: { $ne: excludeUserId } })
    return !!user
  }

  /**
   * Check if password matches the user's password
   * @param {String} password 
   * @returns {Promiss<boolean>}
   */
  UserSchema.methods.isPasswordMatch = async function (password) {
    return bcrypt.compare(password, this.password)
  }

  // Middleware to hash the password before saving
  UserSchema.pre("save", async function (next) {
    const user = this
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next()
  })

  /**
   * @typedef User
   */
  return model('User', UserSchema)
}

