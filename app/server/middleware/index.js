const { setupMiddlewares } = require("./commonMiddleware");
const { csrfProtection } = require("./csrfMiddleware");
const { htmxMiddleware } = require("./htmx");
const { setupConfig } = require("./setupConfigs");
const { setupCsp } = require("./setupCsp");
const { setupStaticAssets } = require("./staticAssets");
const {
  checkServiceAvailability,
} = require("./serviceAvailabilityMiddleware.js");
const { activeNavigationMiddleware } = require("./activeNavigation.js");
const { nunjucksSetup } = require("./setupNunjucks.js");

module.exports = {
  activeNavigationMiddleware,
  csrfProtection,
  htmxMiddleware,
  setupConfig,
  setupCsp,
  setupMiddlewares,
  nunjucksSetup,
  setupStaticAssets,
  checkServiceAvailability,
};
