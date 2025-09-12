const { registerEmployeeHandlers } = require("./employee");

function registerIpc(db) {
  registerEmployeeHandlers(db);
}

module.exports = { registerIpc };
