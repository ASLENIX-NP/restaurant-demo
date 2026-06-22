const Shift = require("../models/Shift");

// @desc    Start a new shift
// @route   POST /api/shifts/start
// @access  Private
exports.startShift = async (req, res) => {
  try {
    const { cashierName, startingCash } = req.body;
    
    // Check if there is already an open shift for this cashier
    const existingShift = await Shift.findOne({ cashierName, status: "Open" });
    if (existingShift) {
      return res.status(400).json({ message: "You already have an open shift. Close it first." });
    }

    const shift = new Shift({
      cashierName,
      startingCash,
      startTime: new Date()
    });

    const createdShift = await shift.save();
    res.status(201).json(createdShift);
  } catch (error) {
    console.error("Error starting shift:", error);
    res.status(500).json({ message: "Server error starting shift" });
  }
};

// @desc    Get active shift for a cashier
// @route   GET /api/shifts/active
// @access  Private
exports.getActiveShift = async (req, res) => {
  try {
    const { cashierName } = req.query;
    
    if (!cashierName) {
      return res.status(400).json({ message: "Cashier name is required" });
    }

    const shift = await Shift.findOne({ cashierName, status: "Open" });
    res.status(200).json(shift);
  } catch (error) {
    console.error("Error fetching active shift:", error);
    res.status(500).json({ message: "Server error fetching active shift" });
  }
};

// @desc    End a shift
// @route   PUT /api/shifts/end/:id
// @access  Private
exports.endShift = async (req, res) => {
  try {
    const { actualEndingCash, expectedEndingCash } = req.body;
    
    const shift = await Shift.findById(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    if (shift.status === "Closed") {
      return res.status(400).json({ message: "Shift is already closed" });
    }

    shift.actualEndingCash = actualEndingCash;
    shift.expectedEndingCash = expectedEndingCash;
    shift.endTime = new Date();
    shift.status = "Closed";

    const updatedShift = await shift.save();
    res.status(200).json(updatedShift);
  } catch (error) {
    console.error("Error ending shift:", error);
    res.status(500).json({ message: "Server error ending shift" });
  }
};

// @desc    Update a shift (e.g. add payouts)
// @route   PUT /api/shifts/:id
// @access  Private
exports.updateShift = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    if (req.body.payouts) {
      shift.payouts = req.body.payouts;
    }

    const updatedShift = await shift.save();
    res.status(200).json(updatedShift);
  } catch (error) {
    console.error("Error updating shift:", error);
    res.status(500).json({ message: "Server error updating shift" });
  }
};
