//requiring express dependency
const express = require("express");
//setting router const equal to express router method
const router = express.Router();

//requiring auth middlewar
const auth = require("../../middleware/auth");

//requiring our Profile Schema
const Profile = require("../../models/Profile");
//requiring our User Schema
const User = require("../../models/User");

//@route  GET api/profile/me
//@desc   Get current users  profile
//@access Private
router.get("/me", auth, async (req, res) => {
  try {
    //setting profile equal to our Profile Model (async/awit) given it returns a promise
    //setting the profile const to the req.user.id through our token verification middleware
    //chaining the .populate method to include the fields we want to add to our profile const (first param is which model to use, second is  an array of fields we want to grab from the given schema)
    //the user schema is attached to our profile schema from the objectid method in our profile schema
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);

    //checking if there is NO user
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
