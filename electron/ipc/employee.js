const { ipcMain } = require("electron");

function registerEmployeeHandlers(db) {
  ipcMain.handle("employees:list", async () => {
    const rows = await db.Employees.findAll({ order: [["id", "ASC"]] });
    return rows.map((r) => r.toJSON());
  });

  ipcMain.handle("employees:create", async (_e, payload) => {
    if (!payload?.name) throw new Error("name is required");
    const row = await db.Employees.create(payload);
    return row.toJSON();
  });

  ipcMain.handle("employees:get", async (_e, id) => {
    const row = await db.Employees.findByPk(Number(id));
    if (!row) throw new Error("not found");
    return row.toJSON();
  });

  ipcMain.handle("employees:update", async (_e, id, payload) => {
    const row = await db.Employees.findByPk(Number(id));
    if (!row) throw new Error("not found");
    Object.assign(row, payload || {});
    await row.save();
    return row.toJSON();
  });

  ipcMain.handle("employees:delete", async (_e, id) => {
    const row = await db.Employees.findByPk(Number(id));
    if (!row) return { success: false };
    await row.destroy();
    return { success: true };
  });
}

module.exports = { registerEmployeeHandlers };
