const debug = require("debug")("apply-juggling-license:staticAssets");
const express = require("express");
const path = require("node:path");

/**
 * Set up user-defined static assets from the /assets directory.
 *
 * @param {import('express').Application} app - The Express app
 * @param {object} config
 * @param {string} config.paths.static - The path for serving user static files
 */
function setupUserAssets(app, config) {
  // Serve static files from the user-defined assets directory
  debug("config.paths.static:", config.paths.static);
  app.use("/assets", express.static(config.paths.static));
}

/**
 * Set up third-party or library static assets.
 *
 * @param {import('express').Application} app - The Express app
 */
function setupLibraryAssets(app) {
  // Create reusable options object for cache headers
  /** @type {import('express').ServeStaticOptions} */
  const longTermCache = {
    maxAge: "31536000", // 1 year in milliseconds
    immutable: true, // Tells browsers the file won't change
    etag: true, // Enables validation
  };

  // Serve GOV.UK Frontend assets
  app.use(
    "/assets",
    express.static(
      path.join(
        __dirname,
        "../../../node_modules/govuk-frontend/dist/govuk/assets",
      ),
      longTermCache,
    ),
  );

  // Serve GOV.UK Frontend JavaScript
  app.use(
    "/assets/scripts/govuk-frontend.min.js",
    express.static(
      path.join(
        __dirname,
        "../../../node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js",
      ),
      longTermCache,
    ),
  );
  app.use(
    "/assets/scripts/govuk-frontend.min.js.map",
    express.static(
      path.join(
        __dirname,
        "../../../node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js.map",
      ),
      longTermCache,
    ),
  );

  // Serve HTMX
  app.use(
    "/assets/scripts",
    express.static(
      path.join(__dirname, "../../../node_modules/htmx.org/dist"),
      longTermCache,
    ),
  );

  // Serve GOV.UK Frontend styles
  app.use(
    "/assets/styles/govuk-frontend.min.css",
    express.static(
      path.join(
        __dirname,
        "../../../node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.css",
      ),
      longTermCache,
    ),
  );
  app.use(
    "/assets/styles/govuk-frontend.min.css.map",
    express.static(
      path.join(
        __dirname,
        "../../../node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.css.map",
      ),
      longTermCache,
    ),
  );
}

/**
 * Sets up both user assets and library assets
 *
 * @param {import('express').Application} app - The Express app
 * @param {object} config
 */
function setupStaticAssets(app, config) {
  setupUserAssets(app, config);
  setupLibraryAssets(app);
}

module.exports = { setupStaticAssets };
