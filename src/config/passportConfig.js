const config = require('../config/config')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const AuthStrategy = require('../utils/strategies/authStrategy')
const UserService = require('../services/userService')

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
    },
    AuthStrategy.authVerifyCallback(UserService, 'google')
  )
)

// Serialización y deserialización
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserService.findUserById(id)
    done(null, user)
  } catch (error) {
    done(error)
  }
})

module.exports = passport
