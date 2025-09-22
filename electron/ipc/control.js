const { ipcMain } = require("electron");

function registerControlHandlers(db) {
  ipcMain.handle("controls:list", async () => {
    const rows = await db.Controls.findAll({ order: [["id", "ASC"]] });
    return rows.map((r) => r.toJSON());
  });

  ipcMain.handle("controls:create", async (_e, payload) => {
    const requiredFields = [
      "employee_name",
      "month_jan",
      "month_feb",
      "month_mar",
      "month_apr",
      "month_may",
      "month_jun",
      "month_jul",
      "month_aug",
      "month_sep",
      "month_oct",
      "month_nov",
      "month_dec",
    ];
    for (const field of requiredFields) {
      if (!payload?.[field]) throw new Error(`${field} is required`);
    }
    const row = await db.Controls.create(payload);
    return row.toJSON();
  });
}

module.exports = { registerControlHandlers };
