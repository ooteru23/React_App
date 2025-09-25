// scripts/inspect-controls.js
const os = require("os");
const path = require("path");
const fs = require("fs");
const { createSequelize } = require("../shared/db");

async function main() {
  const appData =
    process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"); // fallback Windows default
  const storagePath = path.join(appData, "bonus-calculation-app", "bonus.db");

  console.log(
    "Using SQLite file:",
    storagePath,
    fs.existsSync(storagePath) ? "(found)" : "(NOT found)"
  );

  const sequelize = createSequelize(storagePath);

  try {
    await sequelize.authenticate();
    const [results] = await sequelize.query("PRAGMA table_info('Controls');");
    if (results.length === 0) {
      console.log("Tabel 'Controls' tidak ditemukan di database ini.");
    } else {
      console.table(results);
    }
  } catch (err) {
    console.error("Error inspecting table:", err);
  } finally {
    await sequelize.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
