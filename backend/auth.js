const mongoose = require('mongoose');
const User = require('./models/User.js'); 
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

const tokenBlacklist = new Set(); 

module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    
  };
  return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: "1h" }); 
};

// Verify Token Middleware
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports.verify = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ error: "Token has been invalidated" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
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


