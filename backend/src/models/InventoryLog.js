const mongoose = require("mongoose");

const inventoryLogSchema = new mongoose.Schema(
  {
    itemCode: { type: String, required: true },
    itemName: { type: String, required: true },
    action: { type: String, required: true }, // E.g., "Stock Added", "Stock Deducted"
    qtyString: { type: String, required: true }, // E.g., "5 Kg"
    user: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InventoryLog", inventoryLogSchema);
