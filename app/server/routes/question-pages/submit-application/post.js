const { init } = require("@paralleldrive/cuid2");

module.exports = async (req, res, next) => {
  try {
    // Do something with the data, for example storing it in a database
    const createId = init({ length: 8 });
    // In practice, you might get this from an API response
    const referenceNumber = createId().toUpperCase();

    // Clear the session
    req.session.data = null;

    res.render("confirmation.njk", { referenceNumber });
  } catch (err) {
    next(err);
  }
};
