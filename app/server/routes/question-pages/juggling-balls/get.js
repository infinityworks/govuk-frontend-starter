const { determineBackLink } = require("../utils");

module.exports = async (req, res, next) => {
  try {
    const backLinkUrl = determineBackLink(req, "/apply-juggling-license/start");

    res.render("juggling-balls.njk", {
      data: req.session.data,
      backLinkUrl,
    });
  } catch (err) {
    next(err);
  }
};
