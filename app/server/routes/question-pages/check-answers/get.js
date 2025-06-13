module.exports = async (req, res, next) => {
  try {
    if (req.session.data == null) {
      throw new Error(
        "Attempted to load check answers page without session data",
      );
    }

    const backLinkUrl = "/apply-juggling-license/juggling-trick";

    res.render("check-answers.njk", {
      data: req.session.data,
      backLinkUrl,
    });
  } catch (err) {
    next(err);
  }
};
