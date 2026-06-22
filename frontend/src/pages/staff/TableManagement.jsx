import React, { useState } from"react";
import"../../styles/tables.css";
import { useTables } from"../../context/TableContext";
import { useOrders } from"../../context/OrderContext";
import {
 Plus,
 Utensils,
 CheckCircle2,
 Users,
 AlertTriangle,
 Eye,
 Edit2,
 X,
 User,
} from"lucide-react";
import { useNavigate } from"react-router-dom";

const Tables = () => {
 const { tables, addTable, editTable, updateTableStatus } = useTables() || {
 tables: [],
 };
 const { orders, setOrders, cancelOrder, completeOrder } = useOrders() || {
 orders: [],
 };
 const navigate = useNavigate();

 const [activeModal, setActiveModal] = useState(null); //'add' |'edit' |'view' | null
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
 o.status !=="Completed" &&
 o.status !=="Cancelled"
 );

 let activeOrder =
 tableOrders.length > 0 ? tableOrders.flatMap((o) => o.items || []) : null;

 return {
 ...t,
 customer: t.currentCustomer ||"No Customer",
 activeOrder,
 };
 });

 // Dynamic Dashboard Stats Counters
 const totalTables = tablesList.length;
 const availableCount = tablesList.filter(
 (t) => t.status ==="Available"
 ).length;
 const occupiedCount = tablesList.filter(
 (t) => t.status ==="Occupied"
 ).length;
 const reservedCount = tablesList.filter(
 (t) => t.status ==="Reserved"
 ).length;

 // --- Visual Helpers ---
 const getStatusConfig = (status) => {
 switch (status) {
 case"Available":
 return {
 bg:"bg-emerald-50",
 text:"text-emerald-600",
 dot:"bg-emerald-500",
 gradient:"from-emerald-50 to-transparent",
 };
 case"Occupied":
 return {
 bg:"bg-rose-50",
 text:"text-rose-600",
 dot:"bg-rose-500",
 gradient:"from-rose-50 to-transparent",
 };
 case"Reserved":
 return {
 bg:"bg-amber-50",
 text:"text-amber-600",
 dot:"bg-amber-500",
 gradient:"from-amber-50 to-transparent",
 };
 case"Cleaning":
 return {
 bg:"bg-blue-50",
 text:"text-blue-600",
 dot:"bg-blue-500",
 gradient:"from-blue-50 to-transparent",
 };
 default:
 return {
 bg:"bg-slate-50",
 text:"text-slate-600",
 dot:"bg-slate-500",
 gradient:"from-slate-50 to-transparent",
 };
 }
 };

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
 order.status !=="Completed" &&
 order.status !=="Cancelled"
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
 formStatus ==="Available" || formStatus ==="Cleaning"
 ?"No Customer"
 : formCustomer ||"Anonymous";
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
 formStatus ==="Available" || formStatus ==="Cleaning"
 ?"No Customer"
 : formCustomer ||"Anonymous";
 editTable(selectedTable._id || selectedTable.id, {
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
 <h1 className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight">
 Restaurant Tables
 </h1>
 <p className="text-slate-400 text-sm mt-0.5 font-medium">
 Manage layout and live capacity
 </p>
 </div>
 <button
 className="w-full sm:w-auto justify-center bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
 onClick={handleOpenAdd}
 >
 <Plus size={16} /> Add Table
 </button>
 </div>

 {/* STATS */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
 <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
 <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 shadow-inner border border-slate-100 group-hover:scale-110 transition-transform duration-300">
 <Utensils size={26} strokeWidth={2.5} />
 </div>
 <div>
 <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
 Total Tables
 </h4>
 <h2 className="text-3xl font-black text-slate-900 leading-none">
 {totalTables}
 </h2>
 </div>
 </div>
 <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
 <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-inner border border-emerald-100 group-hover:scale-110 transition-transform duration-300">
 <CheckCircle2 size={26} strokeWidth={2.5} />
 </div>
 <div>
 <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
 Available
 </h4>
 <h2 className="text-3xl font-black text-slate-900 leading-none">
 {availableCount}
 </h2>
 </div>
 </div>
 <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
 <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-inner border border-rose-100 group-hover:scale-110 transition-transform duration-300">
 <Users size={26} strokeWidth={2.5} />
 </div>
 <div>
 <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
 Occupied
 </h4>
 <h2 className="text-3xl font-black text-slate-900 leading-none">
 {occupiedCount}
 </h2>
 </div>
 </div>
 <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
 <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-inner border border-amber-100 group-hover:scale-110 transition-transform duration-300">
 <AlertTriangle size={26} strokeWidth={2.5} />
 </div>
 <div>
 <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
 Reserved
 </h4>
 <h2 className="text-3xl font-black text-slate-900 leading-none">
 {reservedCount}
 </h2>
 </div>
 </div>
 </div>

 {/* TABLES GRID */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
 {tablesList.map((table) => {
 const config = getStatusConfig(table.status);
 return (
 <div
 className={`group relative bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 border-slate-100 hover:border-slate-200`}
 key={table.id}
 onClick={() => handleOpenView(table)}
 >
 {/* Background Subtle Gradient */}
 <div className={`absolute inset-0 bg-gradient-to-b ${config.gradient} opacity-50 pointer-events-none`} />
 
 {/* Status Top Accent Line */}
 <div className={`h-1.5 w-full ${config.dot} transition-all duration-300 group-hover:h-2`} />

 <div className="p-6 relative z-10 flex-1 flex flex-col justify-between">
 <div className="flex justify-between items-start mb-5">
 <div className="flex items-center gap-3">
 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${config.bg} ${config.text} group-hover:scale-110 transition-transform duration-300`}>
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

 <div className="flex items-center justify-between mb-2 p-3 rounded-xl bg-white/60 border border-slate-100/50 backdrop-blur-sm">
 <div className="flex items-center gap-3">
 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${table.customer !=="No Customer" ?"bg-blue-50 text-blue-500" :"bg-slate-50 text-slate-400"}`}>
 <User size={16} />
 </div>
 <div>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
 Current Guest
 </p>
 <h4 className={`text-sm font-bold truncate max-w-[140px] ${table.customer !=="No Customer" ?"text-slate-900" :"text-slate-500"}`}>
 {table.customer}
 </h4>
 </div>
 </div>
 <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm border ${config.bg} ${config.text} border-white/50`}>
 {table.status}
 </span>
 </div>
 </div>

 <div className="grid grid-cols-2 border-t border-slate-100 divide-x divide-slate-100 bg-white/5 relative z-10">
 <button
 className="py-3.5 text-xs font-bold text-slate-600 hover:bg-white hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
 onClick={(e) => {
 e.stopPropagation();
 handleOpenView(table);
 }}
 >
 <Eye size={14} /> View
 </button>
 <button
 className="py-3.5 text-xs font-bold text-slate-600 hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
 onClick={(e) => {
 e.stopPropagation();
 handleOpenEdit(table);
 }}
 >
 <Edit2 size={14} /> Edit
 </button>
 </div>
 </div>
 );
 })}
 </div>

 {/* ================= MODALS REGION ================= */}
 {activeModal && (
 <div
 className="modal-overlay fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity"
 onClick={closeModal}
 >
 <div
 className="modal-content bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-slide-in"
 onClick={(e) => e.stopPropagation()}
 >
 {/* VIEW DETAILS MODAL */}
 {activeModal ==="view" &&
 selectedTable &&
 (() => {
 const currentViewingTable =
 tablesList.find((t) => t.id === selectedTable.id) ||
 selectedTable;
 const config = getStatusConfig(currentViewingTable.status);
 return (
 <>
 <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white/5">
 <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
 <Eye size={18} className="text-purple-500" />
 {currentViewingTable.name} Details
 </h2>
 <button
 onClick={closeModal}
 className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition"
 >
 <X size={16} />
 </button>
 </div>

 <div className="p-6 overflow-y-auto space-y-4">
 <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl p-4">
 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
 Status
 </span>
 <span
 className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${config.bg} ${config.text}`}
 >
 {currentViewingTable.status ||"Available"}
 </span>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
 <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
 Capacity
 </span>
 <span className="font-bold text-slate-900 flex items-center gap-1.5">
 <Utensils size={14} className="text-slate-400" />{""}
 {currentViewingTable.seats} Seats
 </span>
 </div>
 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
 <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
 Customer
 </span>
 <span className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
 <User size={14} className="text-slate-400" />{""}
 {currentViewingTable.customer}
 </span>
 </div>
 </div>

 <h3 className="text-base font-black text-slate-900 mt-6 mb-2">
 Ordered Items Tracking
 </h3>
 <hr className="border-slate-100 mb-4" />

 <div className="max-h-[180px] overflow-y-auto flex flex-col gap-2 pr-2">
 {!currentViewingTable.activeOrder ||
 currentViewingTable.activeOrder.length === 0 ? (
 <p className="text-slate-500 italic text-sm py-2 text-center border-2 border-dashed border-slate-200 rounded-xl p-6">
 No active orders running for this table.
 </p>
 ) : (
 currentViewingTable.activeOrder.map((item, idx) => (
 <div
 className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2 shadow-sm"
 key={item.id || idx}
 >
 <div className="flex gap-2.5 text-sm text-slate-800">
 <span className="font-semibold">
 {item.name}
 </span>
 <strong className="text-slate-500">
 x{item.qty}
 </strong>
 </div>

 {/* Interactive Toggle Button status layout */}
 <button
 type="button"
 className={`px-2.5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm transition-colors ${
 item.delivered
 ?"bg-emerald-100 text-emerald-600"
 :"bg-white border border-slate-200 text-slate-500"
 }`}
 onClick={() =>
 toggleItemDelivery(
 currentViewingTable.id,
 item.id
 )
 }
 >
 {item.delivered ?"✓ Delivered" :"⏳ Pending"}
 </button>
 </div>
 ))
 )}
 </div>

 <div className="flex gap-3 mt-6 border-t border-slate-100 pt-5">
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
 o.status !=="Completed" &&
 o.status !=="Cancelled"
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
 className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3.5 rounded-xl transition-all shadow-sm border border-rose-200 text-sm"
 >
 Cancel Order
 </button>
 <button
 type="button"
 onClick={() => {
 closeModal();
 navigate("/cashier/pending-bills", { 
 state: { openTable: currentViewingTable.name } 
 });
 }}
 className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm"
 >
 Checkout Table
 </button>
 </div>
 </div>
 </>
 );
 })()}

 {/* ADD / EDIT FORM MODALS */}
 {(activeModal ==="add" || activeModal ==="edit") && (
 <form
 className="flex flex-col h-full"
 onSubmit={activeModal ==="add" ? saveAddTable : saveEditTable}
 >
 <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white/5">
 <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
 {activeModal ==="add" ? (
 <Plus size={18} className="text-blue-500" />
 ) : (
 <Edit2 size={18} className="text-blue-500" />
 )}
 {activeModal ==="add"
 ?"Add New Table"
 : `Edit Table ${selectedTable?.id}`}
 </h2>
 <button
 type="button"
 onClick={closeModal}
 className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition"
 >
 <X size={16} />
 </button>
 </div>

 <div className="p-6 space-y-4 overflow-y-auto">
 <div>
 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
 Number of Seats:
 </label>
 <input
 id="formSeats"
 name="formSeats"
 type="number"
 className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-bold text-sm text-slate-900 mt-1.5"
 value={formSeats}
 onChange={(e) => setFormSeats(e.target.value)}
 required
 min="1"
 />
 </div>

 <div>
 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
 Status:
 </label>
 <select
 id="formStatus"
 name="formStatus"
 className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-bold text-sm cursor-pointer text-slate-700 mt-1.5"
 value={formStatus}
 onChange={(e) => setFormStatus(e.target.value)}
 >
 <option value="Available">Available</option>
 <option value="Occupied">Occupied</option>
 <option value="Reserved">Reserved</option>
 <option value="Cleaning">Cleaning</option>
 </select>
 </div>

 {formStatus !=="Available" && formStatus !=="Cleaning" && (
 <div className="animate-slide-in">
 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
 Customer Name:
 </label>
 <input
 id="formCustomer"
 name="formCustomer"
 className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-bold text-sm text-slate-900 mt-1.5"
 type="text"
 value={formCustomer}
 onChange={(e) => setFormCustomer(e.target.value)}
 placeholder="Enter customer name"
 required
 />
 </div>
 )}
 </div>

 <div className="p-5 border-t border-slate-100 bg-white/5 flex gap-3">
 <button
 type="button"
 className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition shadow-sm"
 onClick={closeModal}
 >
 Cancel
 </button>
 <button
 type="submit"
 className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-md"
 >
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
