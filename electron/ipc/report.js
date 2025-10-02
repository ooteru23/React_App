const { z } = require("zod");
const { safeHandle } = require("./_utils");

function registerReportHandlers(db) {
  const CHANNELS = Object.freeze({
    LIST: "reports:list",
    CREATE: "reports:create",
  });

  const numberLike = z.union([z.number(), z.string()]);
  const createSchema = z.object({
    employee_name: z.string().min(1),
    month: z.string().min(1),
    salary_deduction: numberLike,
    month_ontime: numberLike,
    month_late: numberLike,
    bonus_component: numberLike,
    percent_ontime: numberLike,
    percent_late: numberLike,
    total_ontime: numberLike,
    total_late: numberLike,
    bonus_ontime: numberLike,
    bonus_late: numberLike,
    total: numberLike,
  });

  safeHandle(CHANNELS.LIST, async () => {
    const rows = await db.Reports.findAll({ order: [["id", "ASC"]] });
    return rows.map((r) => r.toJSON());
  });

  safeHandle(CHANNELS.CREATE, async (_e, payload) => {
    const parsed = createSchema.safeParse(payload);
    if (!parsed.success) {
      const err = new Error("validation error");
      err.code = "E_VALIDATION";
      err.details = parsed.error.flatten();
      throw err;
    }
    const row = await db.Reports.create(payload);
    return row.toJSON();
  });
}

module.exports = { registerReportHandlers };
