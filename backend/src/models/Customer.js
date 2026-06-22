const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    totalVisits: {
      type: Number,
      default: 0,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    lastVisit: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Performance indexes for faster querying and sorting
customerSchema.index({ phone: 1 });
customerSchema.index({ createdAt: -1 });
customerSchema.index({ loyaltyPoints: -1 });

module.exports = mongoose.model("Customer", customerSchema);
