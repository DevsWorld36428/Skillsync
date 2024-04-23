const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message("{{#label}} must be a valid id")
  }
  return value
}

const validateObjectIdArrayInFormData = (value, helpers) => {
  if (typeof value === "string") {
    const arr = value.split(",")
    if (arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i].match(/^[0-9a-fA-F]{24}$/)) {
          return helpers.message("{{#label}} must be a valid id")
        }
      }
    }
    return arr
  }

  return helpers.message("{{#label}} must be a string seperated by commas")
}

const validateObjectArray = (value, helpers) => {
  if (value) {
    const arr = JSON.parse(value)
    return arr
  }

  return helpers.message("{{#label}} must be a string seperated by commas")
}

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message("password must be at least 8 characters")
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(
      "password must contain at least 1 letter and 1 number"
    )
  } else if (!value.match(/[A-Z]/)) {
    return helpers.message(
      "password must contain at least an uppercase"
    )

  } else if (!value.match(/[!@#$%^&*()_+~]/)) {
    return helpers.message(
      "password must contain at least a special symbol"
    )
  }
  return value
}

module.exports = {
  objectId,
  password,
  validateObjectArray,
  validateObjectIdArrayInFormData,
}