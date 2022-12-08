const errorHandler = async function (err, req, res, next) {
	console.log('------- masuk ERR Handler');

	let { name } = err
	let code, message;

	switch (name) {
		case "SequelizeValidationError":
		case "SequelizeUniqueConstraintError":
			code = 400;
			message = err.errors[0].message;
			break;
		case "BadRequest":
			code = 400;
			message = "Email atau password diperlukan";
			break;
		case "Unauthorized":
		case "JsonWebTokenError":
			code = 401;
			message = "Error autentikasi";
			break;
		case "InvalidCredentials":
			code = 401;
			message = "Error login! Email atau Password belum tepat";
			break;
		case "Forbidden":
			code = 403;
			message = "Kesalahan otorisasi";
			break;
		case "NotFound":
			code = 404;
			message = "Data tidak ditemukan";
			break;
		case "NotVerified":
			code = 404;
			message = "Gagal terverifikasi, silakan lakukan verifikasi";
			break;
		case "NotMatch":
			code = 404;
			message = "Password tidak cocok, silakan tulis ulang";
			break;
		default:
			code = 500
			message = "Internal Server Error";
			break;
	}
	res.status(code).json({ message })
}
module.exports = errorHandler