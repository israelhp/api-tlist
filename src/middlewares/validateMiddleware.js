const { StatusCodes } = require('http-status-codes')
const createCustomError = require('../utils/customError')

const validateRequest =
  (schema, property = 'body') =>
  (req, res, next) => {
    const { error } = schema.validate(req[property])

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ')

      return next(createCustomError(errorMessage, StatusCodes.BAD_REQUEST))
    }

    next()
  }

module.exports = validateRequest
