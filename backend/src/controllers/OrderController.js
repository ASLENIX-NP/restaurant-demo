const Order = require("../models/Order");
const Table = require("../models/Table");

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    // Safety check: ensure the protect middleware is actually providing req.user
    if (!req.user) {
      return res.status(401).json({
        message:
          "Not authorized. Make sure 'protect' middleware is used in orderRoutes.js for this GET request.",
      });
    }

    // 1. Database-Level Filtering (Memory Optimization)
    // Let MongoDB filter the data instead of loading everything into Node.js RAM
    let dbQuery = {};
    if (req.user.role === "Chef") {
      dbQuery.status = { $nin: ["Completed", "Served"] };
    } else if (req.user.role === "Staff") {
      dbQuery.status = { $ne: "Completed" };
    }

    // Support optional frontend query filters (e.g., /api/orders?status=Pending)
    if (req.query.status && req.query.status !== "All") {
      dbQuery.status = req.query.status;
    }

    // Use .lean() to get plain JavaScript objects for easier manipulation
    const orders = await Order.find(dbQuery).sort({ createdAt: -1 }).lean();

    // If the user requesting the orders is a Chef, strip out pricing details, filter, and sort
    if (req.user.role === "Chef") {
      const chefOrders = orders.map((order) => {
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
        date: order.date,
        items: order.items, // Keeps item prices intact
        amount: order.amount,
        paymentMethod: order.paymentMethod,
        discountAmount: order.discountAmount,
        serviceCharge: order.serviceCharge,
      }));
      return res.status(200).json(cashierOrders);
    }

    // If the user is a Staff member, they should only see active orders, not payment history
    if (req.user.role === "Staff") {
      return res.status(200).json(orders);
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

    // 1. Check Table Availability BEFORE creating the order
    if (
      req.body.table &&
      req.body.table.trim() !== "Walk-in" &&
      req.body.table.trim() !== "Queue"
    ) {
      const targetTable = await Table.findOne({
        name: { $regex: new RegExp(`^${req.body.table.trim()}$`, "i") },
      });

      if (!targetTable) {
        return res.status(404).json({
          message: `Table '${req.body.table}' not found. Please check the table name.`,
        });
      }

      if (targetTable.status === "Occupied") {
        // 🚀 MERGE LOGIC: Instead of rejecting, find the active order and append the new items!
        const activeOrder = await Order.findOne({
          table: { $regex: new RegExp(`^${req.body.table.trim()}$`, "i") },
          status: { $nin: ["Completed", "Cancelled"] },
        });

        if (activeOrder) {
          // Append new items and calculate the new combined totals
          activeOrder.items.push(...(req.body.items || []));
          activeOrder.total = (activeOrder.total || 0) + (req.body.total || 0);
          if (activeOrder.amount !== undefined)
            activeOrder.amount = activeOrder.total;

          // Bump status back to Pending so the kitchen sees the new items
          activeOrder.status = "Pending";

          const updatedOrder = await activeOrder.save();

          // 📢 Broadcast to all clients that an existing order was updated
          if (req.io) req.io.emit("orderUpdated", updatedOrder);

          return res.status(200).json(updatedOrder);
        }
      }
    }

    // 2. Automatically generate a sequential Order ID (e.g., #ORD-0001)
    // We do this here so the frontend (or Postman) never has to provide one manually.
    const lastOrder = await Order.findOne().sort({ createdAt: -1 });
    let nextSeq = 1;
    if (lastOrder && lastOrder.id && lastOrder.id.startsWith("#ORD-")) {
      const lastSeq = parseInt(lastOrder.id.replace("#ORD-", ""), 10);
      if (!isNaN(lastSeq)) {
        nextSeq = lastSeq + 1;
      }
    }
    req.body.id = `#ORD-${nextSeq.toString().padStart(4, "0")}`;

    // 3. Automatically generate the server-side timestamp, date, and time
    const now = new Date();
    req.body.timestamp = now;
    req.body.date = now.toISOString().split("T")[0];
    req.body.time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const order = new Order(req.body);
    const createdOrder = await order.save();

    // Automatically mark the table as Occupied if a specific table is assigned
    if (
      order.table &&
      order.table.trim() !== "Walk-in" &&
      order.table.trim() !== "Queue"
    ) {
      const updateData = {
        status: "Occupied",
        currentCustomer: order.customer,
      };

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

    // 📢 Broadcast to all clients (like the Kitchen screen) that a brand new order arrived!
    if (req.io) req.io.emit("newOrder", createdOrder);

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

    // 📢 Broadcast to all clients that an order status changed (Kitchen -> Waiter)
    if (req.io) req.io.emit("orderStatusUpdated", updatedOrder);

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
    // Secure checkout: Extract only financial fields to prevent object injection
    const { paymentMethod, discountAmount, serviceCharge, amount } = req.body;

    // Support querying by either MongoDB _id or custom string id
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { id: req.params.id };

    const existingOrder = await Order.findOne(query);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If the frontend forgot to send the amount, automatically calculate it here
    let finalAmount = amount;
    if (!finalAmount) {
      const subtotal = (existingOrder.items || []).reduce((sum, item) => sum + item.qty * (item.price || 0), 0);
      finalAmount = subtotal + (subtotal > 0 ? 50 : 0);
    }

    const updatedOrder = await Order.findOneAndUpdate(
      query,
      {
        paymentMethod: paymentMethod || "Cash",
        discountAmount: discountAmount || 0,
        serviceCharge: serviceCharge || 0,
        amount: finalAmount,
        status: "Completed",
      },
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

    // 📢 Broadcast that an order is complete (removes it from Kitchen/Staff screens)
    if (req.io) req.io.emit("orderCompleted", updatedOrder);

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

    // Free up the table since the order was cancelled
    if (
      cancelledOrder.table &&
      cancelledOrder.table.trim() !== "Walk-in" &&
      cancelledOrder.table.trim() !== "Queue"
    ) {
      await Table.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${cancelledOrder.table.trim()}$`, "i") },
        }, // Case-insensitive match
        { status: "Available", currentCustomer: "No Customer" },
        { new: true }
      );
    }

    // 📢 Broadcast cancellation
    if (req.io) req.io.emit("orderCancelled", cancelledOrder);

    res.status(200).json(cancelledOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error cancelling order" });
  }
};
