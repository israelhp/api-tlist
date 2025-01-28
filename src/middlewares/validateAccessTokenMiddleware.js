const { StatusCodes } = require('http-status-codes')
const createCustomError = require('../utils/customError')
const TokenService = require('../services/tokenServices')
const config = require('../config/config')

const validateAccessTokenMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(
        createCustomError(
          'Access token is missing or invalid',
          StatusCodes.UNAUTHORIZED
        )
      )
    }

    const token = authHeader.split(' ')[1]

    const decoded = TokenService.verifyToken(token, config.JWT_SECRET)

    req.user = {
      id: decoded.id,
      email: decoded.email,
    }

    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(
        createCustomError('Access token expired', StatusCodes.UNAUTHORIZED)
      )
    }

    if (error.name === 'JsonWebTokenError') {
      return next(
        createCustomError('Invalid access token', StatusCodes.UNAUTHORIZED)
      )
    }

    next(error)
  }
}

module.exports = validateAccessTokenMiddleware
