const express = require('express')
const router = express.Router()
const PemiluController = require('../controllers/PemiluControllers')

router.get('/dapil/dprri', PemiluController.renderDataDapil)

module.exports = router