//requiring the express library
const express = require("express");
//setting router variable equal to the express.router method
const router = express.Router();

//@route   GET api/posts
//@desc    TEST route
//@access  Private
router.get("/", (req, res) => res.send("Posts Route"));

module.exports = router;
