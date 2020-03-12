//requiring express dependency
const express = require("express");
//setting router equal to the express router chain method
const router = express.Router();

//@route GET api/auth
//@descr authenticate a user
//@access Private

router.get("/", (req, res) => res.send("Auth route"));

module.exports = router;
