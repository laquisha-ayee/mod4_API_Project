'use strict';

const { ReviewImage } = require("../models")


let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; 
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
const reviews = await queryInterface.sequelize.query(
`SELECT id FROM "${options.schema ? options.schema + '"."' : ''}Reviews" 
ORDER BY id LIMIT 3;`
);
    
if (reviews[0].length < 3) {
console.log("Not enough reviews found, skipping ReviewImages seeding");
return;
}

await ReviewImage.bulkCreate([
{ //app academy
  reviewId: reviews[0][0].id,  
  url: "https://images.pexels.com/photos/4449867/pexels-photo-4449867.jpeg?auto=compress&cs=tinysrgb&w=1200",
  createdAt: new Date(),
  updatedAt: new Date(),
},
  { //appacademy
  reviewId: reviews[0][1].id, 
  url: "https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=1200",
  createdAt: new Date(),
  updatedAt: new Date(),
},
  { // beach house
  reviewId: reviews[0][2].id,
  url: "https://images.pexels.com/photos/105294/pexels-photo-105294.jpeg?auto=compress&cs=tinysrgb&w=1200",
  createdAt: new Date(),
  updatedAt: new Date(),
},
 ]);
  },

async down(queryInterface, Sequelize) {
options.tableName = 'ReviewImages';
await queryInterface.bulkDelete(options, null, {});
},
 };