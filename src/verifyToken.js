const jwt = require("jsonwebtoken");

const verifyAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    if (!token)
      return res.status(401).send({
        message: "Login to access this route",
      });
    const userInfo = jwt.verify(token, process.env.jwt_secret);
    req.userInfo = userInfo;
    next();
  } catch (error) {
    console.error(error);
    res.status(400).send({
      message: "Invalid Token",
    });
  }
};

module.exports = { verifyAuth };
