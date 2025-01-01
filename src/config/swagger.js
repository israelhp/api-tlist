const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const config = require('./config')

// Función para crear la especificación de Swagger
const createSwaggerSpec = () => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API REST Tlist',
        version: '1.0.0',
        description: 'Documentación API REST TList',
      },
      servers: [
        {
          url: `http://localhost:${config.PORT}`,
        },
      ],
    },
    apis: ['./src/routes/*.js'], // Ruta a los archivos de rutas con anotaciones
  }

  return swaggerJsdoc(options)
}

// Singleton funcional para Swagger
const createSwaggerConfig = () => {
  let swaggerSpec = null

  const getSpec = () => {
    if (!swaggerSpec) {
      swaggerSpec = createSwaggerSpec()
    }
    return swaggerSpec
  }

  const setupSwagger = (app) => {
    const spec = getSpec()
    app.use('/api-tlist/docs', swaggerUi.serve, swaggerUi.setup(spec))
  }

  return { setupSwagger }
}

module.exports = createSwaggerConfig()
