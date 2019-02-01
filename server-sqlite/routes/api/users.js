const express = require("express");
const router = express.Router();
const secret = require("../../config/secret.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
//const getUserId = require("../../utilities/get-user-id");

// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Signup user
// @access Public
router.post("/register", (req, res) => {
  // field validation
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // if email exists, response with 400 status
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        // create new user
        let newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
          region: req.body.region,
          active: false
        });

        // hash user's password and response with a newly created user
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) return res.status(500).json({ error });
            // change user's password with a hash
            newUser.password = hash;
            // save new user and respond with a new user
            newUser
              .save()
              .then(user => {
                delete user.password;
                res.status(200).json(user);
              })
              .catch(err => {
                return res.status(500).json({ error });
              }); // catch(err =>...)
          }); // bcrypt.hash(newUser.password...)
        }); // bcrypt.genSalt(10...)
      } // else
    }) // .then(user => ...
    .catch(error => {
      return res.status(500).json({ error });
    }); // .catch(error =>... )
});

// @route POST api/users/login
// @desc Login user
// @access Public
router.post("/login", (req, res) => {
  // error list won't be shown to the user,
  // just a general 'login unsuccessful' instead
  const badLoginResponse = { msg: "wrong password or email" };

  // validate fields
  //console.log("req.body", req.body);

  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // find the user by email
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email, active: true }, (err, user) => {
    // some error occured
    if (err) {
      return res.status(500).json({ err });
    }
    // active email not found
    if (!user) {
      console.log("user not found");
      return res.status(404).json(badLoginResponse);
    }
    // email found, check if passwords match
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // email and password match
        // create jwt payload
        const payload = {
          email: user.email,
          name: user.name,
          role: user.role,
          region: user.region
        };
        // sign the jwt
        jwt.sign(
          payload,
          secret.SECRET_KEY,
          { expiresIn: 36000 },
          (err, token) => {
            if (!err) {
              res.status(200).json({ success: true, user: payload, token: "Bearer " + token });
            } else {
              // error signing token
              res.status(500).json({ err });
            }
          }
        );
      } else {
        // email and password don't match
        res.status(400).json(badLoginResponse);
      }
    });
  });
});

// @route GET api/users/current
// @desc Get current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      region: req.user.region
    });
  }
);

module.exports = router;
