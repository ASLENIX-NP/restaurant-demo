// src/pages/cashier/Dashboard.jsx

import React, { useEffect } from "react";
import "../../styles/cashierDashboard.css";
import { useOrders } from "../../context/OrderContext";

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

            {/* ADVANCED GRADIENT AREA CHART VIA SVG */}
            <div className="chart-area-container">
              <svg viewBox="0 0 500 200" className="svg-area-chart">
                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Spline Path Filled Area */}
                <path
                  d="M 0 180 C 40 180, 60 160, 100 150 C 140 140, 160 110, 200 115 C 240 120, 260 70, 300 60 C 340 50, 370 120, 420 100 C 470 80, 480 90, 500 90 L 500 200 L 0 200 Z"
                  fill="url(#chartGradient)"
                />
                {/* Top Stroke Line */}
                <path
                  d="M 0 180 C 40 180, 60 160, 100 150 C 140 140, 160 110, 200 115 C 240 120, 260 70, 300 60 C 340 50, 370 120, 420 100 C 470 80, 480 90, 500 90"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <div className="chart-timeline-labels">
                <span>12 AM</span>
                <span>4 AM</span>
                <span>8 AM</span>
                <span>12 PM</span>
                <span>4 PM</span>
                <span>8 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT METHOD (DONUT GRAPH) */}
        <div className="payment-card">
          <h3>Sales by Payment Method</h3>
          <div className="payment-chart-wrapper">
            <div className="donut-chart-container">
              <svg
                width="140"
                height="140"
                viewBox="0 0 42 42"
                className="donut-svg"
              >
                <circle
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="4"
                />
                {/* Segment: Cash */}
                <circle
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray="45 55"
                  strokeDashoffset="25"
                />
                {/* Segment: Card */}
                <circle
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  strokeDasharray="30 70"
                  strokeDashoffset="80"
                />
                {/* Segment: eSewa */}
                <circle
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke="#22c55e"
                  strokeWidth="4"
                  strokeDasharray="15 85"
                  strokeDashoffset="50"
                />
                {/* Segment: Khalti */}
                <circle
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke="#8b5cf6"
                  strokeWidth="4"
                  strokeDasharray="10 90"
                  strokeDashoffset="35"
                />
              </svg>
              <div className="donut-center-labels">
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
