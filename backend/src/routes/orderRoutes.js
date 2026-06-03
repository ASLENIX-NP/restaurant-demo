const express = require("express");
const router = express.Router();

// GET all orders
router.get("/", (req, res) => {
  res.status(200).json([]);
});

// POST new order
router.post("/", (req, res) => {
  res.status(201).json({ message: "Order created successfully" });
});

module.exports = router;
