const authVerifyCallback = (userService, provider) => {
  return async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await userService.saveOrUpdateUser(profile, provider)
      return done(null, user)
    } catch (error) {
      return done(error)
    }
  }
}

const AuthStrategy = {
  authVerifyCallback,
}
module.exports = AuthStrategy
