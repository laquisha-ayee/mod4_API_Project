'use strict';

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      username: { [Op.in]: [
        'Demo-lition',
        'FakeUser1',
        'FakeUser2',
        'FakeUser3',
        'FakeUser4',
        'FakeUser5',
        'FakeUser6',
        'FakeUser7',
      ]}
    });

    if (process.env.NODE_ENV === 'production') {
      await queryInterface.sequelize.query(
        `ALTER SEQUENCE "${options.schema ? options.schema + '.' : ''}Users_id_seq" RESTART WITH 1;`
      );
    }

    await queryInterface.bulkInsert(options, [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Demo',
        lastName: 'Lition',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'Juan',
        lastName:'Uno',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName:'Jwan',
        lastName:'Dos',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user3@user.io',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password4'),
        firstName:'Trey',
        lastName:'Tres',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user4@user.io',
        username: 'FakeUser4',
        hashedPassword: bcrypt.hashSync('password5'),
        firstName:'Quattro',
        lastName:'Cuatro',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user5@user.io',
        username: 'FakeUser5',
        hashedPassword: bcrypt.hashSync('password6'),
        firstName:'Cinco',
        lastName:'Cinco',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user6@user.io',
        username: 'FakeUser6',
        hashedPassword: bcrypt.hashSync('password7'),
        firstName:'Six',
        lastName:'Seis',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user7@user.io',
        username: 'FakeUser7',
        hashedPassword: bcrypt.hashSync('password8'),
        firstName:'Seven',
        lastName:'Siete',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: [
        'Demo-lition',
        'FakeUser1',
        'FakeUser2',
        'FakeUser3',
        'FakeUser4',
        'FakeUser5',
        'FakeUser6',
        'FakeUser7'
      ]}
    });
  }
};