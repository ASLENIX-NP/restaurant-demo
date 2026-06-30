// src/pages/cashier/Dashboard.jsx

import React, { useEffect, useState } from"react";
import"../../styles/cashierDashboard.css";
import { useNavigate } from"react-router-dom";
import {
 DollarSign,
 Receipt,
 Package,
 Clock,
 X,
 User,
 Table2,
 CalendarDays,
 Wallet,
} from"lucide-react";
import { useOrders } from"../../context/OrderContext";
import DatePicker from"react-datepicker";
import"react-datepicker/dist/react-datepicker.css";
import {
 AreaChart,
 Area,
 XAxis,
 YAxis,
 Tooltip,
 ResponsiveContainer,
 PieChart,
 Pie,
 Cell,
} from"recharts";

const Dashboard = () => {
 const { orders = [], fetchOrders } = useOrders() || {};
 const navigate = useNavigate();
 const [selectedOrder, setSelectedOrder] = useState(null);
 const [dateRange, setDateRange] = useState([null, null]);
 const [startDate, endDate] = dateRange;

 useEffect(() => {
 if (fetchOrders) fetchOrders();
 }, [fetchOrders]);

 // Dynamically filter orders between selected dates
 const filteredOrders = React.useMemo(() => {
 if (!startDate || !endDate) return orders;
 return orders.filter((order) => {
 const orderDate = order.timestamp
 ? new Date(order.timestamp)
 : order.date
 ? new Date(order.date)
 : null;
 if (!orderDate) return false;

 const start = new Date(startDate);
 start.setHours(0, 0, 0, 0);
 const end = new Date(endDate);
 end.setHours(23, 59, 59, 999);

 return orderDate >= start && orderDate <= end;
 });
 }, [orders, startDate, endDate]);

 const completedSales = filteredOrders.filter(
 (order) => order.status ==="Completed"
 );
 const pendingBills = filteredOrders.filter(
   (order) => order.status !== "Completed" && order.status !== "Cancelled"
 );

 const totalSalesAmount = completedSales.reduce((acc, order) => {
 const subtotal = (order.items || []).reduce(
 (sum, item) => sum + item.qty * (parseFloat(item.price) || 0),
 0
 );
 return acc + (order.amount || subtotal + (subtotal > 0 ? 50 : 0));
 }, 0);

 const pendingBillsAmount = pendingBills.reduce((acc, order) => {
 const subtotal = (order.items || []).reduce(
 (sum, item) => sum + item.qty * (parseFloat(item.price) || 0),
 0
 );
 return acc + (order.amount || subtotal + (subtotal > 0 ? 50 : 0));
 }, 0);

 const totalOrders = filteredOrders.length;

 const totalItemsSold = completedSales.reduce((acc, order) => {
 return acc + (order.items || []).reduce((sum, item) => sum + item.qty, 0);
 }, 0);

 const avgOrderValue =
 completedSales.length > 0 ? totalSalesAmount / completedSales.length : 0;

 // Prepare dynamic data for the Pie Chart
 const paymentData = React.useMemo(() => {
 let cash = 0,
 card = 0,
 esewa = 0,
 khalti = 0;
 completedSales.forEach((order) => {
 const amt =
 order.amount ||
 (order.items || []).reduce((sum, i) => sum + i.qty * i.price, 0) + 50;
 if (order.paymentMethod ==="Card") card += amt;
 else if (order.paymentMethod ==="eSewa") esewa += amt;
 else if (order.paymentMethod ==="Khalti") khalti += amt;
 else cash += amt;
 });
 return [
 { name:"Cash", value: cash, color:"#10b981" },
 { name:"Card", value: card, color:"#3b82f6" },
 { name:"eSewa", value: esewa, color:"#22c55e" },
 { name:"Khalti", value: khalti, color:"#8b5cf6" },
 ].filter((item) => item.value > 0); // Only show methods that have sales
 }, [completedSales]);

  const salesTrendData = React.useMemo(() => {
    const hoursMap = {};
    // Pre-fill typical restaurant hours (8 AM to 11 PM) to ensure a continuous line
    for (let i = 8; i <= 23; i++) {
      const label = i === 12 ? "12 PM" : i > 12 ? `${i - 12} PM` : `${i} AM`;
      hoursMap[label] = 0;
    }

    completedSales.forEach(order => {
      const orderDate = order.timestamp ? new Date(order.timestamp) : order.date ? new Date(order.date) : null;
      if (orderDate) {
        const hour = orderDate.getHours();
        const label = hour === 0 ? "12 AM" : hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
        
        if (hoursMap[label] === undefined) {
          hoursMap[label] = 0;
        }

        const subtotal = (order.items || []).reduce((sum, item) => sum + item.qty * (parseFloat(item.price) || 0), 0);
        const amt = order.amount || subtotal + (subtotal > 0 ? 50 : 0);
        hoursMap[label] += amt;
      }
    });

    // Sort by chronological hour
    return Object.keys(hoursMap).sort((a, b) => {
      const parseHour = (str) => {
        const [h, ampm] = str.split(' ');
        let hr = parseInt(h);
        if (ampm === 'PM' && hr !== 12) hr += 12;
        if (ampm === 'AM' && hr === 12) hr = 0;
        return hr;
      };
      return parseHour(a) - parseHour(b);
    }).map(time => ({ time, sales: hoursMap[time] }));
  }, [completedSales]);

 const CustomTooltip = ({ active, payload, label }) => {
 if (active && payload && payload.length) {
 return (
 <div className="bg-slate-900 text-white p-3 rounded-lg shadow-md border border-slate-700">
 <p className="font-bold text-slate-300 text-xs mb-1">{label}</p>
 <p className="font-black text-lg">
 Rs.{""}
 {payload[0].value.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </p>
 </div>
 );
 }
 return null;
 };

 return (
 <div className="cashier-dashboard">
 {/* HEADER */}
 <div className="dashboard-header flex-col md:flex-row gap-4 items-start md:items-center">
 <div>
 <h1>Dashboard</h1>
 <p>Welcome back! Here's what's happening with your sales.</p>
 </div>
 {/* Responsive Date Picker */}
 <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm hover:border-blue-300 transition-all w-full md:max-w-[280px] relative">
 <CalendarDays size={18} className="text-blue-500 flex-shrink-0" />
 <style>{`
 .react-datepicker-wrapper { width: 100%; display: block; }
 .react-datepicker__input-container { display: block; }
 .react-datepicker__close-icon { padding: 0; right: 0; }
 .react-datepicker__close-icon::after { background-color: #f1f5f9; color: #64748b; font-size: 16px; height: 22px; width: 22px; line-height: 20px; border-radius: 6px; }
 `}</style>
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
 id="dashboardDateRange"
 name="dashboardDateRange"
 />
 </div>
 </div>

 {/* TOP STATS CARDS */}
 <div className="stats-grid">
 <div className="stat-card">
 <div className="stat-icon-wrapper green-light">💵</div>
 <div className="stat-info">
 <h4>Total Sales</h4>
 <h2>
 Rs.{""}
 {totalSalesAmount.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 maximumFractionDigits: 2,
 })}
 </h2>
 <span className="trend-text">Completed Revenue</span>
 </div>
 </div>

 <div
 className="stat-card clickable-card"
 onClick={() => navigate("/cashier/pending-bills")}
 >
 <div className="stat-icon-wrapper orange-light">⏳</div>
 <div className="stat-info">
 <h4>Pending Bills</h4>
 <h2>{pendingBills.length}</h2>
 <span className="trend-text">Unpaid Orders</span>
 </div>
 </div>

 <div
 className="stat-card clickable-card"
 onClick={() => navigate("/cashier/total-orders")}
 >
 <div className="stat-icon-wrapper blue-light">🛒</div>
 <div className="stat-info">
 <h4>Total Orders</h4>
 <h2>{totalOrders}</h2>
 <span className="trend-text">All Orders Today</span>
 </div>
 </div>

 <div className="stat-card">
 <div className="stat-icon-wrapper indigo-light">💳</div>
 <div className="stat-info">
 <h4>Average Order Value</h4>
 <h2>
 Rs.{""}
 {avgOrderValue.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 maximumFractionDigits: 2,
 })}
 </h2>
 <span className="trend-text">Based on completed</span>
 </div>
 </div>
 </div>

 {/* MIDDLE SECTION: GRAPHICAL OVERVIEWS */}
 <div className="middle-grid">
 {/* SALES OVERVIEW (AREA GRAPH) */}
 <div className="overview-card">
 <div className="card-top">
 <h3>Today's Sales Overview</h3>
 </div>

 <div className="overview-content">
 <div className="overview-info-list">
 <div className="overview-item">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
 <DollarSign size={20} strokeWidth={2.5} />
 </div>
 <span className="item-label">Sales Amount</span>
 </div>
 <strong className="item-val">
 Rs.{""}
 {totalSalesAmount.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 maximumFractionDigits: 2,
 })}
 </strong>
 </div>
 <div
 className="overview-item cursor-pointer"
 onClick={() => navigate("/cashier/total-orders")}
 >
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
 <Receipt size={20} strokeWidth={2.5} />
 </div>
 <span className="item-label">Orders</span>
 </div>
 <strong className="item-val">{totalOrders}</strong>
 </div>
 <div
 className="overview-item cursor-pointer"
 onClick={() => navigate("/cashier/pos")}
 >
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-sm">
 <Package size={20} strokeWidth={2.5} />
 </div>
 <span className="item-label">Items Sold</span>
 </div>
 <strong className="item-val">{totalItemsSold}</strong>
 </div>
 <div className="overview-item">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-sm">
 <Clock size={20} strokeWidth={2.5} />
 </div>
 <span className="item-label">Pending Amount</span>
 </div>
 <strong className="item-val">
 Rs.{""}
 {pendingBillsAmount.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 maximumFractionDigits: 2,
 })}
 </strong>
 </div>
 </div>

 {/* DYNAMIC RECHARTS AREA CHART */}
 <div
 className="chart-area-container"
 style={{ height:"340px", width:"100%", marginTop:"16px" }}
 >
 <ResponsiveContainer width="99%" height="100%">
 <AreaChart
 data={salesTrendData}
 margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
 >
 <defs>
 <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
 <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
 </linearGradient>
 </defs>
 <XAxis
 dataKey="time"
 axisLine={false}
 tickLine={false}
 tick={{ fontSize: 12, fill:"#94a3b8" }}
 dy={10}
 />
 <YAxis
 axisLine={false}
 tickLine={false}
 tick={{ fontSize: 12, fill:"#94a3b8" }}
 tickFormatter={(val) => `Rs.${val / 1000}k`}
 />
 <Tooltip content={<CustomTooltip />} />
 <Area
 type="monotone"
 dataKey="sales"
 stroke="#3b82f6"
 strokeWidth={3}
 fillOpacity={1}
 fill="url(#colorSales)"
 />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>

 {/* PAYMENT METHOD (DYNAMIC RECHARTS DONUT) */}
 <div className="payment-card flex flex-col">
 <div className="card-top mb-0 pb-4 border-b border-slate-100">
 <h3>Sales by Payment Method</h3>
 </div>
 <div className="payment-chart-wrapper flex flex-col justify-center mt-4">
 <div className="relative h-[220px] w-[220px] mx-auto mb-6">
 <ResponsiveContainer width="99%" height="100%">
                <PieChart>
                <Pie
                  data={
                    paymentData.length > 0
                      ? paymentData
                      : [{ name: "No Data", value: 1, color: "#e2e8f0" }]
                  }
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={6}
                >
                  {(paymentData.length > 0
                    ? paymentData
                    : [{ name: "No Data", value: 1, color: "#e2e8f0" }]
                  ).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      style={{ filter: "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))" }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{ color: "#e2e8f0", fontSize: "13px", fontWeight: "600" }}
                  formatter={(value, name) => [`Rs. ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, name]} 
                />
                </PieChart>
 </ResponsiveContainer>
 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
 <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
 Total
 </span>
 <span className="text-xl font-black text-slate-900 mt-0.5">
 Rs.{""}
 {totalSalesAmount >= 1000
 ? (totalSalesAmount / 1000).toFixed(1) +"k"
 : totalSalesAmount}
 </span>
 </div>
 </div>

 <div className="flex flex-col gap-2 w-full">
 {paymentData.length > 0 ? (
 paymentData.map((method, idx) => (
 <div
 key={idx}
 className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white transition-all shadow-sm hover:shadow"
 >
 <div className="flex items-center gap-3">
 <span
 className="w-3.5 h-3.5 rounded-full shadow-sm"
 style={{ backgroundColor: method.color }}
 ></span>
 <span className="text-sm font-bold text-slate-700">
 {method.name}
 </span>
 </div>
 <div className="flex flex-col items-end">
 <span className="text-sm font-black text-slate-900">
 Rs.{""}
 {method.value.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </span>
 <span className="text-[10px] font-bold text-slate-400">
 {totalSalesAmount > 0
 ? ((method.value / totalSalesAmount) * 100).toFixed(1)
 : 0}
 %
 </span>
 </div>
 </div>
 ))
 ) : (
 <div className="text-center p-4 text-sm text-slate-400 font-medium bg-slate-50 rounded-xl border border-slate-100">
 No payment data available
 </div>
 )}
 </div>
 </div>
 </div>
 </div>

 {/* BOTTOM GRID: TABLES & RECENTS */}
 <div className="bottom-grid">
 {/* RECENT TRANSACTIONS TABLE */}
 <div className="transactions-card flex flex-col">
 <div className="card-top mb-0 pb-4 border-b border-slate-100">
 <h3>Recent Transactions</h3>
 <button
 onClick={() => navigate("/cashier/total-orders")}
 className="text-sm font-bold text-blue-600 hover:text-blue-700 transition"
 >
 View All
 </button>
 </div>

 <div className="overflow-x-auto mt-4">
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
 className="text-center py-12 text-slate-400 font-medium"
 >
 No recent transactions found.
 </td>
 </tr>
 ) : (
 [...filteredOrders].slice(0, 5).map((order) => {
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
 className="hover:bg-slate-50/50 transition-colors cursor-pointer"
 onClick={() => setSelectedOrder(order)}
 >
 <td className="p-4 pl-6 font-bold text-slate-900">
 {order.id}
 </td>
 <td className="p-4">
 <div className="font-semibold text-slate-800">
 {order.table ||"Walk-in"}
 </div>
 <div className="text-xs text-slate-500">
 {order.customer || order.server ||"Guest"}
 </div>
 </td>
 <td className="p-4 text-center font-semibold text-slate-600">
 {itemCount}
 </td>
 <td className="p-4 text-right font-bold text-slate-900">
 Rs.{""}
 {total.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 maximumFractionDigits: 2,
 })}
 </td>
 <td className="p-4 text-center">
 <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
 {order.paymentMethod ||"Cash"}
 </span>
 </td>
 <td className="p-4 text-center">
 <span
 className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
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

 {/* RECENT SALES PANEL */}
 <div className="recent-sales-card flex flex-col">
 <div className="card-top mb-0 pb-4 border-b border-slate-100">
 <h3>Recent Sales</h3>
 <button
 onClick={() => navigate("/cashier/sales")}
 className="text-sm font-bold text-blue-600 hover:text-blue-700 transition"
 >
 View All
 </button>
 </div>

 <div className="flex flex-col gap-2 mt-4 flex-1">
 {completedSales.length === 0 ? (
 <div className="text-center py-8 text-slate-400 font-medium">
 No recent sales.
 </div>
 ) : (
 [...completedSales].slice(0, 5).map((order) => {
 const subtotal = (order.items || []).reduce(
 (sum, item) => sum + item.qty * (parseFloat(item.price) || 0),
 0
 );
 const total =
 order.amount || subtotal + (subtotal > 0 ? 50 : 0);
 return (
 <div
 key={order.id}
 className="flex justify-between items-center p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white transition-all shadow-sm hover:shadow cursor-pointer"
 onClick={() => setSelectedOrder(order)}
 >
 <div className="flex flex-col">
 <strong className="text-sm font-bold text-slate-900">
 {order.id}
 </strong>
 <span className="text-xs font-semibold text-slate-400 mt-0.5">
 {order.time}
 </span>
 </div>
 <strong className="text-sm font-black text-emerald-600">
 Rs.{""}
 {total.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 maximumFractionDigits: 2,
 })}
 </strong>
 </div>
 );
 })
 )}
 </div>

 <div className="mt-4 pt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
 <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
 Total Today
 </span>
 <strong className="text-lg font-black text-slate-900">
 Rs.{""}
 {totalSalesAmount.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 maximumFractionDigits: 2,
 })}
 </strong>
 </div>
 </div>
 </div>

 {/* ORDER DETAILS MODAL */}
 {selectedOrder && (
 <div
 className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity"
 onClick={() => setSelectedOrder(null)}
 >
 <div
 className="bg-white rounded-xl shadow-md w-full max-w-md overflow-hidden animate-slide-in flex flex-col max-h-[90vh]"
 onClick={(event) => event.stopPropagation()}
 >
 <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
 <div>
 <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1 block">
 Receipt Preview
 </span>
 <h2 className="text-lg font-black text-slate-900">
 Invoice Details
 </h2>
 <p className="text-xs font-semibold text-slate-500">
 {selectedOrder.id} -{""}
 {selectedOrder.date || new Date().toLocaleDateString()}
 </p>
 </div>
 <button
 className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition"
 onClick={() => setSelectedOrder(null)}
 type="button"
 >
 <X size={18} />
 </button>
 </div>

 <div className="p-6 overflow-y-auto space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
 <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
 <User size={12} /> Customer
 </span>
 <span className="font-bold text-slate-900 text-sm truncate block">
 {selectedOrder.customer ||"Walk-in"}
 </span>
 </div>
 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
 <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
 <Table2 size={12} /> Table
 </span>
 <span className="font-bold text-slate-900 text-sm truncate block">
 {selectedOrder.table ||"Walk-in"}
 </span>
 </div>
 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
 <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
 <CalendarDays size={12} /> Time
 </span>
 <span className="font-bold text-slate-900 text-sm truncate block">
 {selectedOrder.time ||"N/A"}
 </span>
 </div>
 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
 <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
 <Wallet size={12} /> Payment
 </span>
 <span className="font-bold text-slate-900 text-sm truncate block">
 {selectedOrder.paymentMethod ||"Cash"}
 </span>
 </div>
 </div>

 <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-2 border-b border-slate-100 pb-2">
 Itemized Summary
 </h4>
 <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-2">
 {(selectedOrder.items || []).map((item, i) => (
 <div
 key={i}
 className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border-l-4 border-slate-300 shadow-sm text-sm text-slate-800"
 >
 <span className="font-semibold">{item.name}</span>
 <strong className="text-slate-500">x{item.qty}</strong>
 </div>
 ))}
 </div>

 <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4">
 <h3 className="font-bold text-slate-600 uppercase tracking-wider text-xs">
 Total Amount
 </h3>
 <h2 className="text-xl font-black text-slate-900">
 Rs.{""}
 {(
 selectedOrder.amount ||
 (selectedOrder.items || []).reduce(
 (sum, item) =>
 sum + item.qty * (parseFloat(item.price) || 0),
 0
 ) +
 ((selectedOrder.items || []).reduce(
 (sum, item) =>
 sum + item.qty * (parseFloat(item.price) || 0),
 0
 ) > 0
 ? 50
 : 0)
 ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
 </h2>
 </div>
 </div>

 <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-4">
 <button
 onClick={() => setSelectedOrder(null)}
 className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm"
 >
 Close Details
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
};

export default Dashboard;
