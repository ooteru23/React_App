"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex(
      "Controls",
      ["client_name", "employee1", "employee2", "net_value1", "net_value2"],
      {
        unique: true,
        name: "controls_unique_index",
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("Controls", "controls_unique_index");
  },
};
