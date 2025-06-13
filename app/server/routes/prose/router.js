const express = require("express");
const requestHandler = require("./requestHandler");

const router = express.Router();

router.get("/:page", requestHandler);

module.exports = router;
