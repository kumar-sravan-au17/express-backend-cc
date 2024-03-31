const express = require("express");
require("dotenv").config();
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

app.post("/data", (req, res) => {
  res.status(201).send(req.body);
});

// Define the server port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
