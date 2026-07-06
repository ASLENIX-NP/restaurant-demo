const mongoose = require("mongoose");
const Order = require("../models/Order");
const Table = require("../models/Table");
const Inventory = require("../models/InventoryItem");

const MenuItem = require("../models/MenuItem");
const { createLog } = require("./logController");

// --- INVENTORY AUTOMATION HELPERS ---
const deductInventory = async (items, io, session) => {
  try {
    let updated = false;
    for (const orderItem of items) {
      // Find the menu item to get its ingredients recipe
      const menuItem = await MenuItem.findOne({
        name: { $regex: new RegExp(`^${orderItem.name.trim()}$`, "i") },
      }).session(session);

      if (!menuItem || !menuItem.ingredients || menuItem.ingredients.length === 0) {
        // Fallback to legacy exact-name match if no recipe exists
        await updateInventoryItem(orderItem.name.trim(), -orderItem.qty, io, session);
        updated = true;
        continue;
      }

      // Deduct based on recipe
      for (const ingredient of menuItem.ingredients) {
        const totalDeduction = -(ingredient.qty * orderItem.qty);
        
        let query = {};
        if (ingredient.inventoryItem) {
          query = { _id: ingredient.inventoryItem };
        } else if (ingredient.itemName) {
          query = { name: { $regex: new RegExp(`^${ingredient.itemName.trim()}$`, "i") } };
        } else {
          continue;
        }

        const invItem = await Inventory.findOneAndUpdate(
          query,
          { $inc: { qty: totalDeduction } },
          { new: true, session }
        );

        if (invItem) {
          await evaluateLowStock(invItem, io, session);
          updated = true;
        }
      }
    }
    if (updated && io) io.emit("inventoryUpdated");
  } catch (err) {
    console.error("Inventory deduction error:", err);
  }
};

const restockInventory = async (items, io, session) => {
  try {
    let updated = false;
    for (const orderItem of items) {
      const menuItem = await MenuItem.findOne({
        name: { $regex: new RegExp(`^${orderItem.name.trim()}$`, "i") },
      }).session(session);

      if (!menuItem || !menuItem.ingredients || menuItem.ingredients.length === 0) {
        await updateInventoryItem(orderItem.name.trim(), orderItem.qty, io, session);
        updated = true;
        continue;
      }

      for (const ingredient of menuItem.ingredients) {
        const totalAddition = ingredient.qty * orderItem.qty;
        
        let query = {};
        if (ingredient.inventoryItem) {
          query = { _id: ingredient.inventoryItem };
        } else if (ingredient.itemName) {
          query = { name: { $regex: new RegExp(`^${ingredient.itemName.trim()}$`, "i") } };
        } else {
          continue;
        }

        const invItem = await Inventory.findOneAndUpdate(
          query,
          { $inc: { qty: totalAddition } },
          { new: true, session }
        );

        if (invItem) {
          await evaluateLowStock(invItem, io, session);
          updated = true;
        }
      }
    }
    if (updated && io) io.emit("inventoryUpdated");
  } catch (err) {
    console.error("Inventory restock error:", err);
  }
};

const updateInventoryItem = async (itemName, changeQty, io, session) => {
  const invItem = await Inventory.findOneAndUpdate(
    { name: { $regex: new RegExp(`^${itemName}$`, "i") } },
    { $inc: { qty: changeQty } },
    { new: true, session }
  );
  if (invItem) {
    await evaluateLowStock(invItem, io, session);
  }
};

const evaluateLowStock = async (invItem, io, session) => {
  let newStatus = "In Stock";
  if (invItem.qty <= 0) {
    if (invItem.qty < 0) {
      await Inventory.updateOne({ _id: invItem._id }, { $set: { qty: 0 } }, { session });
    }
    newStatus = "Out of Stock";
  } else if (invItem.qty <= 10) { // 10% or fixed 10 units threshold
    newStatus = "Low Stock";
    if (io) {
      io.emit("lowStockAlert", {
        itemName: invItem.name,
        qty: invItem.qty,
        message: `Alert: ${invItem.name} stock has dropped to ${invItem.qty}!`,
      });
    }
  }

  if (invItem.status !== newStatus) {
    await Inventory.updateOne({ _id: invItem._id }, { $set: { status: newStatus } }, { session });
  }
};

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
      dbQuery.status = { $nin: ["Completed", "Served", "Cancelled"] };
    }

    // Support optional frontend query filters (e.g., /api/orders?status=Pending)
    if (req.query.status && req.query.status !== "All") {
      dbQuery.status = req.query.status;
    }

    // 2. Pagination Logic
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    // 3. Execute query with pagination
    const totalOrders = await Order.countDocuments(dbQuery);
    const orders = await Order.find(dbQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(totalOrders / limit);
    const paginationMeta = { totalOrders, totalPages, currentPage: page, limit };

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
          cashier: order.cashier,
          chef: order.chef,
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

      return res.status(200).json({ data: chefOrders, ...paginationMeta });
    }

    // If the user is a Cashier, return full financial details needed for billing
    if (req.user.role === "Cashier") {
      const cashierOrders = orders.map((order) => ({
        _id: order._id,
        id: order.id,
        table: order.table,
        customer: order.customer,
        server: order.server,
        cashier: order.cashier,
        chef: order.chef,
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
      return res.status(200).json({ data: cashierOrders, ...paginationMeta });
    }

    // If the user is a Staff member, they should only see active orders, not payment history
    if (req.user.role === "Staff") {
      return res.status(200).json({ data: orders, ...paginationMeta });
    }

    // Admin gets the fully unedited order details (including completed payment history)
    res.status(200).json({ data: orders, ...paginationMeta });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  let retries = 3;
  while (retries > 0) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Staff don't ask for customer name, so default it to "Guest"
      req.body.customer = req.body.customer || "Guest";

      // Automatically mark who took the order based on the logged-in user
      if (req.user && req.user.name) {
        req.body.server = req.user.name;
      } else {
        req.body.server = "System";
      }

      // 1. Check Table Availability BEFORE creating the order
      if (
        req.body.table &&
        req.body.table.trim() !== "Walk-in" &&
        req.body.table.trim() !== "Queue"
      ) {
        const targetTable = await Table.findOne({
          name: { $regex: new RegExp(`^${req.body.table.trim()}$`, "i") },
        }).session(session);

        if (!targetTable) {
          await session.abortTransaction();
          session.endSession();
          return res.status(404).json({
            message: `Table '${req.body.table}' not found. Please check the table name.`,
          });
        }

        if (targetTable.status === "Occupied") {
          // 🚀 MERGE LOGIC: Instead of rejecting, find the active order and append the new items!
          const activeOrder = await Order.findOne({
            table: { $regex: new RegExp(`^${req.body.table.trim()}$`, "i") },
            status: { $nin: ["Completed", "Cancelled"] },
          }).session(session);

          if (activeOrder) {
            // Append new items and calculate the new combined totals
            activeOrder.items.push(...(req.body.items || []));
            activeOrder.total = (activeOrder.total || 0) + (req.body.total || 0);
            if (activeOrder.amount !== undefined)
              activeOrder.amount = activeOrder.total;

            // Bump status back to Pending so the kitchen sees the new items
            activeOrder.status = "Pending";

            const updatedOrder = await activeOrder.save({ session });

            // Deduct inventory for the newly appended items (pass null for io to defer emission)
            await deductInventory(req.body.items || [], null, session);

            await session.commitTransaction();
            session.endSession();

            // 📢 Broadcast to all clients that an existing order was updated
            if (req.io) {
              req.io.emit("orderUpdated", updatedOrder);
              req.io.emit("inventoryUpdated");
            }

            return res.status(200).json(updatedOrder);
          }
        }
      }

      // 2. Fetch True Prices from Database to Prevent Tampering
      const MenuItem = require("../models/MenuItem"); // Ensure MenuItem is required
      let safeTotal = 0;
      const sanitizedItems = [];

      if (req.body.items && req.body.items.length > 0) {
        for (const item of req.body.items) {
          // Find the official menu item to get its true price
          const officialItem = await MenuItem.findOne({
            name: { $regex: new RegExp(`^${item.name.trim()}$`, "i") },
          }).session(session);

          const safePrice = officialItem ? officialItem.price : 0;
          const safeQty = Math.max(1, parseInt(item.qty, 10) || 1); // Prevent negative or zero quantities

          safeTotal += safePrice * safeQty;

          sanitizedItems.push({
            ...item,
            qty: safeQty,
            price: safePrice, // Force the real price onto the order item
          });
        }
      }

      req.body.items = sanitizedItems;
      req.body.total = safeTotal;
      req.body.amount = safeTotal;

      // 3. Automatically generate a sequential Order ID (e.g., #ORD-0001)
      // We do this here so the frontend (or Postman) never has to provide one manually.
      const lastOrder = await Order.findOne().sort({ createdAt: -1 }).session(session);
      let nextSeq = 1;
      if (lastOrder && lastOrder.id && lastOrder.id.startsWith("#ORD-")) {
        const lastSeq = parseInt(lastOrder.id.replace("#ORD-", ""), 10);
        if (!isNaN(lastSeq)) {
          nextSeq = lastSeq + 1;
        }
      }
      req.body.id = `#ORD-${nextSeq.toString().padStart(4, "0")}`;

      // 4. Automatically generate the server-side timestamp, date, and time
      const now = new Date();
      req.body.timestamp = now;
      req.body.date = now.toISOString().split("T")[0];
      req.body.time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const order = new Order(req.body);
      const createdOrder = await order.save({ session });

      // Deduct inventory for the new order items
      await deductInventory(req.body.items || [], null, session);

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
          { new: true, session }
        );

        if (!updatedTable) {
          console.warn(
            `[Warning] Could not find table matching '${order.table}' to mark as Occupied. Check for typos in Postman!`
          );
        }
      }

      await session.commitTransaction();
      session.endSession();

      // 📢 Broadcast to all clients (like the Kitchen screen) that a brand new order arrived!
      if (req.io) {
        req.io.emit("newOrder", createdOrder);
        req.io.emit("inventoryUpdated");
      }

      return res.status(201).json(createdOrder);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (error.hasErrorLabel && error.hasErrorLabel("TransientTransactionError") && retries > 1) {
        retries--;
        console.warn(`TransientTransactionError in createOrder, retrying... (${retries} retries left)`);
        continue;
      }
      console.error("Error creating order:", error);
      return res
        .status(500)
        .json({ message: "Server error creating order", error: error.message });
    }
  }
};

// @desc    Update order status (Kitchen/Staff: Pending -> Cooking -> Ready -> Served)
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Security Check: Only Admin, Cashier, and Staff can mark an order as "Completed"
    if (status === "Completed") {
      if (req.user.role !== "Admin" && req.user.role !== "Cashier" && req.user.role !== "Staff") {
        return res.status(403).json({ message: "Only Cashier, Staff, and Admin can complete orders." });
      }
    }

    // Support querying by either MongoDB _id or custom string id (e.g., #ORD-1234)
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { id: req.params.id };

    const updateFields = { status };
    if (req.user && req.user.role === "Chef") {
      updateFields.chef = req.user.name;
    }

    const updatedOrder = await Order.findOneAndUpdate(
      query,
      updateFields,
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
      const subtotal = (existingOrder.items || []).reduce(
        (sum, item) => sum + item.qty * (item.price || 0),
        0
      );
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
        cashier: req.user && req.user.name ? req.user.name : "System",
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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Support querying by either MongoDB _id or custom string id
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { id: req.params.id };

    const cancelledOrder = await Order.findOneAndUpdate(
      query,
      { status: "Cancelled" },
      { new: true, session }
    );
    if (!cancelledOrder)
      return res.status(404).json({ message: "Order not found" });

    // Restock inventory for the cancelled items
    await restockInventory(cancelledOrder.items || [], null, session);

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
        { new: true, session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    // 📢 Broadcast cancellation
    if (req.io) {
      req.io.emit("orderCancelled", cancelledOrder);
      req.io.emit("inventoryUpdated");
    }

    createLog({
      user: req.user.username,
      role: req.user.role,
      action: `Cancelled Order: ${cancelledOrder.id || cancelledOrder._id}`,
      device: req.headers["user-agent"],
      ip: req.ip,
      status: "Success",
    });

    res.status(200).json(cancelledOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server error cancelling order", error: error.message });
  }
};
