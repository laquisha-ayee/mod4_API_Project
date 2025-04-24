//const config = require("./index");

module.exports = {
  development: {
    dbFile: "db/dev.db",
    storage: "db/dev.db",
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true,
  },
  production: {
    use_env_variable: process.env.DATABASE_URL || "default_database_url",
    dialect: "postgres",
    seederStorage: "sequelize",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      schema: process.env.SCHEMA || "public",
    },
  },
};