const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, 
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000, 
      default: "",
    },
    media: {
      type: [
        {
          path: {
            type: String,
            required: true,
            trim: true,
          },
          type: {
            type: String,
            enum: ["image", "video", "audio", "text"],
            required: true,
          },
        },
      ],
      default: [],
      validate: {
        validator: (media) => media.length <= 6,
        message: "Maximum 6 media files allowed per memory",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false },
  }
);

// Compound index for common queries
memorySchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Memory", memorySchema);
