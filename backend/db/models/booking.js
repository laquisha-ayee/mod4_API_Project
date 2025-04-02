'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    static associate(models) {
      Bookings.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Bookings.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Bookings',
    }
  );
  return Bookings;
};
