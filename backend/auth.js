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
    console.log("Authorization header missing");
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token received:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded token:", decoded);
    req.user = decoded; // Attach user data to the request
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
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


