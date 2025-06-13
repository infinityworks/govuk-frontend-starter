const { matchedData, validationResult } = require("express-validator");
const { determineBackLink, formatValidationErrors } = require("../utils");

module.exports = async (req, res, next) => {
  try {
    if (req.session.data == null) {
      req.session.data = {};
    }

    const result = validationResult(req);
    if (result.errors.length > 0) {
      const errors = formatValidationErrors(result);

      const backLinkUrl = determineBackLink(
        req,
        "/apply-juggling-license/start",
      );

      res.status(422);
      res.render("juggling-balls.njk", {
        errors,
        // FIXME: In production this should sanitised
        values: req.session.data ?? matchedData(req, { onlyValidData: false }),
        errorSummary: Object.values(errors),
        backLinkUrl,
      });
      return;
    }

    const howManyBalls = req.body["how-many-balls"];
    req.session.data["how-many-balls"] = howManyBalls;

    const referer = req.get("Referer") || "";
    const fromCheckAnswers = referer.includes("/check-answers");

    if (howManyBalls === "3 or more") {
      if (fromCheckAnswers) {
        return res.redirect("/apply-juggling-license/check-answers");
      }
      return res.redirect("/apply-juggling-license/juggling-trick");
    } else {
      return res.render("ineligible.njk", { data: req.session.data });
    }
  } catch (err) {
    next(err);
  }
};
