'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';

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

return queryInterface.bulkInsert(options, [
{
  spotId: spotMap['App Academy SF'], 
  userId: userMap['FakeUser1'], 
  review: "Amazing place! cant wait to visit again.",
  stars: 5, 
  createdAt: new Date(),
  updatedAt: new Date()
},
 {
  spotId: spotMap['App Academy SF'],
  userId: userMap['FakeUser2'], 
  review: "Pretty good, but a bit noisy.",
  stars: 4,
  createdAt: new Date(),
  updatedAt: new Date()
},
 {
  spotId: spotMap['Beach House'], 
  userId: userMap['Demo-lition'], 
  review: "Very disappointed.",
  stars: 2, 
  createdAt: new Date(),
  updatedAt: new Date()
},
 {
  spotId: spotMap['Mountain Cabin'], 
  userId: userMap['FakeUser1'], 
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