'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Email sudah ada' },
      validate: {
        notNull: { msg: 'Email tidak boleh kosong' },
        notEmpty: { msg: 'Email tidak boleh kosong' },
        isEmail: { msg: 'Bukan format email' },
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Password tidak boleh kosong' },
        notEmpty: { msg: 'Password tidak boleh kosong' },
      }
    },
    fullName: DataTypes.STRING,
    photo: DataTypes.STRING,
    validateKey: DataTypes.STRING,
    validation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(user => {
    user.password = hashPassword(user.password)
  })
  return User;
};