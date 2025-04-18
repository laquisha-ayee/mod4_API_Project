'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123
      },
      {
        ownerId: 2,
        address: "456 Ocean Drive",
        city: "Miami",
        state: "Florida",
        country: "United States of America",
        lat: 25.7617,
        lng: -80.1918,
        name: "Beachside Bungalow",
        description: "A relaxing beachside retreat",
        price: 200
      },
      {
        ownerId: 3,
        address: "789 Mountain Road",
        city: "Denver",
        state: "Colorado",
        country: "United States of America",
        lat: 39.7392,
        lng: -104.9903,
        name: "Mountain Cabin",
        description: "A cozy cabin in the mountains",
        price: 150
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["App Academy", "Beachside Bungalow", "Mountain Cabin"] }
    }, {});
  }
};
