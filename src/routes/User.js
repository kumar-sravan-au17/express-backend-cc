const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/User");
const saltRounds = 10;

const userRouter = express.Router();

/**
 * @openapi
 * /user/register:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User successfully created!
 *       400:
 *         description: Required fields missing
 *       409:
 *         description: User already exists! Please login
 */


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

/**
 * @openapi
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Logged In Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged In Successfully
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzNDU2Nzg5LCJuYW1lIjoiSm9zZXBoIn0.OpOSSw7e485LOP5PrzScxHb7SR6sAOMRckfFwi4rp7o
 *       400:
 *         description: Email or password field missing
 *       401:
 *         description: Invalid credentials
 *       
 */


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

/**
 * @openapi
 * /user/logout:
 *   post:
 *     summary: User logout
 *     tags: [User]
 *     description: Logs out the user by clearing the JWT token stored in the cookie.
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *  
 */

// API for users to logout
userRouter.post("/logout", async (req, res) => {
  // Clear the JWT stored in the cookie
  res.clearCookie("jwt_token");
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = { userRouter };
