const express = require("express");
const { connectDB } = require("./database");
const { userRouter } = require("./routes/User");
const { verifyAuth } = require("./verifyToken");
const { dataRoute } = require("./routes/Data");
require("dotenv").config();
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/data", verifyAuth, dataRoute);

app.get("/test", (req, res) => {
  res.send("Hello World! 👌");
});

// Define the server port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server started at ${PORT}`);
});
