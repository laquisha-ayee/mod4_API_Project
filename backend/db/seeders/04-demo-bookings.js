'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  
}
module.exports = {
  async up (queryInterface, Sequelize) {
  
const users = await queryInterface.sequelize.query(
  `SELECT id, username FROM "${options.schema ? options.schema + '"."' : ''}Users" 
  WHERE username IN ('Demo-lition', 'FakeUser1', 'FakeUser2');`
);
const userMap = {};
  users[0].forEach(user => {
  userMap[user.username] = user.id;
});

const spots = await queryInterface.sequelize.query(
  `SELECT id, name FROM "${options.schema ? options.schema + '"."' : ''}Spots" 
  WHERE name IN ('App Academy SF', 'Beach House', 'Mountain Cabin');`
);
const spotMap = {};
  spots[0].forEach(spot => {
  spotMap[spot.name] = spot.id;
});


await Booking.bulkCreate([
{
  spotId: spotMap['App Academy SF'],
  userId: userMap['FakeUser2'],
  startDate: '2025-04-01',
  endDate: '2025-04-03',
},
  {
  spotId: spotMap['Beach House'],
  userId: userMap['Demo-lition'],
  startDate: '2025-05-11',
  endDate: '2025-05-21',
},
  {
  spotId: spotMap['Mountain Cabin'],
  userId: userMap['FakeUser1'],
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
 