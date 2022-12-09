const axios = require('axios')

const baseUrl = 'https://www.electionhouse.org/api'
const apikey = 'sss0ccg4kcck8w48owwsw40w8ss4w48w44k8cw8g'


class DataController {
	static async renderDataDapil(req, res, next) {

		const { namaProvinsi } = req.params
		const { type } = req.query
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

			const dataCheck = data.map(el => {
				el.id = +el.IDDapil
				delete el.IDDapil
				delete el.URL
				el.wilayah = el.wilayah.split(',')
				el.jumlahWilayah = el.wilayah.length
				el.JumlahKursi = +el.JumlahKursi
				el.MinimumKursi = +el.MinimumKursi
				el.MaksimumKursi = +el.MaksimumKursi
				el.AlokasiKursi = +el.AlokasiKursi

				if (!namaProvinsi) return el
				if (el.NamaProvinsi === namaProvinsi.toUpperCase()) return el
			}).filter(el => el != null)

			if (namaProvinsi == ':namaProvinsi') throw { name: 'NotFound' }
			let dataSend;
			if (!type) {
				dataSend = {
					count: dataCheck.length,
					dapil: dataCheck
				}
			} else if (type) {
				let countProvinsi = dataCheck.map(el => {
					return el.NamaProvinsi
				})
				countProvinsi = [...new Set(countProvinsi)]
				dataSend = {
					count: countProvinsi.length,
					provinsi: countProvinsi
				}
			}

			res.status(200).json(dataSend)
		} catch (error) {
			next(error)
		}
	}

}

module.exports = DataController