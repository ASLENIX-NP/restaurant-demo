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
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <ClipboardList size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{kitchenData.newOrders.length}</h2>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">New Orders</h4>
            </div>
          </div>

          {/* Preparing Stat */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <ChefHat size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{kitchenData.preparing.length}</h2>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">Preparing</h4>
            </div>
          </div>

          {/* Ready Stat */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <Utensils size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{kitchenData.ready.length}</h2>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">Ready</h4>
            </div>
          </div>

          {/* Completed Stat */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
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
    orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", topBorder: "border-t-orange-400" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", topBorder: "border-t-amber-400" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", topBorder: "border-t-emerald-400" },
    slate: { bg: "bg-slate-100", text: "text-slate-500", border: "border-slate-200", topBorder: "border-t-slate-400" }
  };

  const theme = themeMap[colorTheme];

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-4 border-t-4 ${theme.topBorder} transition-transform hover:-translate-y-1 ${isCompleted ? 'opacity-75' : ''}`}>
      
      {/* Top Details */}
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-black text-slate-900 text-lg">{order.id}</h4>
        <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
          <Clock size={12} /> {order.time}
        </span>
      </div>

      {/* Meta Info */}
      <div className="text-xs font-bold text-slate-500 mb-4 pb-3 border-b border-slate-100 flex flex-col gap-1">
        <div>{order.table} <span className="mx-1 text-slate-300">•</span> {order.type}</div>
        <div className="text-[10px] text-slate-400">Server: {order.server}</div>
      </div>

      {/* Food Items */}
      <ul className="space-y-2 mb-5">
        {order.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm font-semibold text-slate-700">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${theme.bg.replace('bg-', 'bg-').replace('-50', '-400')}`} />
            {item}
          </li>
        ))}
      </ul>

      {/* Status Badge */}
      <div className={`text-center py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider border ${theme.bg} ${theme.text} ${theme.border}`}>
        {order.statusText}
      </div>
      
    </div>
  );
};

export default Kitchen;