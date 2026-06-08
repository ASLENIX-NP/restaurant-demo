const Order = require("../models/Order");
const Table = require("../models/Table");

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    // Use .lean() to get plain JavaScript objects for easier manipulation
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

    // Safety check: ensure the protect middleware is actually providing req.user
    if (!req.user) {
      return res.status(401).json({
        message:
          "Not authorized. Make sure 'protect' middleware is used in orderRoutes.js for this GET request.",
      });
    }

    // If the user requesting the orders is a Chef, strip out pricing details, filter, and sort
    if (req.user.role === "Chef") {
      // Filter out completed/served orders so the kitchen only gets active queue
      let chefOrders = orders.filter(
        (order) => order.status !== "Completed" && order.status !== "Served"
      );

      chefOrders = chefOrders.map((order) => {
        const elapsedMinutes = order.createdAt
          ? Math.floor((new Date() - new Date(order.createdAt)) / 60000)
          : 0;

        return {
          _id: order._id,
          id: order.id,
          table: order.table,
          server: order.server,
          status: order.status,
          time: order.time,
          date: order.date,
          notes: order.notes,
          channel: order.channel || "System",
          priority: order.priority || "Normal",
          timestamp: order.createdAt || new Date(),
          elapsedMinutes:
            order.elapsedMinutes !== undefined
              ? order.elapsedMinutes
              : elapsedMinutes,
          items: order.items
            ? order.items.map((item) => ({
                name: item.name,
                qty: item.qty,
                category: item.category || "General",
                station: item.station || "All Stations",
              }))
            : [],
        };
      });

      // Sort exactly like frontend: "Ready" items at the bottom, otherwise First-Come-First-Serve (oldest first)
      chefOrders.sort((a, b) => {
        if (a.status === "Ready" && b.status !== "Ready") return 1;
        if (a.status !== "Ready" && b.status === "Ready") return -1;

        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return timeA - timeB;
      });

      return res.status(200).json(chefOrders);
    }

    // If the user is a Cashier, return full financial details needed for billing
    if (req.user.role === "Cashier") {
      const cashierOrders = orders.map((order) => ({
        _id: order._id,
        id: order.id,
        table: order.table,
        customer: order.customer,
        total: order.total,
        status: order.status,
        time: order.time,
        items: order.items, // Keeps item prices intact
      }));
      return res.status(200).json(cashierOrders);
    }

    // If the user is a Staff member, they should only see active orders, not payment history
    if (req.user.role === "Staff") {
      const staffOrders = orders.filter(
        (order) => order.status !== "Completed"
      );
      return res.status(200).json(staffOrders);
    }

    // Admin gets the fully unedited order details (including completed payment history)
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    // Staff don't ask for customer name, so default it to "Guest"
    req.body.customer = "Guest";

    const order = new Order(req.body);
    const createdOrder = await order.save();

    // Automatically mark the table as Occupied if a specific table is assigned
    if (
      order.table &&
      order.table.trim() !== "Walk-in" &&
      order.table.trim() !== "Queue"
    ) {
      const updateData = { status: "Occupied" };

      const updatedTable = await Table.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${order.table.trim()}$`, "i") } }, // Case-insensitive match
        updateData,
        { new: true }
      );

      if (!updatedTable) {
        console.warn(
          `[Warning] Could not find table matching '${order.table}' to mark as Occupied. Check for typos in Postman!`
        );
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Server error creating order", error: error.message });
  }
};

// @desc    Update order status (Kitchen/Staff: Pending -> Cooking -> Ready -> Served)
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Support querying by either MongoDB _id or custom string id (e.g., #ORD-1234)
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { id: req.params.id };

    const updatedOrder = await Order.findOneAndUpdate(
      query,
      { status },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error updating order status" });
  }
};

// @desc    Complete an order (Checkout)
// @route   PUT /api/orders/:id/complete
// @access  Private (Cashier/Admin)
exports.completeOrder = async (req, res) => {
  try {
    const finalDetails = req.body; // e.g., paymentMethod, amount, discount, etc.

    // Support querying by either MongoDB _id or custom string id
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { id: req.params.id };

    const updatedOrder = await Order.findOneAndUpdate(
      query,
      { ...finalDetails, status: "Completed" },
      { new: true }
    );
    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    // Free up the table since the customer has checked out
    if (
      updatedOrder.table &&
      updatedOrder.table.trim() !== "Walk-in" &&
      updatedOrder.table.trim() !== "Queue"
    ) {
      await Table.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${updatedOrder.table.trim()}$`, "i") } }, // Case-insensitive match
        { status: "Available", currentCustomer: "No Customer" },
        { new: true }
      );
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error completing order" });
  }
};

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    // Support querying by either MongoDB _id or custom string id
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { id: req.params.id };

    const cancelledOrder = await Order.findOneAndUpdate(
      query,
      { status: "Cancelled" },
      { new: true }
    );
    if (!cancelledOrder)
      return res.status(404).json({ message: "Order not found" });
    res.status(200).json(cancelledOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error cancelling order" });
  }
};
