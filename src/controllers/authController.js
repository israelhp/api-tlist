const { StatusCodes } = require('http-status-codes')
const TokenService = require('../services/tokenServices')
const UserService = require('../services/userService')
const { successResponse } = require('../utils/responseHelper')
const createCustomError = require('../utils/customError')
const config = require('../config/config')

const handleOAuthCallback = async (req, res, next) => {
  try {
    const { user } = req

    const tokens = TokenService.generateTokens({
      id: user.id,
      email: user.email,
    })

    await UserService.saveRefreshToken(user, tokens.refreshToken)

    successResponse(res, StatusCodes.OK, 'Login successful', {
      tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    })
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    next(
      createCustomError(
        'Error during OAuth login',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    )
  }
}

const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return next(
        createCustomError('Refresh token is required', StatusCodes.BAD_REQUEST)
      )
    }

    const decoded = TokenService.verifyToken(
      refreshToken,
      config.JWT_REFRESH_SECRET
    )

    const newAccessToken = TokenService.generateTokens({
      id: decoded.id,
      email: decoded.email,
    }).accessToken

    successResponse(
      res,
      StatusCodes.OK,
      'Access token refreshed successfully',
      {
        accessToken: newAccessToken,
      }
    )
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    next(createCustomError('Error renewing token', StatusCodes.FORBIDDEN))
  }
}

const revokeRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return next(
        createCustomError('Refresh token is required', StatusCodes.BAD_REQUEST)
      )
    }

    const user = await UserService.revokeRefreshToken(refreshToken)

    if (!user) {
      return next(
        createCustomError(
          'Invalid or expired refresh token',
          StatusCodes.UNAUTHORIZED
        )
      )
    }

    successResponse(res, StatusCodes.OK, 'Successfully logged out', null)
  } catch (error) {
    next(error)
  }
}

const AuthController = {
  handleOAuthCallback,
  refreshAccessToken,
  revokeRefreshToken,
}

module.exports = AuthController
