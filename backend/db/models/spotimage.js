'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    static associate(models) {
      SpotImage.belongsTo(models.Spot, { foreignKey: 'spotId' });
      SpotImage.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  SpotImage.init(
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      preview: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
      // spotId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: { model: 'Spots', key: 'id' }
      // }, 
      // userId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   references: { model: 'Users', key: 'id'}
      // },
    },
    {
      sequelize,
      modelName: 'SpotImage'
    }
  );
  return SpotImage;
};
