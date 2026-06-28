import React from"react";
import {
 CheckCircle2,
 PackageCheck,
 UtensilsCrossed,
 Clock,
 BellRing,
 Sparkles,
 ChefHat,
} from"lucide-react";
import Skeleton from "../../components/ui/Skeleton";
import { useOrders } from"../../context/OrderContext";

const ReadyOrders = () => {
 const { orders, serveOrder, isLoading } = useOrders();

 // Filter orders to only show those marked as"Ready" by the kitchen
 const readyOrders = orders.filter((order) => order.status ==="Ready");

 return (
 <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-10 text-slate-800 font-sans relative overflow-hidden z-0">
 {/* Decorative background blurs */}
 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-300/10 rounded-full blur-[100px] -z-10" />
 <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-300/10 rounded-full blur-[100px] -z-10" />

 <main className="max-w-[1400px] mx-auto">
 {/* HEADER SECTION */}
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 md:mb-10 gap-4">
 <div>
 <div className="flex items-center gap-3 mb-2">
 <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl shadow-sm">
 <BellRing size={24} />
 </div>
 <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
 Ready for Service
 </h1>
 </div>
 <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5 ml-1">
 <ChefHat size={16} className="text-slate-400" /> Kitchen has
 finished these orders. Awaiting waitstaff pickup.
 </p>
 </div>
 <div className="bg-white/80 w-full sm:w-auto justify-center backdrop-blur-md text-emerald-700 px-5 py-3 rounded-xl font-bold flex items-center gap-3 border border-emerald-100 shadow-sm">
 <div className="relative flex h-3 w-3">
 {readyOrders.length > 0 && (
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
 )}
 <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
 </div>
 <span className="text-lg">{readyOrders.length}</span>
 <span className="text-emerald-600/80">Orders Ready</span>
 </div>
 </div>

 {/* ORDERS GRID WORKSPACE */}
 {readyOrders.length === 0 ? (
 <div className="bg-white/60 backdrop-blur-sm rounded-xl border-2 border-dashed border-slate-200 p-20 flex flex-col items-center justify-center text-slate-400 shadow-sm mt-8">
 <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
 <UtensilsCrossed size={40} className="text-slate-300" />
 </div>
 <h3 className="text-2xl font-black text-slate-700">
 No orders waiting
 </h3>
 <p className="text-slate-500 mt-2 font-medium text-center max-w-md">
 The expo window is clear! Check back later when the kitchen marks
 new tickets as ready.
 </p>
 </div>
 ) : isLoading ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-8">
 {Array.from({ length: 4 }).map((_, i) => (
 <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col h-[380px]">
 <div className="flex justify-between items-start mb-6">
 <div>
 <Skeleton className="w-24 h-8 mb-2 rounded-lg" />
 <div className="flex gap-2">
 <Skeleton className="w-16 h-5 rounded-lg" />
 <Skeleton className="w-16 h-5 rounded-lg" />
 </div>
 </div>
 <Skeleton className="w-20 h-6 rounded-lg" />
 </div>
 <hr className="border-slate-100 border-dashed mb-5" />
 <div className="flex-1 space-y-3">
 <Skeleton className="w-full h-12 rounded-xl" />
 <Skeleton className="w-full h-12 rounded-xl" />
 <Skeleton className="w-full h-12 rounded-xl" />
 </div>
 <Skeleton className="w-full h-14 rounded-xl mt-4" />
 </div>
 ))}
 </div>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-8">
 {readyOrders.map((order) => (
 <div
 key={order.id}
 className="bg-white rounded-xl shadow-sm hover:shadow-md hover:shadow-emerald-500/10 border border-slate-100 p-6 flex flex-col h-full transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
 >
 {/* Top Green Accent Line */}
 <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />

 {/* Order Meta Data */}
 <div className="flex justify-between items-start mb-6 pt-2">
 <div>
 <h2 className="text-2xl font-black text-slate-900 tracking-tight">
 {order.id}
 </h2>
 <div className="flex items-center gap-2 mt-2">
 <span className="inline-flex bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
 {order.channel ||"System"}
 </span>
 <span className="inline-flex bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-100">
 {order.table ||"Queue"}
 </span>
 </div>
 </div>
 <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
 <Clock size={14} className="text-emerald-500" />
 {order.time}
 </div>
 </div>

 <hr className="border-slate-100 border-dashed mb-5" />

 {/* Items List */}
 <div className="flex-1 mb-8">
 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
 <PackageCheck size={14} /> Order Items
 </h4>
 <ul className="space-y-3">
 {(order.items || []).map((item, idx) => (
 <li
 key={idx}
 className="flex justify-between items-start p-3 bg-slate-50/80 rounded-xl border border-slate-100/50 group-hover:bg-emerald-50/30 transition-colors"
 >
 <span className="flex items-start gap-3">
 <span className="bg-white border border-slate-200 text-slate-700 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shadow-sm flex-shrink-0 mt-0.5">
 {item.qty}
 </span>
 <div className="flex flex-col">
 <span className="text-sm font-bold text-slate-800 leading-tight">
 {item.name}
 </span>
 {item.notes && (
 <span className="text-[10px] font-semibold text-rose-500 mt-1">
 Note: {item.notes}
 </span>
 )}
 </div>
 </span>
 </li>
 ))}
 </ul>
 </div>

 {/* Action Button */}
 <button
 onClick={() => serveOrder(order.id)}
 className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-sm shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-auto group/btn"
 >
 <Sparkles
 size={18}
 className="group-hover/btn:animate-spin"
 />
 Mark as Served
 </button>
 </div>
 ))}
 </div>
 )}
 </main>
 </div>
 );
};

export default ReadyOrders;
