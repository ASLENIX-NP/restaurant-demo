import React, { useState } from "react";
import { 
  MonitorPlay, 
  RefreshCw, 
  ClipboardList, 
  ChefHat, 
  CheckCircle2, 
  Utensils,
  Clock
} from "lucide-react";

import "../../styles/kitchen.css"; // Kept for any global custom overrides
import { useOrders } from "../../context/OrderContext";

const Kitchen = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { orders = [] } = useOrders();

  const formatOrderForKitchen = (order) => ({
    id: order.id,
    time: order.time,
    table: order.table,
    server: order.server || "System",
    type: order.channel || "Dine In",
    items: (order.items || []).map(item => `${item.qty}x ${item.name}`),
    statusText: order.status === "Pending" ? "Waiting for Kitchen" : 
                order.status === "Cooking" ? "Preparing Food" : 
                order.status === "Ready" ? "Ready For Service" : "Completed"
  });

  // Helper to ensure strict FIFO (Oldest first)
  const sortFIFO = (orderList) => {
    return [...orderList].sort((a, b) => 
      new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime()
    );
  };

  const kitchenData = {
    newOrders: sortFIFO(orders.filter(o => o.status === "Pending")).map(formatOrderForKitchen),
    preparing: sortFIFO(orders.filter(o => o.status === "Cooking")).map(formatOrderForKitchen),
    ready: sortFIFO(orders.filter(o => o.status === "Ready")).map(formatOrderForKitchen),
    completed: sortFIFO(orders.filter(o => o.status === "Completed")).map(formatOrderForKitchen)
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
              Kitchen Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-0.5 font-medium">
              Manage and track kitchen orders in real-time
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all">
              <MonitorPlay size={16} />
              Kitchen Display
            </button>
            <button 
              onClick={handleRefresh}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* METRICS & STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {/* New Orders Stat */}
          <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <ClipboardList size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{kitchenData.newOrders.length}</h2>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">New Orders</h4>
            </div>
          </div>

          {/* Preparing Stat */}
          <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <ChefHat size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{kitchenData.preparing.length}</h2>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">Preparing</h4>
            </div>
          </div>

          {/* Ready Stat */}
          <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Utensils size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{kitchenData.ready.length}</h2>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">Ready</h4>
            </div>
          </div>

          {/* Completed Stat */}
          <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{kitchenData.completed.length}</h2>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">Completed Today</h4>
            </div>
          </div>
        </div>

        {/* KANBAN ORDER COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

          {/* COLUMN 1: NEW ORDERS */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center bg-orange-100/50 border border-orange-200/50 rounded-xl py-3 px-4">
              <h3 className="font-bold text-orange-700 text-sm">New Orders</h3>
              <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{kitchenData.newOrders.length}</span>
            </div>
            {kitchenData.newOrders.map((order, idx) => (
              <OrderCard key={idx} order={order} colorTheme="orange" />
            ))}
          </div>

          {/* COLUMN 2: PREPARING */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center bg-amber-100/50 border border-amber-200/50 rounded-xl py-3 px-4">
              <h3 className="font-bold text-amber-700 text-sm">Preparing</h3>
              <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{kitchenData.preparing.length}</span>
            </div>
            {kitchenData.preparing.map((order, idx) => (
              <OrderCard key={idx} order={order} colorTheme="amber" />
            ))}
          </div>

          {/* COLUMN 3: READY */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center bg-emerald-100/50 border border-emerald-200/50 rounded-xl py-3 px-4">
              <h3 className="font-bold text-emerald-700 text-sm">Ready</h3>
              <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{kitchenData.ready.length}</span>
            </div>
            {kitchenData.ready.map((order, idx) => (
              <OrderCard key={idx} order={order} colorTheme="emerald" />
            ))}
          </div>

          {/* COLUMN 4: COMPLETED */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center bg-slate-200/50 border border-slate-300/50 rounded-xl py-3 px-4">
              <h3 className="font-bold text-slate-700 text-sm">Completed</h3>
              <span className="bg-slate-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{kitchenData.completed.length}</span>
            </div>
            {kitchenData.completed.map((order, idx) => (
              <OrderCard key={idx} order={order} colorTheme="slate" isCompleted />
            ))}
          </div>

        </div>

      </main>
    </div>
  );
};

/* REUSABLE KITCHEN ORDER CARD COMPONENT */
const OrderCard = ({ order, colorTheme, isCompleted = false }) => {
  
  // Theme color maps for Tailwind utilities
  const themeMap = {
    orange: { bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-500", gradient: "from-orange-50 to-transparent" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500", gradient: "from-amber-50 to-transparent" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500", gradient: "from-emerald-50 to-transparent" },
    slate: { bg: "bg-slate-50", text: "text-slate-500", dot: "bg-slate-400", gradient: "from-slate-50 to-transparent" }
  };

  const theme = themeMap[colorTheme];

  return (
    <div className={`group relative bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-100 hover:border-slate-200 ${isCompleted ? 'opacity-75' : ''}`}>
      
      {/* Background Subtle Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} opacity-50 pointer-events-none`} />
      
      {/* Status Top Accent Line */}
      <div className={`h-1.5 w-full ${theme.dot} transition-all duration-300 group-hover:h-2`} />

      <div className="p-5 relative z-10 flex-1 flex flex-col">
        {/* Top Details */}
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-black text-slate-900 text-lg tracking-tight">{order.id}</h4>
          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-white/60 px-2 py-1 rounded-md border border-slate-100/50 backdrop-blur-sm">
            <Clock size={12} /> {order.time}
          </span>
        </div>

        {/* Meta Info */}
        <div className="text-xs font-bold text-slate-500 mb-4 pb-3 border-b border-slate-100/60 flex flex-col gap-1">
          <div>{order.table} <span className="mx-1 text-slate-300">•</span> {order.type}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Server: {order.server}</div>
        </div>

        {/* Food Items */}
        <ul className="space-y-2 mb-5 flex-1">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm font-semibold text-slate-700">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shadow-sm shrink-0 ${theme.dot}`} />
              <span className="leading-tight">{item}</span>
            </li>
          ))}
        </ul>

        {/* Status Badge */}
        <div className={`text-center py-2 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-sm border ${theme.bg} ${theme.text} border-white/50 backdrop-blur-sm`}>
          {order.statusText}
        </div>
      </div>
      
    </div>
  );
};

export default Kitchen;