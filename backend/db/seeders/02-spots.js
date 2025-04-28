"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; 
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Spots'; 
    try {
    await queryInterface.bulkInsert(options, [
        {
          ownerId: 1,
          address: '123 Disney Lane',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          lat: 37.7645358,
          lng: -122.4730327,
          name: 'App Academy SF',
          description: 'Place where web developers are created',
          price: 222,
          avgRating: 4.5,
          previewImage: 'https://example.com/spot1.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          ownerId: 2,
          address: '456 Ocean Drive',
          city: 'Miami',
          state: 'FL',
          country: 'USA',
          lat: 25.7617,
          lng: -80.1918,
          name: 'Beachside Bungalow',
          description: 'A relaxing beachside retreat',
          price: 333,
          avgRating: 4.8,
          previewImage: 'https://example.com/spot2.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          ownerId: 3,
          address: '789 Mountain Road',
          city: 'Denver',
          state: 'CO',
          country: 'USA',
          lat: 39.7392,
          lng: -104.9903,
          name: 'Mountain Cabin',
          description: 'A cozy cabin in the mountains',
          price: 188,
          avgRating: 4.6,
          previewImage: 'https://example.com/spot3.jpg',
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
    options.tableName = "Spots"; 
  await queryInterface.buldDelete(options, null, {});
  }
};