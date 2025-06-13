const { determineBackLink } = require("../utils");

module.exports = async (req, res, next) => {
  try {
    if (req.session.data == null) {
      throw new Error(
        "Attempted to load juggling trick page without session data",
      );
    }

    const backLinkUrl = determineBackLink(
      req,
      "/apply-juggling-license/juggling-balls",
    );

    res.render("juggling-trick.njk", {
      data: req.session.data,
      backLinkUrl,
    });
  } catch (err) {
    next(err);
  }
};
