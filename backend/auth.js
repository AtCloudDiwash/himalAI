const mongoose = require('mongoose');
const User = require('./models/User.js'); 
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();



module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    
  };
  return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: "1h" }); 
};

// Verify Token Middleware
module.exports.verify = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ auth: "Failed. No Token Provided" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length); 
  }

  if (tokenBlacklist.has(token)) {
    return res.status(403).json({ auth: "Failed", message: "Token is blacklisted. Please log in again." });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ auth: "Failed", message: "Token has expired. Please log in again." });
      }
      return res.status(403).json({ auth: "Failed", message: err.message });
    }

    req.user = decodedToken; 
    next();
  });
};

// Global Error Handler Middleware
module.exports.errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: {
      message: errorMessage,
      errorCode: err.code || "SERVER_ERROR",
      details: err.details || null,
    },
  });
};


