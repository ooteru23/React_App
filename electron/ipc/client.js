const { ipcMain } = require("electron");

function registerClientHandlers(db) {
  ipcMain.handle("clients:list", async () => {
    const rows = await db.Clients.findAll({ order: [["id", "ASC"]] });
    return rows.map((r) => r.toJSON());
  });

  ipcMain.handle("clients:create", async (_e, payload) => {
    const requiredFields = [
      "client_name",
      "address",
      "pic",
      "telephone",
      "service",
      "contract_value",
      "client_status",
    ];
    for (const field of requiredFields) {
      if (!payload?.[field]) throw new Error(`${field} is required`);
    }
    const row = await db.Clients.create(payload);
    return row.toJSON();
  });

  ipcMain.handle("clients:get", async (_e, id) => {
    const row = await db.Clients.findByPk(Number(id));
    if (!row) throw new Error("not found");
    return row.toJSON();
  });

  ipcMain.handle("clients:update", async (_e, id, payload) => {
    const row = await db.Clients.findByPk(Number(id));
    if (!row) throw new Error("not found");
    Object.assign(row, payload || {});
    await row.save();
    return row.toJSON();
  });

  ipcMain.handle("clients:delete", async (_e, id) => {
    const row = await db.Clients.findByPk(Number(id));
    if (!row) return { success: false };
    await row.destroy();
    return { success: true };
  });
}

module.exports = { registerClientHandlers };
