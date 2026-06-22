const InventoryItem = require("../models/InventoryItem");
const InventoryLog = require("../models/InventoryLog");

// Helper to determine stock status
const getStatus = (qty) => {
  if (qty <= 0) return "Out of Stock";
  if (qty <= 10) return "Low Stock";
  return "In Stock";
};

// @desc    Get all inventory items
// @route   GET /api/inventory
exports.getItems = async (req, res) => {
  try {
    const items = await InventoryItem.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching inventory" });
  }
};

// @desc    Create a new inventory item
// @route   POST /api/inventory
exports.createItem = async (req, res) => {
  try {
    const { name, category, unit, qty, image } = req.body;
    const code = `INV-${Math.floor(1000 + Math.random() * 9000)}`;

    const item = new InventoryItem({
      code,
      name,
      category,
      unit,
      qty,
      image,
      status: getStatus(qty),
    });
    await item.save();

    if (req.io) req.io.emit("inventoryUpdated");
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error creating item" });
  }
};

// @desc    Update an inventory item
// @route   PUT /api/inventory/:code
exports.updateItem = async (req, res) => {
  try {
    const { name, category, unit, qty, image } = req.body;
    const item = await InventoryItem.findOneAndUpdate(
      { code: req.params.code },
      { name, category, unit, qty, image, status: getStatus(qty) },
      { new: true }
    );
    if (req.io) req.io.emit("inventoryUpdated");
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error updating item" });
  }
};

// @desc    Delete an inventory item
// @route   DELETE /api/inventory/:code
exports.deleteItem = async (req, res) => {
  try {
    await InventoryItem.findOneAndDelete({ code: req.params.code });
    if (req.io) req.io.emit("inventoryUpdated");
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting item" });
  }
};

// @desc    Adjust Stock (Add/Deduct)
// @route   PUT /api/inventory/:code/adjust
exports.adjustStock = async (req, res) => {
  try {
    const { type, qty } = req.body; // type: 'add' or 'subtract'
    const item = await InventoryItem.findOne({ code: req.params.code });
    if (!item) return res.status(404).json({ message: "Item not found" });

    const adjQty = parseFloat(qty);
    let newQty = type === "add" ? item.qty + adjQty : item.qty - adjQty;
    if (newQty < 0) newQty = 0;

    item.qty = newQty;
    item.status = getStatus(newQty);
    await item.save();

    const log = new InventoryLog({
      itemCode: item.code,
      itemName: item.name,
      action: type === "add" ? "Stock Added" : "Stock Deducted",
      qtyString: `${adjQty} ${item.unit}`,
    });
    await log.save();

    if (req.io) req.io.emit("inventoryUpdated");
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error adjusting stock" });
  }
};

// @desc    Get Inventory Adjustment Logs
// @route   GET /api/inventory/logs
exports.getLogs = async (req, res) => {
  try {
    const logs = await InventoryLog.find().sort({ createdAt: -1 }).limit(50).lean();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching logs" });
  }
};
