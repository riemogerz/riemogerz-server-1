const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const hashPassword = (password) => bcrypt.hashSync(password, salt);
const comparePassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword)

module.exports = { hashPassword, comparePassword }