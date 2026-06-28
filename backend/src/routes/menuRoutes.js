const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { menuItemSchema } = require("../validators/menuValidator");

// Public route to view the menu
router.get("/", menuController.getMenuItems);

// Protected routes for Admin/Cashier
router.post(
  "/",
  protect,
  authorize("Admin", "Cashier"),
  validate(menuItemSchema),
  menuController.createMenuItem
);

router.put(
  "/:id",
  protect,
  authorize("Admin", "Cashier"),
  validate(menuItemSchema),
  menuController.updateMenuItem
);
router.delete(
  "/:id",
  protect,
  authorize("Admin", "Cashier"),
  menuController.deleteMenuItem
);

module.exports = router;
