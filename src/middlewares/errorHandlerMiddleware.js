const { StatusCodes } = require('http-status-codes')
const { errorResponse } = require('../utils/responseHelper')

// eslint-disable-next-line no-unused-vars
const errorHandlerMiddleware = (err, req, res, next) => {
  const { statusCode, message } = err

  if (statusCode && message) errorResponse(res, statusCode, message, err)
  else
    errorResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Service not available',
      err
    )
}

module.exports = errorHandlerMiddleware
