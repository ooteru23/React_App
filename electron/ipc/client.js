const { z } = require("zod");
const { safeHandle, asNumberId, pick } = require("./_utils");

function registerClientHandlers(db) {
  const CHANNELS = Object.freeze({
    LIST: "clients:list",
    CREATE: "clients:create",
    GET: "clients:get",
    UPDATE: "clients:update",
    DELETE: "clients:delete",
  });

  const numberLike = z.union([z.number(), z.string()]);
  const createSchema = z.object({
    client_name: z.string().min(1),
    address: z.string().min(1),
    pic: z.string().min(1),
    telephone: numberLike,
    service: z.string().min(1),
    contract_value: numberLike,
    client_status: z.string().min(1),
  });

  safeHandle(CHANNELS.LIST, async () => {
    const rows = await db.Clients.findAll({ order: [["id", "ASC"]] });
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
    const row = await db.Clients.create(payload);
    return row.toJSON();
  });

  safeHandle(CHANNELS.GET, async (_e, id) => {
    const row = await db.Clients.findByPk(asNumberId(id));
    if (!row) {
      const err = new Error("not found");
      err.code = "E_NOT_FOUND";
      throw err;
    }
    return row.toJSON();
  });

  safeHandle(CHANNELS.UPDATE, async (_e, id, payload) => {
    const row = await db.Clients.findByPk(asNumberId(id));
    if (!row) {
      const err = new Error("not found");
      err.code = "E_NOT_FOUND";
      throw err;
    }
    const allowed = [
      "client_name",
      "address",
      "pic",
      "telephone",
      "service",
      "contract_value",
      "client_status",
    ];
    const updates = pick(payload || {}, allowed);
    Object.assign(row, updates);
    await row.save();
    return row.toJSON();
  });

  safeHandle(CHANNELS.DELETE, async (_e, id) => {
    const row = await db.Clients.findByPk(asNumberId(id));
    if (!row) {
      const err = new Error("not found");
      err.code = "E_NOT_FOUND";
      throw err;
    }
    await row.destroy();
    return { success: true };
  });
}

module.exports = { registerClientHandlers };
