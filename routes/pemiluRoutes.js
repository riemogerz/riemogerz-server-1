const express = require('express')
const router = express.Router()
const PemiluController = require('../controllers/PemiluControllers')

router.get('/dapil', PemiluController.renderDataDapil)

router.get('/perolehanSuara/:id', PemiluController.renderDataPerolehanSuara)

module.exports = router