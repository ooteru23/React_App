"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // SQLite modern (>=3.35) bisa DROP COLUMN; Sequelize handle via recreate table kalau perlu
    await queryInterface.removeColumn(
      "Controls",
      "employee1",
      "employee2",
      "net_value1",
      "net_value2"
    );
  },

  async down(queryInterface, Sequelize) {
    // Balikin lagi kalau rollback
    await queryInterface.addColumn(
      "Controls",
      "employee1",
      "employee2",
      "net_value1",
      "net_value2",
      {
        type: Sequelize.STRING,
        allowNull: true, // biar rollback aman tanpa isi data lama
        defaultValue: null,
      }
    );
  },
};
