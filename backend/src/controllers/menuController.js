const MenuItem = require("../models/MenuItem");
const { createLog } = require("./logController");

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
exports.getMenuItems = async (req, res) => {
  try {
    const { page = 1, limit = 0, search = "", category = "" } = req.query;

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (category && category !== "All") {
      query.category = category;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    let itemsPromise = MenuItem.find(query).lean();
    
    if (limitNum > 0) {
      itemsPromise = itemsPromise
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);
    }

    const [items, total] = await Promise.all([
      itemsPromise,
      MenuItem.countDocuments(query),
    ]);

    res.status(200).json({
      items,
      metadata: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: limitNum > 0 ? Math.ceil(total / limitNum) : 1,
      },
    });
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

    const menuItem = new MenuItem({
      name,
      description: description || "Delicious food item",
      price,
      category,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      image: image || "",
    });

    const createdItem = await menuItem.save();

    createLog({
      user: req.user.username,
      role: req.user.role,
      action: `Created Menu Item: ${menuItem.name}`,
      device: req.headers["user-agent"],
      ip: req.ip,
      status: "Success",
    });

    // 📢 Broadcast that the menu list has changed
    if (req.io) req.io.emit("menuUpdated", { action: "create", item: createdItem });

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

    createLog({
      user: req.user.username,
      role: req.user.role,
      action: `Updated Menu Item: ${updatedItem.name}`,
      device: req.headers["user-agent"],
      ip: req.ip,
      status: "Success",
    });

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

    createLog({
      user: req.user.username,
      role: req.user.role,
      action: `Deleted Menu Item: ${menuItem.name}`,
      device: req.headers["user-agent"],
      ip: req.ip,
      status: "Success",
    });

    // 📢 Broadcast that the menu list has changed
    if (req.io) req.io.emit("menuUpdated");

    res.status(200).json({ message: "Menu item successfully removed" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Server error deleting menu item" });
  }
};
