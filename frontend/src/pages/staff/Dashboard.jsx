import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  Utensils, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  User,
  Users,
  ChevronRight,
  Package,
  CalendarClock,
  X,
  Edit2,
  Receipt
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../../styles/staff.css"; // Kept for any global custom overrides
import { useOrders } from "../../context/OrderContext";

const initialTables = [
  { 
    number: 1, 
    status: "Occupied", 
    customer: "John Doe", 
    seats: 4, 
    label: "Customers Dining",
    activeOrder: { id: "#ORD-1027", items: ["Chicken Momo x2", "Cold Coffee x3"], total: "Rs. 1390" }
  },
  { 
    number: 2, 
    status: "Available", 
    customer: "No Customer", 
    seats: 2, 
    label: "Ready for New Guests",
    activeOrder: null 
  },
  { 
    number: 3, 
    status: "Reserved", 
    customer: "Sarah Jenkins", 
    seats: 6, 
    label: "Reserved for Guest",
    reservationTime: "07:30 PM",
    activeOrder: null
  },
  { 
    number: 4, 
    status: "Occupied", 
    customer: "Alex Mercer", 
    seats: 4, 
    label: "Customers Dining",
    activeOrder: { id: "#ORD-1022", items: ["Pepperoni Pizza x1", "French Fries x1"], total: "Rs. 1100" }
  },
  { 
    number: 5, 
    status: "Available", 
    customer: "No Customer", 
    seats: 2, 
    label: "Ready for New Guests",
    activeOrder: null 
  },
  { 
    number: 6, 
    status: "Occupied", 
    customer: "Emily Watson", 
    seats: 5, 
    label: "Customers Dining",
    activeOrder: { id: "#ORD-1025", items: ["Chicken Burger x2", "Chowmein x1"], total: "Rs. 1250" }
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [tablesList, setTablesList] = useState(initialTables);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal tracking states
  const [selectedTableDetails, setSelectedTableDetails] = useState(null);
  const [editingTable, setEditingTable] = useState(null);

  // Edit form states
  const [editStatus, setEditStatus] = useState("");
  const [editCustomer, setEditCustomer] = useState("");
  const [editSeats, setEditSeats] = useState(2);
  const [editTime, setEditTime] = useState("");

  const { orders } = useOrders();

  // Filter tables list automatically
  const filteredTables = tablesList.filter((table) =>
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
    setTablesList(prev => prev.map(t => {
      if (t.number === editingTable.number) {
        let derivedLabel = "Ready for New Guests";
        let finalCustomer = editCustomer.trim() || "No Customer";

        if (editStatus === "Occupied") derivedLabel = "Customers Dining";
        if (editStatus === "Reserved") derivedLabel = "Reserved for Guest";
        if (editStatus === "Available") finalCustomer = "No Customer";

        return {
          ...t,
          status: editStatus,
          customer: finalCustomer,
          seats: parseInt(editSeats, 10),
          label: derivedLabel,
          reservationTime: editStatus === "Reserved" ? editTime : null,
          activeOrder: editStatus === "Occupied" ? (t.activeOrder || { id: "#ORD-NEW", items: ["Custom Order Initialized"], total: "Rs. 0" }) : null
        };
      }
      return t;
    }));
    setEditingTable(null);
  };

  // UI Helpers
  const getTableStatusStyles = (status) => {
    switch(status) {
      case "Occupied": return { border: "border-t-rose-400", bg: "bg-rose-50", text: "text-rose-600" };
      case "Reserved": return { border: "border-t-amber-400", bg: "bg-amber-50", text: "text-amber-600" };
      default: return { border: "border-t-emerald-400", bg: "bg-emerald-50", text: "text-emerald-600" };
    }
  };

  const getOrderStatusStyles = (status) => {
    switch(status) {
      case "Cooking": return "bg-blue-50 text-blue-600 border-blue-200";
      case "Ready": return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Completed": return "bg-slate-50 text-slate-600 border-slate-200";
      default: return "bg-orange-50 text-orange-600 border-orange-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto pb-12">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Welcome Back 👋</h1>
            <p className="text-slate-400 text-sm mt-0.5 font-medium">Manage restaurant tables and live orders beautifully</p>
          </div>
          <button 
            onClick={() => navigate('/staff/take-order')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
          >
            <Plus size={16} /> Take New Order
          </button>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Utensils size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Tables</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">{tablesList.filter(t => t.status === "Occupied").length}</h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <Package size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pending Orders</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {orders.filter(o => o.status === "Pending" || o.status === "Cooking").length}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Completed Orders</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {orders.filter(o => o.status === "Completed").length}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <CalendarClock size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Reservations</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">{tablesList.filter(t => t.status === "Reserved").length}</h2>
            </div>
          </div>
        </div>

        {/* WORKSPACE FLEX SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: TABLES BLOCK MONITOR */}
          <div className="lg:col-span-8 xl:col-span-9">
            
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <h2 className="text-lg font-black text-slate-900">Restaurant Tables</h2>
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search table or state..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-400 transition-all shadow-sm placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredTables.map((table, index) => {
                const styles = getTableStatusStyles(table.status);
                
                return (
                  <div key={index} className={`bg-white rounded-2xl border-t-4 border-x border-b border-x-slate-100 border-b-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all ${styles.border}`}>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-black text-slate-900">Table {table.number}</h3>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${styles.bg} ${styles.text}`}>
                          {table.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                          <Utensils size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 mb-1">{table.label}</p>
                          <p className="text-[11px] font-medium text-slate-500 mb-0.5"><strong className="text-slate-700">Guest:</strong> {table.customer}</p>
                          <p className="text-[11px] font-medium text-slate-500"><strong className="text-slate-700">Capacity:</strong> {table.seats} Seats</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-t border-slate-100 divide-x divide-slate-100 bg-slate-50/50">
                      <button 
                        onClick={() => setSelectedTableDetails(table)}
                        className="py-3 text-xs font-bold text-slate-700 hover:bg-white hover:text-purple-600 transition flex items-center justify-center gap-1.5"
                      >
                        <Receipt size={14} /> View
                      </button>
                      <button 
                        onClick={() => openEditModal(table)}
                        className="py-3 text-xs font-bold text-slate-600 hover:bg-white transition flex items-center justify-center gap-1.5"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredTables.length === 0 && (
              <div className="text-center py-16 text-slate-400 font-medium">No tables match your search.</div>
            )}
          </div>

          {/* RIGHT: LIVE ORDERS QUEUE CONTAINER */}
          <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-6">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">Live Orders</h2>
              <button onClick={() => navigate('/staff/ready-orders')} className="text-[11px] font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-md transition-colors">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {orders.filter(o => o.status !== "Completed").slice(0, 6).map((order) => (
                <div 
                  key={order.id} 
                  onClick={() => order.status === "Ready" && navigate('/staff/ready-orders')}
                  className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-purple-200 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white border border-slate-200 text-slate-600 font-bold text-[10px] px-2 py-1 rounded-md shadow-sm">
                      {order.id}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{order.table || "Queue"}</h3>
                      <p className="text-[10px] font-medium text-slate-400">
                        {(order.items || []).reduce((acc, item) => acc + item.qty, 0)} items loaded
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getOrderStatusStyles(order.status)}`}>
                      {order.status}
                    </span>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-purple-500 transition-colors" />
                  </div>
                </div>
              ))}
              {orders.filter(o => o.status !== "Completed").length === 0 && (
                <div className="text-center py-6 text-slate-400 text-sm font-medium">
                  No active orders right now.
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* --- POPUP 1: WORKING VIEW MODAL --- */}
      {selectedTableDetails && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity" onClick={() => setSelectedTableDetails(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-in" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-lg font-black text-slate-900">Overview: Table {selectedTableDetails.number}</h2>
                <span className={`mt-1.5 inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${getTableStatusStyles(selectedTableDetails.status).bg} ${getTableStatusStyles(selectedTableDetails.status).text}`}>
                  {selectedTableDetails.status}
                </span>
              </div>
              <button onClick={() => setSelectedTableDetails(null)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition">
                <X size={16} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Guest Assignee</span>
                  <p className="font-bold text-slate-900 text-sm truncate">{selectedTableDetails.customer}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Capacity</span>
                  <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5"><Users size={14} className="text-slate-400"/> {selectedTableDetails.seats} People max</p>
                </div>
                {selectedTableDetails.status === "Reserved" && (
                  <div className="col-span-2 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                    <span className="block text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Expected Arrival ETA</span>
                    <p className="font-bold text-amber-900 text-sm flex items-center gap-1.5"><Clock size={14}/> Today at {selectedTableDetails.reservationTime}</p>
                  </div>
                )}
              </div>

              {selectedTableDetails.status === "Occupied" && selectedTableDetails.activeOrder ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-900 text-white p-3 flex justify-between items-center">
                    <h4 className="font-bold text-sm text-slate-100">Running Ticket</h4>
                    <span className="text-[10px] bg-slate-700 px-2 py-1 rounded-md font-bold">{selectedTableDetails.activeOrder.id}</span>
                  </div>
                  <div className="p-4 space-y-2 bg-slate-50">
                    {selectedTableDetails.activeOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> {item}
                      </div>
                    ))}
                  </div>
                  <div className="bg-white p-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Balance</span>
                    <strong className="text-lg font-black text-purple-600">{selectedTableDetails.activeOrder.total}</strong>
                  </div>
                </div>
              ) : selectedTableDetails.status === "Available" ? (
                <div className="text-center py-8 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 px-6">
                  <CheckCircle2 size={28} className="mx-auto mb-2 opacity-80" />
                  <p className="font-bold text-sm">Station is clean and set up.</p>
                  <p className="text-xs mt-1 opacity-80 font-medium">Ready to process a new terminal order.</p>
                </div>
              ) : null}
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/50">
              <button className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-100 transition shadow-sm" onClick={() => setSelectedTableDetails(null)}>
                Dismiss View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- POPUP 2: WORKING EDIT MODAL --- */}
      {editingTable && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity" onClick={() => setEditingTable(null)}>
          <form className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-in" onClick={(e) => e.stopPropagation()} onSubmit={handleSaveTableEdits}>
            
            <div className="flex justify-between items-start p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Edit2 size={18} className="text-blue-500"/> Modify Table {editingTable.number}
                </h2>
                <p className="text-[11px] font-bold text-slate-400 mt-1">Adjust live layout status and hospitality parameters</p>
              </div>
              <button type="button" className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition" onClick={() => setEditingTable(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hospitality Status</label>
                <select className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-bold text-sm cursor-pointer text-slate-700" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                  <option value="Available">🟢 Available (Vacant)</option>
                  <option value="Occupied">🔴 Occupied (Dining)</option>
                  <option value="Reserved">🟡 Reserved (Booked)</option>
                </select>
              </div>

              {editStatus !== "Available" && (
                <div className="animate-slide-in">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Primary Guest Name</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-semibold text-sm text-slate-900" 
                    placeholder="E.g., Michael Scott" 
                    required
                    value={editCustomer} 
                    onChange={(e) => setEditCustomer(e.target.value)} 
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Seating Max</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="12" 
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-bold text-sm text-slate-900" 
                    value={editSeats} 
                    onChange={(e) => setEditSeats(e.target.value)} 
                  />
                </div>

                {editStatus === "Reserved" && (
                  <div className="animate-slide-in">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Arrival ETA</label>
                    <input 
                      type="text" 
                      className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-amber-500 transition-all font-bold text-sm text-slate-900" 
                      placeholder="08:15 PM" 
                      value={editTime} 
                      onChange={(e) => setEditTime(e.target.value)} 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button type="button" className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-100 transition shadow-sm" onClick={() => setEditingTable(null)}>
                Cancel
              </button>
              <button type="submit" className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-md">
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