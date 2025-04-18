'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        review: "Amazing place, very clean!",
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: "Nice spot, but a bit noisy.",
        stars: 3
      },
      {
        spotId: 3,
        userId: 3,
        review: "Great location and host.",
        stars: 4
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
