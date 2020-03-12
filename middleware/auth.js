//This file is to authenticate user JWT for secured header based on User

//requiring jwt
const jwt = require("jsonwebtoken");

//requiring config
const config = require("config");

//exporting middleware authentication
module.exports = function(req, res, next) {
  //Get the token from the header
  const token = req.header("x-auth-token");

  //Check if there is no token
  if (!token) {
    return res.status(401).json({ msg: "No token, Authorization denied" });
  }

  //Verify token
  try {
    //decoding token if user has token
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    //setting the requested user = to the decoded user payload we made in user.js routes
    req.user = decoded.user;

    //moving to the next function
    next();
  } catch (err) {
    res.status(410).json({ msg: "Token is not valid" });
  }
};
