const Table = require("../models/Table");

// @desc    Get all tables
// @route   GET /api/tables
// @access  Private (All logged-in staff)
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find({});
    res.status(200).json(tables);
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ message: "Server error fetching tables" });
  }
};

// @desc    Create a new table
// @route   POST /api/tables
// @access  Private (Admin/Cashier)
exports.createTable = async (req, res) => {
  try {
    const { name, seats, status, currentCustomer, reservationTime } = req.body;

    const existingTable = await Table.findOne({ name });
    if (existingTable) {
      return res.status(400).json({ message: "Table name already exists" });
    }

    if (
      status === "Reserved" &&
      (!currentCustomer ||
        currentCustomer.trim() === "" ||
        currentCustomer === "No Customer")
    ) {
      return res.status(400).json({
        message: "Customer name is required when reserving a table.",
      });
    }

    const table = new Table({
      name,
      seats,
      status,
      currentCustomer,
      reservationTime,
    });
    const createdTable = await table.save();

    res.status(201).json(createdTable);
  } catch (error) {
    console.error("Error creating table:", error);
    res.status(500).json({ message: "Server error creating table" });
  }
};

// @desc    Update a table (e.g., changing status to Occupied)
// @route   PUT /api/tables/:id
// @access  Private (All logged-in staff)
exports.updateTable = async (req, res) => {
  try {
    // Prevent standard staff from reserving tables (Only Cashier/Admin)
    if (req.body.status === "Reserved") {
      if (
        req.user &&
        req.user.role !== "Admin" &&
        req.user.role !== "Cashier"
      ) {
        return res.status(403).json({
          message:
            "Staff cannot reserve tables. Please ask a Cashier or Admin.",
        });
      }

      // Enforce customer name requirement for reservations
      if (
        !req.body.currentCustomer ||
        req.body.currentCustomer.trim() === "" ||
        req.body.currentCustomer === "No Customer"
      ) {
        return res.status(400).json({
          message: "Customer name is required when reserving a table.",
        });
      }
    }

    const updatedTable = await Table.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTable)
      return res.status(404).json({ message: "Table not found" });
    res.status(200).json(updatedTable);
  } catch (error) {
    res.status(500).json({ message: "Server error updating table" });
  }
};

// @desc    Delete a table
// @route   DELETE /api/tables/:id
// @access  Private (Admin/Cashier)
exports.deleteTable = async (req, res) => {
  try {
    const deletedTable = await Table.findByIdAndDelete(req.params.id);
    if (!deletedTable)
      return res.status(404).json({ message: "Table not found" });
    res.status(200).json({ message: "Table removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting table" });
  }
};
