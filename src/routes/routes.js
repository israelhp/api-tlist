const { Router } = require('express')
const authRoutes = require('./authRoutes')
const noteRoutes = require('./noteRoutes')

const router = Router()

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenido a api-tlist' })
})
router.use('/auth', authRoutes)
router.use('/notes', noteRoutes)

module.exports = router
