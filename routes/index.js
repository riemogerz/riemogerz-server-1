const express = require('express')
const router = express.Router()
const datasRoutes = require('./datasRoutes')
const pemiluRoutes = require('./pemiluRoutes')
const errorHandler = require('../middlewares/errorHandler')

router.use('/datas', datasRoutes)

router.use('/pemilu', pemiluRoutes)

router.use(errorHandler)
module.exports = router