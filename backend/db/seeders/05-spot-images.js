'use strict';

const { Spot } = require('../models'); 
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';

    const spots = await Spot.findAll();

    if (spots.length === 0) {
      throw new Error("Cannot seed SpotImages because no Spots exist! Please seed Spots first.");
    }
    console.log("Spot IDs Found in DB:", spots.map(spot => spot.id));

    const spotImages = [];

    if (spots.length >= 1) {
      spotImages.push(
        { spotId: spots[0].id, url: 'https://images.pexels.com/photos/12582052/pexels-photo-12582052.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: true, createdAt: new Date(), updatedAt: new Date() },
        { spotId: spots[0].id, url: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() },
        { spotId: spots[0].id, url: 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() }
      );
    }

    if (spots.length >= 2) {
      spotImages.push(
        { spotId: spots[1].id, url: 'https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: true, createdAt: new Date(), updatedAt: new Date() },
        { spotId: spots[1].id, url: 'https://images.pexels.com/photos/28843954/pexels-photo-28843954/free-photo-of-luxurious-oceanfront-bedroom-with-scenic-view.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: true, createdAt: new Date(), updatedAt: new Date() },
        { spotId: spots[1].id, url: 'https://images.pexels.com/photos/31956331/pexels-photo-31956331/free-photo-of-urban-beach-scene-with-skyline-backdrop.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: true, createdAt: new Date(), updatedAt: new Date() }

      );
    }

    if (spots.length >= 3) {
      spotImages.push(
        { spotId: spots[2].id, url: 'https://images.pexels.com/photos/10511470/pexels-photo-10511470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', preview: true, createdAt: new Date(), updatedAt: new Date() },
        { spotId: spots[2].id, url: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() },
        { spotId: spots[2].id, url: 'https://images.pexels.com/photos/7163597/pexels-photo-7163597.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() }
      );
    }

    console.log("SpotImages to Insert:", spotImages); 
    return queryInterface.bulkInsert(options, spotImages);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkDelete(options, null, {});
  }
};