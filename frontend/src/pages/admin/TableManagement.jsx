import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Utensils,
  CheckCircle2,
  AlertTriangle,
  X,
  Edit2,
  Trash2,
  Receipt,
  User,
  Clock,
  Users,
} from "lucide-react";

import "../../styles/adminTables.css"; // Kept for any global custom overrides
import { useTables } from "../../context/TableContext";
import { useOrders } from "../../context/OrderContext";

const AdminTables = () => {
  const {
    tables,
    addTable,
    deleteTable,
    editTable,
    updateTableStatus,
    fetchTables,
  } = useTables() || { tables: [] };
  const { orders, completeOrder, cancelOrder, fetchOrders } = useOrders() || {
    orders: [],
  };

  useEffect(() => {
    if (fetchTables) fetchTables();
    if (fetchOrders) fetchOrders();
  }, [fetchTables, fetchOrders]);

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

  // Delete Table Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tableToDelete, setTableToDelete] = useState(null);

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
      gradient: "from-emerald-50 to-transparent",
    },
    occupied: {
      border: "border-t-rose-400",
      bg: "bg-rose-50",
      text: "text-rose-600",
      dot: "bg-rose-500",
      gradient: "from-rose-50 to-transparent",
    },
    reserved: {
      border: "border-t-amber-400",
      bg: "bg-amber-50",
      text: "text-amber-600",
      dot: "bg-amber-500",
      gradient: "from-amber-50 to-transparent",
    },
    cleaning: {
      border: "border-t-blue-400",
      bg: "bg-blue-50",
      text: "text-blue-600",
      dot: "bg-blue-500",
      gradient: "from-blue-50 to-transparent",
    },
  };

  // Action Handlers
  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!newTableName.trim()) {
      alert("Please enter a table name.");
      return;
    }

    // Smart format: If the user only enters numbers, automatically prefix it with "Table "
    let formattedName = newTableName.trim();
    if (/^\d+$/.test(formattedName)) {
      formattedName = `Table ${formattedName}`;
    }

    try {
      await addTable({
        name: formattedName,
        seats: 4,
        status: "Available",
        currentCustomer: "No Customer",
      });
      setNewTableName("");
      setShowAddModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteClick = (tableId) => {
    setTableToDelete(tableId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!tableToDelete) return;
    await deleteTable(tableToDelete);
    if (selectedTableId === tableToDelete) {
      setSelectedTableId(null);
    }
    setShowDeleteModal(false);
    setTableToDelete(null);
  };

  const handleEditClick = (table) => {
    setEditTableData({
      id: table.id,
      // Hide "Table " from the input box so you only see the number/name when editing
      name: table.name.startsWith("Table ")
        ? table.name.replace("Table ", "")
        : table.name,
      status: table.status.charAt(0).toUpperCase() + table.status.slice(1),
      currentCustomer: table.customer === "No Customer" ? "" : table.customer,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTableData.name.trim()) return;

    let formattedName = editTableData.name.trim();
    if (/^\d+$/.test(formattedName)) {
      formattedName = `Table ${formattedName}`;
    }

    try {
      await editTable(editTableData.id, {
        name: formattedName,
        status: editTableData.status,
        currentCustomer: editTableData.currentCustomer || "No Customer",
      });
      setShowEditModal(false);
    } catch (error) {
      alert(error.message);
    }
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
          <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
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
          <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
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
          <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Users size={22} />
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
          <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
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
                    className={`group relative bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 ${
                      isSelected
                        ? "ring-4 ring-purple-500/20 border-purple-300 scale-[1.02]"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    {/* Background Subtle Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${style.gradient} opacity-50 pointer-events-none`} />
                    
                    {/* Status Top Accent Line */}
                    <div className={`h-1.5 w-full ${style.dot} transition-all duration-300 group-hover:h-2`} />

                    <div className="p-6 relative z-10">
                      <div className="flex justify-between items-start mb-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${style.bg} ${style.text} group-hover:scale-110 transition-transform duration-300`}>
                            <Utensils size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">
                              {table.name}
                            </h3>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                              {table.seats || 4} Seats
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-5 p-3 rounded-xl bg-white/60 border border-slate-100/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${table.customer !== "No Customer" ? "bg-blue-50 text-blue-500" : "bg-slate-50 text-slate-400"}`}>
                            <User size={16} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Current Guest
                            </p>
                            <h4 className={`text-sm font-bold truncate max-w-[140px] ${table.customer !== "No Customer" ? "text-slate-900" : "text-slate-500"}`}>
                              {table.customer}
                            </h4>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm border ${style.bg} ${style.text} border-white/50`}>
                          {table.status}
                        </span>
                      </div>

                      <div className="bg-slate-900 rounded-xl p-3.5 flex justify-between items-center shadow-inner group-hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-2">
                           <Receipt size={16} className="text-slate-400" />
                           <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                             Billing
                           </span>
                        </div>
                        <span className="font-black text-white text-sm">
                          Rs. {table.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-t border-slate-100 divide-x divide-slate-100 bg-slate-50/80 relative z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(table);
                        }}
                        className="py-3.5 text-xs font-bold text-slate-600 hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(table.id);
                        }}
                        className="py-3.5 text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center justify-center gap-2"
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

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-slide-in">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-rose-500" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">
              Delete Table?
            </h2>
            <p className="text-sm text-slate-500 font-medium mb-6">
              Are you sure you want to remove this table? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTableToDelete(null);
                }}
                className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 shadow-md shadow-rose-200 transition"
              >
                Yes, Delete
              </button>
            </div>
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
                  Table Number *
                </label>
                <input
                  id="newTableName"
                  name="newTableName"
                  type="text"
                  inputMode="numeric"
                  required
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                  placeholder="e.g. 8"
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
                  Table Number *
                </label>
                <input
                  id="editTableName"
                  name="editTableName"
                  type="text"
                  inputMode="numeric"
                  required
                  value={editTableData.name}
                  onChange={(e) =>
                    setEditTableData({
                      ...editTableData,
                      name: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-medium text-sm"
                  placeholder="e.g. 8"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  id="editTableStatus"
                  name="editTableStatus"
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
                      id="editTableCustomer"
                      name="editTableCustomer"
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
