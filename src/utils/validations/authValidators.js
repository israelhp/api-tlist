const Joi = require('joi')

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.base': 'Refresh token must be a valid text',
    'string.empty': 'Refresh token cannot be empty',
    'any.required': 'Refresh token is required',
  }),
})

module.exports = {
  refreshTokenSchema,
}
