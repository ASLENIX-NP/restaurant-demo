const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Get all orders and create new orders (Available to all logged-in staff)
router.get("/", protect, orderController.getOrders);
router.post("/", protect, orderController.createOrder);

// Update kitchen/serving status (Pending -> Cooking -> Ready -> Served)
router.put("/:id/status", protect, orderController.updateOrderStatus);

// Cancel an order (Mistakes, voids, etc.)
router.put("/:id/cancel", protect, orderController.cancelOrder);

// Complete/Checkout an order (Restricted to Cashier, Staff, and Admin)
router.put(
  "/:id/complete",
  protect,
  authorize("Admin", "Cashier", "Staff"),
  orderController.completeOrder
);

module.exports = router;
