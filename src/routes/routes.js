const { Router } = require('express')
const authRoutes = require('./authRoutes')

const router = Router()

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenido a api-tlist' })
})
router.use('/auth', authRoutes)

module.exports = router
