import React, { useState, useEffect } from "react";
import {
  Plus,
  Utensils,
  CheckCircle2,
  AlertTriangle,
  Users,
  Sparkles,
  Eye,
  Edit2,
  X,
  User,
  CalendarClock,
} from "lucide-react";

import "../../styles/tables.css"; // Kept for any global custom overrides
import { useTables } from "../../context/TableContext";
import { useOrders } from "../../context/OrderContext";

const Tables = () => {
  // --- UI & Data State Management ---
  const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'view' | null
  const [selectedTable, setSelectedTable] = useState(null);

  // Form states
  const [formSeats, setFormSeats] = useState("");
  const [formStatus, setFormStatus] = useState("Available");
  const [formCustomer, setFormCustomer] = useState("");

  const { tables, setTables, updateTableStatus, fetchTables } = useTables();
  const { orders, cancelOrder, completeOrder, fetchOrders } = useOrders();

  useEffect(() => {
    if (fetchTables) fetchTables();
    if (fetchOrders) fetchOrders();
  }, [fetchTables, fetchOrders]);

  const tablesList = tables.map((t) => {
    const tableOrders = orders.filter(
      (o) => o.table === t.name && o.status !== "Completed"
    );
    const activeOrder = tableOrders.flatMap((o) =>
      o.items.map((i) => ({ ...i }))
    );
    return {
      ...t,
      customer: t.currentCustomer,
      activeOrder: activeOrder.length > 0 ? activeOrder : null,
    };
  });

  // --- Dynamic Dashboard Counters ---
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

  // --- Visual Helpers ---
  const getStatusConfig = (status) => {
    switch (status) {
      case "Available":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-600",
          border: "border-t-emerald-400",
          icon: <CheckCircle2 size={14} />,
        };
      case "Occupied":
        return {
          bg: "bg-rose-50",
          text: "text-rose-600",
          border: "border-t-rose-400",
          icon: <Users size={14} />,
        };
      case "Reserved":
        return {
          bg: "bg-amber-50",
          text: "text-amber-600",
          border: "border-t-amber-400",
          icon: <CalendarClock size={14} />,
        };
      case "Cleaning":
        return {
          bg: "bg-blue-50",
          text: "text-blue-600",
          border: "border-t-blue-400",
          icon: <Sparkles size={14} />,
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-600",
          border: "border-t-slate-400",
          icon: <Utensils size={14} />,
        };
    }
  };

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

    const newId =
      tables.length > 0 ? Math.max(...tables.map((t) => t.id)) + 1 : 1;
    const newTable = {
      id: newId,
      name: `Table ${newId}`,
      seats: 4, // Default fallback
      status: formStatus,
      currentCustomer:
        formStatus === "Available" || formStatus === "Cleaning"
          ? "No Customer"
          : formCustomer || "Anonymous",
    };

    setTables([...tables, newTable]);
    closeModal();
  };

  const saveEditTable = (e) => {
    e.preventDefault();
    setTables(
      tables.map((t) =>
        t.id === selectedTable.id
          ? {
              ...t,
              seats: selectedTable.seats || 4,
              status: formStatus,
              currentCustomer:
                formStatus === "Available" || formStatus === "Cleaning"
                  ? "No Customer"
                  : formCustomer,
            }
          : t
      )
    );
    closeModal();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight">
              Restaurant Tables
            </h1>
            <p className="text-slate-400 text-sm mt-0.5 font-medium">
              Manage live table availability and seating
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto justify-center bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
          >
            <Plus size={16} /> Add Table
          </button>
        </div>

        {/* DYNAMIC STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
              <Utensils size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Total Tables
              </h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {totalTables}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Available
              </h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {availableCount}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <Users size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Occupied
              </h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {occupiedCount}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Reserved
              </h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {reservedCount}
              </h2>
            </div>
          </div>
        </div>

        {/* MAIN GRID LAYOUT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {tablesList.map((table) => {
            const config = getStatusConfig(table.status);
            return (
              <div
                key={table.id}
                onClick={() => handleOpenView(table)}
                className={`bg-white rounded-2xl border-t-4 border-x border-b border-x-slate-100 border-b-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all cursor-pointer ${config.border}`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-black text-slate-900">
                      {table.name || `Table ${table.id}`}
                    </h3>
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${config.bg} ${config.text}`}
                    >
                      {config.icon} {table.status}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                        <User size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Customer
                        </p>
                        <p className="text-sm font-bold text-slate-900 truncate max-w-[140px]">
                          {table.customer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 border-t border-slate-100 divide-x divide-slate-100 bg-slate-50/50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(table);
                    }}
                    className="py-3 text-xs font-bold text-slate-600 hover:bg-white hover:text-blue-600 transition flex items-center justify-center gap-1.5"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ================= MODAL WINDOWS UI ================= */}
      {activeModal && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-[95%] max-w-sm sm:max-w-md overflow-hidden animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* VIEW MODAL */}
            {activeModal === "view" && selectedTable && (
              <>
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Eye size={18} className="text-purple-500" />
                    {selectedTable.name || `Table ${selectedTable.id}`} Details
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-lg border border-slate-200 shadow-sm transition"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Current Status
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        getStatusConfig(selectedTable.status).bg
                      } ${getStatusConfig(selectedTable.status).text}`}
                    >
                      {selectedTable.status}
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Current Customer
                    </span>
                    <span className="text-base font-black text-slate-900">
                      {selectedTable.customer}
                    </span>
                  </div>

                  {/* Active Orders List */}
                  <h3 className="text-base font-black text-slate-900 mt-6 mb-2">
                    Ordered Items Tracking
                  </h3>
                  <hr className="border-slate-100 mb-3" />

                  <div className="max-h-[180px] overflow-y-auto flex flex-col gap-2 pr-2">
                    {!selectedTable.activeOrder ||
                    selectedTable.activeOrder.length === 0 ? (
                      <p className="text-slate-500 italic text-sm py-2">
                        No active orders running for this table.
                      </p>
                    ) : (
                      selectedTable.activeOrder.map((item, idx) => (
                        <div
                          className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border-l-4 border-slate-300 shadow-sm"
                          key={idx}
                        >
                          <div className="flex gap-2.5 text-sm text-slate-800">
                            <span className="font-semibold">{item.name}</span>
                            <strong className="text-slate-500">
                              x{item.qty}
                            </strong>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    onClick={closeModal}
                    className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition shadow-md"
                  >
                    Close Details
                  </button>
                </div>
              </>
            )}

            {/* ADD / EDIT FORM MODALS */}
            {(activeModal === "add" || activeModal === "edit") && (
              <form
                onSubmit={activeModal === "add" ? saveAddTable : saveEditTable}
              >
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    {activeModal === "add" ? (
                      <Plus size={18} className="text-blue-500" />
                    ) : (
                      <Edit2 size={18} className="text-blue-500" />
                    )}
                    {activeModal === "add"
                      ? "Add New Table"
                      : `Edit ${
                          selectedTable?.name || `Table ${selectedTable?.id}`
                        }`}
                  </h2>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-lg border border-slate-200 shadow-sm transition"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Current Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-bold text-sm cursor-pointer text-slate-700"
                    >
                      <option value="Available">🟢 Available</option>
                      <option value="Occupied">🔴 Occupied</option>
                      <option value="Reserved">🟡 Reserved</option>
                      <option value="Cleaning">🔵 Cleaning</option>
                    </select>
                  </div>

                  {formStatus !== "Available" && formStatus !== "Cleaning" && (
                    <div className="animate-slide-in">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        value={formCustomer}
                        onChange={(e) => setFormCustomer(e.target.value)}
                        placeholder="Enter customer name"
                        required
                        className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-bold text-sm text-slate-900"
                      />
                    </div>
                  )}

                  {/* Modal Footer */}
                  <div className="flex gap-3 pt-4 mt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition shadow-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-md"
                    >
                      {activeModal === "add" ? "Create Table" : "Save Changes"}
                    </button>
                  </div>
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
