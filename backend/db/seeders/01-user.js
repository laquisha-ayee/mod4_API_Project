"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; 
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Users"; 
    await queryInterface.bulkInsert(
      options,
      [
        {
          id: 1,
          firstName: "John",
          lastName: "Smith",
          email: "john.smith@gmail.com",
          username: "JohnSmith",
          hashedPassword: require("bcryptjs").hashSync("secret password"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          firstName: "mason",
          lastName: "hollo",
          email: "first.test3@gmail.com",
          username: "secre",
          hashedPassword: require("bcryptjs").hashSync("secret password"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          firstName: "natasha",
          lastName: "richardson",
          email: "user2@user.io",
          username: "FakeUser2",
          hashedPassword: require("bcryptjs").hashSync("password3"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          firstName: "Demo",
          lastName: "User",
          email: "demo@user.com",
          username: "DemoUser",
          hashedPassword: require("bcryptjs").hashSync("password123"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users"; 
    const Op = Sequelize.Op; 
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: ["JohnSmith", "secre", "DemoUser", "FakeUser2"],
        },
      },
      {}
    );
  },
};