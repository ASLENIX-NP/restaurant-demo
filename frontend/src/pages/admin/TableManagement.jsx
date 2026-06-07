import React, { useState } from "react";
import {
  Search,
  Plus,
  Utensils,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  X,
  Edit2,
  Trash2,
  Receipt,
  User,
  Clock,
} from "lucide-react";

import "../../styles/adminTables.css"; // Kept for any global custom overrides
import { useTables } from "../../context/TableContext";
import { useOrders } from "../../context/OrderContext";

const AdminTables = () => {
  const { tables, addTable, deleteTable, editTable, updateTableStatus } =
    useTables() || { tables: [] };
  const { orders, completeOrder, cancelOrder } = useOrders() || { orders: [] };

  // Application State Hooks
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTableId, setSelectedTableId] = useState(null);

  // Add Table Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTableName, setNewTableName] = useState("");

  // Edit Table Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTableData, setEditTableData] = useState({
    id: null,
    name: "",
    status: "Available",
    currentCustomer: "",
  });

  // Map global context data to Admin Tables specific format
  const mappedTables = tables.map((t) => {
    const tableName = t.name || `Table ${t.id}`;
    const tableOrders = orders.filter(
      (o) =>
        o.table === tableName &&
        o.status !== "Completed" &&
        o.status !== "Cancelled"
    );

    let items = [];
    let amount = 0;
    let time = "--";

    if (tableOrders.length > 0) {
      tableOrders.forEach((o) => {
        items = [...items, ...(o.items || [])];
        const subtotal = (o.items || []).reduce(
          (sum, item) => sum + item.qty * (parseFloat(item.price) || 0),
          0
        );
        amount +=
          o.amount !== undefined
            ? o.amount
            : subtotal + (subtotal > 0 ? 50 : 0);
      });
      time = tableOrders[0].time || "--";
    }

    return {
      ...t,
      name: tableName,
      customer: t.currentCustomer || t.customer || "No Customer",
      status: t.status ? t.status.toLowerCase() : "available",
      amount,
      time,
      items,
    };
  });

  // Derived filtered data
  const filteredTables = mappedTables.filter((table) => {
    const matchesFilter =
      activeFilter === "All" || table.status === activeFilter.toLowerCase();
    const matchesSearch =
      (table.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (table.customer || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Get active selected table details
  const activeTable = mappedTables.find((t) => t.id === selectedTableId);

  // Status visual mappings
  const statusStyles = {
    available: {
      border: "border-t-emerald-400",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      dot: "bg-emerald-500",
    },
    occupied: {
      border: "border-t-rose-400",
      bg: "bg-rose-50",
      text: "text-rose-600",
      dot: "bg-rose-500",
    },
    reserved: {
      border: "border-t-amber-400",
      bg: "bg-amber-50",
      text: "text-amber-600",
      dot: "bg-amber-500",
    },
    cleaning: {
      border: "border-t-blue-400",
      bg: "bg-blue-50",
      text: "text-blue-600",
      dot: "bg-blue-500",
    },
  };

  // Action Handlers
  const handleAddTable = (e) => {
    e.preventDefault();
    if (!newTableName.trim()) {
      alert("Please enter a table name.");
      return;
    }

    addTable({
      name: newTableName,
      seats: 4,
      status: "Available",
      currentCustomer: "No Customer",
    });

    setNewTableName("");
    setShowAddModal(false);
  };

  const handleDeleteTable = (tableId) => {
    if (window.confirm("Are you sure you want to remove this table?")) {
      deleteTable(tableId);
      if (selectedTableId === tableId) {
        setSelectedTableId(null);
      }
    }
  };

  const handleEditClick = (table) => {
    setEditTableData({
      id: table.id,
      name: table.name,
      status: table.status.charAt(0).toUpperCase() + table.status.slice(1),
      currentCustomer: table.customer === "No Customer" ? "" : table.customer,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editTableData.name.trim()) return;
    editTable(editTableData.id, {
      name: editTableData.name,
      status: editTableData.status,
      currentCustomer: editTableData.currentCustomer || "No Customer",
    });
    setShowEditModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto">
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
              Table Management
            </h1>
            <p className="text-slate-400 text-sm mt-0.5 font-medium">
              Manage restaurant tables, seating, and live orders
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
          >
            <Plus size={16} /> Add New Table
          </button>
        </div>

        {/* METRICS & STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {/* Total */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
              <Utensils size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Total Tables
              </h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {tables.length}
              </h2>
            </div>
          </div>

          {/* Available */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Available
              </h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {
                  tables.filter(
                    (t) => (t.status || "").toLowerCase() === "available"
                  ).length
                }
              </h2>
            </div>
          </div>

          {/* Occupied */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <TrendingUp size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Occupied
              </h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {
                  tables.filter(
                    (t) => (t.status || "").toLowerCase() === "occupied"
                  ).length
                }
              </h2>
            </div>
          </div>

          {/* Reserved */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Reserved
              </h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {
                  tables.filter(
                    (t) => (t.status || "").toLowerCase() === "reserved"
                  ).length
                }
              </h2>
            </div>
          </div>
        </div>

        {/* MAIN WORKSPACE SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: GRID AND FILTERS */}
          <div className="lg:col-span-12 transition-all duration-300">
            {/* Filter Bar */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div className="flex bg-slate-200/50 p-1 rounded-xl">
                {["All", "Available", "Occupied", "Reserved"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                      activeFilter === tab
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search tables or guests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-400 transition-all shadow-sm placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Table Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 transition-all">
              {filteredTables.map((table) => {
                const style =
                  statusStyles[table.status] || statusStyles.available;
                const isSelected = selectedTableId === table.id;

                return (
                  <div
                    key={table.id}
                    onClick={() =>
                      setSelectedTableId(isSelected ? null : table.id)
                    }
                    className={`bg-white rounded-2xl border-t-4 border-x border-b shadow-sm overflow-hidden flex flex-col justify-between transition-all cursor-pointer ${
                      style.border
                    } ${
                      isSelected
                        ? "ring-2 ring-purple-400 border-x-purple-100 border-b-purple-100 scale-[1.02]"
                        : "border-x-slate-100 border-b-slate-100 hover:shadow-md"
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-black text-slate-900">
                          {table.name}
                        </h3>
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${style.bg} ${style.text}`}
                        >
                          {table.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                          <User size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {table.customer}
                          </h4>
                          <p className="text-xs font-medium text-slate-400">
                            Current Guest
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Billing
                        </span>
                        <span className="font-black text-slate-900 text-sm">
                          Rs. {table.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-t border-slate-100 divide-x divide-slate-100 bg-slate-50/50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(table);
                        }}
                        className="py-3 text-xs font-bold text-slate-600 hover:bg-white transition flex items-center justify-center gap-1.5"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTable(table.id);
                        }}
                        className="py-3 text-xs font-bold text-rose-600 hover:bg-rose-50 transition flex items-center justify-center gap-1.5"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredTables.length === 0 && (
              <div className="text-center py-16 text-slate-400 font-medium">
                No tables match your current filters.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* TABLE DETAILS MODAL OVERLAY */}
      {selectedTableId && activeTable && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-in p-6 relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {activeTable.name} Details
                </h2>
                <p className="text-purple-600 font-bold text-xs mt-0.5">
                  {activeTable.customer}
                </p>
              </div>
              <button
                onClick={() => setSelectedTableId(null)}
                className="bg-white border border-slate-200 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg shadow-sm"
              >
                <X size={16} />
              </button>
            </div>

            {activeTable.items.length > 0 ? (
              <>
                {/* Order Time Info */}
                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Clock size={14} className="text-slate-400" /> Order started
                  at: <span className="text-slate-900">{activeTable.time}</span>
                </div>

                {/* Items List */}
                <div className="max-h-[300px] overflow-y-auto pr-2 mb-6">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-slate-100">
                      <tr>
                        <th className="py-2 pl-2">Item</th>
                        <th className="py-2 text-center">Qty</th>
                        <th className="py-2 pr-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeTable.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-3 pl-2 font-semibold text-slate-700">
                            {item.name}{" "}
                            <span className="block text-[10px] text-slate-400 font-medium">
                              Rs. {item.price} each
                            </span>
                          </td>
                          <td className="py-3 text-center font-bold text-slate-500">
                            {item.qty}
                          </td>
                          <td className="py-3 pr-2 text-right font-black text-slate-900">
                            Rs. {(item.qty * item.price).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium text-slate-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-900 font-bold">
                      Rs. {activeTable.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-2 flex justify-between items-baseline text-purple-600 border-t border-slate-200/60 mt-2">
                    <span className="font-extrabold text-sm">
                      Running Total
                    </span>
                    <span className="text-xl font-black">
                      Rs. {activeTable.amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Cancel all active orders for this table?"
                        )
                      ) {
                        const tableOrders = orders.filter(
                          (o) =>
                            o.table === activeTable.name &&
                            o.status !== "Completed" &&
                            o.status !== "Cancelled"
                        );
                        tableOrders.forEach((o) => {
                          if (cancelOrder) cancelOrder(o.id);
                        });
                        if (updateTableStatus)
                          updateTableStatus(
                            activeTable.id,
                            "Available",
                            "No Customer"
                          );
                        setSelectedTableId(null);
                      }
                    }}
                    className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3.5 rounded-xl transition-all shadow-sm border border-rose-200"
                  >
                    Cancel Order
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Checkout and mark this table's orders as Paid?"
                        )
                      ) {
                        const tableOrders = orders.filter(
                          (o) =>
                            o.table === activeTable.name &&
                            o.status !== "Completed" &&
                            o.status !== "Cancelled"
                        );
                        tableOrders.forEach((o) => {
                          if (completeOrder)
                            completeOrder(o.id, {
                              paymentMethod: "Cash",
                              amount: activeTable.amount,
                            });
                        });
                        if (updateTableStatus)
                          updateTableStatus(
                            activeTable.id,
                            "Available",
                            "No Customer"
                          );
                        setSelectedTableId(null);
                      }
                    }}
                    className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <Utensils size={24} className="text-slate-300" />
                </div>
                <p className="font-semibold text-sm">No active orders</p>
                <p className="text-xs mt-1">This table is currently empty.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD NEW TABLE MODAL OVERLAY */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Plus size={18} className="text-purple-500" />
                Add New Table
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-lg border border-slate-200 shadow-sm transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddTable} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Table Name / Number *
                </label>
                <input
                  type="text"
                  required
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                  placeholder="e.g. Table 8 or VIP 3"
                />
              </div>

              {/* Informational UI element */}
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 text-xs font-semibold flex items-start gap-2 mt-2">
                <CheckCircle2 size={16} className="mt-0.5" />
                <p>
                  New tables are automatically marked as{" "}
                  <strong>Available</strong>.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 mt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 shadow-md transition"
                >
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TABLE MODAL OVERLAY */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Edit2 size={18} className="text-blue-500" />
                Edit Table
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-lg border border-slate-200 shadow-sm transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Table Name / Number *
                </label>
                <input
                  type="text"
                  required
                  value={editTableData.name}
                  onChange={(e) =>
                    setEditTableData({ ...editTableData, name: e.target.value })
                  }
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  value={editTableData.status}
                  onChange={(e) =>
                    setEditTableData({
                      ...editTableData,
                      status: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-medium text-sm cursor-pointer"
                >
                  <option value="Available">🟢 Available</option>
                  <option value="Occupied">🔴 Occupied</option>
                  <option value="Reserved">🟡 Reserved</option>
                  <option value="Cleaning">🔵 Cleaning</option>
                </select>
              </div>

              {editTableData.status !== "Available" &&
                editTableData.status !== "Cleaning" && (
                  <div className="animate-slide-in">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={editTableData.currentCustomer}
                      onChange={(e) =>
                        setEditTableData({
                          ...editTableData,
                          currentCustomer: e.target.value,
                        })
                      }
                      className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-medium text-sm"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                )}

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 mt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 shadow-md transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTables;
