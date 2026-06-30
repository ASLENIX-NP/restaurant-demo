import React, { useState, useEffect, useMemo } from"react";
import {
 Download,
 TrendingUp,
 ShoppingBag,
 Users,
 DollarSign,
 Calendar,
 BarChart3,
 PieChart as PieIcon,
} from"lucide-react";
import { io } from"socket.io-client";
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
 BarChart,
 Bar,
} from"recharts";
import DatePicker from"react-datepicker";
import"react-datepicker/dist/react-datepicker.css";

// Links the stylesheet cleanly
import"../../styles/reports.css";
import { useOrders } from"../../context/OrderContext";
import apiClient from"../../api/apiClient";

export default function Reports() {
 const { orders = [] } = useOrders() || {};
 const [activeTab, setActiveTab] = useState(() => {
 return localStorage.getItem("reports_active_tab") ||"Overview";
 });

 useEffect(() => {
 localStorage.setItem("reports_active_tab", activeTab);
 }, [activeTab]);
 const [reportData, setReportData] = useState(null);

 // Default to the current month's report
 const [dateRange, setDateRange] = useState([null, null]);
 const [startDate, endDate] = dateRange;
 const [loading, setLoading] = useState(true);

 const tabs = [
"Overview",
"Sales Report",
"Orders",
"Menu Report",
"Customers",
 ];

 useEffect(() => {
 // Prevent fetching if the user has only clicked the start date and is still picking the end date
 if (startDate && !endDate) return;

 const fetchReports = async (start, end) => {
 setLoading(true);
 try {
 let url ="/api/reports/dashboard";
 if (start && end) {
 const formattedStart = start.toISOString().split("T")[0];
 const formattedEnd = end.toISOString().split("T")[0];
 url += `?startDate=${formattedStart}&endDate=${formattedEnd}`;
 }

 const { data } = await apiClient.get(url);
 setReportData(data);
 } catch (err) {
 console.error("Failed to fetch reports:", err);
 } finally {
 setLoading(false);
 }
 };

 fetchReports(startDate, endDate);

 const socket = io(import.meta.env.VITE_API_URL ||"http://localhost:5001");

 const handleUpdate = () => fetchReports(startDate, endDate);

 socket.on("newOrder", handleUpdate);
 socket.on("orderUpdated", handleUpdate);
 socket.on("orderStatusUpdated", handleUpdate);
 socket.on("orderCompleted", handleUpdate);

 return () => socket.disconnect();
 }, [startDate, endDate]);

 const totalRevenue = reportData?.overall?.totalRevenue || 0;
 const totalOrders = reportData?.overall?.totalOrders || 0;
 const avgOrderValue = reportData?.overall?.avgOrderValue || 0;
 const totalCustomers = reportData?.totalCustomers || 0;

 // Vibrant color palette for the Pie Chart
 const colors = [
"#8b5cf6", // Purple
"#3b82f6", // Blue
"#10b981", // Emerald
"#f59e0b", // Amber
"#ef4444", // Rose
"#06b6d4", // Cyan
"#ec4899", // Pink
 ];
 const totalItemsSold = (reportData?.categoryDistribution || []).reduce(
 (acc, curr) => acc + curr.value,
 0
 );

 let categoryDistributionData = (reportData?.categoryDistribution || []).map(
 (cat, idx) => ({
 name: cat.name,
 value:
 totalItemsSold > 0 ? Math.round((cat.value / totalItemsSold) * 100) : 0,
 color: colors[idx % colors.length],
 })
 );

 if (categoryDistributionData.length === 0) {
 categoryDistributionData = [
 { name:"No Sales", value: 100, color:"#cbd5e1" },
 ];
 }

 const topItems = (reportData?.topItems || []).map((item) => ({
 name: item.name,
 category: item.category ||"Mains",
 quantity: item.sold,
 revenue: `Rs. ${(item.revenue || 0).toLocaleString()}`,
 image:
"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80",
 }));

 // Local Context Data Calculations for Orders and Customers
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

 const ordersByHourData = useMemo(() => {
 const hours = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
 dateFilteredOrders.forEach((o) => {
 const txDate = o.timestamp ? new Date(o.timestamp) : null;
 if (txDate) {
 hours[txDate.getHours()].count += 1;
 }
 });
 return hours.filter((h) => h.count > 0).map((h) => {
 const ampm = h.hour >= 12 ?"PM" :"AM";
 const hr = h.hour % 12 || 12;
 return { time: `${hr} ${ampm}`, Orders: h.count };
 });
 }, [dateFilteredOrders]);

 const ordersByChannelData = useMemo(() => {
 const channels = {};
 dateFilteredOrders.forEach((o) => {
 const channel = o.channel || o.type ||"Dine In";
 channels[channel] = (channels[channel] || 0) + 1;
 });
 return Object.keys(channels).map((key, idx) => ({
 name: key,
 value: channels[key],
 color: colors[idx % colors.length],
 }));
 }, [dateFilteredOrders, colors]);

 const topCustomersData = useMemo(() => {
 const customerMap = {};
 dateFilteredOrders.forEach((o) => {
 if (o.status !=="Completed") return;
 const name = o.customer ||"Walk-in Guest";
 if (!customerMap[name]) {
 customerMap[name] = { name, visits: 0, spend: 0 };
 }
 customerMap[name].visits += 1;
 const subtotal = (o.items || []).reduce(
 (sum, item) => sum + item.qty * (parseFloat(item.price) || 0),
 0
 );
 const amount = o.amount || subtotal + (subtotal > 0 ? 50 : 0);
 customerMap[name].spend += amount;
 });
 return Object.values(customerMap)
 .sort((a, b) => b.spend - a.spend)
 .slice(0, 10);
 }, [dateFilteredOrders]);

 // Dynamic Summary Metrics
 const bestSeller = topItems.length > 0 ? topItems[0].name :"N/A";
 const sortedCategories = [...categoryDistributionData].sort((a, b) => b.value - a.value);
 const topCategory = sortedCategories.length > 0 && sortedCategories[0].name !=="No Sales" ? sortedCategories[0].name :"N/A";
 const peakHourData = [...ordersByHourData].sort((a, b) => b.Orders - a.Orders);
 const peakHour = peakHourData.length > 0 ? peakHourData[0].time :"N/A";
 const sortedChannels = [...ordersByChannelData].sort((a, b) => b.value - a.value);
 const topChannel = sortedChannels.length > 0 ? sortedChannels[0].name :"N/A";

 // Dynamic Revenue Trend Data (Last 7 Days)
 const revenueTrendData = useMemo(() => {
 const trendStartDate =
 startDate || new Date(new Date().setDate(new Date().getDate() - 6));
 const trendEndDate = endDate || new Date();
 const dateLabels = [];
 let currentDate = new Date(trendStartDate);
 while (currentDate <= trendEndDate) {
 dateLabels.push(new Date(currentDate));
 currentDate.setDate(currentDate.getDate() + 1);
 }

 return dateLabels.map((d) => {
 const label = d.toLocaleDateString("en-US", {
 month:"short",
 day:"numeric",
 });
 const fullDateStr = d.toISOString().split("T")[0];
 const found = (reportData?.revenueTrend || []).find(
 (r) => r.date === fullDateStr
 );
 return {
 label,
 revenue: found ? found.revenue : 0,
 };
 });
 }, [reportData, startDate, endDate]);

 const handlePrintExport = () => {
 window.print();
 };

 if (loading) {
 return (
 <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-400">
 <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
 <p className="font-semibold">Loading Analytics Dashboard...</p>
 </div>
 );
 }

 return (
 <div className="report-page">
 {/* PRINT-ONLY STYLES FOR PDF EXPORT */}
 <style>
 {`
 @media print {
 @page { margin: 10mm; size: A4 portrait; }
 html, body { background: #fff; margin: 0; padding: 0; }
 body * { visibility: hidden; }
 .sidebar, .navbar, header, footer, .report-container { display: none !important; }
 .report-page { padding: 0 !important; margin: 0 !important; background: transparent !important; }
 #printable-report-container, #printable-report-container * { visibility: visible; }
 #printable-report-container { position: absolute; left: 0; top: 0; width: 100%; margin: 0; font-family:'Arial', sans-serif; color: #000; }
 .print-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
 .print-table th, .print-table td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 12px; }
 .print-table th { background-color: #f8fafc !important; -webkit-print-color-adjust: exact; font-weight: bold; color: #334155; }
 }
 @media screen {
 #printable-report-container { display: none; }
 }
 `}
 </style>

 <div className="report-container screen-only p-3 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
 {/* HEADER SECTION */}
 <div className="report-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
 <div>
 <h1 className="text-xl sm:text-[28px] font-bold text-slate-900 tracking-tight">
 Reports
 </h1>
 <p className="breadcrumb text-slate-400 text-xs sm:text-sm mt-0.5 font-medium">
 Dashboard <span>&gt;</span> Reports
 </p>
 </div>
 <button
 className="export-report-btn w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-sm flex justify-center items-center gap-2 transition-all"
 onClick={handlePrintExport}
 >
 <Download size={16} />
 Export Report
 </button>
 </div>

 {/* CONTROLS TABS */}
 <div className="flex bg-slate-200/60 p-1 sm:p-1.5 rounded-lg sm:rounded-xl w-full sm:w-max mb-5 sm:mb-8 overflow-x-auto scrollbar-hide">
 {tabs.map((tab) => (
 <button
 key={tab}
 className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-lg text-[11px] sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${
 activeTab === tab
 ?"bg-white text-slate-900 shadow-sm"
 :"text-slate-500 hover:text-slate-700 hover:bg-white/50"
 }`}
 onClick={() => setActiveTab(tab)}
 >
 {tab ==="Overview" && <BarChart3 size={16} />}
 {tab ==="Sales Report" && <DollarSign size={16} />}
 {tab ==="Orders" && <ShoppingBag size={16} />}
 {tab ==="Menu Report" && <PieIcon size={16} />}
 {tab ==="Customers" && <Users size={16} />}
 {tab}
 </button>
 ))}
 </div>

 {/* TIME FRAME RANGE FILTER BAR */}
 <div className="mb-8">
 <style>{`
 .react-datepicker-wrapper {
 width: 100%;
 display: block;
 }
 .react-datepicker__input-container {
 display: block;
 }
 .react-datepicker__close-icon {
 padding: 0;
 right: 0;
 }
 .react-datepicker__close-icon::after {
 background-color: #f1f5f9;
 color: #64748b;
 font-size: 16px;
 height: 22px;
 width: 22px;
 line-height: 20px;
 border-radius: 6px;
 transition: all 0.2s ease;
 }
 .react-datepicker__close-icon:hover::after {
 background-color: #fee2e2;
 color: #ef4444;
 }
 `}</style>

 <div className="flex items-center gap-2 sm:gap-3 bg-white border border-slate-200 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all w-full sm:max-w-sm relative">
 <Calendar size={18} className="text-indigo-500 flex-shrink-0" />
 <div className="flex-1 w-full">
 <DatePicker
 selectsRange={true}
 startDate={startDate}
 endDate={endDate}
 onChange={(update) => {
 setDateRange(update);
 }}
 isClearable={true}
 placeholderText="Select a date range (All Time)"
 className="w-full bg-transparent outline-none cursor-pointer text-sm text-slate-700 font-bold placeholder:text-slate-400 placeholder:font-medium"
 dateFormat="MMM d, yyyy"
 maxDate={new Date()}
 id="reportDateRange"
 name="reportDateRange"
 />
 </div>
 </div>
 </div>

 {/* ANALYTIC KPI SUMMARY GRID */}
 {(activeTab ==="Overview" || activeTab ==="Sales Report") && (
 <div className="report-stats-grid grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
 {[
 {
 title:"Total Revenue",
 value: `Rs. ${totalRevenue.toLocaleString()}`,
 change:"0% this month",
 icon: <DollarSign size={20} />,
 },
 {
 title:"Total Orders",
 value: totalOrders,
 change:"0% this month",
 icon: <ShoppingBag size={20} />,
 },
 {
 title:"Avg Order Value",
 value: `Rs. ${avgOrderValue.toLocaleString(undefined, {
 maximumFractionDigits: 0,
 })}`,
 change:"0% this month",
 icon: <TrendingUp size={20} />,
 },
 {
 title:"Customers",
 value: totalCustomers,
 change:"0% this month",
 icon: <Users size={20} />,
 },
 ].map((stat, i) => (
 <div
 key={i}
 className="report-stat-card bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-xl border border-slate-100 shadow-sm flex flex-col xl:flex-row items-start xl:items-center gap-2.5 sm:gap-4 hover:shadow-md transition-shadow"
 >
 <div className="report-icon-wrapper w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 shrink-0">
 {React.cloneElement(stat.icon, {
 className:"w-4 h-4 sm:w-5 sm:h-5",
 })}
 </div>
 <div className="stat-content flex flex-col">
 <h3 className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider line-clamp-1">
 {stat.title}
 </h3>
 <h1 className="text-base sm:text-2xl font-black text-slate-900 mt-0.5 sm:mt-1">
 {stat.value}
 </h1>
 <p className="stat-change-text text-emerald-500 text-[9px] sm:text-[10px] font-bold mt-0.5">
 {stat.change}
 </p>
 </div>
 </div>
 ))}
 </div>
 )}

 {/* EMPTY STATE FOR NO DATA IN SELECTED DATES */}
 {(reportData &&
 totalOrders === 0 && dateFilteredOrders.length === 0) &&
 (activeTab ==="Overview" ||
 activeTab ==="Sales Report" ||
 activeTab ==="Menu Report" ||
 activeTab ==="Orders" ||
 activeTab ==="Customers") && (
 <div className="bg-white rounded-xl border border-slate-100 p-8 sm:p-16 text-center text-slate-500 font-medium shadow-sm mb-6 sm:mb-8 mx-0">
 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
 <Calendar size={32} className="text-slate-400" />
 </div>
 <h2 className="text-2xl font-bold text-slate-800 mb-2">
 No Records Found
 </h2>
 <p className="max-w-md mx-auto leading-relaxed">
 There are no orders within the selected date range.
 Please adjust the calendar to a different time period.
 </p>
 </div>
 )}

 {/* MENU REPORT SUMMARY CARDS */}
 {activeTab ==="Menu Report" && dateFilteredOrders.length > 0 && (
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 animate-slide-in">
 <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
 <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><PieIcon size={24}/></div>
 <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Items Sold</p><h3 className="text-2xl font-black text-slate-900 mt-1">{totalItemsSold}</h3></div>
 </div>
 <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
 <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600"><TrendingUp size={24}/></div>
 <div className="min-w-0 flex-1"><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Best Seller</p><h3 className="text-xl font-black text-slate-900 mt-1 truncate">{bestSeller}</h3></div>
 </div>
 <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
 <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><ShoppingBag size={24}/></div>
 <div className="min-w-0 flex-1"><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Top Category</p><h3 className="text-xl font-black text-slate-900 mt-1 truncate">{topCategory}</h3></div>
 </div>
 </div>
 )}

 {/* INTERACTIVE GRAPH DATA BLOCK CONTAINER */}
 {reportData &&
 totalOrders > 0 &&
 (activeTab ==="Overview" ||
 activeTab ==="Sales Report" || 
 activeTab ==="Menu Report") && (
 <div
 className={`report-chart-grid mb-6 sm:mb-8 grid grid-cols-1 ${
 activeTab ==="Overview" ?"lg:grid-cols-3" : 
 activeTab ==="Menu Report" ?"lg:grid-cols-1" :"lg:grid-cols-1"
 } gap-4 sm:gap-6`}
 >
 {/* SMOOTH AREA-LINE CHART */}
 {(activeTab ==="Overview" || activeTab ==="Sales Report") && (
 <div
 className={`chart-card linear-graph-block bg-white p-4 sm:p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col min-h-[280px] sm:min-h-[400px] ${
 activeTab ==="Overview" ?"lg:col-span-2" :"lg:col-span-1"
 }`}
 >
 <div className="chart-header-node flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
 <div>
 <h2 className="text-lg font-bold text-slate-900">
 Revenue Overview
 </h2>
 <p className="text-xs text-slate-400 font-medium mt-1">
 Gross performance trends over this cycle
 </p>
 </div>
 <button className="chart-toggle-btn w-full sm:w-auto bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-lg transition-colors">
 By Day
 </button>
 </div>

 <div className="chart-wrapper-canvas w-full h-[250px] sm:h-[300px] mt-2">
 <ResponsiveContainer width="99%" height="100%">
 <AreaChart
 data={revenueTrendData}
 margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
 >
 <defs>
 <linearGradient
 id="reportRevenueGrad"
 x1="0"
 y1="0"
 x2="0"
 y2="1"
 >
 <stop
 offset="5%"
 stopColor="#1e293b"
 stopOpacity={0.15}
 />
 <stop
 offset="95%"
 stopColor="#1e293b"
 stopOpacity={0}
 />
 </linearGradient>
 </defs>
 <CartesianGrid
 strokeDasharray="3 3"
 stroke="#f1f5f9"
 vertical={false}
 />
 <XAxis
 dataKey="label"
 stroke="#94a3b8"
 tickLine={false}
 axisLine={false}
 dy={8}
 style={{ fontSize:"11px" }}
 />
 <YAxis
 stroke="#94a3b8"
 tickLine={false}
 axisLine={false}
 dx={-5}
 tickFormatter={(v) => `Rs.${v / 1000}k`}
 style={{ fontSize:"11px" }}
 />
 <Tooltip
 contentStyle={{
 backgroundColor:"#0f172a",
 borderRadius:"10px",
 border:"none",
 color:"#fff",
 fontSize:"12px",
 }}
 formatter={(value) => [
 `Rs. ${value.toLocaleString()}`,
"Revenue",
 ]}
 />
 <Area
 type="monotone"
 dataKey="revenue"
 stroke="#334155"
 strokeWidth={2.5}
 fillOpacity={1}
 fill="url(#reportRevenueGrad)"
 />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>
 )}

 {/* DOUGHNUT PIE CHART */}
 {(activeTab ==="Overview" || activeTab ==="Menu Report") && (
 <div
 className={`chart-card distribution-graph-block bg-white p-4 sm:p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col min-h-[280px] sm:min-h-[400px] ${
 activeTab ==="Overview" ?"lg:col-span-1" :"lg:col-span-1"
 }`}
 >
 <div className="chart-header-node mb-4 sm:mb-6">
 <h2 className="text-lg font-bold text-slate-900">
 Sales By Category
 </h2>
 <p className="text-xs text-slate-400 font-medium mt-1">
 Performance weight by preparation tier
 </p>
 </div>

 <div className="pie-section-wrapper flex flex-col sm:flex-row lg:flex-col items-center justify-center flex-1 gap-6">
 <div className="pie-canvas-container relative w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] shrink-0">
 <ResponsiveContainer
 width="100%"
 height="100%"
 minWidth={1}
 minHeight={1}
 >
 <PieChart>
 <Pie
 data={categoryDistributionData}
 cx="50%"
 cy="50%"
 innerRadius={60}
 outerRadius={80}
 paddingAngle={4}
 dataKey="value"
 >
 {categoryDistributionData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.color} />
 ))}
 </Pie>
 <Tooltip formatter={(value) => [`${value}% Share`]} />
 </PieChart>
 </ResponsiveContainer>
 <div className="pie-center-label absolute inset-0 flex items-center justify-center pointer-events-none">
 <PieIcon
 size={20}
 className="text-slate-200 sm:w-6 sm:h-6"
 />
 </div>
 </div>

 <div className="pie-details-legend w-full flex flex-col gap-2">
 {categoryDistributionData.map((item, index) => (
 <div
 key={index}
 className="legend-row-item flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100"
 >
 <div className="legend-indicator flex items-center gap-2.5">
 <span
 className="color-indicator-dot w-3 h-3 rounded-full shadow-sm"
 style={{ backgroundColor: item.color }}
 />
 <span className="legend-name-text text-sm font-bold text-slate-700">
 {item.name}
 </span>
 </div>
 <span className="legend-percentage-value text-sm font-black text-slate-900">
 {item.value}%
 </span>
 </div>
 ))}
 </div>
 </div>
 </div>
 )}
 </div>
 )}

 {/* COMPREHENSIVE PERFORMANCE DATATABLE */}
 {reportData &&
 totalOrders > 0 &&
 (activeTab ==="Overview" || activeTab ==="Menu Report") && (
 <div className="top-items-card bg-white p-4 sm:p-6 rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-6 sm:mb-8">
 <div className="table-title-node mb-4 sm:mb-6">
 <h2 className="text-lg font-bold text-slate-900">
 Top Selling Items
 </h2>
 <p className="text-xs text-slate-400 font-medium mt-1">
 High velocity restaurant performance entries listed by
 inventory rank
 </p>
 </div>

 <div className="report-table-wrapper overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
 <table className="report-table w-full text-left border-collapse min-w-[500px]">
 <thead className="bg-slate-50/80 text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider font-bold border-b border-slate-100">
 <tr>
 <th className="p-3 sm:p-4 pl-4 sm:pl-6 w-10 sm:w-16">
 #
 </th>
 <th className="p-3 sm:p-4">Item</th>
 <th className="p-3 sm:p-4">Category</th>
 <th className="p-3 sm:p-4 text-center">Qty</th>
 <th className="p-3 sm:p-4 pr-4 sm:pr-6 text-right">
 Revenue
 </th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-sm">
 {topItems.length === 0 ? (
 <tr>
 <td
 colSpan="5"
 className="text-center py-8 text-slate-400 font-medium"
 >
 No items sold yet.
 </td>
 </tr>
 ) : (
 topItems.map((item, index) => (
 <tr
 key={index}
 className="hover:bg-slate-50/50 transition-colors"
 >
 <td className="rank-index-cell p-3 sm:p-4 pl-4 sm:pl-6 font-bold text-slate-400 text-xs sm:text-sm">
 {index + 1}
 </td>
 <td className="p-3 sm:p-4">
 <div className="item-info flex items-center gap-2 sm:gap-3">
 <img
 src={item.image}
 alt={item.name}
 className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl object-cover shadow-sm border border-slate-200"
 />
 <span className="item-name-bold font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
 {item.name}
 </span>
 </div>
 </td>
 <td className="category-text-dim p-3 sm:p-4 font-medium text-slate-500 text-xs sm:text-sm">
 {item.category}
 </td>
 <td className="qty-center-cell p-3 sm:p-4 text-center font-bold text-slate-700 text-xs sm:text-sm">
 {item.quantity}
 </td>
 <td className="revenue-right-cell p-3 sm:p-4 pr-4 sm:pr-6 text-right font-black text-emerald-600 text-xs sm:text-sm">
 {item.revenue}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* ORDERS TAB */}
 {activeTab ==="Orders" && dateFilteredOrders.length > 0 && (
 <div className="animate-slide-in">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
 <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
 <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><ShoppingBag size={24}/></div>
 <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Orders</p><h3 className="text-2xl font-black text-slate-900 mt-1">{totalOrders}</h3></div>
 </div>
 <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
 <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><Calendar size={24}/></div>
 <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Peak Hour</p><h3 className="text-xl font-black text-slate-900 mt-1">{peakHour}</h3></div>
 </div>
 <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
 <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600"><Users size={24}/></div>
 <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Top Channel</p><h3 className="text-xl font-black text-slate-900 mt-1">{topChannel}</h3></div>
 </div>
 </div>

 <div className="report-chart-grid mb-6 sm:mb-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
 <div className="chart-card bg-white p-4 sm:p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col min-h-[280px] sm:min-h-[400px] lg:col-span-2">
 <div className="chart-header-node mb-4 sm:mb-6">
 <h2 className="text-lg font-bold text-slate-900">Orders by Hour</h2>
 <p className="text-xs text-slate-400 font-medium mt-1">Order volume distribution across the day</p>
 </div>
 <div className="chart-wrapper-canvas w-full h-[250px] sm:h-[300px] mt-2">
 <ResponsiveContainer width="99%" height="100%">
 <BarChart data={ordersByHourData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
 <XAxis dataKey="time" stroke="#94a3b8" tickLine={false} axisLine={false} dy={8} style={{ fontSize:"11px" }} />
 <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} dx={-5} style={{ fontSize:"11px" }} />
 <Tooltip
 contentStyle={{ backgroundColor:"#0f172a", borderRadius:"10px", border:"none", color:"#fff", fontSize:"12px" }}
 cursor={{fill:'#f8fafc'}}
 />
 <Bar dataKey="Orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>
 
 <div className="chart-card bg-white p-4 sm:p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col min-h-[280px] sm:min-h-[400px] lg:col-span-1">
 <div className="chart-header-node mb-4 sm:mb-6">
 <h2 className="text-lg font-bold text-slate-900">Order Channels</h2>
 <p className="text-xs text-slate-400 font-medium mt-1">Fulfillment type distribution</p>
 </div>
 <div className="pie-section-wrapper flex flex-col items-center justify-center flex-1 gap-6">
 <div className="pie-canvas-container relative w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] shrink-0">
 <ResponsiveContainer width="100%" height="100%">
 <PieChart>
 <Pie
 data={ordersByChannelData}
 cx="50%"
 cy="50%"
 innerRadius={60}
 outerRadius={80}
 paddingAngle={4}
 dataKey="value"
 >
 {ordersByChannelData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.color} />
 ))}
 </Pie>
 <Tooltip formatter={(value) => [`${value} Orders`]} />
 </PieChart>
 </ResponsiveContainer>
 <div className="pie-center-label absolute inset-0 flex items-center justify-center pointer-events-none">
 <ShoppingBag size={20} className="text-slate-200 sm:w-6 sm:h-6" />
 </div>
 </div>
 <div className="pie-details-legend w-full flex flex-col gap-2">
 {ordersByChannelData.map((item, index) => (
 <div key={index} className="legend-row-item flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
 <div className="legend-indicator flex items-center gap-2.5">
 <span className="color-indicator-dot w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
 <span className="legend-name-text text-sm font-bold text-slate-700">{item.name}</span>
 </div>
 <span className="legend-percentage-value text-sm font-black text-slate-900">{item.value}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* CUSTOMERS TAB */}
 {activeTab ==="Customers" && dateFilteredOrders.length > 0 && (
 <div className="top-items-card bg-white p-4 sm:p-6 rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-6 sm:mb-8">
 <div className="table-title-node mb-4 sm:mb-6">
 <h2 className="text-lg font-bold text-slate-900">Top Customers</h2>
 <p className="text-xs text-slate-400 font-medium mt-1">Most valuable returning guests by total spend</p>
 </div>
 <div className="report-table-wrapper overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
 <table className="report-table w-full text-left border-collapse min-w-[500px]">
 <thead className="bg-slate-50/80 text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider font-bold border-b border-slate-100">
 <tr>
 <th className="p-3 sm:p-4 pl-4 sm:pl-6 w-10 sm:w-16">#</th>
 <th className="p-3 sm:p-4">Customer Name</th>
 <th className="p-3 sm:p-4 text-center">Visits</th>
 <th className="p-3 sm:p-4 pr-4 sm:pr-6 text-right">Total Spend</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-sm">
 {topCustomersData.length === 0 ? (
 <tr>
 <td colSpan="4" className="text-center py-8 text-slate-400 font-medium">
 No customer data found.
 </td>
 </tr>
 ) : (
 topCustomersData.map((customer, index) => (
 <tr key={index} className="hover:bg-slate-50/50 transition-colors">
 <td className="rank-index-cell p-3 sm:p-4 pl-4 sm:pl-6 font-bold text-slate-400 text-xs sm:text-sm">{index + 1}</td>
 <td className="p-3 sm:p-4">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold shadow-sm border border-indigo-100">
 {customer.name.charAt(0).toUpperCase()}
 </div>
 <span className="font-bold text-slate-900 text-xs sm:text-sm">{customer.name}</span>
 </div>
 </td>
 <td className="p-3 sm:p-4 text-center font-bold text-slate-700 text-xs sm:text-sm">{customer.visits}</td>
 <td className="p-3 sm:p-4 pr-4 sm:pr-6 text-right font-black text-emerald-600 text-xs sm:text-sm">
 Rs. {customer.spend.toLocaleString()}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 )}
 </div>

 {/* DEDICATED PRINTABLE PDF REPORT LAYOUT */}
 <div id="printable-report-container">
 <div style={{ textAlign:"center", marginBottom:"20px" }}>
 <h2 style={{ fontSize:"22px", margin:"0 0 8px 0" }}>
 मिठ्ठो चिया & Tiffin घर
 </h2>
 <h3
 style={{ fontSize:"16px", margin:"0 0 5px 0", color:"#475569" }}
 >
 {activeTab ==="Overview" || activeTab ==="Sales Report" ?"Financial & Sales Report" : 
 activeTab ==="Menu Report" ?"Menu Performance Report" : 
 activeTab ==="Orders" ?"Order Fulfillment Report" :"Customer Loyalty Report"}
 </h3>
 <p style={{ margin:"3px 0", fontSize:"13px" }}>
 <strong>Date Range:</strong>{""}
 {startDate ? startDate.toLocaleDateString() :"All Time"} to{""}
 {endDate ? endDate.toLocaleDateString() :"Today"}
 </p>
 <p style={{ margin:"3px 0", fontSize:"13px" }}>
 <strong>Generated On:</strong> {new Date().toLocaleString()}
 </p>
 </div>

 {/* FINANCIAL REPORT PRINT */}
 {(activeTab ==="Overview" || activeTab ==="Sales Report") && (
 <>
 <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"20px", fontSize:"13px", backgroundColor:"#f8fafc", padding:"12px", border:"1px solid #e2e8f0", borderRadius:"8px", WebkitPrintColorAdjust:"exact" }}>
 <div><strong>Total Revenue:</strong> Rs. {totalRevenue.toLocaleString()}</div>
 <div><strong>Total Orders:</strong> {totalOrders}</div>
 <div><strong>Avg Order Value:</strong> Rs. {avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
 <div><strong>Total Customers:</strong> {totalCustomers}</div>
 </div>
 
 <h3 style={{ fontSize:"16px", margin:"20px 0 10px 0", borderBottom:"1px solid #e2e8f0", paddingBottom:"5px" }}>Top Selling Items</h3>
 <table className="print-table">
 <thead><tr><th style={{ width:"60px" }}>#</th><th>Item</th><th>Category</th><th style={{ textAlign:"center" }}>Qty Sold</th><th style={{ textAlign:"right" }}>Revenue</th></tr></thead>
 <tbody>
 {topItems.length === 0 ? (
 <tr><td colSpan="5" style={{ textAlign:"center", padding:"20px", color:"#64748b" }}>No items sold in this period.</td></tr>
 ) : (
 topItems.slice(0, 10).map((item, idx) => (
 <tr key={idx}><td>{idx + 1}</td><td style={{ fontWeight:"bold" }}>{item.name}</td><td>{item.category}</td><td style={{ textAlign:"center" }}>{item.quantity}</td><td style={{ textAlign:"right" }}>{item.revenue}</td></tr>
 ))
 )}
 </tbody>
 </table>
 </>
 )}

 {/* MENU REPORT PRINT */}
 {activeTab ==="Menu Report" && (
 <>
 <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"20px", fontSize:"13px", backgroundColor:"#f8fafc", padding:"12px", border:"1px solid #e2e8f0", borderRadius:"8px", WebkitPrintColorAdjust:"exact" }}>
 <div><strong>Total Items Sold:</strong> {totalItemsSold}</div>
 <div><strong>Best Seller:</strong> {bestSeller}</div>
 <div><strong>Top Category:</strong> {topCategory}</div>
 </div>
 
 <h3 style={{ fontSize:"16px", margin:"20px 0 10px 0", borderBottom:"1px solid #e2e8f0", paddingBottom:"5px" }}>Sales By Category</h3>
 <table className="print-table" style={{ width:"60%", marginBottom:"20px" }}>
 <thead><tr><th>Category</th><th style={{ textAlign:"right" }}>Share (%)</th></tr></thead>
 <tbody>
 {categoryDistributionData.map((cat, idx) => (
 <tr key={idx}><td>{cat.name}</td><td style={{ textAlign:"right" }}>{cat.value}%</td></tr>
 ))}
 </tbody>
 </table>

 <h3 style={{ fontSize:"16px", margin:"20px 0 10px 0", borderBottom:"1px solid #e2e8f0", paddingBottom:"5px" }}>All Menu Performance</h3>
 <table className="print-table">
 <thead><tr><th style={{ width:"60px" }}>#</th><th>Item</th><th>Category</th><th style={{ textAlign:"center" }}>Qty Sold</th><th style={{ textAlign:"right" }}>Revenue</th></tr></thead>
 <tbody>
 {topItems.map((item, idx) => (
 <tr key={idx}><td>{idx + 1}</td><td style={{ fontWeight:"bold" }}>{item.name}</td><td>{item.category}</td><td style={{ textAlign:"center" }}>{item.quantity}</td><td style={{ textAlign:"right" }}>{item.revenue}</td></tr>
 ))}
 </tbody>
 </table>
 </>
 )}

 {/* ORDERS REPORT PRINT */}
 {activeTab ==="Orders" && (
 <>
 <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"20px", fontSize:"13px", backgroundColor:"#f8fafc", padding:"12px", border:"1px solid #e2e8f0", borderRadius:"8px", WebkitPrintColorAdjust:"exact" }}>
 <div><strong>Total Orders:</strong> {totalOrders}</div>
 <div><strong>Peak Hour:</strong> {peakHour}</div>
 <div><strong>Top Channel:</strong> {topChannel}</div>
 </div>
 
 <div style={{ display:"flex", gap:"20px" }}>
 <div style={{ flex: 1 }}>
 <h3 style={{ fontSize:"16px", margin:"10px 0", borderBottom:"1px solid #e2e8f0", paddingBottom:"5px" }}>Orders By Channel</h3>
 <table className="print-table">
 <thead><tr><th>Channel</th><th style={{ textAlign:"right" }}>Orders</th></tr></thead>
 <tbody>
 {ordersByChannelData.map((ch, idx) => (
 <tr key={idx}><td>{ch.name}</td><td style={{ textAlign:"right" }}>{ch.value}</td></tr>
 ))}
 </tbody>
 </table>
 </div>
 <div style={{ flex: 1 }}>
 <h3 style={{ fontSize:"16px", margin:"10px 0", borderBottom:"1px solid #e2e8f0", paddingBottom:"5px" }}>Orders By Hour</h3>
 <table className="print-table">
 <thead><tr><th>Time</th><th style={{ textAlign:"right" }}>Orders</th></tr></thead>
 <tbody>
 {ordersByHourData.map((hr, idx) => (
 <tr key={idx}><td>{hr.time}</td><td style={{ textAlign:"right" }}>{hr.Orders}</td></tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </>
 )}

 {/* CUSTOMERS REPORT PRINT */}
 {activeTab ==="Customers" && (
 <>
 <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"20px", fontSize:"13px", backgroundColor:"#f8fafc", padding:"12px", border:"1px solid #e2e8f0", borderRadius:"8px", WebkitPrintColorAdjust:"exact" }}>
 <div><strong>Total Customers:</strong> {topCustomersData.length}</div>
 <div><strong>Top Spender:</strong> {topCustomersData.length > 0 ? topCustomersData[0].name :"N/A"}</div>
 </div>
 
 <h3 style={{ fontSize:"16px", margin:"20px 0 10px 0", borderBottom:"1px solid #e2e8f0", paddingBottom:"5px" }}>Top Customers</h3>
 <table className="print-table">
 <thead><tr><th style={{ width:"60px" }}>#</th><th>Customer Name</th><th style={{ textAlign:"center" }}>Total Visits</th><th style={{ textAlign:"right" }}>Total Spend</th></tr></thead>
 <tbody>
 {topCustomersData.map((cust, idx) => (
 <tr key={idx}><td>{idx + 1}</td><td style={{ fontWeight:"bold" }}>{cust.name}</td><td style={{ textAlign:"center" }}>{cust.visits}</td><td style={{ textAlign:"right", color:"#10b981", fontWeight:"bold" }}>Rs. {cust.spend.toLocaleString()}</td></tr>
 ))}
 </tbody>
 </table>
 </>
 )}
 </div>
 </div>
 );
}
