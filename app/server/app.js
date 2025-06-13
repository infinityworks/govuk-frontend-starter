const compression = require("compression");
const debug = require("debug")("apply-juggling-license:app");
const express = require("express");
const session = require("express-session");
const createError = require("http-errors");
const logger = require("morgan");
const promBundle = require("express-prom-bundle");

const config = require("./config");
const {
  activeNavigationMiddleware,
  checkServiceAvailability,
  csrfProtection,
  htmxMiddleware,
  nunjucksSetup,
  setupConfig,
  setupCsp,
  setupMiddlewares,
  setupStaticAssets,
} = require("./middleware");
const { cookieRoutes, proseRoutes, questionPagesRoutes } = require("./routes");

const app = express();

const adminApp = express();

app.get("/readyz", (req, res) => res.status(200).json({ status: "ok" }));
app.get("/livez", (req, res) => res.status(200).json({ status: "ok" }));

const metricsMiddleware = promBundle({
  autoregister: false,
  includeMethod: true,
  // Serve /metrics endpoint on a port which we do not expose to the internet
  metricsApp: adminApp,
});

app.use(metricsMiddleware);

setupStaticAssets(app, config);

/**
 * Sets up request logging using Morgan for better debugging and analysis.
 */
app.use(logger(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/**
 * Sets up common middleware for handling cookies, body parsing, etc.
 * @param {import('express').Application} app - The Express application instance.
 */
setupMiddlewares(app);

/**
 * Response compression setup. Compresses responses unless the 'x-no-compression' header is present.
 * Improves the performance of your app by reducing the size of responses.
 */
app.use(
  compression({
    /**
     * Custom filter for compression.
     * Prevents compression if the 'x-no-compression' header is set in the request.
     *
     * @param {import('express').Request} req - The Express request object.
     * @param {import('express').Response} res - The Express response object.
     * @returns {boolean} - Returns true if compression should be applied, false otherwise.
     */
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        // Don't compress responses with this request header
        return false;
      }
      // Fallback to the standard filter function
      return compression.filter(req, res);
    },
  }),
);

/**
 * Middleware function to set up a Content Security Policy (CSP) nonce for each request.
 * This helps in preventing certain types of attacks like XSS.
 * This is only on in production.
 */
app.use(csrfProtection);

/**
 * Sets up security headers using Helmet to protect the app from well-known web vulnerabilities.
 *
 * @param {import('express').Application} app - The Express application instance.
 */
setupCsp(app);

// Reducing fingerprinting by removing the 'x-powered-by' header
app.disable("x-powered-by");

/**
 * Set up cookie security for sessions.
 * Configures session management with secure cookie settings and session IDs.
 */
app.use(
  session({
    secure: app.get("env") === "production",
    secret: process.env.SESSION_SECRET, // Secret for session encryption
    name: "sessionId", // Custom session ID cookie name
    resave: false, // Prevents resaving unchanged sessions
    saveUninitialized: false, // Only save sessions that are modified,
    /**
     * FIXME: When using an in-memory session store, sessions are lost when the
     * server restarts and will behave strangely if you ever scale beyond a
     * single instance. In production, use a persistent session store like
     * Redis instead. For a list of stores, see
     * https://www.npmjs.com/package/express-session#compatible-session-stores
     */
    store: new session.MemoryStore(),
  }),
);

/**
 * Sets up Nunjucks as the template engine for the Express app.
 * Configures the view engine and template paths.
 *
 * @param {import('express').Application} app - The Express application instance.
 */
nunjucksSetup(app);

/**
 * Sets up application-specific configurations that are made available in templates.
 *
 * @param {import('express').Application} app - The Express application instance.
 */
setupConfig(app);

// Tell Nunjucks about the user's cookie preferences
app.use((req, res, next) => {
  try {
    const cookiePolicy = req.cookies?.cookie_policy
      ? JSON.parse(req.cookies.cookie_policy)
      : null;

    if (cookiePolicy?.version === 1) {
      res.locals.cookiePreferences = cookiePolicy;
    }

    next();
  } catch (err) {
    next(err);
  }
});

app.use(htmxMiddleware);

app.use(activeNavigationMiddleware);

app.use(checkServiceAvailability);

// Add cache headers for HTML responses
app.use((req, res, next) => {
  // Only set this header for HTML responses, not for static assets
  res.set("Cache-Control", "no-cache, must-revalidate");
  next();
});

app.get("/", async (req, res, next) => {
  try {
    res.render("homepage.njk");
  } catch (err) {
    next(err);
  }
});

app.use("/cookies", cookieRoutes);
app.use("/", proseRoutes);
app.use("/apply-juggling-license", questionPagesRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
/* eslint-disable-next-line no-unused-vars --
 * https://github.com/expressjs/generator/issues/78
 **/
app.use(function (err, req, res, next) {
  debug(err);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  const code = typeof err.status === "number" ? err.status : 500;
  res.status(code);

  switch (code) {
    case 404:
      res.render("page-not-found.njk");
      break;
    case 500:
      res.render("there-is-a-problem-with-the-service.njk");
      break;
    case 503:
      res.render("service-unavailable.njk", {
        message: err.message,
      });
      break;
    default:
      res.render("there-is-a-problem-with-the-service.njk");
  }
});

module.exports = { app, adminApp };
