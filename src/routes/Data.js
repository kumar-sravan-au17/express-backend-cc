const express = require("express");

const dataRoute = express.Router();

dataRoute.get("/", async (req, res) => {
  res.send("Hit data get 👍");
});

module.exports = { dataRoute };
