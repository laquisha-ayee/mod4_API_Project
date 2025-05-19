'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Spots';

const users = await queryInterface.sequelize.query(
  `SELECT id, username FROM "${options.schema ? options.schema + '"."' : ''}Users" 
  WHERE username IN (
  'Demo-lition', 'FakeUser1', 'FakeUser2', 'FakeUser3', 
  'FakeUser4', 'FakeUser5', 'FakeUser6', 'FakeUser7'
);`
);

const userMap = {};
  users[0].forEach(user => {
  userMap[user.username] = user.id;
});

    await queryInterface.bulkInsert(options, [
      {
        ownerId: userMap['Demo-lition'],
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
        ownerId: userMap['FakeUser1'],
        address: '456 Beach Ave',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        lat: 25.7617,
        lng: -80.1918,
        name: 'Beach House',
        description: 'A comfy space, so close to the ocean',
        price: 222,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: userMap['FakeUser2'],
        address: '789 Mountain Rd',
        city: 'Denver',
        state: 'CO',
        country: 'USA',
        lat: 39.7392,
        lng: -104.9903,
        name: 'Mountain Cabin',
        description: 'So much fresh air! and Stunning views!',
        price: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: userMap['FakeUser3'],
        address: '420 Hogwarts Way',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        lat: 34.0522,
        lng: -118.2437,
        name: 'Harrys Hotel',
        description: 'Its Magically fun for everyone',
        price: 321,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: userMap['FakeUser4'],
        address: '222 BlueSky Dr',
        city: 'Denver',
        state: 'CO',
        country: 'USA',
        lat: 39.7392,
        lng: -104.9903,
        name: 'Macbeth Hotel',
        description: 'Victorian style hotel',
        price: 204,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: userMap['FakeUser5'],
        address: '92 Foote st',
        city: 'Hilo',
        state: 'HI',
        country: 'USA',
        lat: 19.7297,
        lng: -155.0900,
        name: 'Mahalo Days',
        description: 'Beautiful retreat, that feels like home',
        price: 555,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: userMap['FakeUser6'],
        address:'72 Mammoth Way',
        city: 'Yellowstone National Park',
        state: 'WY',
        country: 'USA',
        lat: 44.4280,
        lng: -110.5885,
        name: 'Springs Tepee',
        description: 'Close to nature, luxury tepees',
        price: 108,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: userMap['FakeUser7'],
        address:'18 Descansos Dr.',
        city: 'La Cañada Flintridge',
        state: 'CA',
        country: 'USA',
        lat: 34.2103,
        lng: -118.2006,
        name: 'Edens Garden',
        description: 'A tranquil and beautiful getaway',
        price: 108,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkDelete(options, null, {});
  }
};