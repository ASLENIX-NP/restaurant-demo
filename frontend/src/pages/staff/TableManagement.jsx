import React, { useState } from "react";
import "../../styles/tables.css";

// Initial data populated with realistic static items for testing the view feature
const initialTables = [
  { 
    id: 1, 
    seats: 4, 
    status: "Available", 
    customer: "No Customer",
    activeOrder: null 
  },
  { 
    id: 2, 
    seats: 2, 
    status: "Available", 
    customer: "No Customer",
    activeOrder: null 
  },
  { 
    id: 3, 
    seats: 6, 
    status: "Available", 
    customer: "No Customer",
    activeOrder: null 
  },
  { 
    id: 4, 
    seats: 8, 
    status: "Available", 
    customer: "No Customer",
    activeOrder: null 
  },
  { 
    id: 5, 
    seats: 2, 
    status: "Available", 
    customer: "No Customer",
    activeOrder: null 
  },
  { 
    id: 6, 
    seats: 5, 
    status: "Available", 
    customer: "No Customer",
    activeOrder: null 
  },
  { 
    id: 7, 
    seats: 3, 
    status: "Available", 
    customer: "No Customer",
    activeOrder: null 
  },
  { 
    id: 8, 
    seats: 6, 
    status: "Available", 
    customer: "No Customer",
    activeOrder: null 
  },
];

const Tables = () => {
  const [tablesList, setTablesList] = useState(initialTables);
  const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'view' | null
  const [selectedTable, setSelectedTable] = useState(null);

  // Form states for Add/Edit
  const [formSeats, setFormSeats] = useState("");
  const [formStatus, setFormStatus] = useState("Available");
  const [formCustomer, setFormCustomer] = useState("");


  // Dynamic Dashboard Stats Counters
  const totalTables = tablesList.length;
  const availableCount = tablesList.filter((t) => t.status === "Available").length;
  const occupiedCount = tablesList.filter((t) => t.status === "Occupied").length;
  const reservedCount = tablesList.filter((t) => t.status === "Reserved").length;

  // --- Modal Controllers ---
  const handleOpenAdd = () => {
    setFormSeats("");
    setFormStatus("Available");
    setFormCustomer("No Customer");
    setActiveModal("add");
  };

  const handleOpenEdit = (table) => {
    setSelectedTable(table);
    setFormSeats(table.seats);
    setFormStatus(table.status);
    setFormCustomer(table.customer);
    setActiveModal("edit");
  };

  const handleOpenView = (table) => {
    setSelectedTable(table);
    setActiveModal("view");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedTable(null);
  };

  // --- Toggle Food Status (Interactive Status Tag) ---
  const toggleItemDelivery = (tableId, itemId) => {
    const updatedTables = tablesList.map((t) => {
      if (t.id === tableId && t.activeOrder) {
        const updatedOrder = t.activeOrder.map((item) =>
          item.id === itemId ? { ...item, delivered: !item.delivered } : item
        );
        return { ...t, activeOrder: updatedOrder };
      }
      return t;
    });

    setTablesList(updatedTables);
    // Directly update modal viewport state sync
    const currentlyViewing = updatedTables.find((t) => t.id === tableId);
    setSelectedTable(currentlyViewing);
  };

  // --- Form Operations ---
  const saveAddTable = (e) => {
    e.preventDefault();
    const newTable = {
      id: tablesList.length > 0 ? Math.max(...tablesList.map((t) => t.id)) + 1 : 1,
      seats: parseInt(formSeats, 10),
      status: formStatus,
      customer: formStatus === "Available" || formStatus === "Cleaning" ? "No Customer" : formCustomer || "Anonymous",
      activeOrder: null
    };
    setTablesList([...tablesList, newTable]);
    closeModal();
  };

  const saveEditTable = (e) => {
    e.preventDefault();
    setTablesList(
      tablesList.map((t) =>
        t.id === selectedTable.id
          ? {
              ...t,
              seats: parseInt(formSeats, 10),
              status: formStatus,
              customer: formStatus === "Available" || formStatus === "Cleaning" ? "No Customer" : formCustomer,
              activeOrder: formStatus === "Available" || formStatus === "Cleaning" ? null : t.activeOrder
            }
          : t
      )
    );
    closeModal();
  };

  return (
    <div className="tables-page">
      {/* HEADER */}
      <div className="tables-header">
        <div>
          <h1>Restaurant Tables</h1>
          <p>Live table availability</p>
        </div>
        <button className="add-table-btn" onClick={handleOpenAdd}>
          + Add Table
        </button>
      </div>

      {/* STATS */}
      <div className="table-stats">
        <div className="table-stat-card">
          <h2>{totalTables}</h2>
          <p>Total Tables</p>
        </div>
        <div className="table-stat-card green">
          <h2>{availableCount}</h2>
          <p>Available</p>
        </div>
        <div className="table-stat-card red">
          <h2>{occupiedCount}</h2>
          <p>Occupied</p>
        </div>
        <div className="table-stat-card orange">
          <h2>{reservedCount}</h2>
          <p>Reserved</p>
        </div>
      </div>

      {/* TABLES GRID */}
      <div className="tables-grid">
        {tablesList.map((table) => (
          <div className={`table-card ${table.status.toLowerCase()}`} key={table.id}>
            <div className="table-top">
              <h2>Table {table.id}</h2>
              <span className={`status-badge ${table.status.toLowerCase()}`}>
                {table.status}
              </span>
            </div>

            <div className="table-icon">🍽️</div>

            <div className="table-info">
              <p><strong>Seats:</strong> {table.seats}</p>
              <p><strong>Customer:</strong> {table.customer}</p>
            </div>

            <div className="table-actions">
              <button className="view-btn" onClick={() => handleOpenView(table)}>
                View
              </button>
              <button className="edit-btn" onClick={() => handleOpenEdit(table)}>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODALS REGION ================= */}
      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            {/* VIEW DETAILS MODAL */}
            {activeModal === "view" && selectedTable && (
              <div>
                <h2>Table {selectedTable.id} Details</h2>
                <hr />
                <div className="view-details-info">
                  <p><strong>Status:</strong> <span className={`status-text ${selectedTable.status.toLowerCase()}`}>{selectedTable.status}</span></p>
                  <p><strong>Capacity:</strong> {selectedTable.seats} Seats</p>
                  <p><strong>Customer:</strong> {selectedTable.customer}</p>
                </div>

                <h3 style={{ marginTop: "24px", fontSize: "16px", color: "#1e293b" }}>Ordered Items Tracking</h3>
                <hr style={{ margin: "8px 0" }} />
                
                <div className="modal-order-list">
                  {!selectedTable.activeOrder || selectedTable.activeOrder.length === 0 ? (
                    <p className="no-orders-text">No active orders running for this table.</p>
                  ) : (
                    selectedTable.activeOrder.map((item) => (
                      <div className="modal-order-item" key={item.id}>
                        <div className="item-name-qty">
                          <span>{item.name}</span>
                          <strong className="item-qty">x{item.qty}</strong>
                        </div>
                        
                        {/* Interactive Toggle Button status layout */}
                        <button 
                          type="button"
                          className={`delivery-toggle-btn ${item.delivered ? "delivered" : "pending"}`}
                          onClick={() => toggleItemDelivery(selectedTable.id, item.id)}
                        >
                          {item.delivered ? "✓ Delivered" : "⏳ Pending"}
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="modal-actions">
                  <button className="modal-close-btn" onClick={closeModal}>Close Details</button>
                </div>
              </div>
            )}

            {/* ADD / EDIT FORM MODALS */}
            {(activeModal === "add" || activeModal === "edit") && (
              <form onSubmit={activeModal === "add" ? saveAddTable : saveEditTable}>
                <h2>{activeModal === "add" ? "Add New Table" : `Edit Table ${selectedTable?.id}`}</h2>
                <hr />
                
                <div className="form-group">
                  <label>Number of Seats:</label>
                  <input
                    type="number"
                    value={formSeats}
                    onChange={(e) => setFormSeats(e.target.value)}
                    required
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Status:</label>
                  <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)}>
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Cleaning">Cleaning</option>
                  </select>
                </div>

                {formStatus !== "Available" && formStatus !== "Cleaning" && (
                  <div className="form-group">
                    <label>Customer Name:</label>
                    <input
                      type="text"
                      value={formCustomer}
                      onChange={(e) => setFormCustomer(e.target.value)}
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                )}

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;