const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const tokenBlacklist = new Set(); 

const generateToken = (user) => {
  return jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "5s" });
};

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    
    const token = generateToken(user);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


const logout = async (req, res) => {
  try {
    const token = req.token;
    tokenBlacklist.add(token);

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

module.exports = { signup, login, logout, isTokenBlacklisted };