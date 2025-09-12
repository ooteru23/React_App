const { Sequelize } = require("sequelize");

function createSequelize(storagePath) {
  return new Sequelize({
    dialect: "sqlite",
    storage: storagePath,
    logging: false,
  });
}

module.exports = { createSequelize };
