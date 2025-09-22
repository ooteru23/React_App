const { ipcMain } = require("electron");

function registerOfferHandlers(db) {
  ipcMain.handle("offers:list", async () => {
    const rows = await db.Offers.findAll({ order: [["id", "ASC"]] });
    return rows.map((r) => r.toJSON());
  });

  ipcMain.handle("offers:create", async (_e, payload) => {
    const requiredFields = [
      "creator_name",
      "client_candidate",
      "marketing_name",
      "address",
      "date",
      "valid_date",
      "pic",
      "telephone",
      "service",
      "period_time",
      "price",
      "information",
    ];
    for (const field of requiredFields) {
      if (!payload?.[field]) throw new Error(`${field} is required`);
    }
    const row = await db.Offers.create(payload);
    return row.toJSON();
  });

  ipcMain.handle("offers:get", async (_e, id) => {
    const row = await db.Offers.findByPk(Number(id));
    if (!row) throw new Error("not found");
    return row.toJSON();
  });

  ipcMain.handle("offers:update", async (_e, id, payload) => {
    const row = await db.Offers.findByPk(Number(id));
    if (!row) throw new Error("not found");
    Object.assign(row, payload || {});
    await row.save();
    return row.toJSON();
  });

  ipcMain.handle("offers:delete", async (_e, id) => {
    const row = await db.Offers.findByPk(Number(id));
    if (!row) return { success: false };
    await row.destroy();
    return { success: true };
  });
}

module.exports = { registerOfferHandlers };
