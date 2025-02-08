const { Router } = require('express')
const authRoutes = require('./authRoutes')
const noteRoutes = require('./noteRoutes')
const reminderRoutes = require('./reminderRoutes')

const router = Router()

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to api-tlist' })
})
router.use('/auth', authRoutes)
router.use('/notes', noteRoutes)
router.use('/reminders', reminderRoutes)

module.exports = router
