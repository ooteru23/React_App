const { ipcMain } = require("electron");

function registerBonusHandlers(db) {
  console.log("[IPC] Registering bonus handlers");
  ipcMain.handle("bonuses:list", async () => {
    const rows = await db.Bonuses.findAll({ order: [["id", "ASC"]] });
    return rows.map((r) => r.toJSON());
  });

  ipcMain.handle("bonuses:create", async (_e, payload) => {
    const requiredFields = [
      "employee_name",
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

  ipcMain.handle("bonuses:delete", async (_e, id) => {
    console.log("[IPC] bonuses:delete invoked", id);
    const row = await db.Bonuses.findByPk(Number(id));
    if (!row) return { success: false };
    await row.destroy();
    return { success: true };
  });
}

module.exports = { registerBonusHandlers };
