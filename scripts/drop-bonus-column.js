const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "C:/Users/andry/AppData/Roaming/bonus-calculation-app/bonus.db",
});

(async () => {
  try {
    await sequelize.query("ALTER TABLE Bonuses DROP COLUMN employee_name;");

    console.log("Columns dropped successfully");
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
})();
