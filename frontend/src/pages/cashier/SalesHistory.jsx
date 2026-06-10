// src/pages/cashier/SalesHistory.jsx

import React, { useState } from "react";
import "../../styles/saleshistory.css";

import { FaSearch, FaFilter, FaDownload, FaChevronRight } from "react-icons/fa";
import { X } from "lucide-react";
import { useOrders } from "../../context/OrderContext";

const SalesHistory = () => {
  // Provide a safe fallback array in case context is still initializing
  const { orders = [] } = useOrders() || {};
  const [selectedSale, setSelectedSale] = useState(null);

  // Get all completed orders from the global context
  const completedSales = [...orders]
    .filter((order) => order.status === "Completed")
    .reverse();

  // Calculate real metrics based on the completed orders
  const totalSalesAmount = completedSales.reduce((acc, order) => {
    if (order.amount !== undefined) return acc + order.amount;
    const subtotal = (order.items || []).reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );
    return acc + subtotal + (subtotal > 0 ? 50 : 0);
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
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
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
            <h2>
              Rs.{" "}
              {totalSalesAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
            <span>0% vs yesterday</span>
          </div>
        </div>

        <div className="sales-stat-card">
          <div className="stat-icon blue">🛒</div>

          <div>
            <h4>Total Orders</h4>
            <h2>{completedSales.length}</h2>
            <span>0 vs yesterday</span>
          </div>
        </div>

        <div className="sales-stat-card">
          <div className="stat-icon orange">📦</div>

          <div>
            <h4>Total Items Sold</h4>
            <h2>{totalItemsSold}</h2>
            <span>0% vs yesterday</span>
          </div>
        </div>

        <div className="sales-stat-card">
          <div className="stat-icon purple">💳</div>

          <div>
            <h4>Average Order Value</h4>
            <h2>
              Rs.{" "}
              {completedSales.length > 0
                ? (totalSalesAmount / completedSales.length).toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )
                : "0.00"}
            </h2>
            <span>0% vs yesterday</span>
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
              Today -{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            {completedSales.length > 0 ? (
              completedSales.map((sale, index) => {
                const subtotal = (sale.items || []).reduce(
                  (sum, item) => sum + item.qty * item.price,
                  0
                );
                const total =
                  sale.amount !== undefined
                    ? sale.amount
                    : (sale.items || []).reduce(
                        (sum, item) => sum + item.qty * item.price,
                        0
                      ) +
                      ((sale.items || []).reduce(
                        (sum, item) => sum + item.qty * item.price,
                        0
                      ) > 0
                        ? 50
                        : 0);
                const itemCount = (sale.items || []).reduce(
                  (sum, item) => sum + item.qty,
                  0
                );
                const itemNames = (sale.items || [])
                  .map((i) => `${i.name} x${i.qty}`)
                  .join(", ");

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
                        <p
                          className="truncate w-32"
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {itemNames}
                        </p>
                      </div>
                      <div className="sales-payment">
                        <h4>{sale.paymentMethod || "Cash"}</h4>
                        {/* Safely check if ID exists, and ensure it is treated as a String before using .replace() */}
                        <p>
                          INV-
                          {sale.id ? String(sale.id).replace(/\D/g, "") : "N/A"}
                        </p>
                      </div>
                      <div className="sales-amount">Rs. {total.toFixed(2)}</div>
                      <div>
                        <span className="sale-status completed">Completed</span>
                      </div>
                      <button className="details-btn" onClick={() => setSelectedSale(sale)}>View Details</button>
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

            <div className="load-more">Load More History</div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="sales-right">
          {/* PAYMENT METHOD */}
          <div className="right-card">
            <h3>Sales by Payment Method</h3>

            <div className="payment-chart">
              <div className="circle-chart">
                <div className="circle-center">
                  <h4>Total</h4>
                  <p>Rs. {totalSalesAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="chart-details">
                <div className="chart-item">
                  <span
                    className="dot"
                    style={{ backgroundColor: "#10b981" }}
                  ></span>
                  Cash
                </div>

                <div className="chart-item">
                  <span
                    className="dot"
                    style={{ backgroundColor: "#3b82f6" }}
                  ></span>
                  Card
                </div>

                <div className="chart-item">
                  <span
                    className="dot"
                    style={{ backgroundColor: "#22c55e" }}
                  ></span>
                  eSewa
                </div>

                <div className="chart-item">
                  <span
                    className="dot"
                    style={{ backgroundColor: "#8b5cf6" }}
                  ></span>
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
              <strong>
                Rs.{" "}
                {totalSalesAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </div>

            <div className="summary-item">
              <span>Total Orders</span>
              <strong>{completedSales.length}</strong>
            </div>

            <div className="summary-item">
              <span>Total Items Sold</span>
              <strong>{totalItemsSold}</strong>
            </div>

            <div className="summary-item">
              <span>Average Order Value</span>
              <strong>
                Rs.{" "}
                {completedSales.length > 0
                  ? (totalSalesAmount / completedSales.length).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )
                  : "0.00"}
              </strong>
            </div>

            <div className="summary-item">
              <span>Highest Sale</span>
              <strong>
                Rs.{" "}
                {completedSales.length > 0
                  ? Math.max(
                      ...completedSales.map((s) =>
                        s.amount !== undefined
                          ? s.amount
                          : (s.items || []).reduce(
                              (sum, i) => sum + i.qty * i.price,
                              0
                            ) + 50
                      )
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "0.00"}
              </strong>
            </div>

            <div className="summary-item">
              <span>Lowest Sale</span>
              <strong>
                Rs.{" "}
                {completedSales.length > 0
                  ? Math.min(
                      ...completedSales.map((s) =>
                        s.amount !== undefined
                          ? s.amount
                          : (s.items || []).reduce(
                              (sum, i) => sum + i.qty * i.price,
                              0
                            ) + 50
                      )
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "0.00"}
              </strong>
            </div>
          </div>

          {/* QUICK ACTION */}
          <div className="right-card">
            <h3>Quick Actions</h3>

            <button className="quick-btn blue-btn">View All Invoices</button>

            <button className="quick-btn green-btn">Go to Dashboard</button>
          </div>
        </div>
      </div>

      {/* SALE DETAILS MODAL */}
      {selectedSale && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[99] flex justify-center items-center p-4 transition-opacity" onClick={() => setSelectedSale(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-in p-6 relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Order {selectedSale.id}
                </h2>
                <p className="text-purple-600 font-bold text-xs mt-0.5">
                  {selectedSale.customer || "Walk-in Customer"}
                </p>
              </div>
              <button
                onClick={() => setSelectedSale(null)}
                className="bg-white border border-slate-200 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg shadow-sm transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-2">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-2 pl-2">Item</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 pr-2 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(selectedSale.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 pl-2 font-semibold text-slate-700">
                        {item.name}
                      </td>
                      <td className="py-3 text-center font-bold text-slate-500">
                        {item.qty}
                      </td>
                      <td className="py-3 pr-2 text-right font-black text-slate-900">
                        Rs. {(item.qty * (parseFloat(item.price) || 0)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-6 text-sm font-medium text-slate-600 flex justify-between items-center">
              <span>Total Amount</span>
              <span className="text-slate-900 font-black text-lg">
                Rs. {(
                  selectedSale.amount !== undefined
                    ? selectedSale.amount
                    : (selectedSale.items || []).reduce((sum, i) => sum + i.qty * i.price, 0) + 50
                ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;
