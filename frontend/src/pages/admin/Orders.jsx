import React, { useState, useEffect } from"react";
import {
 Search,
 Plus,
 Package,
 CheckCircle2,
 Hourglass,
 Truck,
 Eye,
 X,
 ChefHat,
 FileText
} from"lucide-react";
import { useOrders } from"../../context/OrderContext";

import"../../styles/orders.css"; // Kept for any global custom overrides

const Orders = () => {
 const { orders = [], fetchOrders } = useOrders();
 const [activeFilter, setActiveFilter] = useState("All Orders");
 const [searchTerm, setSearchTerm] = useState("");
 const [selectedOrder, setSelectedOrder] = useState(null);

 useEffect(() => {
 if (fetchOrders) fetchOrders();
 }, [fetchOrders]);

 const formattedOrders = [...orders]
 .sort((a, b) => {
 const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
 const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
 return timeB - timeA;
 })
 .map((o, i) => {
 const subtotal = (o.items || []).reduce(
 (sum, item) => sum + item.qty * item.price,
 0
 );
 const total = o.amount || subtotal + (subtotal > 0 ? 50 : 0);
 return {
 id: o.id,
 itemsList: o.items || [],
 table: o.table ||"Walk-in",
 type: o.channel ||"Dine In",
 amount: `Rs. ${total.toLocaleString()}`,
 status: o.status,
 time: o.time ||"N/A",
 };
 });

 // Logic to filter the orders based on tabs and search box
 const filteredOrders = formattedOrders.filter((order) => {
 const matchesFilter =
 activeFilter ==="All Orders"
 ? true
 : activeFilter ==="Preparing"
 ? order.status ==="Cooking" || order.status ==="Ready"
 : activeFilter ==="Delivery"
 ? order.type ==="Delivery"
 : order.status === activeFilter;

 const matchesSearch = order.id
 .toLowerCase()
 .includes(searchTerm.toLowerCase());

 return matchesFilter && matchesSearch;
 });

 return (
 <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
 <main className="max-w-[1600px] mx-auto">
 {/* HEADER SECTION */}
 <div className="flex justify-between items-center mb-8">
 <div>
 <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
 Orders
 </h1>
 <p className="text-slate-400 text-sm mt-0.5 font-medium">
 Dashboard <span className="mx-1.5 text-slate-300">&gt;</span>{""}
 Orders
 </p>
 </div>
 <button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all">
 <Plus size={16} /> New Order
 </button>
 </div>

 {/* METRICS & STATS GRID */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
 {/* Stat Card 1 */}
 <div 
 onClick={() => setActiveFilter("All Orders")}
 className={`group bg-white rounded-xl p-6 border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 cursor-pointer ${activeFilter ==="All Orders" ?"ring-2 ring-slate-400 border-slate-400" :"border-slate-100"}`}
 >
 <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 ${activeFilter ==="All Orders" ?"bg-slate-800 text-white" :"bg-slate-50 text-slate-600"}`}>
 <Package size={22} />
 </div>
 <div>
 <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
 Total Orders
 </h4>
 <div className="flex items-end gap-2 mt-1">
 <h2 className="text-2xl font-black text-slate-900">
 {formattedOrders.length}
 </h2>
 <span className="text-xs font-bold text-slate-400 mb-1">
 0%
 </span>
 </div>
 </div>
 </div>

 {/* Stat Card 2 */}
 <div 
 onClick={() => setActiveFilter("Completed")}
 className={`group bg-white rounded-xl p-6 border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 cursor-pointer ${activeFilter ==="Completed" ?"ring-2 ring-emerald-400 border-emerald-400" :"border-slate-100"}`}
 >
 <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 ${activeFilter ==="Completed" ?"bg-emerald-500 text-white" :"bg-emerald-50 text-emerald-600"}`}>
 <CheckCircle2 size={22} />
 </div>
 <div>
 <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
 Completed
 </h4>
 <div className="flex items-end gap-2 mt-1">
 <h2 className="text-2xl font-black text-slate-900">
 {
 formattedOrders.filter((o) => o.status ==="Completed")
 .length
 }
 </h2>
 <span className="text-xs font-bold text-slate-400 mb-1">
 0%
 </span>
 </div>
 </div>
 </div>

 {/* Stat Card 3 */}
 <div 
 onClick={() => setActiveFilter("Pending")}
 className={`group bg-white rounded-xl p-6 border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 cursor-pointer ${activeFilter ==="Pending" ?"ring-2 ring-orange-400 border-orange-400" :"border-slate-100"}`}
 >
 <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 ${activeFilter ==="Pending" ?"bg-orange-500 text-white" :"bg-orange-50 text-orange-500"}`}>
 <Hourglass size={22} />
 </div>
 <div>
 <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
 Pending
 </h4>
 <div className="flex items-end gap-2 mt-1">
 <h2 className="text-2xl font-black text-slate-900">
 {formattedOrders.filter((o) => o.status ==="Pending").length}
 </h2>
 <span className="text-xs font-bold text-slate-400 mb-1">
 0%
 </span>
 </div>
 </div>
 </div>

 {/* Stat Card 4 */}
 <div 
 onClick={() => setActiveFilter("Delivery")}
 className={`group bg-white rounded-xl p-6 border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 cursor-pointer ${activeFilter ==="Delivery" ?"ring-2 ring-blue-400 border-blue-400" :"border-slate-100"}`}
 >
 <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 ${activeFilter ==="Delivery" ?"bg-blue-500 text-white" :"bg-blue-50 text-blue-600"}`}>
 <Truck size={22} />
 </div>
 <div>
 <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
 Delivery
 </h4>
 <div className="flex items-end gap-2 mt-1">
 <h2 className="text-2xl font-black text-slate-900">
 {formattedOrders.filter((o) => o.type ==="Delivery").length}
 </h2>
 <span className="text-xs font-bold text-slate-400 mb-1">
 0%
 </span>
 </div>
 </div>
 </div>
 </div>

 {/* TABLE WORKSPACE COMPONENT */}
 <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
 {/* Top Controls Bar */}
 <div className="p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
 {/* Nav Tabs */}
 <div className="inline-flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 overflow-x-auto max-w-full shadow-inner">
 {[
 { name:"All Orders", icon: FileText, activeColor:"text-slate-800", bgActive:"bg-slate-200", ringActive:"ring-slate-300/50" },
 { name:"Pending", icon: Hourglass, activeColor:"text-orange-600", bgActive:"bg-orange-50", ringActive:"ring-orange-200/50" },
 { name:"Preparing", icon: ChefHat, activeColor:"text-amber-600", bgActive:"bg-amber-50", ringActive:"ring-amber-200/50" },
 { name:"Delivery", icon: Truck, activeColor:"text-blue-600", bgActive:"bg-blue-50", ringActive:"ring-blue-200/50" },
 { name:"Completed", icon: CheckCircle2, activeColor:"text-emerald-600", bgActive:"bg-emerald-50", ringActive:"ring-emerald-200/50" }
 ].map((tab) => {
 const Icon = tab.icon;
 const isActive = activeFilter === tab.name;
 
 let count = 0;
 if (tab.name ==="All Orders") count = formattedOrders.length;
 else if (tab.name ==="Pending") count = formattedOrders.filter(o => o.status ==="Pending").length;
 else if (tab.name ==="Preparing") count = formattedOrders.filter(o => o.status ==="Cooking" || o.status ==="Ready").length;
 else if (tab.name ==="Delivery") count = formattedOrders.filter(o => o.type ==="Delivery").length;
 else if (tab.name ==="Completed") count = formattedOrders.filter(o => o.status ==="Completed").length;

 return (
 <button
 key={tab.name}
 onClick={() => setActiveFilter(tab.name)}
 className={`group flex items-center whitespace-nowrap gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 transform active:scale-95 ${
 isActive
 ?"bg-white text-slate-900 shadow-md ring-1 ring-slate-200/50 scale-[1.02] z-10"
 :"text-slate-500 hover:text-slate-700 hover:bg-white/60 hover:shadow-sm"
 }`}
 >
 <Icon size={16} className={`transition-colors duration-300 ${isActive ? tab.activeColor :"text-slate-400 group-hover:text-slate-500"}`} />
 {tab.name}
 <span
 className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-colors duration-300 ${
 isActive
 ? `${tab.bgActive} ${tab.activeColor} ring-1 ${tab.ringActive}`
 :"bg-slate-200/50 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500"
 }`}
 >
 {count}
 </span>
 </button>
 );
 })}
 </div>

 {/* Search Bar */}
 <div className="relative w-full sm:w-72">
 <Search
 size={16}
 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
 />
 <input
 type="text"
 placeholder="Search order..."
 className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-400 shadow-sm"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />
 </div>
 </div>

 {/* Data Table */}
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-wider font-bold">
 <tr>
 <th className="p-5 pl-6 border-b border-slate-100">
 Order ID
 </th>
 <th className="p-5 border-b border-slate-100">Table</th>
 <th className="p-5 border-b border-slate-100">Items</th>
 <th className="p-5 border-b border-slate-100">Type</th>
 <th className="p-5 border-b border-slate-100">Amount</th>
 <th className="p-5 border-b border-slate-100">Status</th>
 <th className="p-5 pr-6 border-b border-slate-100">Time</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-sm">
 {filteredOrders.length === 0 ? (
 <tr>
 <td
 colSpan="7"
 className="text-center py-12 text-slate-400 font-medium"
 >
 No orders found matching your criteria.
 </td>
 </tr>
 ) : (
 filteredOrders.map((order, index) => (
 <tr
 key={index}
 className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
 >
 {/* ID Column */}
 <td className="p-5 pl-6 font-bold text-slate-900">
 {order.id}
 </td>

 {/* Table Column */}
 <td className="p-5 font-bold text-slate-700">
 {order.table}
 </td>

 {/* Ordered Items Column */}
 <td className="p-5">
 <button
 onClick={() => setSelectedOrder(order)}
 className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
 >
 <Eye size={14} />
 View Items
 </button>
 </td>

 {/* Type Column */}
 <td className="p-5 font-semibold text-slate-600">
 {order.type}
 </td>

 {/* Amount Column */}
 <td className="p-5 font-bold text-slate-900">
 {order.amount}
 </td>

 {/* Status Pills Column */}
 <td className="p-5">
 <span
 className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide ${
 order.status ==="Completed"
 ?"bg-emerald-50 text-emerald-600"
 : order.status ==="Preparing"
 ?"bg-amber-50 text-amber-600"
 :"bg-orange-50 text-orange-600"
 }`}
 >
 {order.status}
 </span>
 </td>

 {/* Time Column */}
 <td className="p-5 pr-6 font-semibold text-slate-500">
 {order.time}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 </main>

 {/* ITEMS MODAL */}
 {selectedOrder && (
 <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity">
 <div className="bg-white rounded-xl shadow-md w-full max-w-md overflow-hidden animate-slide-in p-6 relative">
 <div className="flex justify-between items-start mb-6">
 <div>
 <h2 className="text-xl font-black text-slate-900">
 Order {selectedOrder.id}
 </h2>
 </div>
 <button
 onClick={() => setSelectedOrder(null)}
 className="bg-white border border-slate-200 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg shadow-sm transition"
 >
 <X size={16} />
 </button>
 </div>

 <div className="max-h-[300px] overflow-y-auto pr-2">
 <table className="w-full text-left text-sm border-collapse">
 <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-slate-100">
 <tr>
 <th className="py-2 pl-2">Item</th>
 <th className="py-2 text-center">Qty</th>
 <th className="py-2 pr-2 text-right">Price</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {selectedOrder.itemsList.map((item, idx) => (
 <tr key={idx}>
 <td className="py-3 pl-2 font-semibold text-slate-700">
 {item.name}
 </td>
 <td className="py-3 text-center font-bold text-slate-500">
 {item.qty}
 </td>
 <td className="py-3 pr-2 text-right font-black text-slate-900">
 Rs.{""}
 {(
 item.qty * (parseFloat(item.price) || 0)
 ).toLocaleString()}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-6 text-sm font-medium text-slate-600 flex justify-between items-center">
 <span>Total Amount</span>
 <span className="text-slate-900 font-black text-lg">
 {selectedOrder.amount}
 </span>
 </div>
 </div>
 </div>
 )}
 </div>
 );
};

export default Orders;
