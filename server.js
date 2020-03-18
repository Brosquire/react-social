//accessing express from our dependencies
const express = require("express");

//requiring the connectDB function;
const connectDB = require("./config/db");

const path = require("path");

//initilizing our "App" and setting it to express
const app = express();

//connecting the database to our server/app
connectDB();

//Init Middleware - to parse the request of the body in JSON format
app.use(express.json({ extended: false }));

//Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/auth", require("./routes/api/auth"));

//Serve static assets in production
if (process.env.NODE.ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//setting variable for PORT data to be used || process.env.PORT = deployed PORT key
const PORT = process.env.PORT || 5000;

//firing server
app.listen(PORT, () => {
  console.log(`Server listening on Port ${PORT}`);
});
