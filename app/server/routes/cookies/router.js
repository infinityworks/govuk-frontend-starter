const express = require("express");
const setCookiePreferences = require("./setCookiePreferences");

const router = express.Router();

function getCookiePreferences(req) {
  if (!req.cookies?.cookie_policy) {
    return null;
  }

  return JSON.parse(req.cookies.cookie_policy);
}

router
  .get("/", async (req, res, next) => {
    try {
      res.render("cookies.njk", {
        cookiePreferences: getCookiePreferences(req),
      });
    } catch (err) {
      next(err);
    }
  })
  .post("/", async (req, res, next) => {
    try {
      const isHtmx = req.headers["hx-request"] === "true";
      const analytics = req.body.analytics === "yes";

      setCookiePreferences(res, { analytics });

      if (isHtmx) {
        res.render("partials/cookies-page/notification-banner.njk");
      } else {
        res.render("cookies.njk", {
          cookiePreferences: getCookiePreferences(req),
          notification: true,
        });
      }
    } catch (err) {
      next(err);
    }
  });

router.post("/cookie-banner", async (req, res, next) => {
  try {
    const isHtmx = req.headers["hx-request"] === "true";

    const analytics = req.body.cookies.analytics === "yes";
    setCookiePreferences(res, { analytics });

    if (isHtmx) {
      res.render("partials/cookie-banner/confirmation.njk", {
        analytics,
      });
      return;
    }

    const referrer = req.get("Referrer") ?? "/";
    res.redirect(
      `${referrer}?cookieMessage=true&analytics=${String(analytics)}`,
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
