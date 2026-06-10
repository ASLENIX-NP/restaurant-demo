const Order = require("../models/Order");

// @desc    Get dashboard statistics (Revenue, Orders, Payment Methods)
// @route   GET /api/reports/dashboard
// @access  Private (Admin/Cashier)
exports.getDashboardStats = async (req, res) => {
  try {
    // Get today's start and end dates for filtering
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 1. Calculate Overall Revenue & Averages (All Time vs Today)
    const salesStats = await Order.aggregate([
      { $match: { status: "Completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$paidAmount" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$paidAmount" },
        },
      },
    ]);

    const todayStats = await Order.aggregate([
      {
        $match: {
          status: "Completed",
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          todayRevenue: { $sum: "$paidAmount" },
          todayOrders: { $sum: 1 },
        },
      },
    ]);

    // 2. Calculate Revenue split by Payment Method
    const paymentMethods = await Order.aggregate([
      { $match: { status: "Completed" } },
      {
        $group: {
          _id: "$paymentMethod",
          total: { $sum: "$paidAmount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // 3. Top 5 Most Popular Menu Items
    const popularItems = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalSold: { $sum: "$items.qty" },
          revenueGenerated: {
            $sum: { $multiply: ["$items.qty", "$items.price"] },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    const summary = {
      overall: salesStats[0] || {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
      },
      today: todayStats[0] || { todayRevenue: 0, todayOrders: 0 },
      paymentSplit: paymentMethods.map((p) => ({
        method: p._id || "Unknown",
        amount: p.total,
        count: p.count,
      })),
      topItems: popularItems.map((item) => ({
        name: item._id,
        sold: item.totalSold,
        revenue: item.revenueGenerated,
      })),
    };

    res.status(200).json(summary);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Server error generating report" });
  }
};
