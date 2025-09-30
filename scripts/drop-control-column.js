const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "C:/Users/andry/AppData/Roaming/bonus-calculation-app/bonus.db",
});

(async () => {
  try {
    await sequelize.query("ALTER TABLE Controls DROP COLUMN employee1;");
    await sequelize.query("ALTER TABLE Controls DROP COLUMN employee2;");
    await sequelize.query("ALTER TABLE Controls DROP COLUMN net_value1;");
    await sequelize.query("ALTER TABLE Controls DROP COLUMN net_value2;");
    console.log("Columns dropped successfully");
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
})();
