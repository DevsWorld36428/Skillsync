const { toJSON, } = require('./plugins/toJSON.plugin')

/**
 * Defines the Media schema
 * @param {Object} options - Mongoose options
 * @param {Schema} Schema - Mongoose Schema constructor
 * @param {Types} Types - Mongoose Types
 * @param {Function} model - Mongoose model function
 * @param {Function} mongoosePaginate - Mongoose pagination plugin
 * @returns {Model} - Media model
 */
module.exports = ({ Schema, Types, model }, mongoosePaginate) => {
  // Define the Media schema
  const Media = new Schema(
    {
      filePath: { type: String, required: true },
      public_id: { type: String, default: '' },
      size: { type: String, default: '' },
      status: {
        typd: String, 
        enum: ['active', 'pending', 'deleted'],
        default: 'active'
      },
      mimetype: { type: String },
      user: { type: Types.ObjectId, ref: 'User' },
      isPublic: { type: String, default: false }
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
  )

  Media.plugin(toJSON)
  Media.plugin(mongoosePaginate)

  /**
   * @typedef Media
   */
  return model('Media', Media)
}