const { z } = require("zod");
const { safeHandle } = require("./_utils");

function registerControlHandlers(db) {
  const CHANNELS = Object.freeze({
    LIST: "controls:list",
    CREATE: "controls:create",
  });

  const controlItem = z.object({
    client_name: z.string().min(1),
    month_jan: z.string().min(1),
    month_feb: z.string().min(1),
    month_mar: z.string().min(1),
    month_apr: z.string().min(1),
    month_may: z.string().min(1),
    month_jun: z.string().min(1),
    month_jul: z.string().min(1),
    month_aug: z.string().min(1),
    month_sep: z.string().min(1),
    month_oct: z.string().min(1),
    month_nov: z.string().min(1),
    month_dec: z.string().min(1),
  });

  const createSchema = z.union([controlItem, z.array(controlItem)]);

  safeHandle(CHANNELS.LIST, async () => {
    const rows = await db.Controls.findAll({ order: [["id", "ASC"]] });
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

    const items = Array.isArray(payload) ? payload : [payload];
    const results = [];
    for (const item of items) {
      const [row, created] = await db.Controls.findOrCreate({
        where: { client_name: item.client_name },
        defaults: item,
      });
      if (!created) {
        await row.update(item);
      }
      results.push(row.toJSON ? row.toJSON() : row);
    }
    return results;
  });
}

module.exports = { registerControlHandlers };

