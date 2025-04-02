'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert demo data into Spots table
    const spots = await queryInterface.bulkInsert(
      'Spots',
      [
        {
          ownerId: 1, // Assume demo user has ID 1
          address: '123 Disney Lane',
          city: 'San Francisco',
          state: 'California',
          country: 'United States',
          lat: 37.7645358,
          lng: -122.4730327,
          name: 'App Academy',
          description: 'A place where great developers are made.',
          price: 150.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 2, // Assume another demo user with ID 2
          address: '456 Sunshine Blvd',
          city: 'Los Angeles',
          state: 'California',
          country: 'United States',
          lat: 34.052235,
          lng: -118.243683,
          name: 'Sunny Retreat',
          description: 'A cozy retreat with amazing views.',
          price: 200.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 3, // Another user with ID 3
          address: '789 Mountain Road',
          city: 'Denver',
          state: 'Colorado',
          country: 'United States',
          lat: 39.739236,
          lng: -104.990251,
          name: 'Mountain View',
          description: 'Experience the beauty of the Rockies.',
          price: 300.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true } // Return the inserted spots for use
    );

    // Insert spot images into SpotImages table
    await queryInterface.bulkInsert('SpotImages', [
      {
        spotId: spots[0].id, // Spot 1
        url: 'https://example.com/image1.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: spots[0].id, // Spot 1 (Non-preview)
        url: 'https://example.com/image2.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: spots[1].id, // Spot 2
        url: 'https://example.com/image3.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: spots[2].id, // Spot 3
        url: 'https://example.com/image4.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all records from SpotImages and Spots tables
    await queryInterface.bulkDelete('SpotImages', null, {});
    await queryInterface.bulkDelete('Spots', null, {});
  },
};