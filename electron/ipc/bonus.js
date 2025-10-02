const { z } = require("zod");
const { asNumberId, safeHandle } = require("./_utils");

function registerBonusHandlers(db) {
  const CHANNELS = Object.freeze({
    LIST: "bonuses:list",
    CREATE: "bonuses:create",
    DELETE: "bonuses:delete",
  });

  const numberLike = z.union([z.number(), z.string()]);
  const createSchema = z.object({
    employee_name: z.string().min(1),
    client_name: z.string().min(1),
    month: z.string().min(1),
    work_status: z.string().min(1),
    net_value: numberLike,
    disbursement_bonus: z.string().min(1),
  });

  safeHandle(CHANNELS.LIST, async () => {
    const rows = await db.Bonuses.findAll({ order: [["id", "ASC"]] });
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
    const row = await db.Bonuses.create(payload);
    return row.toJSON();
  });

  safeHandle(CHANNELS.DELETE, async (_e, id) => {
    const row = await db.Bonuses.findByPk(asNumberId(id));
    if (!row) {
      const err = new Error("not found");
      err.code = "E_NOT_FOUND";
      throw err;
    }
    await row.destroy();
    return { success: true };
  });
}

module.exports = { registerBonusHandlers };
