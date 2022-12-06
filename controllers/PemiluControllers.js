const axios = require('axios')

const baseUrl = 'https://www.electionhouse.org/api'
const apikey = 'sss0ccg4kcck8w48owwsw40w8ss4w48w44k8cw8g'


class DataController {
	static async renderDataDapil(req, res, next) {
		try {
			const { data } = await axios({
				url: `${baseUrl}/dprri?tahun_pemilu=2019`,
				method: 'get',
				headers: {
					Accept: 'application/json',
					'Accept-Encoding': 'identity',
					'x-api-key': apikey,

				}
			})
			if (!data) throw { name: 'NotFound' }
			data.map(el => {
				el.id = el.IDDapil
				delete el.IDDapil
				delete el.URL
				el.wilayah = el.wilayah.split(',')

				return el
			})

			res.status(200).json(data)
		} catch (error) {
			next(error)
		}
	}

}

module.exports = DataController