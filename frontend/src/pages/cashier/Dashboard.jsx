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
            <h2>Rs. 2,45,000.00</h2>
            <span className="trend-text positive">↑ 12.5% vs yesterday</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper blue-light">🛒</div>
          <div className="stat-info">
            <h4>Total Orders</h4>
            <h2>48</h2>
            <span className="trend-text positive">↑ 5 vs yesterday</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper orange-light">📦</div>
          <div className="stat-info">
            <h4>Total Items Sold</h4>
            <h2>132</h2>
            <span className="trend-text positive">↑ 10.6% vs yesterday</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple-light">💳</div>
          <div className="stat-info">
            <h4>Average Order Value</h4>
            <h2>Rs. 5,104.17</h2>
            <span className="trend-text positive">↑ 8.3% vs yesterday</span>
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
                <strong className="item-val">Rs. 2,45,000.00</strong>
              </div>
              <div className="overview-item">
                <span className="item-label">🧾 Orders</span>
                <strong className="item-val">48</strong>
              </div>
              <div className="overview-item">
                <span className="item-label">📦 Items Sold</span>
                <strong className="item-val">132</strong>
              </div>
              <div className="overview-item">
                <span className="item-label">👥 Customers</span>
                <strong className="item-val">36</strong>
              </div>
              <div className="overview-item">
                <span className="item-label">↩ Refunds</span>
                <strong className="item-val">2</strong>
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
                <span className="donut-value">Rs. 2.45L</span>
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
                  <td className="highlight-id">#TXN-10048</td>
                  <td>Walk-in Customer</td>
                  <td>3 Items</td>
                  <td className="table-weight-text">Rs. 250.00</td>
                  <td>Cash</td>
                  <td><span className="badge-status success">Completed</span></td>
                  <td className="table-time-text">10:34 AM</td>
                </tr>
                <tr>
                  <td className="highlight-id">#TXN-10047</td>
                  <td>Arman Sharma</td>
                  <td>4 Items</td>
                  <td className="table-weight-text">Rs. 350.00</td>
                  <td>Card</td>
                  <td><span className="badge-status success">Completed</span></td>
                  <td className="table-time-text">10:15 AM</td>
                </tr>
                <tr>
                  <td className="highlight-id">#TXN-10046</td>
                  <td>Neha Verma</td>
                  <td>2 Items</td>
                  <td className="table-weight-text">Rs. 180.00</td>
                  <td>eSewa</td>
                  <td><span className="badge-status success">Completed</span></td>
                  <td className="table-time-text">10:04 AM</td>
                </tr>
                <tr>
                  <td className="highlight-id">#TXN-10045</td>
                  <td>Rohan Das</td>
                  <td>2 Items</td>
                  <td className="table-weight-text">Rs. 120.00</td>
                  <td>Khalti</td>
                  <td><span className="badge-status success">Completed</span></td>
                  <td className="table-time-text">09:56 AM</td>
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
            <div className="sale-row-entry">
              <div className="sale-row-left">
                <div className="item-thumbnail-box">
                  <img src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png" alt="Coke" />
                </div>
                <div className="item-meta-details">
                  <h4>Coke</h4>
                  <p>1 x Rs. 50.00</p>
                </div>
              </div>
              <strong className="sale-amount-value">Rs. 50.00</strong>
            </div>

            <div className="sale-row-entry">
              <div className="sale-row-left">
                <div className="item-thumbnail-box">
                  <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="Burger" />
                </div>
                <div className="item-meta-details">
                  <h4>Burger</h4>
                  <p>1 x Rs. 150.00</p>
                </div>
              </div>
              <strong className="sale-amount-value">Rs. 150.00</strong>
            </div>

            <div className="sale-row-entry">
              <div className="sale-row-left">
                <div className="item-thumbnail-box">
                  <img src="https://cdn-icons-png.flaticon.com/512/3132/3132693.png" alt="Pizza" />
                </div>
                <div className="item-meta-details">
                  <h4>Pizza</h4>
                  <p>1 x Rs. 300.00</p>
                </div>
              </div>
              <strong className="sale-amount-value">Rs. 300.00</strong>
            </div>
          </div>

          <div className="summary-total-footer-strip">
            <span>Total (3 Items)</span>
            <strong>Rs. 500.00</strong>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;