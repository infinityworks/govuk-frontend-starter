const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

router.get("/start", require("./start/get"));

router
  .get("/juggling-balls", require("./juggling-balls/get"))
  .post(
    "/juggling-balls",
    body("how-many-balls")
      .trim()
      .notEmpty()
      .withMessage("Select how many balls you can juggle"),
    require("./juggling-balls/post"),
  );

router
  .get("/juggling-trick", require("./juggling-trick/get"))
  .post(
    "/juggling-trick",
    body("most-impressive-trick")
      .trim()
      .notEmpty()
      .withMessage("Enter your most impressive juggling trick"),
    require("./juggling-trick/post"),
  );

router.get("/check-answers", require("./check-answers/get"));

router.post("/submit-application", require("./submit-application/post"));

module.exports = router;
