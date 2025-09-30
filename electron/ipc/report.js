const { ipcMain } = require("electron");

function registerReportHandlers(db) {
  ipcMain.handle("reports:list", async () => {
    const rows = await db.Reports.findAll({ order: [["id", "ASC"]] });
    return rows.map((r) => r.toJSON());
  });

  ipcMain.handle("reports:create", async (_e, payload) => {
    const requiredFields = [
      "employee_name",
      "month",
      "salary_deduction",
      "month_ontime",
      "month_late",
      "bonus_component",
      "percent_ontime",
      "percent_late",
      "total_ontime",
      "total_late",
      "bonus_ontime",
      "bonus_late",
      "total",
    ];
    for (const field of requiredFields) {
      if (!payload?.[field]) throw new Error(`${field} is required`);
    }
    const row = await db.Reports.create(payload);
    return row.toJSON();
  });
}

module.exports = { registerReportHandlers };
