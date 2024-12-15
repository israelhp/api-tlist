const { Router } = require('express')

const router = Router()

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenido a api-tlist' })
})

module.exports = router
