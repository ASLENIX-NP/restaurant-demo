// src/pages/cashier/SalesHistory.jsx

import React from "react";
import "../../styles/saleshistory.css";

import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaChevronRight,
} from "react-icons/fa";
import { useOrders } from "../../context/OrderContext";

const SalesHistory = () => {
  // Provide a safe fallback array in case context is still initializing
  const { orders = [] } = useOrders() || {};

  // Get all completed orders from the global context
  const completedSales = orders.filter((order) => order.status === "Completed");

  // Calculate real metrics based on the completed orders
  const totalSalesAmount = completedSales.reduce((acc, order) => {
    const subtotal = (order.items || []).reduce((sum, item) => sum + item.qty * item.price, 0);
    return acc + subtotal + (subtotal * 0.13) + (subtotal > 0 ? 50 : 0);
  }, 0);

  const totalItemsSold = completedSales.reduce((acc, order) => {
    return acc + (order.items || []).reduce((sum, item) => sum + item.qty, 0);
  }, 0);

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
            <h2>Rs. {totalSalesAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            <span>↑ 12.5% vs yesterday</span>
          </div>
        </div>

        <div className="sales-stat-card">
          <div className="stat-icon blue">🛒</div>

          <div>
            <h4>Total Orders</h4>
            <h2>{completedSales.length}</h2>
            <span>↑ 5 vs yesterday</span>
          </div>
        </div>

        <div className="sales-stat-card">
          <div className="stat-icon orange">📦</div>

          <div>
            <h4>Total Items Sold</h4>
            <h2>{totalItemsSold}</h2>
            <span>↑ 10.6% vs yesterday</span>
          </div>
        </div>

        <div className="sales-stat-card">
          <div className="stat-icon purple">💳</div>

          <div>
            <h4>Average Order Value</h4>
            <h2>Rs. {completedSales.length > 0 ? (totalSalesAmount / completedSales.length).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}</h2>
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

            {completedSales.length > 0 ? (
              completedSales.map((sale, index) => {
                const subtotal = (sale.items || []).reduce((sum, item) => sum + item.qty * item.price, 0);
                const total = subtotal + (subtotal * 0.13) + (subtotal > 0 ? 50 : 0);
                const itemCount = (sale.items || []).reduce((sum, item) => sum + item.qty, 0);
                const itemNames = (sale.items || []).map(i => `${i.name} x${i.qty}`).join(", ");

                return (
                  <div className="sales-row" key={index}>
                    <div className="sales-time">{sale.time || "N/A"}</div>
                    <div className="sales-info">
                      <div className="sales-id">
                        <h4>{sale.id}</h4>
                        <p>{sale.customer || "Walk-in Customer"}</p>
                        <span>{sale.channel || "Dining"}</span>
                      </div>
                      <div className="sales-items">
                        <h4>{itemCount} Items</h4>
                        <p className="truncate w-32" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{itemNames}</p>
                      </div>
                      <div className="sales-payment">
                        <h4>Cash/Card</h4>
                        {/* Safely check if ID exists, and ensure it is treated as a String before using .replace() */}
                        <p>INV-{sale.id ? String(sale.id).replace(/\D/g, '') : "N/A"}</p>
                      </div>
                      <div className="sales-amount">Rs. {total.toFixed(2)}</div>
                      <div>
                        <span className="sale-status completed">Completed</span>
                      </div>
                      <button className="details-btn">View Details</button>
                      <FaChevronRight className="arrow-icon" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-500 font-medium">
                No completed sales today. Settle a bill to see it here!
              </div>
            )}

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