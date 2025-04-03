'use strict';

const { User, Spot, Review, ReviewImage } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const demoUser = await User.findOne({ where: { username: 'Demo-lition' } });
    const fakeUser1 = await User.findOne({ where: { username: 'FakeUser1' } });
    const fakeUser2 = await User.findOne({ where: { username: 'FakeUser2' } });

    const spots = await Spot.findAll();

    await Review.bulkCreate([
      {
        spotId: spots[0].id,
        userId: fakeUser1.id,
        review: 'Amazing place! Had a wonderful time.',
        stars: 5,
      },
      {
        spotId: spots[0].id,
        userId: fakeUser2.id,
        review: 'Great spot, but a bit noisy.',
        stars: 4,
      },
      {
        spotId: spots[1].id,
        userId: demoUser.id,
        review: 'Loved the ambiance and the location.',
        stars: 5,
      },
      {
        spotId: spots[1].id,
        userId: fakeUser2.id,
        review: 'Not bad, but could be better.',
        stars: 3,
      },
      {
        spotId: spots[2].id,
        userId: fakeUser1.id,
        review: 'Perfect getaway!',
        stars: 5,
      },
    ]);

    const reviews = await Review.findAll();

    await ReviewImage.bulkCreate([
      {
        reviewId: reviews[0].id,
        url: 'https://example.com/image1.jpg',
      },
      {
        reviewId: reviews[0].id,
        url: 'https://example.com/image2.jpg',
      },
      {
        reviewId: reviews[2].id,
        url: 'https://example.com/image3.jpg',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ReviewImages', null, {});
    await queryInterface.bulkDelete('Reviews', null, {});
  }
};