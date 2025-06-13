/**
 * Middleware to make the current path available to templates.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 * @returns {void}
 */
const activeNavigationMiddleware = (req, res, next) => {
  console.debug(req.path);
  res.locals.pathname = req.path;
  next();
};

module.exports = {
  activeNavigationMiddleware,
};
