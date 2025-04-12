const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },
  media: [
    {
      url: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["image"],
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
      originalName: String,
      size: Number,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Memory", memorySchema);