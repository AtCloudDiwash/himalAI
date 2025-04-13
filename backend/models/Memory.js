const mongoose = require("mongoose");

const moodMemorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    mood: {
      type: Number,
      required: true,
      min: 1, 
      max: 10, 
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false },
  }
);

module.exports = mongoose.model("MoodMemory", moodMemorySchema);