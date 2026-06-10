const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Only Admins and Cashiers should be able to see financial reports
router.get(
  "/dashboard",
  protect,
  authorize("Admin", "Cashier"),
  reportController.getDashboardStats
);

module.exports = router;
