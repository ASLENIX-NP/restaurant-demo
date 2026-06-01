import React, { useState } from "react";
import "../../styles/tables.css";

// Initial mock data array
const initialTables = [
  { id: 1, seats: 4, status: "Available", customer: "No Customer" },
  { id: 2, seats: 2, status: "Occupied", customer: "John Doe" },
  { id: 3, seats: 6, status: "Reserved", customer: "Sarah" },
  { id: 4, seats: 8, status: "Cleaning", customer: "Cleaning Team" },
  { id: 5, seats: 2, status: "Available", customer: "No Customer" },
  { id: 6, seats: 5, status: "Occupied", customer: "Emily" },
  { id: 7, seats: 3, status: "Reserved", customer: "Michael" },
  { id: 8, seats: 6, status: "Available", customer: "No Customer" },
];

const Tables = () => {
  // --- UI & Data State Management ---
  const [tablesList, setTablesList] = useState(initialTables);
  const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'view' | null
  const [selectedTable, setSelectedTable] = useState(null);

  // Form states
  const [formSeats, setFormSeats] = useState("");
  const [formStatus, setFormStatus] = useState("Available");
  const [formCustomer, setFormCustomer] = useState("");

  // --- Dynamic Dashboard Counters ---
  const totalTables = tablesList.length;
  const availableCount = tablesList.filter((t) => t.status === "Available").length;
  const occupiedCount = tablesList.filter((t) => t.status === "Occupied").length;
  const reservedCount = tablesList.filter((t) => t.status === "Reserved").length;

  // --- Action Handlers ---
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

  // --- Form Submissions ---
  const saveAddTable = (e) => {
    e.preventDefault();
    if (!formSeats || formSeats <= 0) return alert("Please enter valid seats.");

    const newTable = {
      id: tablesList.length > 0 ? Math.max(...tablesList.map((t) => t.id)) + 1 : 1,
      seats: parseInt(formSeats, 10),
      status: formStatus,
      customer: formStatus === "Available" || formStatus === "Cleaning" ? "No Customer" : formCustomer || "Anonymous",
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

      {/* DYNAMIC STATS */}
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

      {/* GRID LAYOUT */}
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

      {/* ================= MODAL WINDOWS UI ================= */}
      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            {/* VIEW MODAL */}
            {activeModal === "view" && selectedTable && (
              <div>
                <h2>Table {selectedTable.id} Details</h2>
                <hr />
                <p><strong>Status:</strong> {selectedTable.status}</p>
                <p><strong>Capacity:</strong> {selectedTable.seats} Seats</p>
                <p><strong>Current Customer:</strong> {selectedTable.customer}</p>
                <button className="modal-close-btn" onClick={closeModal}>Close</button>
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