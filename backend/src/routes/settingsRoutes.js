const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const { protect, authorize } = require("../middleware/authMiddleware");
const multer = require("multer");

// Configure multer for file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// @route   GET /api/settings
// @desc    Get global settings
// @access  Private (All authenticated users can view settings)
router.get("/", protect, settingsController.getSettings);

// @route   PUT /api/settings
// @desc    Update global settings
// @access  Private (Admin only)
router.put("/", protect, authorize("Admin"), settingsController.updateSettings);

// @route   GET /api/settings/backup
// @desc    Download full database backup as JSON
// @access  Private (Admin only)
router.get("/backup", protect, authorize("Admin"), settingsController.backupDatabase);

// @route   POST /api/settings/restore
// @desc    Upload JSON file to fully restore database
// @access  Private (Admin only)
router.post("/restore", protect, authorize("Admin"), upload.single("file"), settingsController.restoreDatabase);

// @route   GET /api/settings/export-csv
// @desc    Export menu items to CSV
// @access  Private (Admin only)
router.get("/export-csv", protect, authorize("Admin"), settingsController.exportCSV);

// @route   POST /api/settings/import-csv
// @desc    Upload CSV file to bulk import menu items
// @access  Private (Admin only)
router.post("/import-csv", protect, authorize("Admin"), upload.single("file"), settingsController.importCSV);

module.exports = router;
