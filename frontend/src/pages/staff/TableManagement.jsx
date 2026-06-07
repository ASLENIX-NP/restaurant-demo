import React, { useState } from "react";
import "../../styles/tables.css";
import { useTables } from "../../context/TableContext";
import { useOrders } from "../../context/OrderContext";

const Tables = () => {
  const { tables, addTable, editTable, updateTableStatus } = useTables() || {
    tables: [],
  };
  const { orders, setOrders, cancelOrder, completeOrder } = useOrders() || {
    orders: [],
  };

  const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'view' | null
  const [selectedTable, setSelectedTable] = useState(null);

  // Form states for Add/Edit
  const [formSeats, setFormSeats] = useState("");
  const [formStatus, setFormStatus] = useState("Available");
  const [formCustomer, setFormCustomer] = useState("");

  // Map global tables to the format needed
  const tablesList = tables.map((t) => {
    const tableOrders = orders.filter(
      (o) =>
        o.table === t.name &&
        o.status !== "Completed" &&
        o.status !== "Cancelled"
    );

    let activeOrder =
      tableOrders.length > 0 ? tableOrders.flatMap((o) => o.items || []) : null;

    return {
      ...t,
      customer: t.currentCustomer || "No Customer",
      activeOrder,
    };
  });

  // Dynamic Dashboard Stats Counters
  const totalTables = tablesList.length;
  const availableCount = tablesList.filter(
    (t) => t.status === "Available"
  ).length;
  const occupiedCount = tablesList.filter(
    (t) => t.status === "Occupied"
  ).length;
  const reservedCount = tablesList.filter(
    (t) => t.status === "Reserved"
  ).length;

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
    if (setOrders) {
      // Find orders for this table
      const targetTable = tables.find((t) => t.id === tableId);
      if (!targetTable) return;

      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (
            order.table === targetTable.name &&
            order.status !== "Completed" &&
            order.status !== "Cancelled"
          ) {
            return {
              ...order,
              items: (order.items || []).map((item) =>
                item.id === itemId
                  ? { ...item, delivered: !item.delivered }
                  : item
              ),
            };
          }
          return order;
        })
      );
    }
  };

  // --- Form Operations ---
  const saveAddTable = (e) => {
    e.preventDefault();
    const newCustomer =
      formStatus === "Available" || formStatus === "Cleaning"
        ? "No Customer"
        : formCustomer || "Anonymous";
    addTable({
      name: `Table ${tables.length + 1}`,
      seats: parseInt(formSeats, 10),
      status: formStatus,
      currentCustomer: newCustomer,
    });
    closeModal();
  };

  const saveEditTable = (e) => {
    e.preventDefault();
    const newCustomer =
      formStatus === "Available" || formStatus === "Cleaning"
        ? "No Customer"
        : formCustomer || "Anonymous";
    editTable(selectedTable.id, {
      seats: parseInt(formSeats, 10),
      status: formStatus,
      currentCustomer: newCustomer,
    });
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
          <div
            className={`table-card ${
              table.status ? table.status.toLowerCase() : "available"
            }`}
            key={table.id}
          >
            <div className="table-top">
              <h2>{table.name}</h2>
              <span
                className={`status-badge ${
                  table.status ? table.status.toLowerCase() : "available"
                }`}
              >
                {table.status}
              </span>
            </div>

            <div className="table-icon">🍽️</div>

            <div className="table-info">
              <p>
                <strong>Seats:</strong> {table.seats}
              </p>
              <p>
                <strong>Customer:</strong> {table.customer}
              </p>
            </div>

            <div className="table-actions">
              <button
                className="view-btn"
                onClick={() => handleOpenView(table)}
              >
                View
              </button>
              <button
                className="edit-btn"
                onClick={() => handleOpenEdit(table)}
              >
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
            {activeModal === "view" &&
              selectedTable &&
              (() => {
                const currentViewingTable =
                  tablesList.find((t) => t.id === selectedTable.id) ||
                  selectedTable;
                return (
                  <div>
                    <h2>{currentViewingTable.name} Details</h2>
                    <hr />
                    <div className="view-details-info">
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`status-text ${
                            currentViewingTable.status
                              ? currentViewingTable.status.toLowerCase()
                              : "available"
                          }`}
                        >
                          {currentViewingTable.status}
                        </span>
                      </p>
                      <p>
                        <strong>Capacity:</strong> {currentViewingTable.seats}{" "}
                        Seats
                      </p>
                      <p>
                        <strong>Customer:</strong>{" "}
                        {currentViewingTable.customer}
                      </p>
                    </div>

                    <h3
                      style={{
                        marginTop: "24px",
                        fontSize: "16px",
                        color: "#1e293b",
                      }}
                    >
                      Ordered Items Tracking
                    </h3>
                    <hr style={{ margin: "8px 0" }} />

                    <div className="modal-order-list">
                      {!currentViewingTable.activeOrder ||
                      currentViewingTable.activeOrder.length === 0 ? (
                        <p className="no-orders-text">
                          No active orders running for this table.
                        </p>
                      ) : (
                        currentViewingTable.activeOrder.map((item, idx) => (
                          <div
                            className="modal-order-item"
                            key={item.id || idx}
                          >
                            <div className="item-name-qty">
                              <span>{item.name}</span>
                              <strong className="item-qty">x{item.qty}</strong>
                            </div>

                            {/* Interactive Toggle Button status layout */}
                            <button
                              type="button"
                              className={`delivery-toggle-btn ${
                                item.delivered ? "delivered" : "pending"
                              }`}
                              onClick={() =>
                                toggleItemDelivery(
                                  currentViewingTable.id,
                                  item.id
                                )
                              }
                            >
                              {item.delivered ? "✓ Delivered" : "⏳ Pending"}
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    <div
                      className="modal-actions"
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "20px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Cancel all active orders for this table?"
                            )
                          ) {
                            const tableOrders = orders.filter(
                              (o) =>
                                o.table === currentViewingTable.name &&
                                o.status !== "Completed" &&
                                o.status !== "Cancelled"
                            );
                            tableOrders.forEach((o) => {
                              if (cancelOrder) cancelOrder(o.id);
                            });
                            if (updateTableStatus)
                              updateTableStatus(
                                currentViewingTable.id,
                                "Available",
                                "No Customer"
                              );
                            closeModal();
                          }
                        }}
                        className="cancel-btn"
                        style={{
                          flex: 1,
                          backgroundColor: "#fff1f2",
                          color: "#e11d48",
                          border: "1px solid #ffe4e6",
                        }}
                      >
                        Cancel Order
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Checkout and mark this table's orders as Paid?"
                            )
                          ) {
                            const tableOrders = orders.filter(
                              (o) =>
                                o.table === currentViewingTable.name &&
                                o.status !== "Completed" &&
                                o.status !== "Cancelled"
                            );
                            tableOrders.forEach((o) => {
                              if (completeOrder)
                                completeOrder(o.id, { paymentMethod: "Cash" });
                            });
                            if (updateTableStatus)
                              updateTableStatus(
                                currentViewingTable.id,
                                "Available",
                                "No Customer"
                              );
                            closeModal();
                          }
                        }}
                        className="save-btn"
                        style={{ flex: 2, backgroundColor: "#0f172a" }}
                      >
                        Checkout Table
                      </button>
                    </div>
                  </div>
                );
              })()}

            {/* ADD / EDIT FORM MODALS */}
            {(activeModal === "add" || activeModal === "edit") && (
              <form
                onSubmit={activeModal === "add" ? saveAddTable : saveEditTable}
              >
                <h2>
                  {activeModal === "add"
                    ? "Add New Table"
                    : `Edit Table ${selectedTable?.id}`}
                </h2>
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
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                  >
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
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeModal}
                  >
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
