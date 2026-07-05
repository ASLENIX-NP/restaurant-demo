import React, { useState, useMemo } from"react";
import {
 Package,
 TrendingUp,
 DollarSign,
 UtensilsCrossed,
 Search,
} from"lucide-react";
import { useOrders } from"../../context/OrderContext";

const POS = () => {
 const { orders = [] } = useOrders() || {};
 const [searchTerm, setSearchTerm] = useState("");
 const [selectedCategory, setSelectedCategory] = useState("All Categories");

 // Aggregate sold items from all completed orders
 const { soldItems, totalItemsSold, totalRevenue } = useMemo(() => {
 const completedOrders = orders.filter((o) => o.status ==="Completed");
 const itemsMap = {};
 let totalQty = 0;
 let totalRev = 0;

 completedOrders.forEach((order) => {
 (order.items || []).forEach((item) => {
 const itemName = item.name ||"Unknown Item";

 if (!itemsMap[itemName]) {
 itemsMap[itemName] = {
 name: itemName,
 category: item.category ||"Uncategorized",
 price: parseFloat(item.price) || 0,
 qty: 0,
 revenue: 0,
 image: item.image || "",
 };
 }

 itemsMap[itemName].qty += item.qty;
 const rev = item.qty * (parseFloat(item.price) || 0);
 itemsMap[itemName].revenue += rev;

 totalQty += item.qty;
 totalRev += rev;
 });
 });

 // Sort by most sold quantity first
 const sortedItems = Object.values(itemsMap).sort((a, b) => b.qty - a.qty);

 return {
 soldItems: sortedItems,
 totalItemsSold: totalQty,
 totalRevenue: totalRev,
 };
 }, [orders]);

 // Extract unique categories dynamically based on sold items
 const categories = useMemo(() => {
 const cats = new Set(soldItems.map((item) => item.category));
 return ["All Categories", ...Array.from(cats)];
 }, [soldItems]);

 // Filter items by category and search
 const filteredItems = useMemo(() => {
 return soldItems.filter((item) => {
 const matchesSearch = item.name
 .toLowerCase()
 .includes(searchTerm.toLowerCase());
 const matchesCategory =
 selectedCategory ==="All Categories" ||
 item.category === selectedCategory;
 return matchesSearch && matchesCategory;
 });
 }, [soldItems, searchTerm, selectedCategory]);

 return (
 <div className="p-6 md:p-8 bg-slate-50 min-h-screen text-slate-800 font-sans">
 {/* Header */}
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
 <div>
 <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
 Items Sold Overview
 </h1>
 <p className="text-slate-500 text-sm mt-1">
 Track quantities and revenue of all items sold today
 </p>
 </div>
 </div>

 {/* Top Metrics Cards */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
 <div className="group bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
 <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
 <Package size={22} />
 </div>
 <div>
 <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
 Total Items Sold
 </h4>
 <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
 {totalItemsSold}
 </h2>
 </div>
 </div>

 <div className="group bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
 <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
 <DollarSign size={22} />
 </div>
 <div>
 <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
 Total Item Revenue
 </h4>
 <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
 Rs.{""}
 {totalRevenue.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </h2>
 </div>
 </div>

 <div className="group bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
 <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
 <TrendingUp size={22} />
 </div>
 <div>
 <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
 Top Selling Item
 </h4>
 <h2 className="text-lg font-black text-slate-900 mt-1 truncate max-w-[200px] tracking-tight">
 {soldItems.length > 0 ? soldItems[0].name :"N/A"}
 </h2>
 </div>
 </div>
 </div>

 {/* Main Workspace */}
 <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
 {/* Controls Bar */}
 <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
 {/* Categories Tab Bar */}
 <div className="inline-flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 overflow-x-auto max-w-full shadow-inner mb-6 md:mb-0">
 {categories.map((category, index) => {
 const isActive = selectedCategory === category;
 const count = category ==="All Categories" ? soldItems.length : soldItems.filter(item => item.category === category).length;
 
 return (
 <button
 key={index}
 onClick={() => setSelectedCategory(category)}
 className={`group flex items-center whitespace-nowrap gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 transform active:scale-95 ${
 isActive
 ?"bg-white text-slate-900 shadow-md ring-1 ring-slate-200/50 scale-[1.02] z-10"
 :"text-slate-500 hover:text-slate-700 hover:bg-white/60 hover:shadow-sm"
 }`}
 >
 {category}
 <span
 className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-colors duration-300 ${
 isActive
 ?"bg-slate-200 text-slate-800 ring-1 ring-slate-300/50"
 :"bg-slate-200/50 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500"
 }`}
 >
 {count}
 </span>
 </button>
 );
 })}
 </div>

 <div className="relative w-full md:max-w-md">
 <Search
 size={16}
 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
 />
 <input
 id="searchPOSItems"
 name="searchPOSItems"
 type="text"
 placeholder="Search items..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-400 shadow-sm"
 />
 </div>
 </div>

 {/* Items Sold Data Table */}
 <div className="overflow-x-auto min-h-[400px]">
 <table className="w-full text-left border-collapse">
 <thead className="bg-white text-slate-400 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
 <tr>
 <th className="p-4 pl-6">Item Name</th>
 <th className="p-4">Category</th>
 <th className="p-4 text-center">Unit Price</th>
 <th className="p-4 text-center">Quantity Sold</th>
 <th className="p-4 pr-6 text-right">Total Revenue Generated</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-sm">
 {filteredItems.length === 0 ? (
 <tr>
 <td
 colSpan="5"
 className="text-center py-16 text-slate-400 font-medium"
 >
 <UtensilsCrossed
 size={32}
 className="mx-auto mb-3 text-slate-300"
 />
 No sold items found matching your filters.
 </td>
 </tr>
 ) : (
 filteredItems.map((item, idx) => (
 <tr
 key={idx}
 className="hover:bg-slate-50/80 transition-colors group cursor-default"
 >
 <td className="p-4 pl-6">
 <div className="flex items-center gap-3">
 {item.image ? (
 <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm" />
 ) : (
 <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
 <UtensilsCrossed size={16} />
 </div>
 )}
 <span className="font-bold text-slate-900">
 {item.name}
 </span>
 </div>
 </td>
 <td className="p-4 font-semibold text-slate-500">
 {item.category}
 </td>
 <td className="p-4 text-center font-semibold text-slate-600">
 Rs.{""}
 {item.price.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </td>
 <td className="p-4 text-center">
 <span className="inline-block bg-blue-50 text-blue-700 font-black px-3.5 py-1.5 rounded-full text-xs shadow-sm">
 x {item.qty}
 </span>
 </td>
 <td className="p-4 pr-6 text-right font-black text-emerald-600 text-base">
 Rs.{""}
 {item.revenue.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
};

export default POS;
