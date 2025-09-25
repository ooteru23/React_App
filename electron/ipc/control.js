const { ipcMain } = require("electron");

function registerControlHandlers(db) {
  ipcMain.handle("controls:list", async () => {
    const rows = await db.Controls.findAll({ order: [["id", "ASC"]] });
    return rows.map((r) => r.toJSON());
  });

  ipcMain.handle("controls:create", async (_e, payload) => {
    const requiredFields = [
      "client_name",
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

    const items = Array.isArray(payload) ? payload : [payload];

    for (const item of items) {
      for (const field of requiredFields) {
        if (!item?.[field]) throw new Error(`${field} is required`);
      }
    }

    const results = [];

    for (const item of items) {
      const [row, created] = await db.Controls.findOrCreate({
        where: { client_name: item.client_name },
        defaults: item,
      });

      if (!created) {
        await row.update(item);
      }

      if (typeof row.toJSON === "function") {
        results.push(row.toJSON());
      } else if (typeof row.get === "function") {
        results.push(row.get({ plain: true }));
      } else {
        results.push(row);
      }
    }

    return results;
  });
}

module.exports = { registerControlHandlers };



