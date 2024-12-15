require('dotenv-flow/config')

const config = {
  ENV: process.env.NODE_ENV || 'production',
  PORT: process.env.PORT || 3000,
  DBURL: process.env.DB_URL || '',
}

module.exports = config
