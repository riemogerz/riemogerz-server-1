const express = require('express')
const router = express.Router()

const userRoutes = require('./userRoutes')
const beritaRoutes = require('./beritaRoutes')
const pemiluRoutes = require('./pemiluRoutes')

const errorHandler = require('../middlewares/errorHandler')

const UserController = require('../controllers/UserControllers')


router.use('/users', userRoutes)
router.use('/berita', beritaRoutes)
router.use('/pemilu', pemiluRoutes)

router.post('/verify', UserController.verify)
router.get('/verify/:validateKey', UserController.verify)
router.post('/forgotPassword/:validateKey', UserController.forgotPassword)
router.post('/resetPassword', UserController.resetPassword)
router.get('/resetPassword/:validateKey', UserController.resetPassword)

router.use(errorHandler)

module.exports = router