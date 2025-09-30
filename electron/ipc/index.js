const { registerEmployeeHandlers } = require("./employee");
const { registerOfferHandlers } = require("./offer");
const { registerClientHandlers } = require("./client");
const { registerSetupHandlers } = require("./setup");
const { registerControlHandlers } = require("./control");
const { registerBonusHandlers } = require("./bonus");
const { registerReportHandlers } = require("./report");

function registerIpc(db) {
  registerEmployeeHandlers(db);
  registerOfferHandlers(db);
  registerClientHandlers(db);
  registerSetupHandlers(db);
  registerControlHandlers(db);
  registerBonusHandlers(db);
  registerReportHandlers(db);
}

module.exports = { registerIpc };
