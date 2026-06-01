import React, { useState } from "react";
import "../../styles/history.css";

const initialOrders = [
  {
    id: "#1021",
    table: "Table 4",
    amount: "Rs. 2400",
    status: "Completed",
    customer: "John Doe",
    customerType: "Regular Customer",
    itemsCount: 4,
    time: "7:30 PM",
    date: "2026-06-01",
    paymentMethod: "UPI / QR",
    breakdown: [
      { name: "Chicken Burger", qty: 2, price: 600 },
      { name: "French Fries", qty: 1, price: 400 },
      { name: "Cold Coffee", qty: 1, price: 800 }
    ]
  },
  {
    id: "#1022",
    table: "Table 2",
    amount: "Rs. 1800",
    status: "Cancelled",
    customer: "Emily Smith",
    customerType: "New Customer",
    itemsCount: 2,
    time: "8:00 PM",
    date: "2026-06-01",
    paymentMethod: "N/A",
    breakdown: [
      { name: "Chowmein", qty: 2, price: 900 }
    ]
  },
  {
    id: "#1023",
    table: "Table 7",
    amount: "Rs. 3200",
    status: "Completed",
    customer: "Michael Lee",
    customerType: "VIP Guest",
    itemsCount: 5,
    time: "9:15 PM",
    date: "2026-05-31",
    paymentMethod: "Credit Card",
    breakdown: [
      { name: "Pepperoni Pizza", qty: 1, price: 1400 },
      { name: "Chicken Momo", qty: 2, price: 1000 },
      { name: "Cold Coffee", qty: 2, price: 800 }
    ]
  },
];

const avatarColors = ["#3b82f6", "#ec4899", "#8b5cf6"];

const History = () => {
  const [ordersList] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All"); // "All" | "Completed" | "Cancelled"
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // --- Search & Filter Logic ---
  const filteredOrders = ordersList.filter((order) => {
    const matchesSearch = 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.table.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "All" || order.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  // --- Dynamic Stats Summary ---
  const totalSales = ordersList
    .filter(o => o.status === "Completed")
    .reduce((sum, o) => sum + parseInt(o.amount.replace("Rs. ", ""), 10), 0);

  const completedCount = ordersList.filter(o => o.status === "Completed").length;
  const cancelledCount = ordersList.filter(o => o.status === "Cancelled").length;

  // --- Export Simulator Action ---
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("✅ Order log data successfully compiled and ready! CSV manifest document downloaded.");
    }, 1200);
  };

  return (
    <div className="history-page">
      
      {/* HEADER ROW */}
      <div className="history-header">
        <div>
          <h1>Order History</h1>
          <p>Track previous customer orders professionally</p>
        </div>

        <button 
          className={`export-btn ${isExporting ? "loading" : ""}`} 
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? "Compiling..." : "📥 Export History"}
        </button>
      </div>

      {/* DASHBOARD SUMMARY CARDS */}
      <div className="history-summary-cards">
        <div className="summary-card">
          <span className="card-icon blue">💰</span>
          <div>
            <h3>Rs. {totalSales}</h3>
            <p>Total Revenue Processed</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="card-icon green">✅</span>
          <div>
            <h3>{completedCount} Orders</h3>
            <p>Completed Manifests</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="card-icon red">❌</span>
          <div>
            <h3>{cancelledCount} Orders</h3>
            <p>Cancelled Invoices</p>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="history-toolbar">
        <div className="search-input-wrapper">
          <span className="search-inside-icon">🔍</span>
          <input
            type="text"
            placeholder="Search ID, Customer, Table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {["All", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER MASTER TABLE */}
      <div className="history-table-wrapper">
        {filteredOrders.length === 0 ? (
          <div className="empty-search-state">
            <p>No logged order profiles found matching your current parameters.</p>
          </div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Profile</th>
                <th>Assigned Table</th>
                <th>Cart Load</th>
                <th>Timestamp</th>
                <th>Gross Settlement</th>
                <th>Workflow Status</th>
                <th style={{ textAlign: "center" }}>Operations</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => {
                const avatarStyle = { backgroundColor: avatarColors[index % avatarColors.length] };
                return (
                  <tr key={order.id} className="table-row-hover">
                    <td className="order-id">{order.id}</td>
                    
                    <td>
                      <div className="customer-box">
                        <div className="customer-avatar" style={avatarStyle}>
                          {order.customer.charAt(0)}
                        </div>
                        <div>
                          <h4>{order.customer}</h4>
                          <p>{order.customerType}</p>
                        </div>
                      </div>
                    </td>

                    <td><span className="table-badge">{order.table}</span></td>
                    <td>{order.itemsCount} Items</td>
                    <td>{order.time}</td>
                    <td className="amount">{order.amount}</td>
                    
                    <td>
                      <span className={`status-badge-history ${order.status.toLowerCase()}`}>
                        <span className="badge-dot"></span>
                        {order.status}
                      </span>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <button 
                        className="action-inspect-btn"
                        onClick={() => setSelectedOrder(order)}
                      >
                        📄 Receipt
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* INTERACTIVE DETAILS POPUP MODAL */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content invoice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-header">
              <div>
                <h2>Invoice Manifest</h2>
                <p>ID: {selectedOrder.id} • {selectedOrder.date}</p>
              </div>
              <button className="close-x-btn" onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            
            <hr className="divider-line"/>

            <div className="invoice-meta-grid">
              <p><strong>Customer:</strong> {selectedOrder.customer}</p>
              <p><strong>Station ID:</strong> {selectedOrder.table}</p>
              <p><strong>Timestamp:</strong> {selectedOrder.time}</p>
              <p><strong>Channel:</strong> {selectedOrder.paymentMethod}</p>
            </div>

            <h4 className="section-title">Itemized Summary</h4>
            <div className="invoice-items-list">
              {selectedOrder.breakdown.map((item, i) => (
                <div key={i} className="invoice-item-row">
                  <span>{item.name} <strong>x{item.qty}</strong></span>
                  <span>Rs. {item.price}</span>
                </div>
              ))}
            </div>

            <hr className="divider-line" />
            
            <div className="invoice-total-row">
              <h3>Grand Total</h3>
              <h2>{selectedOrder.amount}</h2>
            </div>

            <div className="invoice-status-footer">
              <span className={`status-badge-history ${selectedOrder.status.toLowerCase()}`}>
                Invoice State: {selectedOrder.status}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default History;