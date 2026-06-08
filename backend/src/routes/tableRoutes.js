const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Any logged-in user can view tables
router.get("/", protect, tableController.getTables);

// Any logged-in user can update table status (restrictions handled in controller)
router.put("/:id", protect, tableController.updateTable);

// Only Admins and Cashiers can create and delete physical tables from the layout
router.post(
  "/",
  protect,
  authorize("Admin", "Cashier"),
  tableController.createTable
);
router.delete(
  "/:id",
  protect,
  authorize("Admin", "Cashier"),
  tableController.deleteTable
);

module.exports = router;
