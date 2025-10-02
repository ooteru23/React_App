const { ipcMain } = require("electron");
const { z } = require("zod");

const CHANNELS = Object.freeze({
  LIST: "setups:list",
  CREATE: "setups:create",
  GET: "setups:get",
  UPDATE: "setups:update",
  DELETE: "setups:delete",
});

function asNumberId(id) {
  const num = Number(id);
  if (!Number.isFinite(num)) {
    const err = new Error("invalid id");
    err.code = "E_INVALID_ID";
    throw err;
  }
  return num;
}

function validateCreatePayload(payload) {
  const numberLike = z.union([z.number(), z.string()]);
  const schema = z.object({
    client_candidate: z.string().min(1),
    contract_value: numberLike,
    commission_price: numberLike,
    software_price: numberLike,
    employee1: z.string().min(1),
    percent1: numberLike,
    employee2: z.string().min(1),
    percent2: numberLike,
    net_value1: numberLike,
    net_value2: numberLike,
  });
  const result = schema.safeParse(payload);
  if (!result.success) {
    const err = new Error("validation error");
    err.code = "E_VALIDATION";
    err.details = result.error.flatten();
    throw err;
  }
}

function pick(obj, keys) {
  const out = {};
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj || {}, k) && obj[k] != null) {
      out[k] = obj[k];
    }
  }
  return out;
}

function safeHandle(channel, handler) {
  ipcMain.handle(channel, async (event, ...args) => {
    try {
      const data = await handler(event, ...args);
      return { data, error: null };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      const payload = {
        code: err.code || "E_INTERNAL",
        message: err.message || "internal error",
      };
      return { data: null, error: payload };
    }
  });
}

async function getSetupOrThrow(db, id) {
  const row = await db.Setups.findByPk(asNumberId(id));
  if (!row) {
    const err = new Error("not found");
    err.code = "E_NOT_FOUND";
    throw err;
  }
  return row;
}

function registerSetupHandlers(db) {
  safeHandle(CHANNELS.LIST, async () => {
    const rows = await db.Setups.findAll({ order: [["id", "ASC"]] });
    return rows.map((r) => r.toJSON());
  });

  safeHandle(CHANNELS.CREATE, async (_e, payload) => {
    validateCreatePayload(payload);
    const row = await db.Setups.create(payload);
    return row.toJSON();
  });

  safeHandle(CHANNELS.GET, async (_e, id) => {
    const row = await getSetupOrThrow(db, id);
    return row.toJSON();
  });

  safeHandle(CHANNELS.UPDATE, async (_e, id, payload) => {
    const row = await getSetupOrThrow(db, id);
    const allowed = [
      "client_candidate",
      "contract_value",
      "commission_price",
      "software_price",
      "employee1",
      "percent1",
      "employee2",
      "percent2",
      "net_value1",
      "net_value2",
    ];
    const updates = pick(payload || {}, allowed);
    Object.assign(row, updates);
    await row.save();
    return row.toJSON();
  });

  safeHandle(CHANNELS.DELETE, async (_e, id) => {
    const row = await getSetupOrThrow(db, id);
    await row.destroy();
    return { success: true };
  });
}

module.exports = { registerSetupHandlers };
