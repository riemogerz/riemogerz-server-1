const axios = require('axios')

class DataController {
	static async renderData(req, res, next) {
		try {
			const { data } = await axios({
				url: 'https://api-berita-indonesia.vercel.app/antara/politik/',
				method: 'get',
				headers: {
					Accept: 'application/json',
					'Accept-Encoding': 'identity'
				}
			})
			if (!data.success) throw { name: 'NotFound' }
			const { title, link, image, description, posts } = data.data
			const dataSend = {
				title, link, image, description, posts
			}

			res.status(200).json(dataSend)
		} catch (error) {
			console.log(error, 'masuk ERROR');
			next(error)
		}
	}
}

module.exports = DataController