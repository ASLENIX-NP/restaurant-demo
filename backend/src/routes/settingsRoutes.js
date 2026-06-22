const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const { protect, authorize } = require("../middleware/authMiddleware");

// @route   GET /api/settings
// @desc    Get global settings
// @access  Private (All authenticated users can view settings)
router.get("/", protect, settingsController.getSettings);

// @route   PUT /api/settings
// @desc    Update global settings
// @access  Private (Admin only)
router.put("/", protect, authorize("Admin"), settingsController.updateSettings);

module.exports = router;
