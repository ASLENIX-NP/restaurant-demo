const Reservation = require("../models/Reservation");
const Table = require("../models/Table");

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Server error fetching reservations" });
  }
};

// @desc    Create a reservation
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res) => {
  try {
    // Generate sequential ID
    const lastRes = await Reservation.findOne().sort({ createdAt: -1 });
    let nextSeq = 1;
    if (lastRes && lastRes.id && lastRes.id.startsWith("#RES-")) {
      const lastSeq = parseInt(lastRes.id.replace("#RES-", ""), 10);
      if (!isNaN(lastSeq)) {
        nextSeq = lastSeq + 1;
      }
    }
    req.body.id = `#RES-${nextSeq.toString().padStart(4, "0")}`;

    const reservation = new Reservation(req.body);
    const createdReservation = await reservation.save();

    if (req.io) req.io.emit("reservationUpdated");

    res.status(201).json(createdReservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: "Server error creating reservation", error: error.message });
  }
};

// @desc    Update a reservation
// @route   PUT /api/reservations/:id
// @access  Private
exports.updateReservation = async (req, res) => {
  try {
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { id: req.params.id };

    const updatedReservation = await Reservation.findOneAndUpdate(
      query,
      req.body,
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (
      updatedReservation.status === "Completed" ||
      updatedReservation.status === "Cancelled"
    ) {
      if (
        updatedReservation.table &&
        updatedReservation.table !== "Unassigned"
      ) {
        // Attempt to find the table by name and update it
        const updatedTable = await Table.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${updatedReservation.table}$`, "i") } },
          { status: "Available", currentCustomer: "No Customer", reservationTime: null },
          { new: true }
        );
        
        // Also emit tablesUpdated so frontends refresh their table grids
        if (updatedTable && req.io) {
          req.io.emit("tablesUpdated");
        }
      }
    }

    if (req.io) req.io.emit("reservationUpdated");

    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ message: "Server error updating reservation" });
  }
};

// @desc    Delete a reservation
// @route   DELETE /api/reservations/:id
// @access  Private
exports.deleteReservation = async (req, res) => {
  try {
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { id: req.params.id };

    const deleted = await Reservation.findOneAndDelete(query);

    if (!deleted) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (req.io) req.io.emit("reservationUpdated");

    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ message: "Server error deleting reservation" });
  }
};
