const express = require('express')
const router = express.Router()
const DataController = require('../controllers/DataControllers')

router.get('/', DataController.renderData)

module.exports = router