const errorHandler = async function (err, req, res, next) {
	console.log('------- masuk ERR Handler');

	let { name } = err
	let code, message;

	switch (name) {
		case 'FoundData':
			code = 200;
			message = 'Data has already been added to favorites'
			break;
		case 'InvalidRole':
			code = 200;
			message = "You cann't be a customer, because you're already an Admin/Staff"
			break;
		case "SequelizeValidationError":
		case "SequelizeUniqueConstraintError":
			code = 400;
			message = err.errors[0].message;
			break;
		case "BadRequest":
			code = 400;
			message = "Email or password is required";
			break;
		case "Unauthorized":
		case "JsonWebTokenError":
			code = 401;
			message = "Error authentication";
			break;
		case "InvalidCredentials":
			code = 401;
			message = "Error login! Email or Password not matched";
			break;
		case "Forbidden":
			code = 403;
			message = "Forbidden error in authorization";
			break;
		case "NotFound":
			code = 404;
			message = "Data not found";
			break;
		default:
			code = 500
			message = "Internal Server Error";
			break;
	}
	res.status(code).json({ message })
}
module.exports = errorHandler