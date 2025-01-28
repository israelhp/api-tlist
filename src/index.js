const { createApp } = require('./config/app')
const config = require('./config/config')
const dbService = require('./config/database')

const app = createApp()

const startServer = async () => {
  try {
    await dbService.connect(config.DBURL)

    app.listen(config.PORT, () => {
      console.log(`Servidor corriendo en el puerto ${config.PORT}`)
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error al iniciar el servidor:', error)
    } else {
      console.error('Error desconocido al iniciar el servidor')
    }
    process.exit(1)
  }
}

startServer()

process.on('SIGINT', async () => {
  console.log('Cerrando la conexión a la base de datos...')
  await dbService.disconnect()
  process.exit(0)
})
