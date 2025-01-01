const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const routes = require('../routes/routes')
const swagger = require('./swagger') // Importar la configuración de Swagger
require('express-async-errors') // Habilitar manejo de errores asincrónicos

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
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error('Error:', err.message)
    res.status(500).json({ message: 'Error interno del servidor' })
  })
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
