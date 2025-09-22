const { ipcMain } = require("electron");

function registerSetupHandlers(db) {
  ipcMain.handle("setups:list", async () => {
    const rows = await db.Setups.findAll({ order: [["id", "ASC"]] });
    return rows.map((r) => r.toJSON());
  });

  ipcMain.handle("setups:create", async (_e, payload) => {
    const requiredFields = [
      "client_candidate",
      "contract_value",
      "commission_price",
      "software_price",
      "employee1",
      "percent1",
      "employee2",
      "percent2",
      "net_value1",
      "net_value2",
    ];
    for (const field of requiredFields) {
      if (!payload?.[field]) throw new Error(`${field} is required`);
    }
    const row = await db.Setups.create(payload);
    return row.toJSON();
  });

  ipcMain.handle("setups:get", async (_e, id) => {
    const row = await db.Setups.findByPk(Number(id));
    if (!row) throw new Error("not found");
    return row.toJSON();
  });

  ipcMain.handle("setups:update", async (_e, id, payload) => {
    const row = await db.Setups.findByPk(Number(id));
    if (!row) throw new Error("not found");
    Object.assign(row, payload || {});
    await row.save();
    return row.toJSON();
  });

  ipcMain.handle("setups:delete", async (_e, id) => {
    const row = await db.Setups.findByPk(Number(id));
    if (!row) return { success: false };
    await row.destroy();
    return { success: true };
  });
}

module.exports = { registerSetupHandlers };
