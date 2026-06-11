import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  ChevronRight,
  Calendar,
  AlertTriangle,
  Star,
  CreditCard,
  Layers,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../../context/OrderContext";
import { useTables } from "../../context/TableContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { orders = [], fetchOrders } = useOrders() || {};
  const { tables = [], fetchTables } = useTables() || {};
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fetchOrders) fetchOrders();
    if (fetchTables) fetchTables();
  }, [fetchOrders, fetchTables]);

  const reservedCount = tables.filter(
    (t) => (t.status || "").toLowerCase() === "reserved"
  ).length;
  const pendingPaymentsCount = orders.filter(
    (o) => o.status !== "Completed" && o.status !== "Cancelled"
  ).length;

  useEffect(() => {
    // Consider loading complete once both orders and tables have been fetched (even if empty)
    // A more robust solution might involve a loading state in the contexts themselves.
    if (orders && tables) {
      // A small delay can help ensure containers are sized before charts render
      setTimeout(() => setLoading(false), 200);
    }
  }, [orders, tables]);

  const completedSales = orders.filter((order) => order.status === "Completed");

  const totalRevenue = completedSales.reduce((acc, order) => {
    const subtotal = (order.items || []).reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );
    return acc + (order.amount || subtotal + (subtotal > 0 ? 50 : 0));
  }, 0);

  const totalOrders = orders.length;
  const totalCustomers = new Set(orders.map((o) => o.customer || "Guest")).size;
  const avgOrderValue =
    completedSales.length > 0 ? totalRevenue / completedSales.length : 0;

  const dineInCount = orders.filter(
    (o) => o.channel === "Dine In" || o.channel === "Dining"
  ).length;
  const takeawayCount = orders.filter((o) => o.channel === "Takeaway").length;
  const deliveryCount = orders.filter((o) => o.channel === "Delivery").length;

  const orderDistributionData = [
    { name: "Dine In", value: dineInCount, color: "#6366f1" },
    { name: "Takeaway", value: takeawayCount, color: "#f97316" },
    { name: "Delivery", value: deliveryCount, color: "#10b981" },
  ];

  const itemsMap = {};
  completedSales.forEach((order) => {
    (order.items || []).forEach((item) => {
      if (!itemsMap[item.name]) {
        itemsMap[item.name] = {
          name: item.name,
          image:
            item.image ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80",
          qty: 0,
          revenue: 0,
        };
      }
      itemsMap[item.name].qty += item.qty;
      itemsMap[item.name].revenue += item.qty * (parseFloat(item.price) || 0);
    });
  });

  const topItems = Object.values(itemsMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5)
    .map((item) => ({
      ...item,
      revenue: `Rs. ${item.revenue.toLocaleString()}`,
    }));

  const recentOrders = [...orders].slice(0, 5).map((o) => {
    const subtotal = (o.items || []).reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );
    const amount = o.amount || subtotal + (subtotal > 0 ? 50 : 0);
    return {
      id: o.id,
      customer: o.customer || "Guest",
      amount: `Rs. ${amount.toLocaleString()}`,
      status: o.status,
    };
  });

  // Dynamic Revenue Trend Data (Last 7 Days)
  const revenueTrendData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    revenueTrendData.push({
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      fullDate: d.toLocaleDateString(),
      revenue: 0,
    });
  }

  completedSales.forEach((order) => {
    const orderDate = new Date(
      order.timestamp || order.date
    ).toLocaleDateString();
    const dayData = revenueTrendData.find((d) => d.fullDate === orderDate);
    if (dayData) {
      const subtotal = (order.items || []).reduce(
        (sum, item) => sum + item.qty * (parseFloat(item.price) || 0),
        0
      );
      dayData.revenue += order.amount || subtotal + (subtotal > 0 ? 50 : 0);
    }
  });

  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
        <p className="font-semibold">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto">
        {/* TOP SECTION: PAGE HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
              Welcome back, Admin! 👋
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Here's what's happening in your restaurant today.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-4 py-2.5 rounded-xl shadow-sm text-slate-600 font-medium text-sm">
            <Calendar size={16} className="text-purple-500" />
            <span>
              {startOfMonth} - {endOfMonth}
            </span>
          </div>
        </div>

        {/* METRICS SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            {
              title: "Total Revenue",
              value: `Rs. ${totalRevenue.toLocaleString()}`,
              change: "0% this month",
              icon: <DollarSign size={22} />,
              color: "bg-purple-50 text-purple-600 border-purple-100/50",
            },
            {
              title: "Total Orders",
              value: totalOrders,
              change: "0% this month",
              icon: <ShoppingBag size={22} />,
              color: "bg-blue-50 text-blue-600 border-blue-100/50",
            },
            {
              title: "Customers",
              value: totalCustomers,
              change: "0% this month",
              icon: <Users size={22} />,
              color: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
            },
            {
              title: "Avg Order Value",
              value: `Rs. ${avgOrderValue.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}`,
              change: "0% this month",
              icon: <TrendingUp size={22} />,
              color: "bg-orange-50 text-orange-600 border-orange-100/50",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start justify-between transition hover:shadow-md"
            >
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  {card.title}
                </p>
                <h2 className="text-[26px] font-extrabold text-slate-900 mt-1.5 tracking-tight">
                  {card.value}
                </h2>
                <p className="text-emerald-500 text-xs font-semibold mt-1 flex items-center gap-0.5">
                  {card.change}
                </p>
              </div>
              <div className={`p-3.5 rounded-xl border ${card.color}`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* HIGH-PERFORMANCE DATA VISUALIZATION GRAPH GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* INTERACTIVE AREA CHART: REVENUE TRACKING */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[420px]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Revenue Overview
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Weekly breakdown total gross revenue run-rate
                </p>
              </div>
              <button className="bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition">
                By Day
              </button>
            </div>

            <div className="flex-1 w-full text-xs min-h-[250px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={1}
                minHeight={1}
              >
                <AreaChart
                  data={revenueTrendData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `Rs.${v / 1000}k`}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                    }}
                    formatter={(value) => [
                      `Rs. ${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DOUGHNUT PIE CHART: ORDER FULFILLMENT BREAKDOWN */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[420px]">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Orders Overview
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Distribution by channel types
              </p>
            </div>

            <div className="flex-1 w-full h-[220px] relative my-2">
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={1}
                minHeight={1}
              >
                <PieChart>
                  <Pie
                    data={orderDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Orders`]} />
                </PieChart>
              </ResponsiveContainer>

              {/* Absoluted Core Total Aggregate Visual Node */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transform translate-y-[-4px]">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total
                </span>
                <span className="text-2xl font-black text-slate-800">
                  {totalOrders}
                </span>
              </div>
            </div>

            {/* Micro-Badges Component List Grid Layout */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600 mt-2">
              {orderDistributionData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 border border-slate-50 p-2 rounded-xl bg-slate-50/50"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full block shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LOWER DATA MATRIX SECTION GRID CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT AREA PANEL: TOP SELLING ITEMS GRID SECTION */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">
                Top Selling Items
              </h2>
              <button
                onClick={() => navigate("/admin/reports")}
                className="text-purple-600 hover:text-purple-700 font-bold text-xs transition"
              >
                View All
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-3 pl-4">Item</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right pr-4">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {topItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="p-4 text-center text-slate-400 text-xs"
                      >
                        No items sold yet.
                      </td>
                    </tr>
                  ) : (
                    topItems.map((item) => (
                      <tr
                        key={item.name}
                        className="hover:bg-slate-50/40 transition-colors"
                      >
                        <td className="p-3 pl-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-9 h-9 object-cover rounded-lg border border-slate-100"
                            />
                            <span className="font-semibold text-slate-900 shrink-0">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-center text-slate-500">
                          {item.qty}
                        </td>
                        <td className="p-3 text-right pr-4 text-slate-900 font-bold">
                          {item.revenue}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* CENTER AREA PANEL: RECENT CUSTOMER LIVE DISPATCH MATRICES */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">
                Recent Orders
              </h2>
              <button
                onClick={() => navigate("/admin/orders")}
                className="text-purple-600 hover:text-purple-700 font-bold text-xs transition"
              >
                View All
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-3.5 pl-4">Order ID</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5 text-right pr-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-4 text-center text-slate-400 text-xs"
                      >
                        No recent orders found.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-slate-50/40 transition-colors"
                      >
                        <td className="p-3.5 pl-4 font-bold text-purple-600">
                          {order.id}
                        </td>
                        <td className="p-3.5 text-slate-900 font-semibold">
                          {order.customer}
                        </td>
                        <td className="p-3.5 text-slate-600 font-medium">
                          {order.amount}
                        </td>
                        <td className="p-3.5 text-right pr-4">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-block ${
                              order.status === "Completed"
                                ? "bg-emerald-50 text-emerald-600"
                                : order.status === "Preparing"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT AREA PANEL: LIVE OPERATIONAL ACTION REMINDERS BLOCK */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Layers size={18} className="text-purple-500" /> Reminders
            </h2>

            <div className="space-y-2.5">
              {[
                {
                  label: "Upcoming Reservations",
                  icon: <Calendar size={15} />,
                  color: "bg-purple-50 text-purple-600 border-purple-100",
                  action: () => navigate("/admin/tables"),
                  count: reservedCount > 0 ? reservedCount : null,
                },
                {
                  label: "Low Stock Items",
                  icon: <AlertTriangle size={15} />,
                  color: "bg-red-50 text-red-600 border-red-100",
                  action: () => navigate("/admin/inventory"),
                  count: 2, // Sample static value until inventory is linked to context
                },
                {
                  label: "New Reviews Pending",
                  icon: <Star size={15} />,
                  color: "bg-amber-50 text-amber-600 border-amber-100",
                  action: () => alert("Reviews management module coming soon!"),
                },
                {
                  label: "Payments",
                  icon: <CreditCard size={15} />,
                  color: "bg-blue-50 text-blue-600 border-blue-100",
                  action: () => navigate("/admin/billing"),
                  count: pendingPaymentsCount > 0 ? pendingPaymentsCount : null,
                },
              ].map((reminder) => (
                <button
                  key={reminder.label}
                  onClick={reminder.action}
                  className="w-full bg-white border border-slate-200/60 hover:border-slate-300 rounded-xl p-3 flex items-center justify-between text-xs font-semibold text-slate-700 transition hover:bg-slate-50/50 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-2 rounded-lg border ${reminder.color}`}>
                      {reminder.icon}
                    </div>
                    <span className="truncate">{reminder.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {reminder.count && (
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        {reminder.count}
                      </span>
                    )}
                    <ChevronRight
                      size={14}
                      className="text-slate-400 group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
