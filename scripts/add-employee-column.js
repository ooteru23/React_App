const { Sequelize } = require("sequelize");
const path = require("path");
const storage = path.join(process.env.APPDATA, "bonus-calculation-app", "bonus.db");
const sequelize = new Sequelize({ dialect: "sqlite", storage, logging: false });

(async () => {
  try {
    const [columns] = await sequelize.query("PRAGMA table_info('Bonuses')");
    const hasEmployeeName = columns.some((column) => column.name === 'employee_name');

    if (hasEmployeeName) {
      console.log('Column employee_name already exists.');
      return;
    }

    await sequelize.query("ALTER TABLE `Bonuses` ADD COLUMN `employee_name` VARCHAR(255)");
    console.log('Column employee_name added to Bonuses table.');
  } catch (error) {
    console.error('Failed to alter Bonuses table:', error);
  } finally {
    await sequelize.close();
  }
})();