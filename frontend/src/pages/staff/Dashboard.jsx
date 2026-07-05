import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Utensils,
  CheckCircle2,
  BellRing,
  Clock,
  User,
  Package,
  CalendarClock,
  X,
  Edit2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../../styles/staff.css"; // You can likely empty this file since you're using Tailwind!
import { useOrders } from "../../context/OrderContext";
import { useTables } from "../../context/TableContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Modal tracking states
  const [selectedTableDetails, setSelectedTableDetails] = useState(null);
  const [editingTable, setEditingTable] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", type: "danger", confirmText: "Confirm", onConfirm: () => {} });

  // Edit form states
  const [editStatus, setEditStatus] = useState("");
  const [editCustomer, setEditCustomer] = useState("");
  const [editSeats, setEditSeats] = useState(2);
  const [editTime, setEditTime] = useState("");

  const { orders, serveOrder, cancelOrder, completeOrder, fetchOrders } = useOrders();
  const { tables, setTables, updateTableStatus, fetchTables } = useTables();

  useEffect(() => {
    if (fetchOrders) fetchOrders();
    if (fetchTables) fetchTables();
  }, [fetchOrders, fetchTables]);

  // Map global context data to Dashboard specific format
  const tablesList = tables.map((t) => {
    const tableOrders = orders.filter(
      (o) => o.table === t.name && o.status !== "Completed"
    );

    let activeOrder = null;
    if (tableOrders.length > 0) {
      activeOrder = {
        id: tableOrders[0].id,
        items: tableOrders.flatMap((o) => o.items.map((i) => i.name)),
        total: `Rs. ${tableOrders.reduce((sum, o) => sum + (o.total || 0), 0)}`,
      };
    }

    return {
      ...t,
      number: t.id,
      name: t.name,
      customer: t.currentCustomer,
      label:
        t.status === "Occupied"
          ? "Customers Dining"
          : t.status === "Reserved"
            ? "Reserved for Guest"
            : "Ready for New Guests",
      activeOrder,
    };
  });

  // Filter tables list automatically
  const filteredTables = tablesList.filter(
    (table) =>
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
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === editingTable.number) {
          let finalCustomer =
            editStatus === "Available"
              ? "No Customer"
              : editCustomer.trim() || "No Customer";

          return {
            ...t,
            status: editStatus,
            currentCustomer: finalCustomer,
            seats: parseInt(editSeats, 10),
            reservationTime: editStatus === "Reserved" ? editTime : null,
          };
        }
        return t;
      })
    );
    setEditingTable(null);
  };

  const handleCancelOrder = (order) => {
    setConfirmModal({
      isOpen: true,
      title: "Cancel Order?",
      message: `Are you sure you want to cancel order ${order.id}? This action cannot be undone.`,
      type: "danger",
      confirmText: "Cancel Order",
      onConfirm: () => {
        cancelOrder(order.id);
        const tableObj = tables.find(
          (t) => t.name === order.table || `Table ${t.id}` === order.table
        );
        if (tableObj) {
          const remainingActiveOrders = orders.filter(
            (o) =>
              o.table === order.table &&
              o.id !== order.id &&
              o.status !== "Completed" &&
              o.status !== "Cancelled" &&
              o.status !== "Served"
          );
          if (remainingActiveOrders.length === 0) {
            updateTableStatus(tableObj.id, "Available", "No Customer");
          }
        }
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
  };

  // UI Helpers
  const getTableStatusStyles = (status) => {
    switch (status) {
      case "Occupied":
        return {
          bg: "bg-rose-50",
          text: "text-rose-600",
          dot: "bg-rose-500",
          gradient: "from-rose-50 to-transparent",
        };
      case "Reserved":
        return {
          bg: "bg-amber-50",
          text: "text-amber-600",
          dot: "bg-amber-500",
          gradient: "from-amber-50 to-transparent",
        };
      default:
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-600",
          dot: "bg-emerald-500",
          gradient: "from-emerald-50 to-transparent",
        };
    }
  };

  const getOrderStatusStyles = (status) => {
    switch (status) {
      case "Cooking":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "Ready":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Completed":
        return "bg-slate-50 text-slate-600 border-slate-200";
      default:
        return "bg-orange-50 text-orange-600 border-orange-200";
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 md:p-10 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto pb-28 lg:pb-12">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-8 md:mb-10">
          <div>
            <h1 className="text-2xl sm:text-[32px] font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">
              Staff Dashboard
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-semibold tracking-wide uppercase">
              Overview of today's restaurant activity
            </p>
          </div>
          <button
            onClick={() => navigate("/staff/take-order")}
            className="flex w-full sm:w-auto justify-center bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:shadow-[0_12px_25px_rgba(79,70,229,0.35)] items-center gap-2 transition-all duration-300 hover:-translate-y-1 active:scale-95"
          >
            <Plus size={18} strokeWidth={2.5} /> Take New Order
          </button>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-5 sm:p-7 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-400">
            <div className="w-10 h-10 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 flex items-center justify-center text-blue-600 shadow-inner border border-blue-200/50 group-hover:scale-110 transition-transform duration-400">
              <Utensils size={22} className="sm:w-7 sm:h-7" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">
                Active Tables
              </h4>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-none tracking-tight">
                {tablesList.filter((t) => t.status === "Occupied").length}
              </h2>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-5 sm:p-7 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-400">
            <div className="w-10 h-10 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 flex items-center justify-center text-amber-500 shadow-inner border border-amber-200/50 group-hover:scale-110 transition-transform duration-400">
              <Package size={22} className="sm:w-7 sm:h-7" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">
                Pending Orders
              </h4>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-none tracking-tight">
                {orders.filter((o) => o.status === "Pending" || o.status === "Cooking").length}
              </h2>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-5 sm:p-7 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-400">
            <div className="w-10 h-10 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 flex items-center justify-center text-emerald-600 shadow-inner border border-emerald-200/50 group-hover:scale-110 transition-transform duration-400">
              <CheckCircle2 size={22} className="sm:w-7 sm:h-7" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">
                Completed
              </h4>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-none tracking-tight">
                {orders.filter((o) => o.status === "Completed").length}
              </h2>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-5 sm:p-7 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-400">
            <div className="w-10 h-10 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 flex items-center justify-center text-indigo-600 shadow-inner border border-indigo-200/50 group-hover:scale-110 transition-transform duration-400">
              <CalendarClock size={22} className="sm:w-7 sm:h-7" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">
                Reservations
              </h4>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-none tracking-tight">
                {tablesList.filter((t) => t.status === "Reserved").length}
              </h2>
            </div>
          </div>
        </div>

        {/* WORKSPACE FLEX SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">

          {/* RIGHT: LIVE ORDERS QUEUE & ALERTS (Stacks first on Mobile due to order-1) */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 relative lg:sticky lg:top-6 order-1 lg:order-2 mb-2 lg:mb-0">
            {/* READY ORDERS ALERT SECTION */}
            {orders.filter((o) => o.status === "Ready").length > 0 && (
              <div className="bg-emerald-500 rounded-xl shadow-md shadow-emerald-500/20 p-5 sm:p-6 text-white animate-slide-in border border-emerald-400/30">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base sm:text-lg font-black flex items-center gap-2">
                    <BellRing size={20} className="animate-bounce" /> Ready to Serve
                  </h2>
                  <span className="bg-white text-emerald-600 text-xs font-black px-2 py-1 rounded-lg shadow-sm">
                    {orders.filter((o) => o.status === "Ready").length} New
                  </span>
                </div>
                <div className="space-y-3">
                  {orders
                    .filter((o) => o.status === "Ready")
                    .slice(0, 3)
                    .map((order) => (
                      <div
                        key={order.id}
                        className="bg-white/10 hover:bg-white/20 p-3 sm:p-4 rounded-xl border border-white/20 flex items-center justify-between transition-all group backdrop-blur-md"
                      >
                        <div
                          className="cursor-pointer flex-1"
                          onClick={() => navigate("/staff/ready-orders")}
                        >
                          <h3 className="font-black text-white text-sm sm:text-base tracking-tight">
                            {order.table || "Queue"}
                          </h3>
                          <p className="text-xs font-medium text-emerald-50 mt-0.5">
                            {order.id}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => serveOrder(order.id)}
                            className="bg-white text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                          >
                            <CheckCircle2 size={16} /> Serve
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* LIVE ORDERS QUEUE CONTAINER */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 sm:p-6">
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Live Orders
                </h2>
                <button
                  onClick={() => navigate("/staff/ready-orders")}
                  className="text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {orders
                  .filter(
                    (o) => o.status !== "Completed" && o.status !== "Served" && o.status !== "Cancelled"
                  )
                  .slice(0, 6)
                  .map((order) => (
                    <div
                      key={order.id}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all hover:shadow-md ${order.status === "Ready"
                          ? "bg-emerald-50/50 border-emerald-100"
                          : "border-slate-100 bg-slate-50/50 hover:bg-white"
                        }`}
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div
                          className={`border font-black text-[10px] px-2.5 py-1.5 rounded-lg shadow-sm tracking-wider ${order.status === "Ready"
                              ? "bg-emerald-500 text-white border-emerald-600"
                              : "bg-slate-800 text-white border-slate-900"
                            }`}
                        >
                          {order.id}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-sm leading-tight">
                            {order.table || "Queue"}
                          </h3>
                          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                            {(order.items || []).reduce((acc, item) => acc + item.qty, 0)} items
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm ${getOrderStatusStyles(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                        {order.status === "Pending" && (
                          <button
                            onClick={() => handleCancelOrder(order)}
                            className="bg-rose-500 hover:bg-rose-600 text-white p-1.5 rounded-lg shadow-sm transition-colors active:scale-95"
                            title="Cancel Mistaken Order"
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                        {order.status === "Ready" && (
                          <button
                            onClick={() => serveOrder(order.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded-lg shadow-sm transition-colors active:scale-95"
                            title="Mark as Served"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                {orders.filter((o) => o.status !== "Completed" && o.status !== "Served").length === 0 && (
                  <div className="text-center py-6 text-slate-400 text-sm font-medium">
                    No active orders right now.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- POPUP 3: PREMIUM CONFIRM MODAL --- */}
          {confirmModal.isOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex justify-center items-center p-4 transition-all duration-300 animate-fade-in" onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}>
              <div className="bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-sm overflow-hidden animate-slide-in scale-100 transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="p-8 flex flex-col items-center text-center relative">
                  
                  {/* Decorative Background Blob */}
                  <div className={`absolute top-0 left-0 w-full h-32 opacity-20 pointer-events-none rounded-t-[24px] bg-gradient-to-b ${
                    confirmModal.type === 'danger' ? 'from-rose-500 to-transparent' : 'from-emerald-500 to-transparent'
                  }`} />

                  {/* Icon Container */}
                  <div className={`relative w-20 h-20 rounded-full flex items-center justify-center mb-5 shadow-lg border-4 border-white z-10 ${
                    confirmModal.type === 'danger' ? 'bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-rose-500/30' : 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/30'
                  }`}>
                    {confirmModal.type === 'danger' ? (
                      <AlertTriangle size={36} strokeWidth={2.5} />
                    ) : (
                      <CheckCircle2 size={36} strokeWidth={2.5} />
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight relative z-10">{confirmModal.title}</h3>
                  <p className="text-slate-500 font-semibold text-sm leading-relaxed mb-8 relative z-10 px-2">{confirmModal.message}</p>
                  
                  <div className="flex w-full gap-3 relative z-10">
                    <button
                      onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                      className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all duration-200 text-sm active:scale-95 border border-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmModal.onConfirm}
                      className={`flex-1 py-3.5 text-white font-bold rounded-2xl transition-all duration-200 shadow-md text-sm active:scale-95 ${
                        confirmModal.type === 'danger' 
                        ? 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-rose-500/25' 
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/25'
                      }`}
                    >
                      {confirmModal.confirmText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LEFT: TABLES BLOCK MONITOR */}
          <div className="lg:col-span-8 xl:col-span-9 order-2 lg:order-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-black text-slate-900">
                Restaurant Tables
              </h2>
              <div className="relative w-full sm:w-72">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search table or state..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base sm:text-sm outline-none focus:border-indigo-400 transition-all shadow-sm placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {filteredTables.map((table, index) => {
                const styles = getTableStatusStyles(table.status);

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedTableDetails(table)}
                    className="group relative bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer hover:shadow-md sm:hover:-translate-y-1 border-slate-100 hover:border-slate-200"
                  >
                    {/* Background Subtle Gradient */}
                    <div className={`absolute inset-0 bg-${styles.gradient} opacity-50 pointer-events-none`} />

                    {/* Status Top Accent Line */}
                    <div className={`h-1.5 w-full ${styles.dot} transition-all duration-300 group-hover:h-2`} />

                    <div className="p-5 sm:p-6 relative z-10 flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:rounded-xl flex items-center justify-center shadow-sm ${styles.bg} ${styles.text} sm:group-hover:scale-110 transition-transform duration-300`}>
                            <Utensils size={20} className="sm:w-6 sm:h-6" />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                              {table.name}
                            </h3>
                            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                              {table.label}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-2 p-3 rounded-xl bg-white/60 border border-slate-100/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className={`min-w-[32px] h-8 rounded-full flex items-center justify-center ${table.customer && table.customer !== "No Customer" ? "bg-blue-50 text-blue-500" : "bg-slate-50 text-slate-400"}`}>
                            <User size={16} />
                          </div>
                          <div className="truncate">
                            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Current Guest
                            </p>
                            <h4 className={`text-xs sm:text-sm font-bold truncate max-w-[90px] sm:max-w-[140px] ${table.customer && table.customer !== "No Customer" ? "text-slate-900" : "text-slate-500"}`}>
                              {table.customer || "No Customer"}
                            </h4>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm border ${styles.bg} ${styles.text} border-white/50 shrink-0 ml-2`}>
                          {table.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 border-t border-slate-100 bg-slate-50/80 relative z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(table);
                        }}
                        className="py-3.5 text-xs font-bold text-slate-600 hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center gap-2 active:bg-slate-100"
                      >
                        <Edit2 size={14} /> Edit Table Setup
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredTables.length === 0 && (
              <div className="text-center py-16 text-slate-400 font-medium bg-white rounded-xl border border-slate-100 mt-4 shadow-sm">
                No tables match your search.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- POPUP 1: WORKING VIEW MODAL --- */}
      {selectedTableDetails && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity"
          onClick={() => setSelectedTableDetails(null)}
        >
          <div
            className="bg-white rounded-xl shadow-md w-full max-w-md overflow-hidden animate-slide-in max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Overview: {selectedTableDetails.name || `Table ${selectedTableDetails.number}`}
                </h2>
                <span
                  className={`mt-1.5 inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getTableStatusStyles(selectedTableDetails.status).bg
                    } ${getTableStatusStyles(selectedTableDetails.status).text}`}
                >
                  {selectedTableDetails.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedTableDetails(null)}
                className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-lg border border-slate-200 shadow-sm transition active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body (Scrollable on small screens) */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Guest Assignee
                  </span>
                  <p className="font-bold text-slate-900 text-sm truncate">
                    {selectedTableDetails.customer}
                  </p>
                </div>
                {selectedTableDetails.status === "Reserved" && (
                  <div className="col-span-1 sm:col-span-2 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                    <span className="block text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">
                      Expected Arrival ETA
                    </span>
                    <p className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                      <Clock size={14} /> Today at {selectedTableDetails.reservationTime}
                    </p>
                  </div>
                )}
              </div>

              {selectedTableDetails.status === "Occupied" && selectedTableDetails.activeOrder ? (
                <>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-900 text-white p-3 flex justify-between items-center">
                      <h4 className="font-bold text-sm text-slate-100">Running Ticket</h4>
                      <span className="text-[10px] bg-slate-700 px-2 py-1 rounded-lg font-bold">
                        {selectedTableDetails.activeOrder.id}
                      </span>
                    </div>
                    <div className="p-4 space-y-2 bg-slate-50 max-h-[150px] overflow-y-auto">
                      {selectedTableDetails.activeOrder.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" /> {item}
                        </div>
                      ))}
                    </div>
                    <div className="bg-white p-4 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Current Balance
                      </span>
                      <strong className="text-lg sm:text-xl font-black text-indigo-600">
                        {selectedTableDetails.activeOrder.total}
                      </strong>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-5">
                    <button
                      onClick={() => {
                        if (window.confirm("Cancel all active orders for this table?")) {
                          const tableOrders = orders.filter(
                            (o) =>
                              o.table === selectedTableDetails.name &&
                              o.status !== "Completed" &&
                              o.status !== "Cancelled"
                          );
                          tableOrders.forEach((o) => {
                            if (cancelOrder) cancelOrder(o.id);
                          });
                          if (updateTableStatus)
                            updateTableStatus(selectedTableDetails.id, "Available", "No Customer");
                          setSelectedTableDetails(null);
                        }
                      }}
                      className="w-full sm:flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3 rounded-xl transition-all shadow-sm border border-rose-200 text-sm active:scale-[0.98]"
                    >
                      Cancel Order
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Checkout and mark this table's orders as Paid?")) {
                          const tableOrders = orders.filter(
                            (o) =>
                              o.table === selectedTableDetails.name &&
                              o.status !== "Completed" &&
                              o.status !== "Cancelled"
                          );
                          tableOrders.forEach((o) => {
                            if (completeOrder) completeOrder(o.id, { paymentMethod: "Cash" });
                          });
                          if (updateTableStatus)
                            updateTableStatus(selectedTableDetails.id, "Available", "No Customer");
                          setSelectedTableDetails(null);
                        }
                      }}
                      className="w-full sm:flex-[2] bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm active:scale-[0.98]"
                    >
                      Checkout Table
                    </button>
                  </div>
                </>
              ) : selectedTableDetails.status === "Available" ? (
                <div className="text-center py-8 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 px-6">
                  <CheckCircle2 size={28} className="mx-auto mb-2 opacity-80" />
                  <p className="font-bold text-sm">Station is clean and set up.</p>
                  <p className="text-xs mt-1 opacity-80 font-medium">Ready to process a new terminal order.</p>
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 shrink-0">
              <button
                className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-100 transition shadow-sm active:scale-[0.98]"
                onClick={() => setSelectedTableDetails(null)}
              >
                Dismiss View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- POPUP 2: WORKING EDIT MODAL --- */}
      {editingTable && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity"
          onClick={() => setEditingTable(null)}
        >
          <form
            className="bg-white rounded-xl shadow-md w-full max-w-md overflow-hidden animate-slide-in max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSaveTableEdits}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Edit2 size={18} className="text-blue-500" /> Modify {editingTable.name || `Table ${editingTable.number}`}
                </h2>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-1">
                  Adjust live layout status and hospitality parameters
                </p>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-lg border border-slate-200 shadow-sm transition active:scale-95"
                onClick={() => setEditingTable(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Hospitality Status
                </label>
                <select
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 sm:py-2.5 outline-none focus:border-blue-500 transition-all font-bold text-base sm:text-sm cursor-pointer text-slate-700"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="Available">🟢 Available (Vacant)</option>
                  <option value="Occupied">🔴 Occupied (Dining)</option>
                  <option value="Reserved">🟡 Reserved (Booked)</option>
                </select>
              </div>

              {editStatus !== "Available" && (
                <div className="animate-slide-in">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Primary Guest Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 sm:py-2.5 outline-none focus:border-blue-500 transition-all font-semibold text-base sm:text-sm text-slate-900"
                    placeholder="E.g., Michael Scott"
                    required
                    value={editCustomer}
                    onChange={(e) => setEditCustomer(e.target.value)}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Seating Max
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 sm:py-2.5 outline-none focus:border-blue-500 transition-all font-bold text-base sm:text-sm text-slate-900"
                    value={editSeats}
                    onChange={(e) => setEditSeats(e.target.value)}
                  />
                </div>

                {editStatus === "Reserved" && (
                  <div className="animate-slide-in">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Arrival ETA
                    </label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 sm:py-2.5 outline-none focus:border-amber-500 transition-all font-bold text-base sm:text-sm text-slate-900"
                      placeholder="08:15 PM"
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex gap-3 shrink-0">
              <button
                type="button"
                className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-100 transition shadow-sm active:scale-[0.98]"
                onClick={() => setEditingTable(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-md active:scale-[0.98]"
              >
                Apply Config
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
