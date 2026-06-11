const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, inventoryController.getItems);
router.get("/logs", protect, inventoryController.getLogs);

router.post("/", protect, authorize("Admin"), inventoryController.createItem);
router.put(
  "/:code",
  protect,
  authorize("Admin"),
  inventoryController.updateItem
);
router.delete(
  "/:code",
  protect,
  authorize("Admin"),
  inventoryController.deleteItem
);
router.put(
  "/:code/adjust",
  protect,
  authorize("Admin", "Chef", "Cashier"),
  inventoryController.adjustStock
);

module.exports = router;
