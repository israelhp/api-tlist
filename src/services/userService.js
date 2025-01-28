const User = require('../models/User')

const saveOrUpdateUser = async (profile, provider) => {
  const email = profile.emails?.[0]?.value
  const name = profile.displayName || profile.username
  const photo = profile.photos?.[0]?.value

  if (!email) {
    throw new Error('The profile does not contain a valid email')
  }

  let user = await User.findOne({ email })

  if (user) {
    if (!user.providers.includes(provider)) {
      user.providers.push(provider)
    }
  } else {
    user = await User.create({
      email,
      name,
      photo,
      providers: [provider],
    })
  }

  return user
}

const saveRefreshToken = async (user, refreshToken) => {
  user.refreshToken = refreshToken
  await user.save()
}

const revokeRefreshToken = async (refreshToken) => {
  const user = await User.findOne({ refreshToken })

  if (!user) {
    return null
  }

  user.refreshToken = null
  await user.save()
  return user
}

const UserService = {
  saveRefreshToken,
  saveOrUpdateUser,
  revokeRefreshToken,
}

module.exports = UserService
