"use strict";

const bcrypt= require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; 
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Users'; 
    await queryInterface.bulkInsert(
      options, [
        {
          email: 'demo@user.io',
          username: 'Demo-lition',
          hashedPassword: bcryptjs.hashSync('password'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: 'user1@user.io',
          username: "FakeUser1",
          hashedPassword: bcryptjs.hashSync('password2'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "user2@user.io",
          username: "FakeUser2",
          hashedPassword: bcryptjs.hashSync('password3'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users"; 
    const Op = Sequelize.Op; 
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: ['Demo-lition', 'FakeUSer1', 'FakeUser2'], }
      }
    );
  }
};