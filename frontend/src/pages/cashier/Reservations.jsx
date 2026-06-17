import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useTables } from "../../context/TableContext";

import "../../styles/reservations.css";

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
    case "Confirmed":
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "Pending":
      return "bg-amber-50 text-amber-600 border-amber-200";
    case "VIP":
      return "bg-purple-50 text-purple-600 border-purple-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

const Reservations = () => {
  const { tables, editTable, updateTableStatus, fetchTables } = useTables() || {
    tables: [],
  };

  useEffect(() => {
    if (fetchTables) fetchTables();
  }, [fetchTables]);

  const [reservationsData, setReservationsData] = useState(() => {
    try {
      const saved = localStorage.getItem("restaurant_reservations");
      const parsed = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed)) {
        // Filter out the old dummy data that got stuck in the browser's storage
        return parsed.filter(
          (r) =>
            r.name !== "John Doe" &&
            r.name !== "Emily Smith" &&
            r.name !== "Michel Lee" &&
            r.name !== "Sarah Jenkins"
        );
      }
      return defaultReservations;
    } catch (e) {
      return defaultReservations;
    }
  });

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);

  const [newRes, setNewRes] = useState({
    name: "",
    status: "Pending",
    table: "",
    guests: 2,
    time: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    localStorage.setItem(
      "restaurant_reservations",
      JSON.stringify(reservationsData)
    );
    // Dispatch a storage event to actively sync the staff panel if open
    window.dispatchEvent(new Event("storage"));
  }, [reservationsData]);

  const handleAddReservation = (e) => {
    e.preventDefault();
    const res = {
      ...newRes,
      id: Date.now(),
    };
    setReservationsData([...reservationsData, res]);

    // Automatically update the table status to "Reserved" across the system
    if (res.table && tables && (editTable || updateTableStatus)) {
      const tableObj = tables.find(
        (t) =>
          (t.name || `Table ${t.id}`).toLowerCase() === res.table.toLowerCase()
      );

      if (tableObj && editTable) {
        editTable(tableObj._id || tableObj.id, {
          status: "Reserved",
          currentCustomer: res.name,
          reservationTime: res.time,
        });
      } else {
        const match = res.table.match(/\d+/);
        const tableId = match ? parseInt(match[0], 10) : null;
        if (tableId && updateTableStatus) {
          updateTableStatus(tableId, "Reserved", res.name);
        }
      }
    }

    setShowAddModal(false);
    setNewRes({
      name: "",
      status: "Pending",
      table: "",
      guests: 2,
      time: "",
      phone: "",
      notes: "",
    });
  };

  const handleDelete = (id) => {
    setReservationToDelete(id);
  };

  const confirmDelete = () => {
    setReservationsData(
      reservationsData.filter((r) => r.id !== reservationToDelete)
    );
    setSelectedReservation(null);
    setReservationToDelete(null);
  };

  const handleStatusChange = (id, newStatus) => {
    setReservationsData(
      reservationsData.map((r) =>
        r.id === id ? { ...r, status: newStatus } : r
      )
    );
    setSelectedReservation((prev) =>
      prev && prev.id === id ? { ...prev, status: newStatus } : prev
    );
  };

  const totalReservations = reservationsData.length;
  const confirmedCount = reservationsData.filter(
    (r) => r.status === "Confirmed"
  ).length;
  const pendingCount = reservationsData.filter(
    (r) => r.status === "Pending"
  ).length;
  const vipCount = reservationsData.filter((r) => r.status === "VIP").length;

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto pb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
              Manage Reservations
            </h1>
            <p className="text-slate-400 text-sm mt-0.5 font-medium">
              Cashier Panel <span className="mx-1.5 text-slate-300">&gt;</span>{" "}
              Reservations
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
          >
            <CalendarPlus size={16} /> New Booking
          </button>
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {reservationsData.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden"
            >
              <div className="p-6 pb-4 border-b border-slate-50">
                <div className="flex justify-between items-start mb-5">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md bg-gradient-to-br ${getAvatarGradient(
                      index
                    )}`}
                  >
                    {item?.name?.charAt(0) || "?"}
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
                    {item?.name || "Guest"}
                  </h2>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    {item.phone}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-4 flex-1 flex flex-col gap-3.5 bg-slate-50/30">
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
                  onClick={() => setSelectedReservation(item)}
                  className="w-full bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm text-sm"
                >
                  Manage Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* VIEW & MANAGE MODAL */}
      {selectedReservation && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity"
          onClick={() => setSelectedReservation(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  Manage Reservation
                </h2>
                <span
                  className={`mt-1.5 inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(
                    selectedReservation.status
                  )}`}
                >
                  {selectedReservation.status} Booking
                </span>
              </div>
              <button
                onClick={() => setSelectedReservation(null)}
                className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition"
              >
                <X size={16} />
              </button>
            </div>

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
                  <Phone size={14} className="text-slate-400" />{" "}
                  {selectedReservation.phone}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100">
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Table
                  </span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Utensils size={14} className="text-slate-400" />{" "}
                    {selectedReservation.table}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Party Size
                  </span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Users size={14} className="text-slate-400" />{" "}
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
                  {selectedReservation.notes || "No special requests appended."}
                </p>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Update Status
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleStatusChange(selectedReservation.id, "Confirmed")
                    }
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                      selectedReservation.status === "Confirmed"
                        ? "bg-emerald-500 text-white border-emerald-600 shadow-md"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-emerald-50"
                    }`}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(selectedReservation.id, "Pending")
                    }
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                      selectedReservation.status === "Pending"
                        ? "bg-amber-500 text-white border-amber-600 shadow-md"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-amber-50"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(selectedReservation.id, "VIP")
                    }
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                      selectedReservation.status === "VIP"
                        ? "bg-purple-500 text-white border-purple-600 shadow-md"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-purple-50"
                    }`}
                  >
                    VIP
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button
                onClick={() => handleDelete(selectedReservation.id)}
                className="flex items-center justify-center gap-2 flex-1 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold py-3 rounded-xl transition-all shadow-sm"
              >
                <Trash2 size={16} /> Delete
              </button>
              <button
                onClick={() => setSelectedReservation(null)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD RESERVATION MODAL */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <CalendarPlus size={18} className="text-purple-500" /> New
                Booking
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-lg border border-slate-200 shadow-sm transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddReservation} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
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
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Table
                  </label>
                  <select
                    id="resTable"
                    name="resTable"
                    value={newRes.table}
                    onChange={(e) =>
                      setNewRes({ ...newRes, table: e.target.value })
                    }
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm cursor-pointer"
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
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
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
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
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
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                    placeholder="7:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
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
                        phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                      })
                    }
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                    placeholder="e.g. 9812345678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  id="resStatus"
                  name="resStatus"
                  value={newRes.status}
                  onChange={(e) =>
                    setNewRes({ ...newRes, status: e.target.value })
                  }
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
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
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-all font-medium text-sm resize-none"
                  placeholder="Special requests..."
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4 mt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 shadow-md transition"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {reservationToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-slide-in">
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
                className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 shadow-md shadow-rose-200 transition"
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

export default Reservations;
