//requiring express dependency
const express = require("express");
//setting router equal to the express router chain method
const router = express.Router();
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
    //setting user equal to a Promise (async/await method instead) searching by id = findById(search parameter)
    //req.user is available to all protected routes thanks to our exported middleware saving the decoded user authentication in our headers
    //chaining .select("-password") excludes the password from being sent back from the server
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
