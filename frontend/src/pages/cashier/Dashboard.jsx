// src/pages/cashier/Dashboard.jsx

import React from "react";
import "../../styles/cashierDashboard.css";

const Dashboard = () => {
  return (
    <div className="cashier-dashboard">
      
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with your sales today.</p>
        </div>
        <button className="date-btn">📅 May 15, 2024</button>
      </div>

      {/* TOP STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper green-light">💵</div>
          <div className="stat-info">
            <h4>Total Sales</h4>
            <h2>Rs. 0.00</h2>
            <span className="trend-text">0% vs yesterday</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper blue-light">🛒</div>
          <div className="stat-info">
            <h4>Total Orders</h4>
            <h2>0</h2>
            <span className="trend-text">0 vs yesterday</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper orange-light">📦</div>
          <div className="stat-info">
            <h4>Total Items Sold</h4>
            <h2>0</h2>
            <span className="trend-text">0% vs yesterday</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple-light">💳</div>
          <div className="stat-info">
            <h4>Average Order Value</h4>
            <h2>Rs. 0.00</h2>
            <span className="trend-text">0% vs yesterday</span>
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
                <strong className="item-val">Rs. 0.00</strong>
              </div>
              <div className="overview-item">
                <span className="item-label">🧾 Orders</span>
                <strong className="item-val">0</strong>
              </div>
              <div className="overview-item">
                <span className="item-label">📦 Items Sold</span>
                <strong className="item-val">0</strong>
              </div>
              <div className="overview-item">
                <span className="item-label">👥 Customers</span>
                <strong className="item-val">0</strong>
              </div>
              <div className="overview-item">
                <span className="item-label">↩ Refunds</span>
                <strong className="item-val">0</strong>
              </div>
            </div>

            {/* ADVANCED GRADIENT AREA CHART VIA SVG */}
            <div className="chart-area-container">
              <svg viewBox="0 0 500 200" className="svg-area-chart">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
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
              <svg width="140" height="140" viewBox="0 0 42 42" className="donut-svg">
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="4" />
                {/* Segment: Cash */}
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4" 
                  strokeDasharray="45 55" strokeDashoffset="25" />
                {/* Segment: Card */}
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4" 
                  strokeDasharray="30 70" strokeDashoffset="80" />
                {/* Segment: eSewa */}
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#22c55e" strokeWidth="4" 
                  strokeDasharray="15 85" strokeDashoffset="50" />
                {/* Segment: Khalti */}
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#8b5cf6" strokeWidth="4" 
                  strokeDasharray="10 90" strokeDashoffset="35" />
              </svg>
              <div className="donut-center-labels">
                <span className="donut-title">Total</span>
                <span className="donut-value">Rs. 0</span>
              </div>
            </div>

            <div className="payment-legend-list">
              <div className="legend-item"><span className="indicator-dot bg-green"></span> Cash</div>
              <div className="legend-item"><span className="indicator-dot bg-blue"></span> Card</div>
              <div className="legend-item"><span className="indicator-dot bg-lightgreen"></span> eSewa</div>
              <div className="legend-item"><span className="indicator-dot bg-purple"></span> Khalti</div>
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
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                    No recent transactions found.
                  </td>
                </tr>
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
            <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
              No recent sales.
            </div>
          </div>

          <div className="summary-total-footer-strip">
            <span>Total (0 Items)</span>
            <strong>Rs. 0.00</strong>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;