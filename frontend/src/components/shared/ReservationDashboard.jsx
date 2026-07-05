import React, { useState, useEffect } from"react";
import {
 CalendarPlus,
 Utensils,
 Users,
 Clock,
 Phone,
 FileText,
 X,
 Star,
 CheckCircle2,
 Hourglass,
 CalendarCheck,
 Trash2,
 Edit2,
} from"lucide-react";
import { useNavigate } from"react-router-dom";
import apiClient from"../../api/apiClient";
import { io } from"socket.io-client";
import { useTables } from"../../context/TableContext";

import"../../styles/reservations.css";

const defaultReservations = [];

const getAvatarGradient = (index) => {
 const gradients = [
"from-blue-500 to-indigo-600",
"from-pink-500 to-rose-600",
"from-violet-500 to-purple-600",
"from-emerald-400 to-teal-500",
"from-orange-400 to-amber-500",
 ];
 return gradients[index % gradients.length];
};

const getStatusBadge = (status) => {
 switch (status) {
 case"Confirmed":
 return"bg-emerald-50 text-emerald-600 border-emerald-200";
 case"Pending":
 return"bg-amber-50 text-amber-600 border-amber-200";
 case"VIP":
 return"bg-purple-50 text-purple-600 border-purple-200";
 default:
 return"bg-slate-50 text-slate-600 border-slate-100";
 }
};

const ReservationDashboard = ({ role ="staff" }) => {
 const navigate = useNavigate();
 const { tables, editTable, updateTableStatus, fetchTables } = useTables() || {
 tables: [],
 };

 useEffect(() => {
 if (fetchTables) fetchTables();
 }, [fetchTables]);

 const [reservationsData, setReservationsData] = useState([]);
 const [selectedReservation, setSelectedReservation] = useState(null);
 const [activeTab, setActiveTab] = useState("Active");
 const [isEditing, setIsEditing] = useState(false);
 const [editRes, setEditRes] = useState(null);

 const openReservation = (item) => {
 setSelectedReservation(item);
 setEditRes(item);
 setIsEditing(false);
 };

 const fetchReservations = async () => {
 try {
 const { data } = await apiClient.get("/api/reservations");
 setReservationsData(data);
 } catch (err) {
 console.error("Failed to fetch reservations:", err);
 }
 };

 useEffect(() => {
 fetchReservations();

 const socket = io(import.meta.env.VITE_API_URL ||"http://localhost:5001");
 socket.on("reservationUpdated", () => {
 fetchReservations();
 });

 return () => socket.disconnect();
 }, []);

 const handleSeatGuest = () => {
 navigate("/cashier/take-order", {
 state: {
 prefilledCustomer: selectedReservation.name,
 prefilledTable: selectedReservation.table !=="Unassigned" ? selectedReservation.table : null,
 }
 });
 };

 const [showAddModal, setShowAddModal] = useState(false);
 const [reservationToDelete, setReservationToDelete] = useState(null);

 const [newRes, setNewRes] = useState({
 name:"",
 status:"Pending",
 table:"",
 guests: 2,
 time:"",
 phone:"",
 notes:"",
 });



 const handleAddReservation = async (e) => {
 e.preventDefault();
 const res = {
 ...newRes,
 date: new Date().toLocaleDateString(),
 };

 try {
 await apiClient.post("/api/reservations", res);

 // Automatically update the table status to"Reserved" across the system
 if (res.table && tables && (editTable || updateTableStatus)) {
 const tableObj = tables.find(
 (t) =>
 (t.name || `Table ${t.id}`).toLowerCase() === res.table.toLowerCase()
 );

 if (tableObj && editTable) {
 editTable(tableObj._id || tableObj.id, {
 status:"Reserved",
 currentCustomer: res.name,
 reservationTime: res.time,
 });
 } else {
 const match = res.table.match(/\d+/);
 const tableId = match ? parseInt(match[0], 10) : null;
 if (tableId && updateTableStatus) {
 updateTableStatus(tableId,"Reserved", res.name);
 }
 }
 }

 setShowAddModal(false);
 setNewRes({
 name:"",
 status:"Pending",
 table:"",
 guests: 2,
 time:"",
 phone:"",
 notes:"",
 });
 fetchReservations();
 } catch (error) {
 console.error("Failed to add reservation:", error);
 }
 };

 const handleDelete = (id) => {
 setReservationToDelete(id);
 };

  const confirmDelete = async () => {
    try {
      const resObj = reservationsData.find(r => r.id === reservationToDelete || r._id === reservationToDelete);
      
      await apiClient.delete(`/api/reservations/${encodeURIComponent(reservationToDelete)}`);
      
      if (resObj && resObj.table && tables && editTable) {
        const tableObj = tables.find(
          (t) => (t.name || `Table ${t.id}`).toLowerCase() === resObj.table.toLowerCase()
        );
        if (tableObj && tableObj.status === "Reserved") {
          editTable(tableObj._id || tableObj.id, {
            status: "Available",
            currentCustomer: "No Customer",
            reservationTime: null,
          });
        }
      }

      setSelectedReservation(null);
      setReservationToDelete(null);
      fetchReservations();
    } catch (error) {
      console.error("Failed to delete reservation:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await apiClient.put(`/api/reservations/${encodeURIComponent(id)}`, { status: newStatus });
      setSelectedReservation((prev) =>
        prev && (prev.id === id || prev._id === id) ? { ...prev, status: newStatus } : prev
      );
      if (editRes && (editRes.id === id || editRes._id === id)) {
        setEditRes({ ...editRes, status: newStatus });
      }

      if (newStatus === "Completed" || newStatus === "Cancelled") {
        const resObj = reservationsData.find(r => r.id === id || r._id === id) || selectedReservation;
        if (resObj && resObj.table && tables && editTable) {
          const tableObj = tables.find(
            (t) => (t.name || `Table ${t.id}`).toLowerCase() === resObj.table.toLowerCase()
          );
          if (tableObj && tableObj.status === "Reserved") {
            editTable(tableObj._id || tableObj.id, {
              status: "Available",
              currentCustomer: "No Customer",
              reservationTime: null,
            });
          }
        }
      }

      fetchReservations();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleUpdateReservation = async (e) => {
    e.preventDefault();
    try {
      const id = editRes.id || editRes._id;
      await apiClient.put(`/api/reservations/${encodeURIComponent(id)}`, editRes);
      
      // Update Table Status if needed (similar to create)
      if (editRes.table && tables && editRes.table !== selectedReservation.table && (editTable || updateTableStatus)) {
        // Free the old table
        const oldTableObj = tables.find(
          (t) => (t.name || `Table ${t.id}`).toLowerCase() === selectedReservation.table.toLowerCase()
        );
        if (oldTableObj && editTable) {
          editTable(oldTableObj._id || oldTableObj.id, {
            status: "Available",
            currentCustomer: "No Customer",
            reservationTime: null,
          });
        }

        // Find the new table and mark it reserved
        const tableObj = tables.find(
          (t) => (t.name || `Table ${t.id}`).toLowerCase() === editRes.table.toLowerCase()
        );
        if (tableObj && editTable) {
          editTable(tableObj._id || tableObj.id, {
            status: "Reserved",
            currentCustomer: editRes.name,
            reservationTime: editRes.time,
          });
        }
      }

 setIsEditing(false);
 setSelectedReservation(editRes);
 fetchReservations();
 } catch (error) {
 console.error("Failed to update reservation:", error);
 }
 };

 const activeReservations = reservationsData.filter(r => r.status !=="Completed" && r.status !=="Cancelled");
 const historyReservations = reservationsData.filter(r => r.status ==="Completed" || r.status ==="Cancelled");
 const displayedReservations = activeTab ==="Active" ? activeReservations : historyReservations;

 const totalReservations = activeReservations.length;
 const confirmedCount = activeReservations.filter(
 (r) => r.status ==="Confirmed"
 ).length;
 const pendingCount = activeReservations.filter(
 (r) => r.status ==="Pending"
 ).length;
 const vipCount = activeReservations.filter((r) => r.status ==="VIP").length;

 return (
 <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans transition-colors duration-300">
 <main className="max-w-[1600px] mx-auto pb-12">
 <div className="flex justify-between items-center mb-8">
 <div>
 <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
 Manage Reservations
 </h1>
 <p className="text-slate-400 text-sm mt-0.5 font-medium">
 {role ==="cashier" ?"Cashier Panel" :"Dashboard"} <span className="mx-1.5 text-slate-600">&gt;</span>{""}
 Reservations
 </p>
 </div>
 {(role ==="cashier" || role ==="admin") && (
 <button
 onClick={() => setShowAddModal(true)}
 className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
 >
 <CalendarPlus size={16} /> New Booking
 </button>
 )}
 </div>

 <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
 <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
 <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
 <CalendarCheck size={22} />
 </div>
 <div>
 <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
 Total Bookings
 </h4>
 <h2 className="text-2xl font-black text-slate-900 mt-1">
 {totalReservations}
 </h2>
 </div>
 </div>

 <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
 <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
 <CheckCircle2 size={22} />
 </div>
 <div>
 <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
 Confirmed
 </h4>
 <h2 className="text-2xl font-black text-slate-900 mt-1">
 {confirmedCount}
 </h2>
 </div>
 </div>

 <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
 <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
 <Hourglass size={22} />
 </div>
 <div>
 <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
 Pending
 </h4>
 <h2 className="text-2xl font-black text-slate-900 mt-1">
 {pendingCount}
 </h2>
 </div>
 </div>

 <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
 <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
 <Star size={22} />
 </div>
 <div>
 <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
 VIP Guests
 </h4>
 <h2 className="text-2xl font-black text-slate-900 mt-1">
 {vipCount}
 </h2>
 </div>
 </div>
 </div>

 {/* TABS */}
 <div className="flex items-center gap-2 mb-6 bg-slate-200/50 p-1.5 rounded-xl w-fit">
 <button 
 onClick={() => setActiveTab("Active")}
 className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab ==="Active" ?"bg-white text-slate-900 shadow-sm" :"text-slate-500 hover:text-slate-700"}`}
 >
 Active
 </button>
 <button 
 onClick={() => setActiveTab("History")}
 className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab ==="History" ?"bg-white text-slate-900 shadow-sm" :"text-slate-500 hover:text-slate-700"}`}
 >
 History
 </button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
 {displayedReservations.length === 0 ? (
 <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border border-slate-100 border-dashed">
 <CalendarCheck size={48} className="mb-4 text-slate-600" />
 <p className="text-lg font-bold text-slate-500">No {activeTab.toLowerCase()} reservations found.</p>
 </div>
 ) : (
 displayedReservations.map((item, index) => (
 <div
 key={item.id}
 className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden"
 >
 <div className="p-6 pb-4 border-b border-slate-50">
 <div className="flex justify-between items-start mb-5">
 <div
 className={`w-14 h-14 rounded-2xl flex items-center justify-center text-slate-900 font-black text-xl shadow-md bg-gradient-to-br ${getAvatarGradient(
 index
 )}`}
 >
 {item?.name?.charAt(0) ||"?"}
 </div>
 <span
 className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(
 item.status
 )}`}
 >
 {item.status}
 </span>
 </div>
 <div>
 <h2 className="text-lg font-black text-slate-900">
 {item?.name ||"Guest"}
 </h2>
 <p className="text-xs font-semibold text-slate-400 mt-0.5">
 {item.phone}
 </p>
 </div>
 </div>

 <div className="p-6 pt-4 flex-1 flex flex-col gap-3.5 bg-white/5">
 <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
 <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
 <Utensils size={14} />
 </div>
 {item.table}
 </div>
 <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
 <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
 <Users size={14} />
 </div>
 {item.guests} Guests
 </div>
 <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
 <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
 <Clock size={14} />
 </div>
 {item.time}
 </div>
 </div>

 <div className="p-4 border-t border-slate-100">
 <button
 onClick={() => openReservation(item)}
 className="w-full bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm text-sm"
 >
 Manage Booking
 </button>
 </div>
 </div>
 )))}
 </div>
 </main>

 {/* VIEW & MANAGE MODAL */}
 {selectedReservation && (
 <div
 className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-[60] flex justify-center items-center p-4 transition-opacity"
 onClick={() => setSelectedReservation(null)}
 >
 <div
 className="bg-white rounded-[24px] shadow-2xl shadow-indigo-900/20 w-full max-w-lg border border-slate-100 overflow-hidden animate-slide-in"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50/50 to-white">
 <div>
 <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
 {isEditing ?"Edit Reservation" :"Manage Reservation"}
 </h2>
 <span
 className={`mt-1.5 inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(
 selectedReservation.status
 )}`}
 >
 {selectedReservation.status} Booking
 </span>
 </div>
 <div className="flex items-center gap-2">
 {!isEditing && (
 <button
 onClick={() => setIsEditing(true)}
 className="text-purple-600 hover:text-purple-700 bg-purple-50 p-1.5 rounded-lg border border-purple-100 shadow-sm transition"
 title="Edit Reservation"
 >
 <Edit2 size={16} />
 </button>
 )}
 <button
 onClick={() => setSelectedReservation(null)}
 className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-lg border border-slate-100 shadow-sm transition"
 >
 <X size={16} />
 </button>
 </div>
 </div>

 {isEditing ? (
 <form onSubmit={handleUpdateReservation} className="p-6 space-y-4">
 <div>
 <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
 Guest Name *
 </label>
 <input
 type="text"
 required
 value={editRes.name}
 onChange={(e) =>
 setEditRes({ ...editRes, name: e.target.value })
 }
 className="w-full border-2 border-slate-100 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300"
 />
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
 Table *
 </label>
 <select
 required
 value={editRes.table}
 onChange={(e) =>
 setEditRes({ ...editRes, table: e.target.value })
 }
 className="w-full border-2 border-slate-100 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300 cursor-pointer"
 >
 <option value="" disabled>Select Table</option>
 {tables.map((t) => (
 <option key={t.id} value={t.name || `Table ${t.id}`}>
 {t.name || `Table ${t.id}`}
 </option>
 ))}
 </select>
 </div>
 <div>
 <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
 Guests *
 </label>
 <input
 type="number"
 required
 min="1"
 value={editRes.guests}
 onChange={(e) =>
 setEditRes({ ...editRes, guests: e.target.value })
 }
 className="w-full border-2 border-slate-100 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300"
 />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
 Time *
 </label>
 <input
 type="text"
 required
 value={editRes.time}
 onChange={(e) =>
 setEditRes({ ...editRes, time: e.target.value })
 }
 className="w-full border-2 border-slate-100 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300"
 />
 </div>
 <div>
 <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
 Phone
 </label>
 <input
 type="tel"
 pattern="[0-9]{10}"
 maxLength="10"
 value={editRes.phone}
 onChange={(e) =>
 setEditRes({
 ...editRes,
 phone: e.target.value.replace(/\D/g,"").slice(0, 10),
 })
 }
 className="w-full border-2 border-slate-100 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300"
 />
 </div>
 </div>

 <div>
 <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
 Notes
 </label>
 <textarea
 rows="2"
 value={editRes.notes}
 onChange={(e) =>
 setEditRes({ ...editRes, notes: e.target.value })
 }
 className="w-full border-2 border-slate-100 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm text-slate-800 resize-none placeholder:text-slate-300"
 ></textarea>
 </div>

 <div className="flex gap-3 pt-4 mt-2 border-t border-slate-100">
 <button
 type="button"
 onClick={() => setIsEditing(false)}
 className="flex-1 bg-white border-2 border-slate-200 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-all"
 >
 Cancel
 </button>
 <button
 type="submit"
 className="flex-1 bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all"
 >
 Save Changes
 </button>
 </div>
 </form>
 ) : (
 <div className="p-6 space-y-4">
 <div className="flex justify-between items-center pb-3 border-b border-slate-100">
 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
 Guest Name
 </span>
 <span className="font-black text-slate-900">
 {selectedReservation.name}
 </span>
 </div>

 <div className="flex justify-between items-center pb-3 border-b border-slate-100">
 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
 Contact
 </span>
 <span className="font-bold text-slate-700 flex items-center gap-1.5">
 <Phone size={14} className="text-slate-400" />{""}
 {selectedReservation.phone}
 </span>
 </div>

 <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100">
 <div>
 <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
 Table
 </span>
 <span className="font-bold text-slate-900 flex items-center gap-1.5">
 <Utensils size={14} className="text-slate-400" />{""}
 {selectedReservation.table}
 </span>
 </div>
 <div>
 <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
 Party Size
 </span>
 <span className="font-bold text-slate-900 flex items-center gap-1.5">
 <Users size={14} className="text-slate-400" />{""}
 {selectedReservation.guests} Guests
 </span>
 </div>
 </div>

 <div className="flex justify-between items-center pb-4">
 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
 Arrival Time
 </span>
 <span className="font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-lg border border-purple-100 flex items-center gap-1.5">
 <Clock size={14} /> {selectedReservation.time}
 </span>
 </div>

 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
 <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
 <FileText size={14} /> Special Requests / Notes
 </span>
 <p className="text-sm font-medium text-slate-700 leading-relaxed">
 {selectedReservation.notes ||"No special requests appended."}
 </p>
 </div>

 <div className="pt-2">
 <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-3">
 Quick Actions
 </label>
 {(role ==="cashier" || role ==="admin") && (
 <div className="flex gap-2">
 <button
 onClick={() => handleStatusChange(selectedReservation.id || selectedReservation._id, "Confirmed")}
 className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl text-[11px] font-bold transition-all border shadow-sm ${
 selectedReservation.status ==="Confirmed"
 ?"bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/30 scale-[1.02]"
 :"bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600"
 }`}
 >
 <CheckCircle2 size={16} className="mb-1" /> Confirm
 </button>
 <button
 onClick={() => handleStatusChange(selectedReservation.id || selectedReservation._id, "Pending")}
 className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl text-[11px] font-bold transition-all border shadow-sm ${
 selectedReservation.status ==="Pending"
 ?"bg-amber-500 text-white border-amber-600 shadow-amber-500/30 scale-[1.02]"
 :"bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600"
 }`}
 >
 <Hourglass size={16} className="mb-1" /> Pending
 </button>
 <button
 onClick={() => handleStatusChange(selectedReservation.id || selectedReservation._id, "VIP")}
 className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl text-[11px] font-bold transition-all border shadow-sm ${
 selectedReservation.status ==="VIP"
 ?"bg-indigo-500 text-white border-indigo-600 shadow-indigo-500/30 scale-[1.02]"
 :"bg-white text-slate-600 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600"
 }`}
 >
 <Star size={16} className="mb-1" /> VIP
 </button>
 </div>
 )}
 {selectedReservation.status !=="Completed" && selectedReservation.status !=="Cancelled" && (
 <div className="flex gap-2 mt-3">
 <button
 onClick={() => handleStatusChange(selectedReservation.id || selectedReservation._id, "Completed")}
 className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 shadow-sm"
 >
 <CheckCircle2 size={14} /> Mark Complete
 </button>
 <button
 onClick={() => handleStatusChange(selectedReservation.id || selectedReservation._id, "Cancelled")}
 className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border bg-white text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 shadow-sm"
 >
 <X size={14} /> Cancel Booking
 </button>
 </div>
 )}
 </div>
 </div>
 )}

 {!isEditing && (
 <div className="p-5 border-t border-slate-100 bg-white/5 flex gap-3">
 {(role ==="cashier" || role ==="admin") && (
 <button
 onClick={() => handleDelete(selectedReservation.id || selectedReservation._id)}
 className="flex items-center justify-center gap-2 flex-1 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold py-3 rounded-xl transition-all shadow-sm"
 >
 <Trash2 size={16} /> Delete
 </button>
 )}
 <button
 onClick={() => setSelectedReservation(null)}
 className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-md"
 >
 Done
 </button>
 </div>
 )}
 </div>
 </div>
 )}

 {/* ADD RESERVATION MODAL */}
 {(role ==="cashier" || role ==="admin") && showAddModal && (
 <div
 className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-[60] flex justify-center items-center p-4 transition-opacity"
 onClick={() => setShowAddModal(false)}
 >
 <div
 className="bg-white rounded-[24px] shadow-2xl shadow-indigo-900/20 w-full max-w-lg border border-slate-100 overflow-hidden animate-slide-in"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50/50 to-white">
 <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
 <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><CalendarPlus size={16} /></div> New
 Booking
 </h2>
 <button
 onClick={() => setShowAddModal(false)}
 className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-lg border border-slate-100 shadow-sm transition"
 >
 <X size={16} />
 </button>
 </div>

 <form onSubmit={handleAddReservation} className="p-6 space-y-4">
 <div>
 <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
 Guest Name *
 </label>
 <input
 id="resGuestName"
 name="resGuestName"
 type="text"
 required
 value={newRes.name}
 onChange={(e) =>
 setNewRes({ ...newRes, name: e.target.value })
 }
 className="w-full border-2 border-slate-100 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300"
 placeholder="e.g. Jane Doe"
 />
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
 Table *
 </label>
 <select
 id="resTable"
 name="resTable"
 required
 value={newRes.table}
 onChange={(e) =>
 setNewRes({ ...newRes, table: e.target.value })
 }
 className="w-full border-2 border-slate-100 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300 cursor-pointer"
 >
 <option value="" disabled>
 Select Table
 </option>
 {tables.map((t) => (
 <option key={t.id} value={t.name || `Table ${t.id}`}>
 {t.name || `Table ${t.id}`}
 </option>
 ))}
 </select>
 </div>
 <div>
 <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
 Guests *
 </label>
 <input
 id="resGuests"
 name="resGuests"
 type="number"
 required
 min="1"
 value={newRes.guests}
 onChange={(e) =>
 setNewRes({ ...newRes, guests: e.target.value })
 }
 className="w-full border-2 border-slate-100 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300"
 />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
 Time *
 </label>
 <input
 id="resTime"
 name="resTime"
 type="text"
 required
 value={newRes.time}
 onChange={(e) =>
 setNewRes({ ...newRes, time: e.target.value })
 }
 className="w-full border-2 border-slate-100 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300"
 placeholder="7:00 PM"
 />
 </div>
 <div>
 <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
 Phone
 </label>
 <input
 id="resPhone"
 name="resPhone"
 type="tel"
 pattern="[0-9]{10}"
 maxLength="10"
 title="Please enter exactly 10 digits"
 value={newRes.phone}
 onChange={(e) =>
 setNewRes({
 ...newRes,
 phone: e.target.value.replace(/\D/g,"").slice(0, 10),
 })
 }
 className="w-full border-2 border-slate-100 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300"
 placeholder="e.g. 9812345678"
 />
 </div>
 </div>

 <div>
 <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
 Status
 </label>
 <select
 id="resStatus"
 name="resStatus"
 value={newRes.status}
 onChange={(e) =>
 setNewRes({ ...newRes, status: e.target.value })
 }
 className="w-full border-2 border-slate-100 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300 cursor-pointer"
 >
 <option value="Pending">Pending</option>
 <option value="Confirmed">Confirmed</option>
 <option value="VIP">VIP</option>
 </select>
 </div>

 <div>
 <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
 Notes
 </label>
 <textarea
 id="resNotes"
 name="resNotes"
 rows="2"
 value={newRes.notes}
 onChange={(e) =>
 setNewRes({ ...newRes, notes: e.target.value })
 }
 className="w-full border-2 border-slate-100 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm text-slate-800 resize-none placeholder:text-slate-300"
 placeholder="Special requests..."
 ></textarea>
 </div>

 <div className="flex gap-3 pt-4 mt-2 border-t border-slate-100">
 <button
 type="button"
 onClick={() => setShowAddModal(false)}
 className="flex-1 bg-white border-2 border-slate-200 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-all"
 >
 Cancel
 </button>
 <button
 type="submit"
 className="flex-1 bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all"
 >
 Create Booking
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 {/* DELETE CONFIRMATION MODAL */}
 {(role ==="cashier" || role ==="admin") && reservationToDelete && (
 <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex justify-center items-center p-4 transition-opacity">
 <div className="bg-white rounded-[24px] shadow-2xl shadow-rose-900/20 w-full max-w-sm border border-slate-100 p-6 text-center animate-slide-in">
 <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
 <Trash2 size={28} className="text-rose-500" />
 </div>
 <h2 className="text-xl font-black text-slate-900 mb-2">
 Delete this reservation?
 </h2>
 <p className="text-sm text-slate-500 font-medium mb-6">
 Are you sure you want to delete this booking? This action cannot
 be undone.
 </p>
 <div className="flex gap-3">
 <button
 onClick={() => setReservationToDelete(null)}
 className="flex-1 bg-white border-2 border-slate-200 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-all"
 >
 Cancel
 </button>
 <button
 onClick={confirmDelete}
 className="flex-1 bg-rose-500 text-white font-bold py-3.5 rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-500/30 transition-all"
 >
 Yes, Delete
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
};

export default ReservationDashboard;
