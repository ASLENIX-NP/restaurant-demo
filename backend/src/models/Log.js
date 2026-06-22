const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    device: {
      type: String,
    },
    ip: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Success", "Failed"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", LogSchema);