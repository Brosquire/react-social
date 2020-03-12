//requiring express dependency
const express = require("express");
//setting router const equal to express router method
const router = express.Router();

//@route  GET api/profile
//@desc   Test Route
//@access Private
router.get("/", (req, res) => res.send("Profile Route"));

module.exports = router;
