const { z } = require("zod");
const { safeHandle, asNumberId, pick } = require("./_utils");

function registerEmployeeHandlers(db) {
  const CHANNELS = Object.freeze({
    LIST: "employees:list",
    CREATE: "employees:create",
    GET: "employees:get",
    UPDATE: "employees:update",
    DELETE: "employees:delete",
  });

  const numberLike = z.union([z.number(), z.string()]);
  const createSchema = z.object({
    name: z.string().min(1),
    job_title: z.string().min(1),
    status: z.string().min(1),
    salary: numberLike,
  });

  safeHandle(CHANNELS.LIST, async () => {
    const rows = await db.Employees.findAll({ order: [["id", "ASC"]] });
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
    const row = await db.Employees.create(payload);
    return row.toJSON();
  });

  safeHandle(CHANNELS.GET, async (_e, id) => {
    const row = await db.Employees.findByPk(asNumberId(id));
    if (!row) {
      const err = new Error("not found");
      err.code = "E_NOT_FOUND";
      throw err;
    }
    return row.toJSON();
  });

  safeHandle(CHANNELS.UPDATE, async (_e, id, payload) => {
    const row = await db.Employees.findByPk(asNumberId(id));
    if (!row) {
      const err = new Error("not found");
      err.code = "E_NOT_FOUND";
      throw err;
    }
    const allowed = ["name", "job_title", "status", "salary"];
    const updates = pick(payload || {}, allowed);
    Object.assign(row, updates);
    await row.save();
    return row.toJSON();
  });

  safeHandle(CHANNELS.DELETE, async (_e, id) => {
    const row = await db.Employees.findByPk(asNumberId(id));
    if (!row) {
      const err = new Error("not found");
      err.code = "E_NOT_FOUND";
      throw err;
    }
    await row.destroy();
    return { success: true };
  });
}

module.exports = { registerEmployeeHandlers };
