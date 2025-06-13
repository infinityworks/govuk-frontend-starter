function determineBackLink(req, defaultBackLink) {
  const referer = req.get("Referer") || "";
  if (referer.includes("/check-answers")) {
    return "/apply-juggling-license/check-answers";
  }

  return defaultBackLink;
}

module.exports = {
  determineBackLink,
};
