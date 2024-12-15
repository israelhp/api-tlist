require('express-async-errors')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const SwaggerConfig = require('./swagger')
const routes = require('../routes/routes')

class ExpressConfig {
  app

  constructor() {
    this.app = express()
    this.configureMiddlewares()
    this.configureRoutes()
    this.configureSwagger()
    this.configureErrorHandling()
  }

  configureMiddlewares() {
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(express.json())
    this.app.use(cors())
    this.app.use(helmet())
    this.app.use(morgan('tiny'))
  }
  configureRoutes() {
    this.app.use('/api-tlist', routes)
  }
  configureSwagger() {
    const swagger = SwaggerConfig.getInstance()
    swagger.setupSwagger(this.app)
  }

  configureErrorHandling() {}

  getApp() {
    return this.app
  }
}

module.exports = ExpressConfig
