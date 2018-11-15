const express = require("express");
const genres = require("../routes/genres");
const books = require("../routes/books");
const customers = require("../routes/customers");
const rentals = require("../routes/rentals");
const home = require("../routes/home");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function(app) {
  app.use(express.json()); // to parse json
  app.use("/", home);
  app.use("/api/genres", genres);
  app.use("/api/books", books);
  app.use("/api/customers", customers);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
