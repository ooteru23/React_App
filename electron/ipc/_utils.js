const { ipcMain } = require("electron");

function asNumberId(id) {
  const num = Number(id);
  if (!Number.isFinite(num)) {
    const err = new Error("invalid id");
    err.code = "E_INVALID_ID";
    throw err;
  }
  return num;
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

module.exports = { asNumberId, pick, safeHandle };

