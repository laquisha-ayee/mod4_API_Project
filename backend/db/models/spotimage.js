'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpotImages extends Model {
    static associate(models) {
      SpotImages.belongsTo(models.Spot, { foreignKey: 'spotId' });
    }
  }
  SpotImages.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preview: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'SpotImages',
    }
  );
  return SpotImages;
};
