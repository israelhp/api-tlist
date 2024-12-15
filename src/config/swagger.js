const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const config = require('./config')

class SwaggerConfig {
  static instance
  swaggerSpec

  constructor() {
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
            url: `http://localhost:${config.PORT}`, // Cambia esto según el entorno
          },
        ],
      },
      apis: ['./src/routes/*.js'], // Ruta a los archivos de rutas con anotaciones
    }

    this.swaggerSpec = swaggerJsdoc(options)
  }

  static getInstance() {
    if (!SwaggerConfig.instance) {
      SwaggerConfig.instance = new SwaggerConfig()
    }
    return SwaggerConfig.instance
  }

  setupSwagger(app) {
    app.use(
      '/api-tlist/docs',
      swaggerUi.serve,
      swaggerUi.setup(this.swaggerSpec)
    )
  }
}

module.exports = SwaggerConfig
