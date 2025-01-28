const createCustomError = (message, statusCode, error) => {
  if (!error) error = new Error(message)
  error.statusCode = statusCode
  return error
}

module.exports = createCustomError
