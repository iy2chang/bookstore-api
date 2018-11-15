const config = require("config");

module.exports = function() {
  // terminate the application if config is not set
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
};
