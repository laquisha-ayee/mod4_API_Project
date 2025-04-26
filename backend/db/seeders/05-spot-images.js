"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; 
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "SpotImages"; 
    await queryInterface.bulkInsert(
      options,
      [
        {
          url: "https://media.cntraveler.com/photos/5d112d50c4d7bd806dbc00a4/16:9/w_2560%2Cc_limit/airbnb%2520luxe.jpg",
          preview: true,
          spotId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          url: "https://a0.muscache.com/im/pictures/bc3d8641-6699-41aa-bdca-493794f51066.jpg",
          preview: true,
          spotId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          url: "https://images.barrons.com/im-85242?width=700&height=466.jpg",
          preview: true,
          spotId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages"; 
    const Op = Sequelize.Op; 
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3] }, 
      },
      {}
    );
  },
};