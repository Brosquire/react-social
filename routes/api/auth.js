//requiring express dependency
const express = require("express");

//setting router equal to the express router chain method
const router = express.Router();

//requiring bcryptjs dependency to hash password
const bcrypt = require("bcryptjs");

//requiring JSONWT
const jwt = require("jsonwebtoken");

//requiring methods from the expressvalidator dependency
const { check, validationResult } = require("express-validator");

//requiring the config secret token from files

const config = require("config");
//importing middleware we created
const auth = require("../../middleware/auth");

//requiring our User model
const User = require("../../models/User");

//@route GET api/auth
//@descr authenticate a user
//@access Private

//adding auth as a parameter makes the route secure
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  Post api/auth
//@desc   Authenticate User and Get token
//@access Public
router.post(
  "/",
  //validating user fields are correct
  [
    check("email", "Please include valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    //setting errors const to req validation field
    const errors = validationResult(req);

    //if there ARE errors return error message
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //destructure email and password form req.body
    const { email, password } = req.body;

    //try/catch block
    //find user by email
    try {
      let user = await User.findOne({ email });

      //if user DOES NOT EXIST return error
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //if user does exists compare passwords using bcrypt method .compare(password to be compared, password hashed from database)
      const isMatch = await bcrypt.compare(password, user.password);

      //if the passwords do NOT match return error
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //passwords do match set the JWT payload to be checked
      const payload = {
        user: {
          id: user.id
        }
      };

      //sign the payload
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;

          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
