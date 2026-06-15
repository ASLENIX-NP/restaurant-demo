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
  CalendarCheck
} from "lucide-react";

import "../../styles/reservations.css"; // Kept for any global custom overrides

const defaultReservations = [];

// Helper to assign premium gradient backgrounds to avatars
const getAvatarGradient = (index) => {
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-pink-500 to-rose-600",
    "from-violet-500 to-purple-600",
    "from-emerald-400 to-teal-500",
    "from-orange-400 to-amber-500"
  ];
  return gradients[index % gradients.length];
};

// Helper for status badge styling
const getStatusBadge = (status) => {
  switch (status) {
    case "Confirmed": return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "Pending": return "bg-amber-50 text-amber-600 border-amber-200";
    case "VIP": return "bg-purple-50 text-purple-600 border-purple-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

const Reservations = () => {
  const [reservationsData, setReservationsData] = useState(() => {
    try {
      const saved = localStorage.getItem("restaurant_reservations");
      const parsed = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed)) {
        // Filter out the old dummy data that got stuck in the browser's storage
        return parsed.filter(r => 
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

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("restaurant_reservations");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setReservationsData(parsed.filter(r => 
              r.name !== "John Doe" && 
              r.name !== "Emily Smith" && 
              r.name !== "Michel Lee" && 
              r.name !== "Sarah Jenkins"
            ));
          }
        }
      } catch (e) {}
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Quick stats calculations
  const totalReservations = reservationsData.length;
  const confirmedCount = reservationsData.filter(r => r.status === "Confirmed").length;
  const pendingCount = reservationsData.filter(r => r.status === "Pending").length;
  const vipCount = reservationsData.filter(r => r.status === "VIP").length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto pb-12">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight">Reservations</h1>
            <p className="text-slate-400 text-sm mt-0.5 font-medium">
              Dashboard <span className="mx-1.5 text-slate-300">&gt;</span> Reservations
            </p>
          </div>
        </div>

        {/* METRICS & STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner border border-blue-100">
              <CalendarCheck size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Total Bookings</h4>
              <h2 className="text-3xl font-black text-slate-900 leading-none">{totalReservations}</h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-inner border border-emerald-100">
              <CheckCircle2 size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Confirmed</h4>
              <h2 className="text-3xl font-black text-slate-900 leading-none">{confirmedCount}</h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-inner border border-amber-100">
              <Hourglass size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Pending</h4>
              <h2 className="text-3xl font-black text-slate-900 leading-none">{pendingCount}</h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-inner border border-purple-100">
              <Star size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">VIP Guests</h4>
              <h2 className="text-3xl font-black text-slate-900 leading-none">{vipCount}</h2>
            </div>
          </div>
        </div>

        {/* RESERVATIONS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {reservationsData.length === 0 ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border border-slate-100 border-dashed">
              <CalendarCheck size={48} className="mb-4 text-slate-300" />
              <p className="text-lg font-bold text-slate-500">No reservations found.</p>
            </div>
          ) : (
            reservationsData.map((item, index) => (
            <div 
              key={item.id} 
              className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
              onClick={() => setSelectedReservation(item)}
            >
              {/* Card Top */}
              <div className="p-6 pb-4 flex justify-between items-start">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md bg-gradient-to-br ${getAvatarGradient(index)}`}>
                    {item?.name?.charAt(0) || '?'}
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(item.status)}`}>
                    {item.status}
                </span>
              </div>
              <div className="px-6 pb-4">
                <h2 className="text-xl font-black text-slate-900 truncate">{item?.name || 'Guest'}</h2>
                <p className="text-xs font-semibold text-slate-400 mt-1 flex items-center gap-1.5"><Phone size={12}/> {item.phone}</p>
              </div>

              {/* Card Details */}
              <div className="px-6 pb-6 pt-2 flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shadow-inner">
                    <Utensils size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Table</p>
                    <p className="text-sm font-bold text-slate-900">{item.table || 'Unassigned'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shadow-inner">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Guests</p>
                    <p className="text-sm font-bold text-slate-900">{item.guests} People</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-inner">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-0.5">Time</p>
                    <p className="text-sm font-bold text-purple-700">{item.time}</p>
                  </div>
                </div>
              </div>

              {/* Card Action */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <button 
                  className="w-full bg-white hover:bg-slate-900 text-slate-600 border border-slate-200 hover:text-white hover:border-slate-900 font-bold py-2.5 rounded-xl transition-all shadow-sm text-sm flex items-center justify-center gap-2"
                >
                  View Details
                </button>
              </div>
            </div>
            ))
          )}
        </div>
      </main>

      {/* AESTHETIC DETAIL MODAL */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity" onClick={() => setSelectedReservation(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-in" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  Reservation Details
                </h2>
                <span className={`mt-1.5 inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(selectedReservation.status)}`}>
                  {selectedReservation.status} Booking
                </span>
              </div>
              <button onClick={() => setSelectedReservation(null)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition">
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
              <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl p-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Guest Name</span>
                <span className="font-black text-slate-900 text-base">{selectedReservation.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 truncate"><Phone size={14} className="text-slate-400"/> {selectedReservation.phone}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Party Size</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5"><Users size={14} className="text-slate-400"/> {selectedReservation.guests} Guests</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Table</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5"><Utensils size={14} className="text-slate-400"/> {selectedReservation.table}</span>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                  <span className="block text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">Arrival Time</span>
                  <span className="font-bold text-purple-700 flex items-center gap-1.5"><Clock size={14} className="text-purple-500"/> {selectedReservation.time}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-2">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <FileText size={14} /> Special Requests / Notes
                </span>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  {selectedReservation.notes || "No special requests appended."}
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => setSelectedReservation(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;