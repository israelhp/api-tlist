const mongoose = require('mongoose')

const createDatabase = () => {
  let instance = null

  const connect = async (uri) => {
    try {
      await mongoose.connect(uri)
      console.log('Conexión a la base de datos establecida')
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error)
      process.exit(1)
    }
  }

  const disconnect = async () => {
    try {
      await mongoose.disconnect()
      console.log('Desconexión de la base de datos completada')
    } catch (error) {
      console.error('Error al desconectar de la base de datos:', error)
    }
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = { connect, disconnect }
      }
      return instance
    },
  }
}

// Exportar una única instancia del singleton
module.exports = createDatabase().getInstance()
