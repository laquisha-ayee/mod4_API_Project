'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';

    return queryInterface.bulkInsert(options, [
      {
        spotId: 1, 
        userId: 2, 
        review: "Amazing place! cant wait to visit again.",
        stars: 5, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 1,
        userId: 3, 
        review: "Pretty good, but a bit noisy.",
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2, 
        userId: 1, 
        review: "Very disappointed.",
        stars: 2, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3, 
        userId: 2, 
        review: "Nice and quiet.",
        stars: 5, 
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkDelete(options, null, {});
  }
};