const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/User");
const saltRounds = 10;

const userRouter = express.Router();

// API to register users
userRouter.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).send({
        message: "Required fields missing",
      });
    }
    const existingUser = await userModel.find({ email });
    if (existingUser.length > 0) {
      return res.status(409).send({
        message: "User already exists! Please login",
      });
    }
    // Password hashing using bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const updatedWithHashedPassword = {
      ...req.body,
      password: hashedPassword,
    };
    await userModel.create(updatedWithHashedPassword);
    res.status(200).send({
      message: "User successfully created!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Something went wrong!",
    });
  }
});

// API for users to login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({
      message: "Email or password field missing",
    });
  }
  const findUser = await userModel.find({ email });
  if (findUser.length === 0) {
    return res.status(401).send({
      message: "Invalid credentials",
    });
  }

  const result = await bcrypt.compare(password, findUser[0].password);
  if (!result) {
    return res.status(401).send({
      message: "Invalid credentials",
    });
  }
  const jwtToken = jwt.sign(
    {
      userID: findUser[0].id,
      email: findUser[0].email,
    },
    process.env.jwt_secret,
    { expiresIn: "1h" }
  );
  res.status(200).send({
    message: "Logged In Succesfully",
    token: jwtToken,
  });
});

// API for users to logout
userRouter.post("/logout", async (req, res) => {
  // Clear the JWT stored in the cookie
  res.clearCookie("jwt_token");
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = { userRouter };
