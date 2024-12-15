const mongoose = require('mongoose')

class Database {
  static instance
  mongooseInstance

  constructor() {
    this.mongooseInstance = mongoose
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
  async connect(uri) {
    try {
      await this.mongooseInstance.connect(uri)
      console.log('Conexión a la base de datos establecida')
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error)
      process.exit(1)
    }
  }
  async disconnect() {
    try {
      await this.mongooseInstance.disconnect()
      console.log('Desconexión de la base de datos completada')
    } catch (error) {
      console.error('Error al desconectar de la base de datos:', error)
    }
  }
}

module.exports = Database
