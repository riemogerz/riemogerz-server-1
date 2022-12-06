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
				return el
			})

			res.status(200).json(data)
		} catch (error) {
			next(error)
		}
	}

	static async renderDataPerolehanSuara(req, res, next) {
		const { id } = req.params
		console.log(id, '<<<<<<<<<<');
		try {
			const { data } = await axios({
				url: `${baseUrl}/dataperolehansuarapartaidpr?id_dapil=${id}&limit=5`,
				method: 'get',
				headers: {
					Accept: 'application/json',
					'Accept-Encoding': 'identity',
					'x-api-key': apikey
				}
			})
			if (!data || data.status) throw { name: 'NotFound' }

			res.status(200).json(data)
		} catch (error) {
			next(error)
		}
	}

}

module.exports = DataController