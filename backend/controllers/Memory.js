const MoodMemory = require("../models/Memory.js"); 

// Create a new memory
const createMemory = async (req, res) => {
  try {
    console.log("req.user:", req.user); // Debugging log

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: User ID missing" });
    }

    const memory = new MoodMemory({
      ...req.body,
      user: req.user.id, // Associate the memory with the logged-in user
    });

    await memory.save();
    res.status(201).json(memory);
  } catch (error) {
    console.error("Error creating memory:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get 3 most recent memories
const getRecentMemories = async (req, res) => {
  try {
    console.log("req.user:", req.user); // Debugging log
    const recentMemories = await MoodMemory.find({ user: req.user.id }) // Filter by user ID
      .sort({ createdAt: -1 }) // Sort by creation date (most recent first)
      .limit(3); // Limit to 3 memories
    res.status(200).json(recentMemories);
  } catch (error) {
    console.error("Error fetching recent memories:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get all memories
const getAllMemories = async (req, res) => {
  try {
    console.log("req.user:", req.user); // Debugging log
    const memories = await MoodMemory.find({});
    res.status(200).json(memories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single memory by ID
const getMemoryById = async (req, res) => {
  try {
    console.log("req.user:", req.user); // Debugging log
    const memory = await MoodMemory.findById(req.params.id); 
    if (!memory) {
      return res.status(404).json({ error: "Memory not found" });
    }
    res.status(200).json(memory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a memory by ID
const updateMemory = async (req, res) => {
  try {
    console.log("req.user:", req.user); // Debugging log
    const memory = await MoodMemory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }); 
    if (!memory) {
      return res.status(404).json({ error: "Memory not found" });
    }
    res.status(200).json(memory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a memory by ID
const deleteMemory = async (req, res) => {
  try {
    console.log("req.user:", req.user); // Debugging log
    const memory = await MoodMemory.findByIdAndDelete(req.params.id); 
    if (!memory) {
      return res.status(404).json({ error: "Memory not found" });
    }
    res.status(200).json({ message: "Memory deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMemory,
  getRecentMemories,
  getAllMemories,
  getMemoryById,
  updateMemory,
  deleteMemory,
};