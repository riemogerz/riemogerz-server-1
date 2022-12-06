if (process.env.NODE_ENV !== `production`) require('dotenv').config();

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
const routes = require('./routes/index')

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', routes)

if (process.env.NODE_ENV !== `test`) {
	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`)
	})

} else {
	module.exports = app
}