const {
  format,
  formatRFC7231,
  isAfter,
  isValid,
  isWithinInterval,
  parseISO,
} = require("date-fns");
const createError = require("http-errors");

function isServiceAvailable() {
  if (process.env.SERVICE_UNAVAILABLE_START == null) {
    return true;
  }

  const serviceUnavailableStart = parseISO(
    process.env.SERVICE_UNAVAILABLE_START,
  );

  if (!isValid(serviceUnavailableStart)) {
    throw new Error(
      "SERVICE_UNAVAILABLE_START could not be parsed to a Date time",
    );
  }

  const now = new Date();

  if (process.env.SERVICE_UNAVAILABLE_END != null) {
    const serviceUnavailableEnd = parseISO(process.env.SERVICE_UNAVAILABLE_END);

    if (!isValid(serviceUnavailableEnd)) {
      throw new Error(
        "SERVICE_UNAVAILABLE_END could not be parsed to a Date time",
      );
    }

    if (
      isWithinInterval(now, {
        start: serviceUnavailableStart,
        end: serviceUnavailableEnd,
      })
    ) {
      return false;
    }
  } else if (isAfter(now, serviceUnavailableStart)) {
    return false;
  }

  return true;
}

/**
 * @param {Date | undefined} serviceAvailableFrom
 * @returns {string}
 */
function createMessage(serviceAvailableFrom) {
  let message;

  if (
    serviceAvailableFrom !== undefined &&
    Boolean(isValid(serviceAvailableFrom))
  ) {
    message = `You will be able to use the service from ${format(
      serviceAvailableFrom,
      "haaa 'on' eeee d MMMM yyyy",
    )}.`;
  } else {
    message = "Try again later.";
  }

  return message;
}

/**
 * Middleware to check if the service is available.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
function checkServiceAvailability(req, res, next) {
  if (isServiceAvailable()) {
    return next();
  }

  let serviceUnavailableEnd;
  if (process.env.SERVICE_UNAVAILABLE_END != null) {
    serviceUnavailableEnd = parseISO(process.env.SERVICE_UNAVAILABLE_END);
  }

  const message = createMessage(serviceUnavailableEnd);

  const error = createError(503, message, {
    headers: {
      ...(serviceUnavailableEnd && {
        "retry-after": formatRFC7231(serviceUnavailableEnd),
      }),
    },
  });

  return next(error);
}

module.exports = {
  checkServiceAvailability,
};
