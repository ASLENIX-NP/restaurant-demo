const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    unit: { type: String, default: "Kg" },
    qty: { type: Number, default: 0 },
    status: { type: String, default: "In Stock" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);
