const mongoose = require("mongoose");

// Sub-schema for individual items inside an order's cart
const orderItemSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  qty: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  category: { type: String },
  station: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // Format: #ORD-1234
    table: { type: String, required: true }, // E.g., Table 1, Walk-in, Queue
    customer: { type: String, default: "Guest" },
    server: { type: String, default: "System" },
    channel: { type: String, default: "Dine In" }, // E.g., Dine In, Takeaway, Delivery
    priority: { type: String, default: "Normal" },
    station: { type: String, default: "Hot Line" },
    notes: { type: String, default: "" }, // Special instructions for the kitchen
    elapsedMinutes: { type: Number, default: 0 },

    items: [orderItemSchema], // Array of the food items ordered

    subtotal: { type: Number, default: 0 },
    vat: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    serviceCharge: { type: Number, default: 0 },

    time: { type: String }, // E.g., 08:30 PM
    date: { type: String }, // E.g., 2024-05-15
    paymentMethod: { type: String }, // Cash, Card, eSewa, Khalti

    status: {
      type: String,
      enum: ["Pending", "Cooking", "Ready", "Served", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
