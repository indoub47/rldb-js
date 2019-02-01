"use strict";

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
//const settings = require("./config/settings");
const secret = require("./config/secret");

const users = require("./routes/api/users");
//const defects = require("./routes/api/defects");
const items = require("./routes/api/items");
const things = require("./routes/api/things");



const app = express();
require("./config/passport")(passport);

app.use((req, res, next) => {
  const delay = 0;
  const start = Date.now();
  while (Date.now() - start < delay) {}
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(
    secret.DB_URI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use(passport.initialize());

app.use("/api/users", users);
app.use(["/api/defects", "/api/weldings"], items);
app.use("/api/things", things);
app.use("/", express.static("../client-redux/"));

// Add a random delay to all requests. Set SHOULD_DELAY to false for a more
// responsive server, or play around with the delay RANGE.
/*
app.use((req, res, next) => {
  if (settings.SHOULD_DELAY) {
    const delay = Math.random() * (settings.DELAY_RANGE[1] - settings.DELAY_RANGE[0]) + settings.DELAY_RANGE[0];
    const start = Date.now();
    while (Date.now() - start < delay) {}
  }
  next();
});
*/

/**
 * Start listening on port 3000
 */

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Node express server is running on port ${PORT}!`);
});
