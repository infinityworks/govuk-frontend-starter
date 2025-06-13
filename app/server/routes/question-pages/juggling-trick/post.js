const { matchedData, validationResult } = require("express-validator");
const { determineBackLink, formatValidationErrors } = require("../utils");

module.exports = async (req, res, next) => {
  try {
    if (req.session.data == null) {
      throw new Error(
        "Attempted to submit juggling trick form without session data",
      );
    }

    const result = validationResult(req);
    if (result.errors.length > 0) {
      const errors = formatValidationErrors(result);

      const backLinkUrl = determineBackLink(
        req,
        "/apply-juggling-license/juggling-balls",
      );

      res.status(422);
      res.render("juggling-trick.njk", {
        errors,
        // FIXME: In production this should sanitised
        values: req.session.data ?? matchedData(req, { onlyValidData: false }),
        errorSummary: Object.values(errors),
        backLinkUrl,
      });
      return;
    }

    req.session.data["most-impressive-trick"] =
      req.body["most-impressive-trick"];

    const referer = req.get("Referer") || "";
    const fromCheckAnswers = referer.includes("/check-answers");

    if (fromCheckAnswers) {
      return res.redirect("/apply-juggling-license/check-answers");
    }

    res.redirect("/apply-juggling-license/check-answers");
  } catch (err) {
    next(err);
  }
};
