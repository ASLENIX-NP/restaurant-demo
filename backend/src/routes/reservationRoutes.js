const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const { protect, authorize } = require("../middleware/authMiddleware");

// @route   GET /api/reservations
// @access  Private
router.get("/", protect, reservationController.getReservations);

// @route   POST /api/reservations
// @access  Private
router.post("/", protect, reservationController.createReservation);

// @route   PUT /api/reservations/:id
// @access  Private
router.put("/:id", protect, reservationController.updateReservation);

// @route   DELETE /api/reservations/:id
// @access  Private
router.delete("/:id", protect, authorize("Admin", "Staff", "Cashier"), reservationController.deleteReservation);

module.exports = router;
