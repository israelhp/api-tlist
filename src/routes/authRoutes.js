const express = require('express')
const passport = require('../config/passportConfig')
const AuthController = require('../controllers/authController')
const validateRequest = require('../middlewares/validateMiddleware')
const { refreshTokenSchema } = require('../utils/validations/authValidators')

const router = express.Router()
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints para la autenticacion y manejo de access token
 */

/**
 * @swagger
 * /google:
 *   get:
 *     summary: Redirect to Google for authentication
 *     description: Initiates Google OAuth2 login flow. Redirects to Google's authentication page.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirect to Google's authentication page.
 */
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

/**
 * @swagger
 * /google/callback:
 *   get:
 *     summary: Google OAuth2 callback
 *     description: Callback endpoint for Google authentication. On success, returns user information and tokens.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully authenticated with Google.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Google authentication successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 64a8f728bc01a12c97d345d2
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *                         name:
 *                           type: string
 *                           example: John Doe
 *                         photo:
 *                           type: string
 *                           example: https://example.com/photo.jpg
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                         refreshToken:
 *                           type: string
 *                           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Unauthorized or invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid credentials or access denied.
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  AuthController.handleOAuthCallback
)

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refresh an access token
 *     description: Generate a new access token using a valid refresh token.
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
 *                 description: The refresh token obtained during login or token refresh.
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Successfully refreshed the access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Access token refreshed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: The new access token.
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Bad request, missing or invalid refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Refresh token is required
 *       403:
 *         description: Forbidden, error renewing token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Error renewing token
 */
router.post(
  '/refresh-token',
  validateRequest(refreshTokenSchema),
  AuthController.refreshAccessToken
)

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
router.post(
  '/revoke-refresh-token',
  validateRequest(refreshTokenSchema),
  AuthController.revokeRefreshToken
)

module.exports = router
