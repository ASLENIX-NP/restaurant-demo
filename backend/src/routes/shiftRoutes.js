const express = require("express");
const router = express.Router();
const shiftController = require("../controllers/shiftController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/shifts/start
// @access  Private
router.post("/start", protect, shiftController.startShift);

// @route   GET /api/shifts/active
// @access  Private
router.get("/active", protect, shiftController.getActiveShift);

// @route   PUT /api/shifts/end/:id
// @access  Private
router.put("/end/:id", protect, shiftController.endShift);

// @route   PUT /api/shifts/:id
// @access  Private
router.put("/:id", protect, shiftController.updateShift);

module.exports = router;
