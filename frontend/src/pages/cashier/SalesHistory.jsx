// src/pages/cashier/SalesHistory.jsx

import React, { useState, useRef, useEffect } from "react";
import "../../styles/saleshistory.css";

import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaChevronRight,
  FaPrint,
} from "react-icons/fa";
import { X, ChevronDown, FileText } from "lucide-react";
import { useOrders } from "../../context/OrderContext";

const SalesHistory = () => {
  // Provide a safe fallback array in case context is still initializing
  const { orders = [] } = useOrders() || {};
  const [selectedSale, setSelectedSale] = useState(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef(null);

  // Filtering States
  const [searchTerm, setSearchTerm] = useState("");
  const [stationFilter, setStationFilter] = useState("All Stations");
  const [paymentFilter, setPaymentFilter] = useState("All Payment Methods");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [timeRange, setTimeRange] = useState("Today");
  const [showFilters, setShowFilters] = useState(true);

  // Date calculations for Time Range filter
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfLast7Days = new Date(startOfToday);
  startOfLast7Days.setDate(startOfLast7Days.getDate() - 6);
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Get all completed orders from the global context
  const completedSales = [...orders]
    .filter((order) => order.status === "Completed")
    .reverse();

  // Apply Filters
  const filteredSales = completedSales.filter((sale) => {
    const matchesSearch =
      (sale.id && String(sale.id).toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sale.customer && String(sale.customer).toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStation = stationFilter === "All Stations" || (sale.channel || "Dining") === stationFilter;
    const matchesPayment = paymentFilter === "All Payment Methods" || (sale.paymentMethod || "Cash") === paymentFilter;
    const matchesStatus = statusFilter === "All Status" || sale.status === statusFilter;

    // Time range matching
    const orderDate = new Date(sale.timestamp || sale.date);
    let matchesTime = true;
    if (timeRange === "Today") matchesTime = orderDate >= startOfToday;
    else if (timeRange === "Last 7 Days") matchesTime = orderDate >= startOfLast7Days;
    else if (timeRange === "This Month") matchesTime = orderDate >= startOfThisMonth;

    return matchesSearch && matchesStation && matchesPayment && matchesStatus && matchesTime;
  });

  // Calculate real metrics based on the completed orders
  const totalSalesAmount = filteredSales.reduce((acc, order) => {
    if (order.amount !== undefined) return acc + order.amount;
    const subtotal = (order.items || []).reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );
    return acc + subtotal + (subtotal > 0 ? 50 : 0);
  }, 0);

  const totalItemsSold = filteredSales.reduce((acc, order) => {
    return acc + (order.items || []).reduce((sum, item) => sum + item.qty, 0);
  }, 0);

  const paymentTotals = filteredSales.reduce((acc, sale) => {
    const method = sale.paymentMethod || "Cash";
    const subtotal = (sale.items || []).reduce((sum, item) => sum + item.qty * item.price, 0);
    const amount = sale.amount !== undefined ? sale.amount : subtotal + (subtotal > 0 ? 50 : 0);
    
    if (acc[method] !== undefined) acc[method] += amount;
    else acc["Cash"] += amount; // Fallback
    
    return acc;
  }, { Cash: 0, Card: 0, eSewa: 0, Khalti: 0 });

  // Handle CSV Export
  const handleExportCSV = () => {
    if (filteredSales.length === 0) {
      alert("No data to export based on current filters.");
      return;
    }

    const headers = ["Order ID", "Date", "Time", "Customer", "Channel", "Items", "Payment Method", "Amount", "Status"];
    const csvRows = filteredSales.map((sale) => {
      const itemNames = (sale.items || []).map(i => `${i.name} (x${i.qty})`).join("; ");
      const total = sale.amount !== undefined ? sale.amount : (sale.items || []).reduce((sum, item) => sum + item.qty * item.price, 0) + 50;

      return [
        sale.id,
        sale.date || "N/A",
        sale.time || "N/A",
        `"${sale.customer || "Walk-in"}"`,
        sale.channel || "Dining",
        `"${itemNames}"`,
        sale.paymentMethod || "Cash",
        total.toFixed(2),
        sale.status
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Sales_Report_${timeRange.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle PDF Export
  const handleExportPDF = () => {
    if (filteredSales.length === 0) {
      alert("No data to export based on current filters.");
      return;
    }
    
    // Give DOM a split second to ensure state is ready, then print
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="sales-history-page">
      {/* PRINT-ONLY STYLES FOR PDF EXPORT */}
      <style>
        {`
        .dropdown-item:hover {
          background-color: #f8fafc !important;
        }
        @media print {
          @page { margin: 10mm; size: A4 portrait; }
          html, body {
            background: #fff;
            margin: 0;
            padding: 0;
          }
          body * {
            visibility: hidden;
          }
          .sidebar, .navbar, header, footer, .sales-history-page > *:not(#printable-sales-report) {
            display: none !important;
          }
          .sales-history-page {
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
          }
          #printable-sales-report, #printable-sales-report * {
            visibility: visible;
          }
          #printable-sales-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            font-family: 'Arial', sans-serif;
            color: #000;
          }
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .print-table th, .print-table td {
            border: 1px solid #e2e8f0;
            padding: 10px;
            text-align: left;
            font-size: 12px;
          }
          .print-table th {
            background-color: #f8fafc !important;
            -webkit-print-color-adjust: exact;
            font-weight: bold;
            color: #334155;
          }
        }
        @media screen {
          #printable-sales-report {
            display: none;
          }
        }
        `}
      </style>

      {/* HEADER */}
      <div className="sales-top">
        <div>
          <h1>Sales History</h1>
          <p>Complete history of all sales transactions</p>
        </div>

        <div className="sales-top-actions" style={{ display: "flex", gap: "12px" }}>
          <select 
            className="date-btn" 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ cursor: "pointer", border: "1px solid #e2e8f0", backgroundColor: "#fff", padding: "8px 16px", borderRadius: "8px", outline: "none", fontSize: "14px", fontWeight: "600", color: "#334155" }}
          >
            <option value="Today">Today</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="This Month">This Month</option>
            <option value="All Time">All Time</option>
          </select>

          <button 
            className="filter-btn" 
            onClick={() => setShowFilters(!showFilters)}
            style={{ cursor: "pointer", border: "1px solid #e2e8f0", backgroundColor: "#fff", padding: "8px 16px", borderRadius: "8px", outline: "none", fontSize: "14px", fontWeight: "600", color: "#334155", display: "flex", alignItems: "center", gap: "8px", transition: "0.2s" }}
          >
            <FaFilter />
            Filter
          </button>

          <div style={{ position: "relative" }} ref={exportMenuRef}>
            <button
              className="export-btn"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              style={{ cursor: "pointer", border: "1px solid #e2e8f0", backgroundColor: "#fff", padding: "8px 16px", borderRadius: "8px", outline: "none", fontSize: "14px", fontWeight: "600", color: "#334155", display: "flex", alignItems: "center", gap: "8px", transition: "0.2s" }}
            >
              <FaDownload />
              Export
              <ChevronDown size={16} style={{ marginLeft: "4px", color: "#94a3b8" }} />
            </button>
            {isExportMenuOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 5px)", right: 0, background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "6px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", zIndex: 50, minWidth: "180px" }}>
                <button onClick={() => { handleExportPDF(); setIsExportMenuOpen(false); }} style={{ width: "100%", background: "none", border: "none", padding: "10px 12px", textAlign: "left", cursor: "pointer", borderRadius: "6px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "500" }} className="dropdown-item">
                  <FaDownload size={14} /> Download as PDF
                </button>
                <button onClick={() => { handleExportCSV(); setIsExportMenuOpen(false); }} style={{ width: "100%", background: "none", border: "none", padding: "10px 12px", textAlign: "left", cursor: "pointer", borderRadius: "6px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "500" }} className="dropdown-item">
                  <FileText size={14} /> Download as CSV
                </button>
                <button onClick={() => { handleExportPDF(); setIsExportMenuOpen(false); }} style={{ width: "100%", background: "none", border: "none", padding: "10px 12px", textAlign: "left", cursor: "pointer", borderRadius: "6px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "500" }} className="dropdown-item">
                  <FaPrint size={14} /> Print Report
                </button>
              </div>
            )}
          </div>
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
            <h2>{filteredSales.length}</h2>
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
              {filteredSales.length > 0
                ? (totalSalesAmount / filteredSales.length).toLocaleString(
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
          {showFilters && (
            <div className="sales-filters" style={{ transition: "all 0.3s ease" }}>
              <div className="sales-search">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer or Phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select value={stationFilter} onChange={(e) => setStationFilter(e.target.value)}>
                <option value="All Stations">All Stations</option>
                <option value="Dining">Dining</option>
                <option value="Takeaway">Takeaway</option>
                <option value="Delivery">Delivery</option>
              </select>

              <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
                <option value="All Payment Methods">All Payment Methods</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="eSewa">eSewa</option>
                <option value="Khalti">Khalti</option>
              </select>

              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All Status">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          )}

          {/* HISTORY LIST */}
          <div className="sales-list">
            <div className="sales-date">
              {timeRange} Sales
            </div>

            {filteredSales.length > 0 ? (
              filteredSales.map((sale, index) => {
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
                <div className="chart-item" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <div><span className="dot" style={{ backgroundColor: "#10b981" }}></span>Cash</div>
                  <strong>Rs. {paymentTotals.Cash.toLocaleString()}</strong>
                </div>

                <div className="chart-item" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <div><span className="dot" style={{ backgroundColor: "#3b82f6" }}></span>Card</div>
                  <strong>Rs. {paymentTotals.Card.toLocaleString()}</strong>
                </div>

                <div className="chart-item" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <div><span className="dot" style={{ backgroundColor: "#22c55e" }}></span>eSewa</div>
                  <strong>Rs. {paymentTotals.eSewa.toLocaleString()}</strong>
                </div>

                <div className="chart-item" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <div><span className="dot" style={{ backgroundColor: "#8b5cf6" }}></span>Khalti</div>
                  <strong>Rs. {paymentTotals.Khalti.toLocaleString()}</strong>
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
              <strong>{filteredSales.length}</strong>
            </div>

            <div className="summary-item">
              <span>Total Items Sold</span>
              <strong>{totalItemsSold}</strong>
            </div>

            <div className="summary-item">
              <span>Average Order Value</span>
              <strong>
                Rs.{" "}
                {filteredSales.length > 0
                  ? (totalSalesAmount / filteredSales.length).toLocaleString(
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
                {filteredSales.length > 0
                  ? Math.max(
                      ...filteredSales.map((s) =>
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
                {filteredSales.length > 0
                  ? Math.min(
                      ...filteredSales.map((s) =>
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

      {/* DEDICATED PRINTABLE PDF REPORT LAYOUT */}
      <div id="printable-sales-report">
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "22px", margin: "0 0 8px 0" }}>ASLENIX RESTAURANT</h2>
          <h3 style={{ fontSize: "16px", margin: "0 0 5px 0", color: "#475569" }}>Filtered Sales Report</h3>
          <p style={{ margin: "3px 0", fontSize: "13px" }}><strong>Time Range:</strong> {timeRange}</p>
          <p style={{ margin: "3px 0", fontSize: "13px" }}><strong>Generated On:</strong> {new Date().toLocaleString()}</p>
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "13px", backgroundColor: "#f8fafc", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", WebkitPrintColorAdjust: "exact" }}>
          <div><strong>Total Orders:</strong> {filteredSales.length}</div>
          <div><strong>Items Sold:</strong> {totalItemsSold}</div>
          <div><strong>Total Revenue:</strong> Rs. {totalSalesAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>

        <table className="print-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date & Time</th>
              <th>Customer</th>
              <th>Channel</th>
              <th>Payment</th>
              <th style={{ textAlign: "right" }}>Amount</th>
              <th style={{ textAlign: "center" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale, idx) => {
              const subtotal = (sale.items || []).reduce((sum, item) => sum + item.qty * item.price, 0);
              const total = sale.amount !== undefined ? sale.amount : subtotal + (subtotal > 0 ? 50 : 0);
              return (
                <tr key={idx}>
                  <td style={{ fontWeight: "bold" }}>{sale.id}</td>
                  <td>{sale.date || "N/A"} {sale.time || ""}</td>
                  <td>{sale.customer || "Walk-in"}</td>
                  <td>{sale.channel || "Dining"}</td>
                  <td>{sale.paymentMethod || "Cash"}</td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>Rs. {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: "center" }}>{sale.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesHistory;
