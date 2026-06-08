const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    seats: {
      type: Number,
      required: true,
      default: 4,
    },
    status: {
      type: String,
      enum: ["Available", "Occupied", "Reserved", "Cleaning"],
      default: "Available",
    },
    currentCustomer: { type: String, default: "No Customer" },
    reservationTime: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", tableSchema);
