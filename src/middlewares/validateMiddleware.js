const { StatusCodes } = require('http-status-codes')
const createCustomError = require('../utils/customError')

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body)

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(', ')

    return next(createCustomError(errorMessage, StatusCodes.BAD_REQUEST))
  }

  next()
}

module.exports = validateRequest
