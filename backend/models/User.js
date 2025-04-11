const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30, 
      lowercase: true, 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 100, 
    },
    password: {
      type: String,
      required: true,
      minlength: 6, 
    },
    data: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Memory",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: false },
  }
);

// Indexes for common queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 }); 

module.exports = mongoose.model("User", userSchema);
