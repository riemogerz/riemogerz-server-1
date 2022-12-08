const { hashPassword, comparePassword } = require('../helpers/bcrypt');
const nodemailer = require('nodemailer');
const { User } = require('../models/index')
const { Op } = require("sequelize");
const { createToken } = require('../helpers/jwt');

const baseurl = 'http://localhost:3000'
const emailAdmin = process.env.SECRET_EMAIL
const passAdmin = process.env.SECRET_PASS

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: emailAdmin,
		pass: passAdmin,
	}
});

class UserController {
	static async register(req, res, next) {
		const { email, password, fullName, photo } = req.body

		try {
			const verifySend = hashPassword(email)
			const dataUser = await User.create({
				email, password, fullName, photo,
				validateKey: verifySend,
				validation: false
			})
			if (!dataUser || !verifySend) throw { name: 'SequelizeValidationError' }

			const mailOptions = {
				from: emailAdmin,
				to: dataUser.email,
				subject: `[Amnesia News] Berhasil registrasi`,
				html: `<h1>Selamat Datang di AMNESIA News</h1><p>Aspirasi Masyarakat Indonesia !!!</p><br>Email anda : ${dataUser.email} telah terdaftar.<br>Silakan simpan kode verifikasi anda:${verifySend}<br></br>Silakan lakukan verifikasi akun anda terlebih dahulu dengan mengklik link berikut ini:<br>${baseurl}/verify/${verifySend}<br><p>Development by ${emailAdmin}</p>`
			};
			transporter.sendMail(mailOptions, (err, info) => {
				if (err) throw err;
				console.log('Email terkirim: ' + info.response);
			});

			res.status(200).json({
				email: dataUser.email,
				fullName: dataUser.fullName,
				photo: dataUser.photo,
				validation: dataUser.validation
			})
		} catch (error) {
			console.log(error, 'masuk ERROR');
			next(error)
		}
	}

	static async forgotPassword(req, res, next) {
		const { email } = req.body
		const { validateKey } = req.params
		try {
			const data = await User.findOne({
				where: {
					[Op.and]: [
						{ email },
						{ validateKey }
					],
				}
			})
			if (email !== data.email && validateKey !== data.validateKey) throw { name: 'NotFound' }

			const mailOptions = {
				from: emailAdmin,
				to: data.email,
				subject: `[Amnesia News] Lupa password`,
				html: `<h1>Selamat Datang di AMNESIA News</h1><p>Aspirasi Masyarakat Indonesia !!!</p><br>Anda sedang mengajukan untuk mereset Password.<br>Silakan klik link berikut ini:<br>${baseurl}/resetPassword/${validateKey}<br>Abaikan email ini jika Anda tidak mengajukannya.<br><br><p>Development by ${emailAdmin}</p>`
			};
			transporter.sendMail(mailOptions, (err, info) => {
				if (err) throw err;
				console.log('Email terkirim: ' + info.response);
			});

			res.status(200).json({ message: 'Silakan cek email Anda' })

		} catch (error) {
			next(error)
		}
	}

	static async resetPassword(req, res, next) {
		const { email, password, repassword } = req.body
		try {
			let { validateKey } = req.params
			if (!validateKey) throw { name: 'NotVerified' }

			if (!password || !repassword || password !== repassword) throw { name: 'NotMatch' }
			const updatePassword = hashPassword(password)
			await User.update({ password: updatePassword }, { where: { email } })

			res.status(200).json({ message: 'Password berhasil diganti' })
		} catch (error) {
			next(error)
		}
	}

	static async verify(req, res, next) {

		let { validateKey } = req.params
		if (!validateKey) validateKey = req.body.validateKey
		if (!validateKey) throw { name: 'NotVerified' }

		try {
			const data = await User.findOne({ where: { validateKey } })
			if (!data) throw { name: 'NotVerified' }

			await User.update({ validation: true }, { where: { validateKey } })

			res.status(200).json({ message: 'Akun anda berhasil diganti' })
		} catch (error) {
			next(error)
		}
	}

	static async login(req, res, next) {
		try {
			const { email, password } = req.body
			console.log(email, password, '<<<<<<');
			if (!email || !password) throw { name: 'InvalidCredentials' }

			const foundUser = await User.findOne({ where: { email } });
			console.log(foundUser, '---------');

			if (!foundUser) throw { name: 'InvalidCredentials' };
			if (foundUser.validation === 'false') throw { name: 'NotVerified' }

			const comparedPassword = comparePassword(password, foundUser.password);
			if (!comparedPassword) throw { name: 'InvalidCredentials' };

			const user_id = foundUser.id
			const access_token = createToken({ id: user_id })

			res.status(200).json({
				access_token, user_id, email: foundUser.email
			})
		} catch (error) {
			next(error)
		}
	}


}

module.exports = UserController