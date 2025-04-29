'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    try {

      await queryInterface.bulkInsert(options, [
        {
          ownerId: 1,
          address: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          lat: 37.7749,
          lng: -122.4194,
          name: 'App Academy SF',
          description: 'A place where developers are made',
          price: 123,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          ownerId: 2,
          address: '456 Beach Ave',
          city: 'Miami',
          state: 'FL',
          country: 'USA',
          lat: 25.7617,
          lng: -80.1918,
          name: 'Beach House',
          description: 'Beautiful! Stunning! Amazing!',
          price: 222,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          ownerId: 3,
          address: '789 Mountain Rd',
          city: 'Denver',
          state: 'CO',
          country: 'USA',
          lat: 39.7392,
          lng: -104.9903,
          name: 'Mountain Cabin',
          description: 'Great weekend getaway',
          price: 100,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    } catch (error) {
      console.error('SEED ERROR:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkDelete(options, null, {});
  }
};