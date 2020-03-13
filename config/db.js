//MONGO DB CONNECTION
//requiring mongoose dependency
const mongoose = require("mongoose");
//requiring config dependency
const config = require("config");
//setting our MONGOOURI credentilal throgh cofig.get("REQUIRES STRING PARAMETER")
const db = config.get("mongoURI");

//arrow function calling the mongoDB server using mongoose - wrapped in an async/await model
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log(`MongoDB Connected`);
  } catch (err) {
    console.error(err.message);
    //exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
