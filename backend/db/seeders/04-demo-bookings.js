'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 3,
        startDate: '2025-04-01',
        endDate: '2025-04-03',
      },
      {
        spotId: 2,
        userId: 1,
        startDate: '2025-05-11',
        endDate: '2025-05-21',
      },
      {
        spotId: 3,
        userId: 2,
        startDate: '2025-10-15',
        endDate: '2025-10-17',
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    
    return queryInterface.bulkDelete(options, null, {});
  }
};
