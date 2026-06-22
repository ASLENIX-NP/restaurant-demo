import React, { useState, useMemo, useEffect } from"react";
import { useOrders } from"../../context/OrderContext";
import { Search, ArrowLeft } from"lucide-react";
import { useNavigate } from"react-router-dom";

const TotalOrders = () => {
 const { orders = [], fetchOrders } = useOrders() || {};
 const navigate = useNavigate();
 const [searchTerm, setSearchTerm] = useState("");

 useEffect(() => {
 if (fetchOrders) fetchOrders();
 }, [fetchOrders]);

 const filteredOrders = useMemo(() => {
 return orders.filter((order) => {
 const term = searchTerm.toLowerCase();
 return (
 order.id?.toLowerCase().includes(term) ||
 order.table?.toLowerCase().includes(term) ||
 order.customer?.toLowerCase().includes(term) ||
 order.status?.toLowerCase().includes(term)
 );
 });
 }, [orders, searchTerm]);

 return (
 <div className="p-6 md:p-8 bg-slate-50 min-h-screen text-slate-800 font-sans">
 {/* Header */}
 <div className="flex items-center gap-4 mb-8">
 <button
 onClick={() => navigate(-1)}
 className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm hover:bg-slate-50 transition"
 >
 <ArrowLeft size={18} className="text-slate-600" />
 </button>
 <div>
 <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
 Total Orders
 </h1>
 <p className="text-slate-500 text-sm mt-1">
 View and search through all orders
 </p>
 </div>
 </div>

 {/* Main Content Workspace */}
 <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
 {/* Controls Bar */}
 <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
 <div className="relative w-full md:max-w-md">
 <Search
 size={16}
 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
 />
 <input
 id="searchOrders"
 name="searchOrders"
 type="text"
 placeholder="Search by Order ID, Table, Customer, or Status..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-purple-400 transition-all placeholder:text-slate-400 shadow-sm"
 />
 </div>
 <div className="text-sm font-bold text-slate-500">
 Total: {filteredOrders.length} Orders
 </div>
 </div>

 {/* Data Table */}
 <div className="overflow-x-auto min-h-[400px]">
 <table className="w-full text-left border-collapse">
 <thead className="bg-white text-slate-400 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
 <tr>
 <th className="p-4 pl-6">Order ID</th>
 <th className="p-4">Table / Customer</th>
 <th className="p-4 text-center">Items</th>
 <th className="p-4 text-right">Amount</th>
 <th className="p-4 text-center">Payment</th>
 <th className="p-4 text-center">Status</th>
 <th className="p-4 pr-6 text-right">Time</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-sm">
 {filteredOrders.length === 0 ? (
 <tr>
 <td
 colSpan="7"
 className="text-center py-16 text-slate-400 font-medium"
 >
 No orders found matching your search.
 </td>
 </tr>
 ) : (
 filteredOrders.map((order) => {
 const subtotal = (order.items || []).reduce(
 (sum, item) =>
 sum + item.qty * (parseFloat(item.price) || 0),
 0
 );
 const total =
 order.amount || subtotal + (subtotal > 0 ? 50 : 0);
 const itemCount = (order.items || []).reduce(
 (sum, item) => sum + item.qty,
 0
 );

 return (
 <tr
 key={order.id}
 className="hover:bg-slate-50/50 transition-colors"
 >
 <td className="p-4 pl-6 font-bold text-slate-900">
 {order.id}
 </td>
 <td className="p-4">
 <div className="font-semibold text-slate-800">
 {order.table ||"Walk-in"}
 </div>
 <div className="text-xs text-slate-500">
 {order.customer ||"Guest"}
 </div>
 </td>
 <td className="p-4 text-center font-semibold text-slate-600">
 {itemCount}
 </td>
 <td className="p-4 text-right font-bold text-slate-900">
 Rs.{""}
 {total.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </td>
 <td className="p-4 text-center">
 <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
 {order.paymentMethod ||"Cash"}
 </span>
 </td>
 <td className="p-4 text-center">
 <span
 className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
 order.status ==="Completed"
 ?"bg-emerald-50 text-emerald-600"
 : order.status ==="Cancelled"
 ?"bg-rose-50 text-rose-600"
 :"bg-amber-50 text-amber-600"
 }`}
 >
 {order.status}
 </span>
 </td>
 <td className="p-4 pr-6 text-right text-slate-500 font-medium">
 {order.time ||"N/A"}
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
};

export default TotalOrders;
