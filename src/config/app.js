const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const routes = require('../routes/routes')
const swagger = require('./swagger')
const errorHandlerMiddleware = require('../middlewares/errorHandlerMiddleware')

const configureMiddlewares = (app) => {
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  app.use(cors())
  app.use(helmet())
  app.use(morgan('tiny'))
}

const configureRoutes = (app) => {
  app.use('/api-tlist', routes)
}

const configureSwagger = (app) => {
  swagger.setupSwagger(app)
}

const configureErrorHandling = (app) => {
  app.use(errorHandlerMiddleware)
}

const createApp = () => {
  const app = express()
  configureMiddlewares(app)
  configureRoutes(app)
  configureSwagger(app)
  configureErrorHandling(app)
  return app
}

module.exports = { createApp }
