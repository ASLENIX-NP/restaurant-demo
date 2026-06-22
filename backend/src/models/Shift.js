const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
  {
    cashierName: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    startingCash: { type: Number, required: true },
    actualEndingCash: { type: Number },
    expectedEndingCash: { type: Number },
    payouts: [
      {
        amount: { type: Number },
        reason: { type: String },
        time: { type: String }
      }
    ],
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shift", shiftSchema);
