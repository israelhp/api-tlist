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

/**
 * @swagger
 * /revoke-refresh-token:
 *   post:
 *     summary: Revoke the refresh token to log out a user
 *     description: This endpoint will invalidate the user's refresh token and log them out.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token of the user to revoke.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjA0NzEwMjAwfQ.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 *     responses:
 *       200:
 *         description: Successfully logged out (refresh token revoked)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully logged out"
 *       400:
 *         description: Refresh token is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Refresh token is required"
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or expired refresh token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error processing the request"
 */
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
