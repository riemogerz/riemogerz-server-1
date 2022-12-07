const express = require('express')
const router = express.Router()

const UserController = require('../controllers/UserControllers')


router.post('/register', UserController.register)

module.exports = router