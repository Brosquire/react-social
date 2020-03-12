//requiring mongoose dependency
const mongoose = require("mongoose");

//creating a schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});
//exporting our User Schema : setting User = the schema we created mongoose.model("MODELname", SCHEMAname)
module.exports = User = mongoose.model("user", UserSchema);
