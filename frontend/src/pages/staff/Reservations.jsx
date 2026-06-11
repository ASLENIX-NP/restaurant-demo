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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <CalendarCheck size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Bookings</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">{totalReservations}</h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Confirmed</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">{confirmedCount}</h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <Hourglass size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pending</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">{pendingCount}</h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Star size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">VIP Guests</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">{vipCount}</h2>
            </div>
          </div>
        </div>

        {/* RESERVATIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {reservationsData.map((item, index) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden"
            >
              {/* Card Top */}
              <div className="p-6 pb-4 border-b border-slate-50">
                <div className="flex justify-between items-start mb-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md bg-gradient-to-br ${getAvatarGradient(index)}`}>
                    {item?.name?.charAt(0) || '?'}
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">{item?.name || 'Guest'}</h2>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">{item.phone}</p>
                </div>
              </div>

              {/* Card Details */}
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

              {/* Card Action */}
              <div className="p-4 border-t border-slate-100">
                <button 
                  onClick={() => setSelectedReservation(item)}
                  className="w-full bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
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
            <div className="p-6 space-y-4">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guest Name</span>
                <span className="font-black text-slate-900">{selectedReservation.name}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</span>
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone size={14} className="text-slate-400"/> {selectedReservation.phone}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100">
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Table</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Utensils size={14} className="text-slate-400"/> {selectedReservation.table}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Party Size</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Users size={14} className="text-slate-400"/> {selectedReservation.guests} Guests
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Arrival Time</span>
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

            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => setSelectedReservation(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-md"
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