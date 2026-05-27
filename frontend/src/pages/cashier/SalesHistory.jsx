// src/pages/cashier/SalesHistory.jsx

import React from "react";
import "../../styles/saleshistory.css";

import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaChevronRight,
} from "react-icons/fa";

const salesData = [
  {
    time: "10:34 AM",
    id: "#TXN-10048",
    customer: "Walk-in Customer",
    items: "Burger x1, Pizza x1, Coke x1",
    payment: "Cash",
    invoice: "INV-10024",
    amount: "Rs. 250.00",
    status: "Completed",
  },
  {
    time: "10:15 AM",
    id: "#TXN-10047",
    customer: "Arman Sharma",
    items: "Burger x2, Pizza x1, Coke x1",
    payment: "Card",
    invoice: "INV-10023",
    amount: "Rs. 350.00",
    status: "Completed",
  },
  {
    time: "10:04 AM",
    id: "#TXN-10046",
    customer: "Neha Verma",
    items: "Pizza x1, Coke x1",
    payment: "eSewa",
    invoice: "INV-10022",
    amount: "Rs. 180.00",
    status: "Completed",
  },
  {
    time: "09:56 AM",
    id: "#TXN-10045",
    customer: "Rohan Das",
    items: "Burger x1, Coke x1",
    payment: "Khalti",
    invoice: "INV-10021",
    amount: "Rs. 120.00",
    status: "Completed",
  },
  {
    time: "09:42 AM",
    id: "#TXN-10044",
    customer: "Walk-in Customer",
    items: "Coke x1",
    payment: "Cash",
    invoice: "INV-10020",
    amount: "Rs. 200.00",
    status: "Completed",
  },
  {
    time: "09:30 AM",
    id: "#TXN-10043",
    customer: "Priya Patel",
    items: "Burger x2, Pizza x1, Coke x2",
    payment: "Card",
    invoice: "INV-10019",
    amount: "Rs. 500.00",
    status: "Refunded",
  },
];

const SalesHistory = () => {
  return (
    <div className="sales-history-page">

      {/* HEADER */}
      <div className="sales-top">
        <div>
          <h1>Sales History</h1>
          <p>Complete history of all sales transactions</p>
        </div>

        <div className="sales-top-actions">
          <button className="date-btn">
            May 15, 2024 - May 15, 2024
          </button>

          <button className="filter-btn">
            <FaFilter />
            Filter
          </button>

          <button className="export-btn">
            <FaDownload />
            Export
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="sales-stats">

        <div className="sales-stat-card">
          <div className="stat-icon green">📈</div>

          <div>
            <h4>Total Sales</h4>
            <h2>Rs. 2,45,000.00</h2>
            <span>↑ 12.5% vs yesterday</span>
          </div>
        </div>

        <div className="sales-stat-card">
          <div className="stat-icon blue">🛒</div>

          <div>
            <h4>Total Orders</h4>
            <h2>48</h2>
            <span>↑ 5 vs yesterday</span>
          </div>
        </div>

        <div className="sales-stat-card">
          <div className="stat-icon orange">📦</div>

          <div>
            <h4>Total Items Sold</h4>
            <h2>132</h2>
            <span>↑ 10.6% vs yesterday</span>
          </div>
        </div>

        <div className="sales-stat-card">
          <div className="stat-icon purple">💳</div>

          <div>
            <h4>Average Order Value</h4>
            <h2>Rs. 5,104.17</h2>
            <span>↑ 8.3% vs yesterday</span>
          </div>
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="sales-content">

        {/* LEFT */}
        <div className="sales-left">

          {/* FILTERS */}
          <div className="sales-filters">

            <div className="sales-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search by Order ID, Customer or Phone..."
              />
            </div>

            <select>
              <option>All Stations</option>
            </select>

            <select>
              <option>All Payment Methods</option>
            </select>

            <select>
              <option>All Status</option>
            </select>

          </div>

          {/* HISTORY LIST */}
          <div className="sales-list">

            <div className="sales-date">
              Today - May 15, 2024
            </div>

            {salesData.map((sale, index) => (
              <div className="sales-row" key={index}>

                <div className="sales-time">
                  {sale.time}
                </div>

                <div className="sales-info">

                  <div className="sales-id">
                    <h4>{sale.id}</h4>
                    <p>{sale.customer}</p>
                    <span>Main Counter</span>
                  </div>

                  <div className="sales-items">
                    <h4>
                      {sale.items.includes("x2") ? "4 Items" : "2 Items"}
                    </h4>

                    <p>{sale.items}</p>
                  </div>

                  <div className="sales-payment">
                    <h4>{sale.payment}</h4>
                    <p>{sale.invoice}</p>
                  </div>

                  <div className="sales-amount">
                    {sale.amount}
                  </div>

                  <div>
                    <span
                      className={`sale-status ${
                        sale.status === "Completed"
                          ? "completed"
                          : "refunded"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </div>

                  <button className="details-btn">
                    View Details
                  </button>

                  <FaChevronRight className="arrow-icon" />

                </div>
              </div>
            ))}

            <div className="load-more">
              Load More History
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="sales-right">

          {/* PAYMENT METHOD */}
          <div className="right-card">
            <h3>Sales by Payment Method</h3>

            <div className="payment-chart">
              <div className="circle-chart">
                <div className="chart-center">
                  <h4>Total</h4>
                  <p>Rs. 2,45,000</p>
                </div>
              </div>

              <div className="chart-details">

                <div className="chart-item">
                  <span className="dot green-dot"></span>
                  Cash
                </div>

                <div className="chart-item">
                  <span className="dot blue-dot"></span>
                  Card
                </div>

                <div className="chart-item">
                  <span className="dot lightgreen-dot"></span>
                  eSewa
                </div>

                <div className="chart-item">
                  <span className="dot purple-dot"></span>
                  Khalti
                </div>

              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="right-card">
            <h3>Sales Summary</h3>

            <div className="summary-item">
              <span>Total Sales</span>
              <strong>Rs. 2,45,000</strong>
            </div>

            <div className="summary-item">
              <span>Total Orders</span>
              <strong>48</strong>
            </div>

            <div className="summary-item">
              <span>Total Items Sold</span>
              <strong>132</strong>
            </div>

            <div className="summary-item">
              <span>Average Order Value</span>
              <strong>Rs. 5,104</strong>
            </div>

            <div className="summary-item">
              <span>Highest Sale</span>
              <strong>Rs. 12,500</strong>
            </div>

            <div className="summary-item">
              <span>Lowest Sale</span>
              <strong>Rs. 120</strong>
            </div>
          </div>

          {/* QUICK ACTION */}
          <div className="right-card">
            <h3>Quick Actions</h3>

            <button className="quick-btn blue-btn">
              View All Invoices
            </button>

            <button className="quick-btn green-btn">
              Go to Dashboard
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SalesHistory;