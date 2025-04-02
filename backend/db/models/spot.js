'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.hasMany(models.SpotImages, { foreignKey: 'spotId' });
    }
  }
  Spot.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'Spot',
    }
  );
  return Spot;
};
