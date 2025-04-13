const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30, 
      lowercase: true, 
    },
    email: {
      type: String,
      required: true,
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
        required: true
      },
    ],
  },
  {
    timestamps: true,
    
  }
);


userSchema.index({ email: 1 }, {unique: true},);
userSchema.index({ username: 1 }, {unique: true}); 

module.exports = mongoose.model("User", userSchema);
