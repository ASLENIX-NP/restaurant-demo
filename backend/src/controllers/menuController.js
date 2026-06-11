const MenuItem = require("../models/MenuItem");

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({});
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ message: "Server error fetching menu items" });
  }
};

// @desc    Create a new menu item
// @route   POST /api/menu
// @access  Private (Admin/Cashier)
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable, image } = req.body;

    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ message: "Name, price, and category are required" });
    }

    const menuItem = new MenuItem({
      name,
      description: description || "Delicious food item",
      price,
      category,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      image: image || "",
    });

    const createdItem = await menuItem.save();

    // 📢 Broadcast that the menu list has changed
    if (req.io) req.io.emit("menuUpdated");

    res.status(201).json(createdItem);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ message: "Server error creating menu item" });
  }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private (Admin/Cashier)
exports.updateMenuItem = async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem)
      return res.status(404).json({ message: "Menu item not found" });

    // 📢 Broadcast that the menu list has changed
    if (req.io) req.io.emit("menuUpdated");

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Server error updating menu item" });
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private (Admin/Cashier)
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem)
      return res.status(404).json({ message: "Menu item not found" });

    // 📢 Broadcast that the menu list has changed
    if (req.io) req.io.emit("menuUpdated");

    res.status(200).json({ message: "Menu item successfully removed" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Server error deleting menu item" });
  }
};
