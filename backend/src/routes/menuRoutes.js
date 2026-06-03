const express = require("express");
const router = express.Router();
const {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/")
  .post(protect, authorize("Admin", "Cashier"), createMenuItem)
  .get(getMenuItems);

router.route("/:id")
  .get(getMenuItemById)
  .put(protect, authorize("Admin", "Cashier"), updateMenuItem)
  .delete(protect, authorize("Admin", "Cashier"), deleteMenuItem);

module.exports = router;
