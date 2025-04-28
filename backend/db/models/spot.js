'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Spot extends Model {
    static associate(models) {
      Spot.belongsTo( models.User, { foreignKey: "ownerId", as: "Owner" });
      Spot.hasMany( models.SpotImage, { foreignKey: "spotId", onDelete: "CASCADE" });
      Spot.hasMany(models.Review, { foreignKey: 'spotId', onDelete: 'CASCADE' });      
    };
  }
  Spot.init({
    ownerId: { type: DataTypes.INTEGER, allowNull: false }, 
    address: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false },
    lat: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
    lng: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
    name: { type: DataTypes.STRING(50), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false }, 
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    previewImage: { type: DataTypes.STRING, allowNull: false, defaultValue: "https://example.com/default.jpg" }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};