const path = require("node:path");

const config = {
  GOOGLE_TAG_ID: process.env.GOOGLE_TAG_ID,
  app: {
    environment: process.env.NODE_ENV || "development",
    version: require("../../package.json").version, // Managed by release script
  },
  csrf: {
    cookieName: "_csrf",
    secure: process.env.NODE_ENV === "production", // Only secure in production
    httpOnly: true, // Restrict client-side access
  },
  paths: {
    static: path.join(__dirname, "../client/public"), // Path for serving static files
    views: path.join(__dirname, "./views"), // Path for Nunjucks views
  },
};

module.exports = config;
