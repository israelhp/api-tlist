const jwt = require('jsonwebtoken')
const config = require('../config/config')

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '15m' })
  const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  })

  return { accessToken, refreshToken }
}

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret)
}

const TokenService = {
  generateTokens,
  verifyToken,
}

module.exports = TokenService
