const helmet = require("helmet");

/**
 * Sets up Helmet middleware for the Express application to configure Content Security Policy (CSP).
 *
 * @param {object} app - The Express application instance.
 */
const setupCsp = (app) => {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
          imgSrc: [
            "'self'",
            "https://*.google-analytics.com",
            "https://*.googletagmanager.com",
          ],
          connectSrc: [
            "'self'",
            /*
              Consider using server analytics instead of remote analytics.

              Remote analytics, such as Google Analytics, introduces a
              vulnerability to your service and requires relaxing the CSP. It
              can also slow down the site for users with
              slow devices or where they have low bandwidth.

              If you use remote analytics and handle sensitive data, such as
              user login, you should not include the remote JavaScript on those
              paths.
            */
            "https://*.google-analytics.com",
            "https://*.analytics.google.com",
            "https://*.googletagmanager.com",
          ],
        },
      },
      crossOriginEmbedderPolicy: true,
      referrerPolicy: { policy: "same-origin" },
    }),
  );
};

module.exports = { setupCsp };
