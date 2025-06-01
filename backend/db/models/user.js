const { Sequelize, DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const Validator = require('validator');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Define associations here
    }

    toSafeObject() {
      const { id, username, email } = this;
      return { id, username, email };
    }

    validatePassword(password) {
      console.log("bcrypt.compareSync typeof this.hashedPassword:", typeof this.hashedPassword);
      return bcrypt.compareSync(password, this.hashedPassword);
    }

    static getCurrentUserById(id) {
      return User.scope('currentUser').findByPk(id);
    }

    static async login( credential, password ) {
      console.log("LOGIN DEBUG:", credential, password);
      
      const { Op } = require('sequelize');
      let user;

      if (Validator.isEmail(credential)) {
        user = await User.scope('loginUser').findOne({ where: { email: credential } });
      } else {
        user = await User.scope('loginUser').findOne({ where: { username: credential } });
      }

      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }

      return null;
    }

    static async signup({ username, email, password }) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await User.create({
        username,
        email,
        hashedPassword,
      });

      return await User.scope('currentUser').findByPk(user.id);
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    }
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: { exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'] }
      },
      scopes: {
        currentUser: {
          attributes: { exclude: ['hashedPassword'] }
        },
        loginUser: {
          attributes: ['id', 'username', 'email', 'hashedPassword'] }
      }
    }
  );

  return User;
};