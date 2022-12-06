const express = require('express')
const router = express.Router()
const datasRoutes = require('./datasRoutes')
const errorHandler = require('../middlewares/errorHandler')

router.use('/datas', datasRoutes)

router.use(errorHandler)
module.exports = router