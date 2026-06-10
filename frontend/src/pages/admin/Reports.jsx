import React, { useState } from "react";
import {
  Download,
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Calendar,
  PieChart as PieIcon,
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

// Links the stylesheet cleanly
import "../../styles/reports.css";
import { useOrders } from "../../context/OrderContext";

export default function Reports() {
  const { orders = [] } = useOrders() || {};
  const [timeRange, setTimeRange] = useState("This Month");

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfLast7Days = new Date(startOfToday);
  startOfLast7Days.setDate(startOfLast7Days.getDate() - 6);
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.timestamp || order.date);
    if (timeRange === "Today") return orderDate >= startOfToday;
    if (timeRange === "Last 7 Days") return orderDate >= startOfLast7Days;
    if (timeRange === "This Month") return orderDate >= startOfThisMonth;
    return true; // All Time
  });

  const completedSales = filteredOrders.filter((order) => order.status === "Completed");

  const totalRevenue = completedSales.reduce((acc, order) => {
    const subtotal = (order.items || []).reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );
    return (
      acc +
      (order.amount !== undefined
        ? order.amount
        : subtotal + (subtotal > 0 ? 50 : 0))
    );
  }, 0);

  const totalOrders = filteredOrders.length;
  const totalCustomers = new Set(filteredOrders.map((o) => o.customer || "Guest")).size;
  const avgOrderValue =
    completedSales.length > 0 ? totalRevenue / completedSales.length : 0;

  // Category Distribution Data
  const categoriesMap = {};
  let totalItemsSold = 0;
  completedSales.forEach((order) => {
    (order.items || []).forEach((item) => {
      const cat = item.category || "Other";
      categoriesMap[cat] = (categoriesMap[cat] || 0) + item.qty;
      totalItemsSold += item.qty;
    });
  });

  const colors = ["#1e293b", "#475569", "#94a3b8", "#cbd5e1", "#818cf8"];
  let categoryDistributionData = Object.entries(categoriesMap).map(
    ([name, qty], idx) => ({
      name,
      value: totalItemsSold > 0 ? Math.round((qty / totalItemsSold) * 100) : 0,
      color: colors[idx % colors.length],
    })
  );
  if (categoryDistributionData.length === 0) {
    categoryDistributionData = [
      { name: "No Sales", value: 100, color: "#cbd5e1" },
    ];
  }

  const itemsMap = {};
  completedSales.forEach((order) => {
    (order.items || []).forEach((item) => {
      if (!itemsMap[item.name]) {
        itemsMap[item.name] = {
          name: item.name,
          image:
            item.image ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80",
          category: item.category || "Mains",
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
    .map((item) => ({
      ...item,
      quantity: item.qty,
      revenue: `Rs. ${item.revenue.toLocaleString()}`,
    }));

  const formatDate = (date) => date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  let displayStart = "";
  let displayEnd = formatDate(now);

  if (timeRange === "Today") displayStart = displayEnd;
  else if (timeRange === "Last 7 Days") displayStart = formatDate(startOfLast7Days);
  else if (timeRange === "This Month") displayStart = formatDate(startOfThisMonth);
  else displayStart = "All Time";

  // Dynamic Revenue Trend Data
  let numDays = 7;
  if (timeRange === "Today") numDays = 1;
  else if (timeRange === "Last 7 Days") numDays = 7;
  else if (timeRange === "This Month") numDays = now.getDate() || 1; // days elapsed this month
  else if (timeRange === "All Time") numDays = 30; // Show last 30 days for trend

  const revenueTrendData = [];
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    revenueTrendData.push({
      label: d
        .toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })
        .replace("/", "-"),
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
      dayData.revenue +=
        order.amount !== undefined
          ? order.amount
          : subtotal + (subtotal > 0 ? 50 : 0);
    }
  });

  const handlePrintExport = () => {
    window.print();
  };

  const dynamicChangeText = timeRange === "All Time" ? "Lifetime" : `In ${timeRange}`;

  return (
    <div className="report-page">
      <div className="report-container screen-only">
        {/* HEADER SECTION */}
        <div className="report-header">
          <div>
            <h1>Reports</h1>
            <p className="breadcrumb">
              Dashboard <span>&gt;</span> Reports
            </p>
          </div>
          <button className="export-report-btn" onClick={handlePrintExport}>
            <Download size={16} />
            Export Report
          </button>
        </div>

        {/* TIME FRAME RANGE FILTER BAR */}
        <div className="report-filter">
          <div className="date-box flex items-center gap-2">
            <Calendar size={15} className="text-purple-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-none font-bold text-slate-700 outline-none cursor-pointer text-sm"
            >
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="This Month">This Month</option>
              <option value="All Time">All Time</option>
            </select>
            <span className="text-slate-400 text-xs font-medium border-l border-slate-200 pl-2 ml-1">
              {timeRange === "Today" || timeRange === "All Time"
                ? displayStart
                : `${displayStart} - ${displayEnd}`}
            </span>
          </div>
        </div>

        {/* ANALYTIC KPI SUMMARY GRID */}
        <div className="report-stats-grid">
          {[
            {
              title: "Total Revenue",
              value: `Rs. ${totalRevenue.toLocaleString()}`,
              change: dynamicChangeText,
              icon: <DollarSign size={20} />,
            },
            {
              title: "Total Orders",
              value: totalOrders,
              change: dynamicChangeText,
              icon: <ShoppingBag size={20} />,
            },
            {
              title: "Avg Order Value",
              value: `Rs. ${avgOrderValue.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}`,
              change: dynamicChangeText,
              icon: <TrendingUp size={20} />,
            },
            {
              title: "Customers",
              value: totalCustomers,
              change: dynamicChangeText,
              icon: <Users size={20} />,
            },
          ].map((stat, i) => (
            <div key={i} className="report-stat-card">
              <div className="report-icon-wrapper">{stat.icon}</div>
              <div className="stat-content">
                <h3>{stat.title}</h3>
                <h1>{stat.value}</h1>
                <p className="stat-change-text">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* INTERACTIVE GRAPH DATA BLOCK CONTAINER */}
        <div className="report-chart-grid">
          {/* SMOOTH AREA-LINE CHART */}
          <div className="chart-card linear-graph-block">
            <div className="chart-header-node">
              <div>
                <h2>Revenue Overview</h2>
                <p>Gross performance trends over this cycle</p>
              </div>
              <button className="chart-toggle-btn">By Day</button>
            </div>

            <div className="chart-wrapper-canvas">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueTrendData}
                  margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="reportRevenueGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#1e293b"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#1e293b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    stroke="#94a3b8"
                    tickLine={false}
                    axisLine={false}
                    dy={8}
                    style={{ fontSize: "11px" }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tickLine={false}
                    axisLine={false}
                    dx={-5}
                    tickFormatter={(v) => `Rs.${v / 1000}k`}
                    style={{ fontSize: "11px" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderRadius: "10px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [
                      `Rs. ${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#334155"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#reportRevenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DOUGHNUT PIE CHART */}
          <div className="chart-card distribution-graph-block">
            <div className="chart-header-node">
              <h2>Sales By Category</h2>
              <p>Performance weight by preparation tier</p>
            </div>

            <div className="pie-section-wrapper">
              <div className="pie-canvas-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}% Share`]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-center-label">
                  <PieIcon size={18} className="text-slate-400" />
                </div>
              </div>

              <div className="pie-details-legend">
                {categoryDistributionData.map((item, index) => (
                  <div key={index} className="legend-row-item">
                    <div className="legend-indicator">
                      <span
                        className="color-indicator-dot"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="legend-name-text">{item.name}</span>
                    </div>
                    <span className="legend-percentage-value">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* COMPREHENSIVE PERFORMANCE DATATABLE */}
        <div className="top-items-card">
          <div className="table-title-node">
            <h2>Top Selling Items</h2>
            <p>
              High velocity restaurant performance entries listed by inventory
              rank
            </p>
          </div>

          <div className="report-table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>#</th>
                  <th>Item</th>
                  <th>Category</th>
                  <th style={{ textAlign: "center" }}>Quantity</th>
                  <th style={{ textAlign: "right" }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-8 text-slate-400 font-medium"
                    >
                      No items sold yet.
                    </td>
                  </tr>
                ) : (
                  topItems.map((item, index) => (
                    <tr key={index}>
                      <td className="rank-index-cell">{index + 1}</td>
                      <td>
                        <div className="item-info">
                          <img src={item.image} alt={item.name} />
                          <span className="item-name-bold">{item.name}</span>
                        </div>
                      </td>
                      <td className="category-text-dim">{item.category}</td>
                      <td className="qty-center-cell">{item.quantity}</td>
                      <td className="revenue-right-cell">{item.revenue}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PRINT-ONLY UI SECTION */}
      <div className="print-only">
        <h1>Sales & Performance Report</h1>
        <p><strong>Date Period:</strong> {timeRange === "Today" || timeRange === "All Time" ? displayStart : `${displayStart} to ${displayEnd}`}</p>
        <p><strong>Generated On:</strong> {new Date().toLocaleString()}</p>
        
        <div className="print-only-grid">
          <div>
            <h2>Summary</h2>
            <p><strong>Total Revenue:</strong> Rs. {totalRevenue.toLocaleString()}</p>
            <p><strong>Total Orders:</strong> {totalOrders}</p>
            <p><strong>Avg Order Value:</strong> Rs. {avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            <p><strong>Total Customers:</strong> {totalCustomers}</p>
          </div>
          <div>
            <h2>Category Distribution</h2>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {categoryDistributionData.map(c => (
                <li key={c.name} style={{ marginBottom: "4px" }}>
                  <strong>{c.name}:</strong> {c.value}%
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h2>Top Selling Items</h2>
        <table className="print-only-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Item Name</th>
              <th>Category</th>
              <th style={{ textAlign: "center" }}>Quantity</th>
              <th style={{ textAlign: "right" }}>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {topItems.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No items sold yet.</td>
              </tr>
            ) : (
              topItems.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td style={{ textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ textAlign: "right" }}>{item.revenue}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
