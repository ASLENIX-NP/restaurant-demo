import React, { useState, useEffect, useMemo } from"react";
import {
 TrendingUp,
 ShoppingBag,
 Users,
 DollarSign,
 ChevronRight,
 Calendar,
 AlertTriangle,
 Star,
 CreditCard,
 Layers,
} from"lucide-react";
import {
 AreaChart,
 Area,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer,
 PieChart,
 Pie,
 Cell,
} from"recharts";
import { useNavigate } from"react-router-dom";
import DatePicker from"react-datepicker";
import"react-datepicker/dist/react-datepicker.css";
import { useOrders } from"../../context/OrderContext";
import { useTables } from"../../context/TableContext";
import { useToast } from"../../context/ToastContext";
import Skeleton from"../../components/ui/Skeleton";

export default function AdminDashboard() {
 const navigate = useNavigate();
 const { orders = [], fetchOrders } = useOrders() || {};
 const { tables = [], fetchTables } = useTables() || {};
 const { showToast } = useToast();
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 if (fetchOrders) fetchOrders();
 if (fetchTables) fetchTables();
 }, [fetchOrders, fetchTables]);

 const reservedCount = tables.filter(
 (t) => (t.status ||"").toLowerCase() ==="reserved"
 ).length;

 const [dateRange, setDateRange] = useState([null, null]);
 const [startDate, endDate] = dateRange;

 const dateFilteredOrders = useMemo(() => {
 if (!startDate || !endDate) return orders;
 return orders.filter((order) => {
 const txDate = order.timestamp
 ? new Date(order.timestamp)
 : order.date
 ? new Date(order.date)
 : null;
 if (!txDate) return false;
 const endOfDay = new Date(endDate);
 endOfDay.setHours(23, 59, 59, 999);
 return txDate >= startDate && txDate <= endOfDay;
 });
 }, [orders, startDate, endDate]);

 const pendingPaymentsCount = useMemo(() => dateFilteredOrders.filter(
 (o) => o.status !=="Completed" && o.status !=="Cancelled"
 ).length, [dateFilteredOrders]);

 useEffect(() => {
 if (orders && tables) {
 setTimeout(() => setLoading(false), 200);
 }
 }, [orders, tables]);

 const completedSales = useMemo(() => dateFilteredOrders.filter(
 (order) => order.status ==="Completed"
 ), [dateFilteredOrders]);

 const totalRevenue = useMemo(() => completedSales.reduce((acc, order) => {
 const subtotal = (order.items || []).reduce(
 (sum, item) => sum + item.qty * item.price,
 0
 );
 return acc + (order.amount || subtotal + (subtotal > 0 ? 50 : 0));
 }, 0), [completedSales]);

 const totalOrders = dateFilteredOrders.length;
 const totalCustomers = useMemo(() => new Set(
 dateFilteredOrders.map((o) => o.customer ||"Guest")
 ).size, [dateFilteredOrders]);
 const avgOrderValue = completedSales.length > 0 ? totalRevenue / completedSales.length : 0;

 const { dineInCount, takeawayCount, deliveryCount } = useMemo(() => {
 let dineIn = 0, takeaway = 0, delivery = 0;
 dateFilteredOrders.forEach((o) => {
 if (o.channel ==="Dine In" || o.channel ==="Dining") dineIn++;
 else if (o.channel ==="Takeaway") takeaway++;
 else if (o.channel ==="Delivery") delivery++;
 });
 return { dineInCount: dineIn, takeawayCount: takeaway, deliveryCount: delivery };
 }, [dateFilteredOrders]);

 const orderDistributionData = useMemo(() => [
 { name:"Dine In", value: dineInCount, color:"#6366f1" },
 { name:"Takeaway", value: takeawayCount, color:"#f97316" },
 { name:"Delivery", value: deliveryCount, color:"#10b981" },
 ], [dineInCount, takeawayCount, deliveryCount]);

 const topItems = useMemo(() => {
 const itemsMap = {};
 completedSales.forEach((order) => {
 (order.items || []).forEach((item) => {
 if (!itemsMap[item.name]) {
 itemsMap[item.name] = {
 name: item.name,
 image: item.image ||"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80",
 qty: 0,
 revenue: 0,
 };
 }
 itemsMap[item.name].qty += item.qty;
 itemsMap[item.name].revenue += item.qty * (parseFloat(item.price) || 0);
 });
 });

 return Object.values(itemsMap)
 .sort((a, b) => b.qty - a.qty)
 .slice(0, 5)
 .map((item) => ({
 ...item,
 revenue: `Rs. ${item.revenue.toLocaleString()}`,
 }));
 }, [completedSales]);

 const recentOrders = useMemo(() => [...dateFilteredOrders]
 .sort((a, b) => {
 const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
 const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
 return timeB - timeA;
 })
 .slice(0, 5)
 .map((o) => {
 const subtotal = (o.items || []).reduce(
 (sum, item) => sum + item.qty * item.price,
 0
 );
 const amount = o.amount || subtotal + (subtotal > 0 ? 50 : 0);
 return {
 id: o.id,
 amount: `Rs. ${amount.toLocaleString()}`,
 status: o.status,
 };
 }), [dateFilteredOrders]);

 const revenueTrendData = useMemo(() => {
 const arr = [];
 const trendEndDate = endDate || new Date();
 for (let i = 6; i >= 0; i--) {
 const d = new Date(trendEndDate);
 d.setDate(d.getDate() - i);
 const dateStr = d.toISOString().split("T")[0];

 // Format as"Mon","Tue", etc.
 const dayName = d.toLocaleDateString("en-US", { weekday:"short" });

 const dayRevenue = completedSales.reduce((acc, o) => {
 const orderDate = o.timestamp
 ? new Date(o.timestamp).toISOString().split("T")[0]
 : o.date
 ? new Date(o.date).toISOString().split("T")[0]
 : null;
 if (orderDate === dateStr) {
 const subtotal = (o.items || []).reduce(
 (sum, item) => sum + item.qty * (parseFloat(item.price) || 0),
 0
 );
 return acc + (o.amount || subtotal + (subtotal > 0 ? 50 : 0));
 }
 return acc;
 }, 0);

 arr.push({ day: dayName, revenue: dayRevenue });
 }
 return arr;
 }, [endDate, completedSales]);

 if (loading) {
 return (
 <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
 <div className="max-w-[1600px] mx-auto space-y-8">
 <div className="flex justify-between">
 <div>
 <Skeleton className="h-8 w-64 mb-2" />
 <Skeleton className="h-4 w-48" />
 </div>
 <Skeleton className="h-10 w-64 rounded-xl" />
 </div>
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
 {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
 </div>
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
 <Skeleton className="lg:col-span-2 h-[400px] rounded-xl" />
 <Skeleton className="h-[400px] rounded-xl" />
 </div>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans transition-colors duration-300">
 <main className="max-w-[1600px] mx-auto">
 {/* TOP SECTION: PAGE HEADER */}
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
 <div>
 <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
 Welcome back, Admin! 👋
 </h1>
 <p className="text-slate-400 text-sm mt-0.5">
 Here's what's happening in your restaurant today.
 </p>
 </div>

 <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-4 py-2.5 rounded-xl shadow-sm text-slate-600 font-medium text-sm w-full sm:w-[260px] relative z-10">
 <style>{`
 .react-datepicker-wrapper { width: 100%; display: block; }
 .react-datepicker__input-container { display: block; }
 .react-datepicker__close-icon { padding: 0; right: 0; }
 .react-datepicker__close-icon::after { background-color: #f1f5f9; color: #64748b; font-size: 16px; height: 22px; width: 22px; line-height: 20px; border-radius: 6px; transition: all 0.2s ease; }
 .react-datepicker__close-icon:hover::after { background-color: #fee2e2; color: #ef4444; }
 `}</style>
 <Calendar size={16} className="text-indigo-500 shrink-0" />
 <DatePicker
 selectsRange={true}
 startDate={startDate}
 endDate={endDate}
 onChange={(update) => setDateRange(update)}
 isClearable={true}
 placeholderText="Filter by date range..."
 className="w-full bg-transparent outline-none cursor-pointer text-sm text-slate-700 font-bold placeholder:text-slate-400"
 dateFormat="MMM d, yyyy"
 maxDate={new Date()}
 />
 </div>
 </div>

 {/* METRICS SUMMARY CARDS */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
 {[
 {
 title:"Total Revenue",
 value: `Rs. ${totalRevenue.toLocaleString()}`,
 change:"0% this month",
 icon: <DollarSign size={22} />,
 color:"bg-indigo-50 text-indigo-600 border-indigo-100/50",
 },
 {
 title:"Total Orders",
 value: totalOrders,
 change:"0% this month",
 icon: <ShoppingBag size={22} />,
 color:"bg-blue-50 text-blue-600 border-blue-100/50",
 },
 {
 title:"Active Customers",
 value: totalCustomers,
 change:"0% this month",
 icon: <Users size={22} />,
 color:"bg-emerald-50 text-emerald-600 border-emerald-100/50",
 },
 {
 title:"Avg Order Value",
 value: `Rs. ${avgOrderValue.toLocaleString(undefined, {
 maximumFractionDigits: 0,
 })}`,
 change:"0% this month",
 icon: <TrendingUp size={22} />,
 color:"bg-orange-50 text-orange-600 border-orange-100/50",
 },
 ].map((card) => (
 <div
 key={card.title}
 className="bg-white rounded-xl sm:rounded-xl p-3.5 sm:p-6 border border-slate-100 shadow-sm flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between transition hover:shadow-md gap-2 sm:gap-0"
 >
 <div>
 <p className="text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider line-clamp-1">
 {card.title}
 </p>
 <h2 className="text-lg sm:text-[26px] font-extrabold text-slate-900 mt-0.5 sm:mt-1.5 tracking-tight">
 {card.value}
 </h2>
 <p className="text-emerald-500 text-[9px] sm:text-xs font-semibold mt-0.5 sm:mt-1 flex items-center gap-0.5">
 {card.change}
 </p>
 </div>
 <div
 className={`p-2 sm:p-3.5 rounded-lg sm:rounded-xl border ${card.color}`}
 >
 {React.cloneElement(card.icon, {
 className:"w-4 h-4 sm:w-5 sm:h-5",
 })}
 </div>
 </div>
 ))}
 </div>

 {/* HIGH-PERFORMANCE DATA VISUALIZATION GRAPH GRID */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-6 sm:mb-8">
 {/* INTERACTIVE AREA CHART: REVENUE TRACKING */}
 <div className="lg:col-span-8 bg-white rounded-xl sm:rounded-xl p-4 sm:p-6 border border-slate-100 shadow-sm">
 <div className="flex justify-between items-start sm:items-center mb-4">
 <div>
 <h2 className="text-base font-bold text-slate-900">
 Revenue Overview
 </h2>
 <p className="text-slate-400 text-xs mt-0.5">
 Gross performance trends over this cycle
 </p>
 </div>
 <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
 By Day
 </button>
 </div>

 <div className="w-full h-[250px] sm:h-[300px] text-xs mt-2 overflow-hidden">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart
 data={revenueTrendData}
 margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
 >
 <defs>
 <linearGradient
 id="colorRevenue"
 x1="0"
 y1="0"
 x2="0"
 y2="1"
 >
 <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
 <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
 </linearGradient>
 </defs>
 <CartesianGrid
 strokeDasharray="3 3"
 vertical={false}
 stroke="#f1f5f9"
 />
 <XAxis
 dataKey="day"
 stroke="#94a3b8"
 tickLine={false}
 axisLine={false}
 dy={10}
 />
 <YAxis
 stroke="#94a3b8"
 tickLine={false}
 axisLine={false}
 tickFormatter={(v) => `Rs.${v / 1000}k`}
 dx={-10}
 />
 <Tooltip
 contentStyle={{
 backgroundColor:"#0f172a",
 borderRadius:"12px",
 border:"none",
 color:"#fff",
 }}
 formatter={(value) => [
 `Rs. ${value.toLocaleString()}`,
"Revenue",
 ]}
 />
 <Area
 type="monotone"
 dataKey="revenue"
 stroke="#8b5cf6"
 strokeWidth={3}
 fillOpacity={1}
 fill="url(#colorRevenue)"
 />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* DOUGHNUT PIE CHART: ORDER FULFILLMENT BREAKDOWN */}
 <div className="lg:col-span-4 bg-white rounded-xl sm:rounded-xl p-4 sm:p-6 border border-slate-100 shadow-sm">
 <div>
 <h2 className="text-base font-bold text-slate-900">
 Orders Overview
 </h2>
 <p className="text-slate-400 text-xs mt-0.5">
 Distribution by channel types
 </p>
 </div>

 <div className="w-full h-[220px] relative mt-4 mb-2 overflow-hidden">
 <ResponsiveContainer width="100%" height="100%">
 <PieChart>
 <Pie
 data={orderDistributionData}
 cx="50%"
 cy="50%"
 innerRadius={65}
 outerRadius={85}
 paddingAngle={4}
 dataKey="value"
 >
 {orderDistributionData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.color} />
 ))}
 </Pie>
 <Tooltip formatter={(value) => [`${value} Orders`]} />
 </PieChart>
 </ResponsiveContainer>

 {/* Absoluted Core Total Aggregate Visual Node */}
 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transform translate-y-[-4px]">
 <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
 Total
 </span>
 <span className="text-2xl font-black text-slate-800">
 {totalOrders}
 </span>
 </div>
 </div>

 {/* Micro-Badges Component List Grid Layout */}
 <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600 mt-2">
 {orderDistributionData.map((item) => (
 <div
 key={item.name}
 className="flex items-center gap-2 border border-slate-50 p-2 rounded-xl bg-slate-50/50"
 >
 <span
 className="w-2.5 h-2.5 rounded-full block shrink-0"
 style={{ backgroundColor: item.color }}
 />
 <span className="truncate">
 {item.name} ({item.value})
 </span>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* LOWER DATA MATRIX SECTION GRID CONTAINER */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
 {/* LEFT AREA PANEL: TOP SELLING ITEMS GRID SECTION */}
 <div className="lg:col-span-4 bg-white rounded-xl sm:rounded-xl p-4 sm:p-5 border border-slate-100 shadow-sm">
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-base font-bold text-slate-900">
 Top Selling Items
 </h2>
 <button
 onClick={() => navigate("/admin/reports")}
 className="text-indigo-600 hover:text-indigo-700 font-bold text-xs transition"
 >
 View All
 </button>
 </div>
 <div className="overflow-x-auto rounded-xl border border-slate-100 -mx-4 sm:mx-0">
 <table className="w-full text-left text-xs border-collapse">
 <thead className="bg-slate-50 font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
 <tr>
 <th className="p-3 pl-4">Item</th>
 <th className="p-3 text-center">Qty</th>
 <th className="p-3 text-right pr-4">Revenue</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
 {topItems.length === 0 ? (
 <tr>
 <td
 colSpan="3"
 className="p-4 text-center text-slate-400 text-xs"
 >
 No items sold recently.
 </td>
 </tr>
 ) : (
 topItems.map((item) => (
 <tr
 key={item.name}
 className="hover:bg-slate-50/40 transition-colors"
 >
 <td className="p-3 pl-4">
 <div className="flex items-center gap-3">
 <img
 src={item.image}
 alt={item.name}
 className="w-9 h-9 object-cover rounded-lg border border-slate-100"
 />
 <span className="font-semibold text-slate-900 shrink-0">
 {item.name}
 </span>
 </div>
 </td>
 <td className="p-3 text-center text-slate-500">
 {item.qty}
 </td>
 <td className="p-3 text-right pr-4 text-slate-900 font-bold">
 {item.revenue}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* CENTER AREA PANEL: RECENT CUSTOMER LIVE DISPATCH MATRICES */}
 <div className="lg:col-span-5 bg-white rounded-xl sm:rounded-xl p-4 sm:p-5 border border-slate-100 shadow-sm">
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-base font-bold text-slate-900">
 Recent Orders
 </h2>
 <button
 onClick={() => navigate("/admin/orders")}
 className="text-indigo-600 hover:text-indigo-700 font-bold text-xs transition"
 >
 View All
 </button>
 </div>

 <div className="overflow-x-auto rounded-xl border border-slate-100 -mx-4 sm:mx-0">
 <table className="w-full text-left text-xs border-collapse">
 <thead className="bg-slate-50 font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
 <tr>
 <th className="p-3.5 pl-4">Order ID</th>
 <th className="p-3.5">Amount</th>
 <th className="p-3.5 text-right pr-4">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
 {recentOrders.length === 0 ? (
 <tr>
 <td
 colSpan="3"
 className="p-4 text-center text-slate-400 text-xs"
 >
 No recent orders found.
 </td>
 </tr>
 ) : (
 recentOrders.map((order) => (
 <tr
 key={order.id}
 className="hover:bg-slate-50/40 transition-colors"
 >
 <td className="p-3.5 pl-4 font-bold text-indigo-600">
 {order.id}
 </td>
 <td className="p-3.5 text-slate-600 font-medium">
 {order.amount}
 </td>
 <td className="p-3.5 text-right pr-4">
 <span
 className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-block ${
 order.status ==="Completed"
 ?"bg-emerald-50 text-emerald-600"
 : order.status ==="Preparing"
 ?"bg-amber-50 text-amber-600"
 :"bg-blue-50 text-blue-600"
 }`}
 >
 {order.status}
 </span>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* RIGHT AREA PANEL: LIVE OPERATIONAL ACTION REMINDERS BLOCK */}
 <div className="lg:col-span-3 bg-white rounded-xl sm:rounded-xl p-4 sm:p-5 border border-slate-100 shadow-sm">
 <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
 <Layers size={18} className="text-indigo-500" /> Reminders
 </h2>

 <div className="space-y-2.5">
 {[
 {
 label:"Upcoming Reservations",
 icon: <Calendar size={15} />,
 color:"bg-indigo-50 text-indigo-600 border-indigo-100",
 action: () => navigate("/admin/table-management"),
 count: reservedCount > 0 ? reservedCount : null,
 },
 {
 label:"Low Stock Items",
 icon: <AlertTriangle size={15} />,
 color:"bg-red-50 text-red-600 border-red-100",
 action: () => navigate("/admin/inventory"),
 },
 {
 label:"New Reviews Pending",
 icon: <Star size={15} />,
 color:"bg-amber-50 text-amber-600 border-amber-100",
 action: () => showToast("Reviews management module coming soon!", "info"),
 },
 {
 label:"Payments",
 icon: <CreditCard size={15} />,
 color:"bg-blue-50 text-blue-600 border-blue-100",
 action: () => navigate("/admin/billing"),
 count: pendingPaymentsCount > 0 ? pendingPaymentsCount : null,
 },
 ].map((reminder) => (
 <button
 key={reminder.label}
 onClick={reminder.action}
 className="w-full bg-white border border-slate-200/60 hover:border-slate-300 rounded-xl p-3 flex items-center justify-between text-xs font-semibold text-slate-700 transition hover:bg-slate-50/50 group"
 >
 <div className="flex items-center gap-2.5 min-w-0">
 <div className={`p-2 rounded-lg border ${reminder.color}`}>
 {reminder.icon}
 </div>
 <span className="truncate">{reminder.label}</span>
 </div>
 <div className="flex items-center gap-2">
 {reminder.count && (
 <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg font-bold text-[10px]">
 {reminder.count}
 </span>
 )}
 <ChevronRight
 size={14}
 className="text-slate-400 group-hover:translate-x-0.5 transition-transform"
 />
 </div>
 </button>
 ))}
 </div>
 </div>
 </div>
 </main>
 </div>
 );
}
