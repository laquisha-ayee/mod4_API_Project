"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; 
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Reviews"; 
    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          userId: 2,
          review: "Amazing place, very clean!",
          stars: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 1,
          userId: 3,
          review: "Nice spot, but a bit noisy.",
          stars: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 2,
          userId: 1,
          review: "Great location and host.",
          stars: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 3,
          userId: 2,
          review: "Great for a weeekend retreat.",
          stars: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews"; 
return queryInterface.bulkDelete(options, null, {});
  }
};