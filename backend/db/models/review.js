'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User, { foreignKey: 'userId' });
      Review.belongsTo(models.Spot, { foreignKey: 'spotId' });
      Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId' })
    }
  }

  Review.init(
    {
      // userId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: { model: 'Users', key: 'id' }
      // },
      // spotId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: { model: 'Spots', key: 'id' }
      // },
      review: {
        type: DataTypes.STRING,
        allowNull: false
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
      }
    },
    {
      sequelize,
      modelName: 'Review'
    }
  );

  return Review;
};
