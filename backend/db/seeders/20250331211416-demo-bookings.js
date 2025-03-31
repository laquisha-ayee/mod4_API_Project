'use strict';

const options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Use schema in production
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bookings = [
      {
        spotId: 1,
        userId: 2,
        startDate: '2021-11-19',
        endDate: '2021-11-20',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 1,
        userId: 3,
        startDate: '2021-11-21',
        endDate: '2021-11-22',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        userId: 1,
        startDate: '2021-11-15',
        endDate: '2021-11-16',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3,
        userId: 2,
        startDate: '2021-12-01',
        endDate: '2021-12-02',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '2021-11-25',
        endDate: '2021-11-30',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('Bookings', bookings, options);
  },

  down: async (queryInterface, Sequelize) => {
    const options = {};
    if (process.env.NODE_ENV === 'production') {
      options.schema = process.env.SCHEMA; // Use schema in production
    }

    return queryInterface.bulkDelete('Bookings', null, options);
  },
};
