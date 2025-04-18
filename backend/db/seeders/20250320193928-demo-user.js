"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          firstName: "John",
          lastName: "Smith",
          email: "john.smith@gmail.com",
          username: "JohnSmith",
          hashedPassword: bcrypt.hashSync("secret password"),
        },
        {
          firstName: "mason",
          lastName: "hollo",
          email: "first.test3@gmail.com",
          username: "secre",
          hashedPassword: bcrypt.hashSync("secret password"),
        },
        {
          firstName: "natasha",
          lastName: "richardson",
          email: "user2@user.io",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password3"),
        },
        {
          firstName: "Demo",
          lastName: "User",
          email: "demo@user.com",
          username: "DemoUser",
          hashedPassword: bcrypt.hashSync("password123"),
        },
      ],
      { validate: true, ...options }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: [
            "JohnSmith",
            "secre",
            "Demo-lition",
            "DemoUser",
            "FakeUser2",
          ],
        },
      },
      {}
    );
  },
};