const { z } = require("zod");
const { safeHandle, asNumberId, pick } = require("./_utils");

function registerOfferHandlers(db) {
  const CHANNELS = Object.freeze({
    LIST: "offers:list",
    CREATE: "offers:create",
    GET: "offers:get",
    UPDATE: "offers:update",
    DELETE: "offers:delete",
  });

  const numberLike = z.union([z.number(), z.string()]);
  const createSchema = z.object({
    creator_name: z.string().min(1),
    client_candidate: z.string().min(1),
    marketing_name: z.string().min(1),
    address: z.string().min(1),
    date: z.any(),
    valid_date: z.any(),
    pic: z.string().min(1),
    telephone: numberLike,
    service: z.string().min(1),
    period_time: z.any(),
    price: numberLike,
    information: z.string().min(1),
  });

  safeHandle(CHANNELS.LIST, async () => {
    const rows = await db.Offers.findAll({ order: [["id", "ASC"]] });
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
    const row = await db.Offers.create(payload);
    return row.toJSON();
  });

  safeHandle(CHANNELS.GET, async (_e, id) => {
    const row = await db.Offers.findByPk(asNumberId(id));
    if (!row) {
      const err = new Error("not found");
      err.code = "E_NOT_FOUND";
      throw err;
    }
    return row.toJSON();
  });

  safeHandle(CHANNELS.UPDATE, async (_e, id, payload) => {
    const row = await db.Offers.findByPk(asNumberId(id));
    if (!row) {
      const err = new Error("not found");
      err.code = "E_NOT_FOUND";
      throw err;
    }
    const allowed = [
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
      "offer_status",
    ];
    const updates = pick(payload || {}, allowed);
    Object.assign(row, updates);
    await row.save();
    return row.toJSON();
  });

  safeHandle(CHANNELS.DELETE, async (_e, id) => {
    const row = await db.Offers.findByPk(asNumberId(id));
    if (!row) {
      const err = new Error("not found");
      err.code = "E_NOT_FOUND";
      throw err;
    }
    await row.destroy();
    return { success: true };
  });
}

module.exports = { registerOfferHandlers };
