import React, { useState } from "react";
import "../../styles/staff.css";

const initialTables = [
  { 
    number: 1, 
    status: "Occupied", 
    customer: "John Doe", 
    seats: 4, 
    label: "Customers Dining",
    activeOrder: { id: "#ORD-1027", items: ["Chicken Momo x2", "Cold Coffee x3"], total: "Rs. 1390" }
  },
  { 
    number: 2, 
    status: "Available", 
    customer: "No Customer", 
    seats: 2, 
    label: "Ready for New Guests",
    activeOrder: null 
  },
  { 
    number: 3, 
    status: "Reserved", 
    customer: "Sarah Jenkins", 
    seats: 6, 
    label: "Reserved for Guest",
    reservationTime: "07:30 PM",
    activeOrder: null
  },
  { 
    number: 4, 
    status: "Occupied", 
    customer: "Alex Mercer", 
    seats: 4, 
    label: "Customers Dining",
    activeOrder: { id: "#ORD-1022", items: ["Pepperoni Pizza x1", "French Fries x1"], total: "Rs. 1100" }
  },
  { 
    number: 5, 
    status: "Available", 
    customer: "No Customer", 
    seats: 2, 
    label: "Ready for New Guests",
    activeOrder: null 
  },
  { 
    number: 6, 
    status: "Occupied", 
    customer: "Emily Watson", 
    seats: 5, 
    label: "Customers Dining",
    activeOrder: { id: "#ORD-1025", items: ["Chicken Burger x2", "Chowmein x1"], total: "Rs. 1250" }
  },
];

const initialOrders = [
  { id: "#ORD-1025", table: "Table 6", itemsCount: 3, status: "Preparing", statusClass: "preparing" },
  { id: "#ORD-1026", table: "Table 5", itemsCount: 2, status: "Ready", statusClass: "ready" },
  { id: "#ORD-1027", table: "Table 1", itemsCount: 5, status: "Cooking", statusClass: "cooking" },
];

const Dashboard = () => {
  const [tablesList, setTablesList] = useState(initialTables);
  const [ordersList, setOrdersList] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal tracking states
  const [selectedTableDetails, setSelectedTableDetails] = useState(null);
  const [editingTable, setEditingTable] = useState(null);

  // Edit form states
  const [editStatus, setEditStatus] = useState("");
  const [editCustomer, setEditCustomer] = useState("");
  const [editSeats, setEditSeats] = useState(2);
  const [editTime, setEditTime] = useState("");

  // Filter tables list automatically
  const filteredTables = tablesList.filter((table) =>
    `Table ${table.number}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open Edit Layout Mode
  const openEditModal = (table) => {
    setEditingTable(table);
    setEditStatus(table.status);
    setEditCustomer(table.customer === "No Customer" ? "" : table.customer);
    setEditSeats(table.seats);
    setEditTime(table.reservationTime || "07:00 PM");
  };

  // Process and save updated table data properties
  const handleSaveTableEdits = (e) => {
    e.preventDefault();
    
    setTablesList(prev => prev.map(t => {
      if (t.number === editingTable.number) {
        let derivedLabel = "Ready for New Guests";
        let finalCustomer = editCustomer.trim() || "No Customer";

        if (editStatus === "Occupied") derivedLabel = "Customers Dining";
        if (editStatus === "Reserved") derivedLabel = "Reserved for Guest";
        if (editStatus === "Available") finalCustomer = "No Customer";

        return {
          ...t,
          status: editStatus,
          customer: finalCustomer,
          seats: parseInt(editSeats, 10),
          label: derivedLabel,
          reservationTime: editStatus === "Reserved" ? editTime : null,
          activeOrder: editStatus === "Occupied" ? (t.activeOrder || { id: "#ORD-NEW", items: ["Custom Order Initialized"], total: "Rs. 0" }) : null
        };
      }
      return t;
    }));

    setEditingTable(null);
  };

  const handleOrderStatusCycle = (id) => {
    setOrdersList(prevOrders => 
      prevOrders.map(order => {
        if (order.id === id) {
          if (order.status === "Cooking") return { ...order, status: "Preparing", statusClass: "preparing" };
          if (order.status === "Preparing") return { ...order, status: "Ready", statusClass: "ready" };
          return { ...order, status: "Cooking", statusClass: "cooking" };
        }
        return order;
      })
    );
  };

  return (
    <div className="staff-page">
      
      {/* HEADER */}
      <div className="staff-header">
        <div>
          <h1>Welcome Back 👋</h1>
          <p>Manage restaurant tables and live orders beautifully</p>
        </div>
        <button className="take-order-btn">
          <span>+</span> Take New Order
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="staff-stats">
        <div className="staff-stat-card">
          <div className="stat-icon blue">🍽</div>
          <div>
            <h2>{tablesList.filter(t => t.status === "Occupied").length}</h2>
            <p>Active Tables</p>
          </div>
        </div>
        <div className="staff-stat-card">
          <div className="stat-icon orange">📦</div>
          <div>
            <h2>8</h2>
            <p>Pending Orders</p>
          </div>
        </div>
        <div className="staff-stat-card">
          <div className="stat-icon green">✅</div>
          <div>
            <h2>42</h2>
            <p>Completed Orders</p>
          </div>
        </div>
        <div className="staff-stat-card">
          <div className="stat-icon red">⏰</div>
          <div>
            <h2>{tablesList.filter(t => t.status === "Reserved").length}</h2>
            <p>Reservations</p>
          </div>
        </div>
      </div>

      {/* WORKSPACE FLEX SPLIT */}
      <div className="dashboard-workspace-grid">
        
        {/* TABLES BLOCK MONITOR */}
        <div className="tables-section">
          <div className="section-top">
            <h2>Restaurant Tables</h2>
            <div className="search-wrapper">
              <span className="search-icon-inside">🔍</span>
              <input
                type="text"
                placeholder="Search table or state..."
                className="table-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="tables-grid">
            {filteredTables.map((table, index) => (
              <div key={index} className={`table-card card-status-${table.status.toLowerCase()}`}>
                <div className="table-top">
                  <h3>Table {table.number}</h3>
                  <span className={`table-status badge-${table.status.toLowerCase()}`}>
                    <span className="badge-bullet"></span> {table.status}
                  </span>
                </div>

                <div className="table-body">
                  <div className="table-graphic-placeholder">
                    <span className="graphic-utensils">🍽️</span>
                  </div>
                  <div className="table-meta-details">
                    <p className="meta-label">{table.label}</p>
                    <p className="meta-sub"><strong>Guest:</strong> {table.customer}</p>
                    <p className="meta-sub"><strong>Capacity:</strong> {table.seats} Seats</p>
                  </div>
                </div>

                <div className="table-card-actions">
                  <button className="manage-btn-view" onClick={() => setSelectedTableDetails(table)}>
                    View
                  </button>
                  <button className="manage-btn-edit" onClick={() => openEditModal(table)}>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LIVE ORDERS QUEUE CONTAINER */}
        <div className="live-orders">
          <div className="section-top">
            <h2>Live Orders Queue</h2>
            <button className="view-all-btn">View All</button>
          </div>

          <div className="orders-list">
            {ordersList.map((order) => (
              <div className="order-card-row" key={order.id} onClick={() => handleOrderStatusCycle(order.id)}>
                <div className="order-main-info">
                  <div className="order-hash-badge">{order.id}</div>
                  <div>
                    <h3>{order.table}</h3>
                    <p>{order.itemsCount} Items loaded</p>
                  </div>
                </div>
                <div className="order-status-action-box">
                  <span className={`order-pill ${order.statusClass}`}>{order.status}</span>
                  <span className="click-hint-dot">➔</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* --- POPUP 1: WORKING VIEW MODAL --- */}
      {selectedTableDetails && (
        <div className="modal-backdrop" onClick={() => setSelectedTableDetails(null)}>
          <div className="table-inspect-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div>
                <h2>Overview: Table {selectedTableDetails.number}</h2>
                <span className={`table-status badge-${selectedTableDetails.status.toLowerCase()}`}>
                  <span className="badge-bullet"></span> {selectedTableDetails.status}
                </span>
              </div>
              <button className="modal-close-cross" onClick={() => setSelectedTableDetails(null)}>×</button>
            </div>
            <hr className="modal-spacer-line" />
            <div className="modal-details-grid">
              <div className="detail-item">
                <span className="detail-title">Current Guest Assignee</span>
                <p className="detail-value">{selectedTableDetails.customer}</p>
              </div>
              <div className="detail-item">
                <span className="detail-title">Configured Seats Capacity</span>
                <p className="detail-value">{selectedTableDetails.seats} People max</p>
              </div>
              {selectedTableDetails.status === "Reserved" && (
                <div className="detail-item full-width-item">
                  <span className="detail-title">Expected Arrival ETA</span>
                  <p className="detail-value warning-text">🕒 Today at {selectedTableDetails.reservationTime}</p>
                </div>
              )}
            </div>
            {selectedTableDetails.status === "Occupied" && selectedTableDetails.activeOrder ? (
              <div className="modal-order-subview">
                <h4>Active Running Ticket ({selectedTableDetails.activeOrder.id})</h4>
                <div className="modal-items-bucket">
                  {selectedTableDetails.activeOrder.items.map((item, i) => (
                    <div key={i} className="bucket-item-row"><span>{item}</span></div>
                  ))}
                </div>
                <div className="bucket-total-row">
                  <span>Current Running Balance:</span>
                  <strong>{selectedTableDetails.activeOrder.total}</strong>
                </div>
              </div>
            ) : selectedTableDetails.status === "Available" ? (
              <div className="modal-empty-notice-box">
                <p>This station is clean and set up. Ready to process a new terminal order immediately.</p>
              </div>
            ) : null}
            <div className="modal-action-footer">
              <button className="footer-dismiss-btn" onClick={() => setSelectedTableDetails(null)}>Dismiss View</button>
            </div>
          </div>
        </div>
      )}

      {/* --- POPUP 2: WORKING EDIT MODAL --- */}
      {editingTable && (
        <div className="modal-backdrop" onClick={() => setEditingTable(null)}>
          <form className="table-inspect-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSaveTableEdits}>
            <div className="modal-header-row">
              <div>
                <h2>Modify Configuration: Table {editingTable.number}</h2>
                <p className="modal-subtitle-text">Adjust live layout status and hospitality parameters</p>
              </div>
              <button type="button" className="modal-close-cross" onClick={() => setEditingTable(null)}>×</button>
            </div>
            
            <hr className="modal-spacer-line" />

            <div className="edit-form-body-wrapper">
              {/* Form Input Item 1 */}
              <div className="form-input-block">
                <label className="detail-title">Current Table Hospitality Status</label>
                <select className="form-select-element" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                  <option value="Available">🟢 Available (Vacant)</option>
                  <option value="Occupied">🔴 Occupied (Dining)</option>
                  <option value="Reserved">🟡 Reserved (Booked Holder)</option>
                </select>
              </div>

              {/* Form Input Item 2 */}
              {editStatus !== "Available" && (
                <div className="form-input-block animation-fade-slide">
                  <label className="detail-title">Primary Guest Full Name</label>
                  <input 
                    type="text" 
                    className="form-text-input-field" 
                    placeholder="E.g., Michael Scott" 
                    required
                    value={editCustomer} 
                    onChange={(e) => setEditCustomer(e.target.value)} 
                  />
                </div>
              )}

              {/* Grid block pair elements */}
              <div className="modal-details-grid custom-margin-top">
                <div className="form-input-block">
                  <label className="detail-title">Total Seating Max</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="12" 
                    className="form-text-input-field" 
                    value={editSeats} 
                    onChange={(e) => setEditSeats(e.target.value)} 
                  />
                </div>

                {editStatus === "Reserved" && (
                  <div className="form-input-block animation-fade-slide">
                    <label className="detail-title">Arrival Target Time</label>
                    <input 
                      type="text" 
                      className="form-text-input-field" 
                      placeholder="E.g., 08:15 PM" 
                      value={editTime} 
                      onChange={(e) => setEditTime(e.target.value)} 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="modal-action-footer custom-border-top">
              <button type="button" className="footer-dismiss-btn" onClick={() => setEditingTable(null)}>Cancel Changes</button>
              <button type="submit" className="footer-action-btn-bill">Apply Configuration</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default Dashboard;