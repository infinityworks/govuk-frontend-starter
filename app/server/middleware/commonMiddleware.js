const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

/**
 * Sets up common middlewares for the given Express application.
 *
 * @param {express.Application} app - The Express application instance.
 * @returns {void} Sets up various middleware on the provided app instance.
 */
const setupMiddlewares = (app) => {
  // Parses cookies and adds them to req.cookies
  app.use(cookieParser());

  // Parses URL-encoded bodies (form submissions)
  app.use(bodyParser.urlencoded({ extended: true }));

  // Parses JSON request bodies
  app.use(express.json());

  // Parses URL-encoded bodies
  app.use(express.urlencoded({ extended: false }));
};

module.exports = { setupMiddlewares };
