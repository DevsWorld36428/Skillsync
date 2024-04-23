/**
 * @author Junming
 * @published April 11, 2024
 * @description A mongoose schema plugin which applies the following in the toJSON trasform call:
 ** - removes __v, createAt, updateAt, and any path that has private: true
 ** - replaces _id with id
 */

 /**
  * Recursively deletes a property at the specified path within an object
  * @param {Object} obj - The object to delete the property from
  * @param {String[]} path -The path to the property to be deleted, represented as an array of keys
  * @param {Number} index - The index of the current key in the path array
  * @returns 
  */
 const deleteAtPath = (obj, path, index) => {
  if (index === path.length - 1) {
    delete obj[path[index]]
    return
  }
  deleteAtPath(obj[path[index]], path, index + 1)
}

/**
 * Method to exclude private fields and perform additional transformations
 * @param {Object} schema - The Mongoose schema to modify
 */
const toJSON = (schema) => {
  let transform

  // Preserve existing transform function, if any, from schema options
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform
  }

  // Override the toJSON method with custom behavior
  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc, ret, options) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          deleteAtPath(ret, path.split('.'), 0)
        }
      })

      ret.id = ret._id.toString() // Convert _id to id
      delete ret.__v // Remove __v property
      delete ret.deleted // Remove deleted property

      // Call the original transform function, if available
      if (transform) return transform(doc, ret, options)
    }
  })
}

module.exports = toJSON