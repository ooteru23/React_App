"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Controls", "disbursement_bonus");
  },

  // async down(queryInterface, Sequelize) {
  //   await queryInterface.addColumn("Control", "disbursement_bonus", {
  //     type: Sequelize.STRING,
  //     allowNull: false,
  //     defaultValue: "Paid",
  //   });
  // },
};
