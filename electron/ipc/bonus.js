const { ipcMain } = require("electron");

function registerBonusHandlers(db) {
  ipcMain.handle("bonuses:list", async () => {
    const rows = await db.Bonuses.findAll({ order: [["id", "ASC"]] });
    return rows.map((r) => r.toJSON());
  });

  ipcMain.handle("bonuses:create", async (_e, payload) => {
    const requiredFields = [
      "client_name",
      "month",
      "work_status",
      "net_value",
      "disbursement_bonus",
    ];
    for (const field of requiredFields) {
      if (!payload?.[field]) throw new Error(`${field} is required`);
    }
    const row = await db.Bonuses.create(payload);
    return row.toJSON();
  });
}

module.exports = { registerBonusHandlers };
