const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "C:/Users/andry/AppData/Roaming/bonus-calculation-app/bonus.db",
});

(async () => {
  try {
    const [rows] = await sequelize.query("DELETE FROM Reports");
    console.table(rows);
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
})();
