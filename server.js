//accessing express from our dependencies
const express = require("express");
//initilizing our "App" and setting it to express
const app = express();

app.get("/", (req, res) => res.send("API Running"));
//setting variable for PORT data to be used || process.env.PORT = deployed PORT key
const PORT = process.env.PORT || 5000;
//firing server
app.listen(PORT, () => {
  console.log(`Server listening on Port ${PORT}`);
});
