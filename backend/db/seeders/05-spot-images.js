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

    //app academy1
    if (spots.length >= 1) {
      spotImages.push(
        { spotId: spots[0].id, url: 'https://images.pexels.com/photos/12582052/pexels-photo-12582052.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: true, createdAt: new Date(), updatedAt: new Date() },
        { spotId: spots[0].id, url: 'https://images.pexels.com/photos/271795/pexels-photo-271795.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() },
        { spotId: spots[0].id, url: 'https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg?auto=compress&cs=tinysrgb&w=1600', preview: false, createdAt: new Date(), updatedAt: new Date() },
        { spotId: spots[0].id, url: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() },
        { spotId: spots[0].id, url: 'https://images.pexels.com/photos/244133/pexels-photo-244133.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() },
      );
    }

    //beach house2
    if (spots.length >= 2) {
      spotImages.push(
        { spotId: spots[1].id, url: 'https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: true, createdAt: new Date(), updatedAt: new Date() },
        { spotId: spots[1].id, url: 'https://images.pexels.com/photos/28843954/pexels-photo-28843954/free-photo-of-luxurious-oceanfront-bedroom-with-scenic-view.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: true, createdAt: new Date(), updatedAt: new Date() },
        { spotId: spots[1].id, url: 'https://images.pexels.com/photos/31956331/pexels-photo-31956331/free-photo-of-urban-beach-scene-with-skyline-backdrop.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: true, createdAt: new Date(), updatedAt: new Date() }

      );
    }

    //mountain cabin3
    if (spots.length >= 3) {
      spotImages.push(
        { spotId: spots[2].id, url: 'https://images.pexels.com/photos/10511470/pexels-photo-10511470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', preview: true, createdAt: new Date(), updatedAt: new Date() },
        { spotId: spots[2].id, url: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() },
        { spotId: spots[2].id, url: 'https://images.pexels.com/photos/7163597/pexels-photo-7163597.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() },
        { spotId: spots[2].id, url: 'https://images.pexels.com/photos/1374295/pexels-photo-1374295.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() }
      );
    }

      //Harrys Hotel4
      if (spots.length >= 4) {
        spotImages.push(
          { spotId: spots[3].id, url: 'https://images.pexels.com/photos/6022633/pexels-photo-6022633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', preview: false, createdAt: new Date(), updatedAt: new Date() },
          { spotId: spots[3].id, url: 'https://images.pexels.com/photos/8390635/pexels-photo-8390635.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: true, createdAt: new Date(), updatedAt: new Date() },
          { spotId: spots[3].id, url: 'https://images.pexels.com/photos/3155367/pexels-photo-3155367.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() }
        );
      }

    //Macbeth Hotel5
    if (spots.length >= 5) {
  spotImages.push(
  { spotId: spots[4].id, url: 'https://images.pexels.com/photos/259685/pexels-photo-259685.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: true, createdAt: new Date(), updatedAt: new Date() },
  { spotId: spots[4].id, url: 'https://images.pexels.com/photos/17790674/pexels-photo-17790674/free-photo-of-wooden-vintage-bed-in-bedroom.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() },
  { spotId: spots[4].id, url: 'https://images.pexels.com/photos/29591193/pexels-photo-29591193/free-photo-of-vintage-1800s-victorian-room-with-antique-furniture.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() },
  { spotId: spots[4].id, url: 'https://images.pexels.com/photos/7045707/pexels-photo-7045707.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() },
  { spotId: spots[4].id, url: 'https://images.pexels.com/photos/6598742/pexels-photo-6598742.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() }
      );
    }

  //Mahalo Days6
  if (spots.length >= 6) {
    spotImages.push(
    { spotId: spots[5].id, url: 'https://images.pexels.com/photos/19193212/pexels-photo-19193212/free-photo-of-a-bed-on-a-tropical-beach.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', preview: true, createdAt: new Date(), updatedAt: new Date() },
    { spotId: spots[5].id, url: 'https://images.pexels.com/photos/6389027/pexels-photo-6389027.jpeg?auto=compress&cs=tinysrgb&w=1600', preview: false, createdAt: new Date(), updatedAt: new Date() },
    { spotId: spots[5].id, url: 'https://images.pexels.com/photos/4610334/pexels-photo-4610334.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() },
    { spotId: spots[5].id, url: 'https://images.pexels.com/photos/9209882/pexels-photo-9209882.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() }
    );
  }
    //Springs Tepee7
    if (spots.length >= 7) {
      spotImages.push(
      { spotId: spots[6].id, url: 'https://images.pexels.com/photos/5358788/pexels-photo-5358788.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: true, createdAt: new Date(), updatedAt: new Date() },
      { spotId: spots[6].id, url: 'https://images.pexels.com/photos/13869948/pexels-photo-13869948.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() },
      { spotId: spots[6].id, url: 'https://images.pexels.com/photos/8968167/pexels-photo-8968167.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() }
      );
    }

    //Edens Garden8
    if (spots.length >= 8) {
      spotImages.push(
      { spotId: spots[7].id, url: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: true, createdAt: new Date(), updatedAt: new Date() },
      { spotId: spots[7].id, url: 'https://images.pexels.com/photos/955656/pexels-photo-955656.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() },
      { spotId: spots[7].id, url: 'https://images.pexels.com/photos/334978/pexels-photo-334978.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() },
      { spotId: spots[7].id, url: 'https://images.pexels.com/photos/242258/pexels-photo-242258.jpeg?auto=compress&cs=tinysrgb&w=1200', preview: false, createdAt: new Date(), updatedAt: new Date() }
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