const { registerEmployeeHandlers } = require("./employee");
const { registerOfferHandlers } = require("./offer");
const { registerClientHandlers } = require("./client");
const { registerSetupHandlers } = require("./setup");
const { registerControlHandlers } = require("./control");
const { registerBonusHandlers } = require("./bonus");

function registerIpc(db) {
  registerEmployeeHandlers(db);
  registerOfferHandlers(db);
  registerClientHandlers(db);
  registerSetupHandlers(db);
  registerControlHandlers(db);
  registerBonusHandlers(db);
}

module.exports = { registerIpc };
