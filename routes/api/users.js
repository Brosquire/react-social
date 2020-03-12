//requiring express dependency
const express = require("express");

//requiring the gravatar dependency
const gravatar = require("gravatar");

//requiring bcryptjs dependency to hash password
const bcrypt = require("bcryptjs");

//requiring JSONWT
const jwt = require("jsonwebtoken");

//requiring methods from the expressvalidator dependency
const { check, validationResult } = require("express-validator");

//requiring the config secret token from files
const config = require("config");

//requiring User Schema
const User = require("../../models/User");

//setting express routes to const ROUTER chaining the router method on express
const router = express.Router();

//@route                   POST api/users
//@description(desc)       Register User
//@access                  Public
router.post(
  "/",
  //express validator middleware : check = testing if the user entered correct data in the correct format = chaining .not().isEmpty() to ensure the field of data is true
  //Set to an array for multiple checks!!!!!
  //parameters of a check are 1: the parameter being checked 2: an error message
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters" //setting password length through express validator in obkect format
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    //setting errors to the validationResult method of express validator
    const errors = validationResult(req);
    //if there ARE errors return res.status
    if (!errors.isEmpty()) {
      //returning a 400 message for invalid data - setting error messages to the custom messages created above by chaining errors.array()
      return res.status(400).json({ errors: errors.array() });
    }
    //destructuring the req.body parameters
    const { name, email, password } = req.body;

    try {
      //See if the User exists
      //setting user equal to await User.findOne method passing email as the search parameter es6 syntax : await part of async/await
      let user = await User.findOne({ email });

      //checking if the user exists : if so 400 error - server error with printed custom error message
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      //Get Users gravatar
      //setting avatar equal to the gravatar required at top - setting parameters for the gravatar for profile pic size and rating or set to the default "mm"
      const avatar = gravatar.url(email, {
        size: "200",
        rating: "pg",
        default: "mm"
      });

      //setting a new User using the schema calling new before it - then setting the data to its respective inputs
      user = new User({
        name,
        email,
        avatar,
        password
      });

      //Encrypt the password
      //setting the salt with bcrypt method genSalt("# of rounds to be genereted for hashing" SHOULD BE 10 = reccommended)
      const salt = await bcrypt.genSalt(10);

      //hashing the user password
      user.password = await bcrypt.hash(password, salt);

      //saving the user to the database : await becayuse it returns a promise
      await user.save();

      //Return the JSONWebtoken
      //setting the payload for the JWT
      const payload = {
        user: {
          id: user.id
        }
      };

      //signing the jwt token to be set for user
      //set the payload to be sent, get the secret token from external file, set certain parametrs ie: expiresIn (seconds), cb taking error or token
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          //setting error catches OR sending the token in json format
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
