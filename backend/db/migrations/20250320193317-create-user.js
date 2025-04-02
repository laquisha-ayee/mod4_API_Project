'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define your schema in the options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // Debugging: Log the options to confirm they are as expected
    console.log('Migration options (up):', options);

    // Create the Users table
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING(256),
        allowNull: false,
        unique: true,
      },
      hashedPassword: {
        type: Sequelize.STRING.BINARY,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, options);
  },

  async down(queryInterface, Sequelize) {
    // Debugging: Log the options to confirm they are as expected
    console.log('Migration options (down):', options);

    // Ensure the tableName matches exactly to avoid issues
    options.tableName = 'Users';
    return queryInterface.dropTable(options);
  },
};
