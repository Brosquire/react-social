//requiring express dependency
const express = require("express");
//setting router const equal to express router method
const router = express.Router();
//requiring express-validator
const { check, validationResult } = require("express-validator");
//requiring request dependency
const request = require("request");
//requiring our config dependency
const config = require("config");

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

//@route  POST api/profile
//@desc   Create or Update a user profile
//@access Private
router.post(
  "/",
  //setting multiple middleware : auth and express validator for required fields
  [
    auth,
    [
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //logging errors from the required fields if correct data input not met
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //destructuring our key items from our profile schema
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //Build Profile Object
    const profileFields = {};
    //setting profile fields equal to the current user profile being created
    profileFields.user = req.user.id;

    //checking if the fields of the profile schema contain data and if so pushing that data into the new profileFields object to be sent off to the database
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    //setting skills into an array seperated by a comma then mapping through to ensure each value is displayed correctly
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    //Build  Social Object from profile
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      //finding the profile to be true or false using findOne method passing the req.user.id we get from the token (auth middleware)
      let profile = await Profile.findOne({ user: req.user.id });

      //Update Profile
      if (profile) {
        //first fibnd the profile that needs to be updated by the req.body.id that we get from the token (auth middleware)
        //then set the profileFields and new = true
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        //send back the new updated profile
        res.json(profile);
      }

      //Create Profile
      //calling new Profile Schema and setting it equal to the profileFields created above
      profile = new Profile(profileFields);
      await profile.save();

      //sending back the created profile
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route  GET api/profile
//@desc   Get all profiles
//@access Public
router.get("/", async (req, res) => {
  try {
    //setting profiles equal to the all profiles found in the database and adding name and avatar to the field by chaining populate method
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    //sending the profiles back from the database
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  GET api/profile/user/:user_id
//@desc   Get profile by user ID
//@access Public
router.get("/user/:user_id", async (req, res) => {
  try {
    //setting profile equal to the specific profile by ID found in the database and adding name and avatar to the field by chaining populate method
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    //checking to see if profile exists
    if (!profile) {
      return res.status(400).json({ msg: "Profile Not Found" });
    }
    //sending the profiles back from the database
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Profile Not Found" });
    }
    res.status(500).send("Server Error");
  }
});

//@route  DELETE api/profile
//@desc   Delete Profile user and Posts
//@access Private
router.delete("/", auth, async (req, res) => {
  try {
    //remove Profile by user.id
    await Profile.findOneAndRemove({ user: req.user.id });
    //remove User by user.id
    await User.findOneAndRemove({ _id: req.user.id });
    //sending the profiles back from the database
    res.json({ msg: "User Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  PUT api/profile/experience
//@desc   Add profile experience
//@access Private
router.put(
  "/experience",
  [
    //setting multiuple middleware for validation and security
    auth,
    check("title", "Title is required")
      .not()
      .isEmpty(),
    check("company", "Company is required")
      .not()
      .isEmpty(),
    check("from", "From date is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    //setting const to errors and thenm displaying errors if they are found
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //destructuring the keys from the req.body from the Profile Schema
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    //setting new object to capture the data the user submits
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      //setting profile equal to the profile found by user.id
      const profile = await Profile.findOne({ user: req.user.id });

      //updating the profile experience using unshift(adds to the beginning of the array)
      profile.experience.unshift(newExp);

      //saving the updated profile experience to the database
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route  DELETE api/profile/experience/:exp_id
//@desc   Delete experience from profile
//@access Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get the remove index by setting the const equal to the profile.experience and then mapping through the experience
    //and setting the index by using indexOf method(params = the queried paramaters from the url)
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    //removing the profile experience by chaining the splice method using the const removeIndex and taking out just the ONE value
    profile.experience.splice(removeIndex, 1);

    //saving the updated/deleted experience to the database
    await profile.save();

    //sending back the updated profile experience from the database
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  PUT api/profile/education
//@desc   Add profile education
//@access Private
router.put(
  "/education",
  [
    //setting multiuple middleware for validation and security
    auth,
    check("school", "School is required")
      .not()
      .isEmpty(),
    check("degree", "Degree is required")
      .not()
      .isEmpty(),
    check("from", "From date is required")
      .not()
      .isEmpty(),
    check("fieldofstudy", "Field of Study is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    //setting const to errors and thenm displaying errors if they are found
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //destructuring the keys from the req.body from the Profile Schema
    const {
      school,
      degree,
      from,
      to,
      fieldofstudy,
      current,
      description
    } = req.body;

    //setting new object to capture the data the user submits
    const newEdu = {
      school,
      degree,
      from,
      to,
      fieldofstudy,
      current,
      description
    };

    try {
      //setting profile equal to the profile found by user.id
      const profile = await Profile.findOne({ user: req.user.id });

      //updating the profile education using unshift(adds to the beginning of the array)
      profile.education.unshift(newEdu);

      //saving the updated profile education to the database
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route  DELETE api/profile/education/:edu_id
//@desc   Delete education from profile
//@access Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get the remove index by setting the const equal to the profile.education and then mapping through the experience
    //and setting the index by using indexOf method(params = the queried paramaters from the url)
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    //removing the profile education by chaining the splice method using the const removeIndex and taking out just the ONE value
    profile.education.splice(removeIndex, 1);

    //saving the updated/deleted education to the database
    await profile.save();

    //sending back the updated profile education from the database
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  GET api/profile/github/:username
//@desc   Get user repos from github
//@access Public
router.get("/github/:username", async (req, res) => {
  try {
    //setting an options object to access repos of specific users github accounts

    const options = {
      uri: encodeURI(
        `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
      ),
      method: "GET",
      headers: {
        "user-agent": "node.js",
        Authorization: `token ${config.get("githubToken")}`
      }
    };

    //using the request dependency to access the github repos by user profile through its parameters specified through the options object we created
    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No Github profile found" });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
