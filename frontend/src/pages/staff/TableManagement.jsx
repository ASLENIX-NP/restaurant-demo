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
    <div className="tables-page p-4 sm:p-6 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-800">
      {/* HEADER */}
      <div className="tables-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight">Restaurant Tables</h1>
          <p className="text-slate-400 text-sm mt-0.5 font-medium">Live table availability</p>
        </div>
        <button className="add-table-btn w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all" onClick={handleOpenAdd}>
          + Add Table
        </button>
      </div>

      {/* STATS */}
      <div className="table-stats grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
        <div className="table-stat-card bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{totalTables}</h2>
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Tables</p>
        </div>
        <div className="table-stat-card green bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-500">{availableCount}</h2>
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Available</p>
        </div>
        <div className="table-stat-card red bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-rose-500">{occupiedCount}</h2>
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Occupied</p>
        </div>
        <div className="table-stat-card orange bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-amber-500">{reservedCount}</h2>
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Reserved</p>
        </div>
      </div>

      {/* TABLES GRID */}
      <div className="tables-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {tablesList.map((table) => (
          <div
            className={`table-card bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all overflow-hidden ${
              table.status ? table.status.toLowerCase() : "available"
            }`}
            key={table.id}
          >
            <div className="table-top p-5 pb-0 flex justify-between items-start">
              <h2 className="text-lg font-black text-slate-900">{table.name}</h2>
              <span
                className={`status-badge px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                  table.status ? table.status.toLowerCase() : "available"
                }`}
              >
                {table.status}
              </span>
            </div>

            <div className="table-icon p-5 flex justify-center text-4xl opacity-50">🍽️</div>

            <div className="table-info px-5 pb-4">
              <p className="text-sm font-medium text-slate-600 mb-1">
                <strong>Seats:</strong> {table.seats}
              </p>
              <p className="text-sm font-medium text-slate-600 truncate">
                <strong>Customer:</strong> {table.customer}
              </p>
            </div>

            <div className="table-actions grid grid-cols-2 border-t border-slate-100 divide-x divide-slate-100 bg-slate-50/50">
              <button
                className="view-btn py-3 text-xs font-bold text-slate-600 hover:bg-white hover:text-purple-600 transition"
                onClick={() => handleOpenView(table)}
              >
                View
              </button>
              <button
                className="edit-btn py-3 text-xs font-bold text-slate-600 hover:bg-white hover:text-blue-600 transition"
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
        <div className="modal-overlay fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity" onClick={closeModal}>
          <div className="modal-content bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md p-6 max-h-[90vh] overflow-y-auto animate-slide-in" onClick={(e) => e.stopPropagation()}>
            {/* VIEW DETAILS MODAL */}
            {activeModal === "view" &&
              selectedTable &&
              (() => {
                const currentViewingTable =
                  tablesList.find((t) => t.id === selectedTable.id) ||
                  selectedTable;
                return (
                  <div className="space-y-4">
                    <h2 className="text-lg font-black text-slate-900">{currentViewingTable.name} Details</h2>
                    <hr className="border-slate-100" />
                    <div className="view-details-info space-y-2">
                      <p className="text-sm text-slate-700">
                        <strong>Status:</strong>{" "}
                        <span
                          className={`status-text font-bold ${
                            currentViewingTable.status
                              ? currentViewingTable.status.toLowerCase()
                              : "available"
                          }`}
                        >
                          {currentViewingTable.status}
                        </span>
                      </p>
                      <p className="text-sm text-slate-700">
                        <strong>Capacity:</strong> {currentViewingTable.seats}{" "}
                        Seats
                      </p>
                      <p className="text-sm text-slate-700">
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
                    <hr className="border-slate-100 mb-4" />

                    <div className="modal-order-list">
                      {!currentViewingTable.activeOrder ||
                      currentViewingTable.activeOrder.length === 0 ? (
                        <p className="no-orders-text text-slate-500 italic text-sm py-2">
                          No active orders running for this table.
                        </p>
                      ) : (
                        currentViewingTable.activeOrder.map((item, idx) => (
                          <div
                            className="modal-order-item flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2"
                            key={item.id || idx}
                          >
                            <div className="item-name-qty flex gap-2.5 text-sm text-slate-800">
                              <span className="font-semibold">{item.name}</span>
                              <strong className="item-qty text-slate-500">x{item.qty}</strong>
                            </div>

                            {/* Interactive Toggle Button status layout */}
                            <button
                              type="button"
                              className={`delivery-toggle-btn px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm transition-colors ${
                                item.delivered ? "bg-emerald-100 text-emerald-600" : "bg-white border border-slate-200 text-slate-500"
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
                            padding: "12px",
                            borderRadius: "12px",
                            fontWeight: "bold",
                            fontSize: "14px"
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
                          style={{ 
                            flex: 2, 
                            backgroundColor: "#0f172a",
                            color: "#fff",
                            padding: "12px",
                            borderRadius: "12px",
                            fontWeight: "bold",
                            fontSize: "14px"
                          }}
                      >
                        Checkout Table
                      </button>
                    </div>
                  </div>
                );
              })()}

            {/* ADD / EDIT FORM MODALS */}
            {(activeModal === "add" || activeModal === "edit") && (
                <form className="space-y-4"
                onSubmit={activeModal === "add" ? saveAddTable : saveEditTable}
              >
                  <h2 className="text-lg font-black text-slate-900 mb-2">
                  {activeModal === "add"
                    ? "Add New Table"
                    : `Edit Table ${selectedTable?.id}`}
                </h2>
                  <hr className="border-slate-100 mb-4" />

                  <div className="form-group flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Number of Seats:</label>
                  <input
                    type="number"
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-bold text-sm"
                    value={formSeats}
                    onChange={(e) => setFormSeats(e.target.value)}
                    required
                    min="1"
                  />
                </div>

                  <div className="form-group flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status:</label>
                  <select
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-bold text-sm cursor-pointer"
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
                    <div className="form-group flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Customer Name:</label>
                    <input
                        className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-bold text-sm"
                      type="text"
                      value={formCustomer}
                      onChange={(e) => setFormCustomer(e.target.value)}
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                )}

                  <div className="modal-actions flex gap-3 pt-4 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                      className="cancel-btn flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                    <button type="submit" className="save-btn flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-md">
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
