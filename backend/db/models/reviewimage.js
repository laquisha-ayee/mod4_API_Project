'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    static associate(models) {
      ReviewImage.belongsTo(models.Review, { foreignKey: 'reviewId' });
    }
  }

  ReviewImage.init(
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Reviews', key: 'id' }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id'}
      }
    },
    {
      sequelize,
      modelName: 'ReviewImage'
    }
  );
  return ReviewImage;
};