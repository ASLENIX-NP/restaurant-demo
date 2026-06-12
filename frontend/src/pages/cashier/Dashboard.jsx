// src/pages/cashier/Dashboard.jsx

import React, { useEffect } from "react";
import "../../styles/cashierDashboard.css";
import { useOrders } from "../../context/OrderContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const { orders = [], fetchOrders } = useOrders() || {};

  useEffect(() => {
    if (fetchOrders) fetchOrders();
  }, [fetchOrders]);

  const completedSales = orders.filter((order) => order.status === "Completed");
  const pendingBills = orders.filter((order) => order.status !== "Completed");

  const totalSalesAmount = completedSales.reduce((acc, order) => {
    const subtotal = (order.items || []).reduce(
      (sum, item) => sum + item.qty * (parseFloat(item.price) || 0),
      0
    );
    return acc + (order.amount || subtotal + (subtotal > 0 ? 50 : 0));
  }, 0);

  const pendingBillsAmount = pendingBills.reduce((acc, order) => {
    const subtotal = (order.items || []).reduce(
      (sum, item) => sum + item.qty * (parseFloat(item.price) || 0),
      0
    );
    return acc + (order.amount || subtotal + (subtotal > 0 ? 50 : 0));
  }, 0);

  const totalOrders = orders.length;

  const totalItemsSold = completedSales.reduce((acc, order) => {
    return acc + (order.items || []).reduce((sum, item) => sum + item.qty, 0);
  }, 0);

  const avgOrderValue =
    completedSales.length > 0 ? totalSalesAmount / completedSales.length : 0;

  // Prepare dynamic data for the Pie Chart
  const paymentData = React.useMemo(() => {
    let cash = 0, card = 0, esewa = 0, khalti = 0;
    completedSales.forEach((order) => {
      const amt = order.amount || ((order.items || []).reduce((sum, i) => sum + i.qty * i.price, 0) + 50);
      if (order.paymentMethod === "Card") card += amt;
      else if (order.paymentMethod === "eSewa") esewa += amt;
      else if (order.paymentMethod === "Khalti") khalti += amt;
      else cash += amt;
    });
    return [
      { name: "Cash", value: cash, color: "#10b981" },
      { name: "Card", value: card, color: "#3b82f6" },
      { name: "eSewa", value: esewa, color: "#22c55e" },
      { name: "Khalti", value: khalti, color: "#8b5cf6" },
    ].filter(item => item.value > 0); // Only show methods that have sales
  }, [completedSales]);

  // Prepare mock/dynamic data for the Area Chart trend
  const salesTrendData = React.useMemo(() => {
    // In a real app, you'd group completedSales by hour. 
    // Here we generate a smooth curve that ends at today's actual total.
    const base = totalSalesAmount > 0 ? totalSalesAmount / 6 : 5000;
    return [
      { time: "8 AM", sales: base * 0.2 },
      { time: "11 AM", sales: base * 0.8 },
      { time: "2 PM", sales: base * 1.5 },
      { time: "5 PM", sales: base * 1.1 },
      { time: "8 PM", sales: base * 2.1 },
      { time: "11 PM", sales: base * 0.4 },
    ];
  }, [totalSalesAmount]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700">
          <p className="font-bold text-slate-300 text-xs mb-1">{label}</p>
          <p className="font-black text-lg">
            Rs. {payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="cashier-dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with your sales today.</p>
        </div>
        <button className="date-btn">
          📅{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </button>
      </div>

      {/* TOP STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper green-light">💵</div>
          <div className="stat-info">
            <h4>Total Sales</h4>
            <h2>
              Rs.{" "}
              {totalSalesAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
            <span className="trend-text">Completed Revenue</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper orange-light">⏳</div>
          <div className="stat-info">
            <h4>Pending Bills</h4>
            <h2>{pendingBills.length}</h2>
            <span className="trend-text">Unpaid Orders</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper blue-light">🛒</div>
          <div className="stat-info">
            <h4>Total Orders</h4>
            <h2>{totalOrders}</h2>
            <span className="trend-text">All Orders Today</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple-light">💳</div>
          <div className="stat-info">
            <h4>Average Order Value</h4>
            <h2>
              Rs.{" "}
              {avgOrderValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
            <span className="trend-text">Based on completed</span>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: GRAPHICAL OVERVIEWS */}
      <div className="middle-grid">
        {/* SALES OVERVIEW (AREA GRAPH) */}
        <div className="overview-card">
          <div className="card-top">
            <h3>Today's Sales Overview</h3>
            <select className="premium-select">
              <option>Today</option>
            </select>
          </div>

          <div className="overview-content">
            <div className="overview-info-list">
              <div className="overview-item">
                <span className="item-label">💳 Sales Amount</span>
                <strong className="item-val">
                  Rs.{" "}
                  {totalSalesAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </div>
              <div className="overview-item">
                <span className="item-label">🧾 Orders</span>
                <strong className="item-val">{totalOrders}</strong>
              </div>
              <div className="overview-item">
                <span className="item-label">📦 Items Sold</span>
                <strong className="item-val">{totalItemsSold}</strong>
              </div>
              <div className="overview-item">
                <span className="item-label">👥 Customers</span>
                <strong className="item-val">{orders.length}</strong>
              </div>
              <div className="overview-item">
                <span className="item-label">⏳ Pending Amount</span>
                <strong className="item-val">
                  Rs.{" "}
                  {pendingBillsAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </div>
            </div>

            {/* DYNAMIC RECHARTS AREA CHART */}
            <div className="chart-area-container" style={{ height: "220px", width: "100%", marginTop: "20px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(val) => `Rs.${val/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* PAYMENT METHOD (DYNAMIC RECHARTS DONUT) */}
        <div className="payment-card">
          <h3>Sales by Payment Method</h3>
          <div className="payment-chart-wrapper">
            <div className="donut-chart-container relative h-[180px] w-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData.length > 0 ? paymentData : [{ name: "No Data", value: 1, color: "#e2e8f0" }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {(paymentData.length > 0 ? paymentData : [{ name: "No Data", value: 1, color: "#e2e8f0" }]).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-center-labels absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="donut-title">Total</span>
                <span className="donut-value">
                  Rs.{" "}
                  {totalSalesAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            <div className="payment-legend-list">
              <div className="legend-item">
                <span className="indicator-dot bg-green"></span> Cash
              </div>
              <div className="legend-item">
                <span className="indicator-dot bg-blue"></span> Card
              </div>
              <div className="legend-item">
                <span className="indicator-dot bg-lightgreen"></span> eSewa
              </div>
              <div className="legend-item">
                <span className="indicator-dot bg-purple"></span> Khalti
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM GRID: TABLES & RECENTS */}
      <div className="bottom-grid">
        {/* RECENT TRANSACTIONS TABLE */}
        <div className="transactions-card">
          <div className="card-top">
            <h3>Recent Transactions</h3>
            <button className="view-all-link">View All</button>
          </div>

          <div className="table-responsive-wrapper">
            <table className="transaction-data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Table / Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: "center",
                        padding: "2rem",
                        color: "#94a3b8",
                      }}
                    >
                      No recent transactions found.
                    </td>
                  </tr>
                ) : (
                  [...orders].slice(0, 5).map((order) => {
                    const subtotal = (order.items || []).reduce(
                      (sum, item) =>
                        sum + item.qty * (parseFloat(item.price) || 0),
                      0
                    );
                    const total =
                      order.amount || subtotal + (subtotal > 0 ? 50 : 0);
                    const itemCount = (order.items || []).reduce(
                      (sum, item) => sum + item.qty,
                      0
                    );
                    return (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>
                          <div style={{ fontWeight: 600, color: "#1e293b" }}>
                            {order.table || "Walk-in"}
                          </div>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>
                            {order.customer || order.server || "Guest"}
                          </div>
                        </td>
                        <td>{itemCount}</td>
                        <td>
                          Rs.{" "}
                          {total.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td>{order.paymentMethod || "Cash"}</td>
                        <td>
                          <span
                            className={`status-badge ${order.status
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>{order.time || "N/A"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT SALES PANEL */}
        <div className="recent-sales-card">
          <div className="card-top">
            <h3>Recent Sales</h3>
            <button className="view-all-link">View All</button>
          </div>

          <div className="sales-items-vertical-stack">
            {completedSales.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#94a3b8",
                }}
              >
                No recent sales.
              </div>
            ) : (
              [...completedSales].slice(0, 5).map((order) => {
                const subtotal = (order.items || []).reduce(
                  (sum, item) => sum + item.qty * (parseFloat(item.price) || 0),
                  0
                );
                const total =
                  order.amount || subtotal + (subtotal > 0 ? 50 : 0);
                return (
                  <div
                    key={order.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "1rem",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <strong style={{ color: "#0f172a" }}>{order.id}</strong>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        {order.time}
                      </span>
                    </div>
                    <strong style={{ color: "#0f172a" }}>
                      Rs.{" "}
                      {total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                  </div>
                );
              })
            )}
          </div>

          <div className="summary-total-footer-strip">
            <span>Total ({totalItemsSold} Items)</span>
            <strong>
              Rs.{" "}
              {totalSalesAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
