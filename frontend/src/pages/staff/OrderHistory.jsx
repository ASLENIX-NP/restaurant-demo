import { useMemo, useState, useRef, useEffect } from"react";
import {
 CalendarDays,
 CheckCircle2,
 Download,
 Eye,
 FileText,
 Receipt,
 Search,
 Table2,
 User,
 Wallet,
 X,
 XCircle,
 Printer,
} from"lucide-react";
import"../../styles/history.css";
import { useOrders } from"../../context/OrderContext";

const filters = ["All","Completed","Cancelled"];

const getAvatarGradient = (index) => {
 const gradients = [
"from-blue-500 to-indigo-600",
"from-violet-500 to-purple-600",
"from-emerald-400 to-teal-500",
"from-pink-500 to-rose-600",
"from-orange-400 to-amber-500",
 ];
 return gradients[index % gradients.length];
};

const History = () => {
 const { orders = [] } = useOrders();
 const [searchTerm, setSearchTerm] = useState("");
 const [activeTab, setActiveTab] = useState("All");
 const [selectedOrder, setSelectedOrder] = useState(null);
 const [isExporting, setIsExporting] = useState(false);
 const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
 const exportMenuRef = useRef(null);

 useEffect(() => {
 const handleOutsideClick = (event) => {
 if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
 setIsExportMenuOpen(false);
 }
 };
 document.addEventListener("mousedown", handleOutsideClick);
 return () => document.removeEventListener("mousedown", handleOutsideClick);
 }, []);

 const ordersList = useMemo(() => {
 return orders
 .filter((o) => o.status ==="Completed" || o.status ==="Cancelled")
 .map((o) => {
 const subtotal = (o.items || []).reduce(
 (sum, i) => sum + i.qty * (parseFloat(i.price) || 0),
 0
 );
 const amount =
 o.amount !== undefined
 ? o.amount
 : subtotal + (subtotal > 0 ? 50 : 0);
 return {
 id: o.id,
 table: o.table ||"Walk-in",
 amount: amount,
 status: o.status,
 customer: o.customer ||"Guest",
 customerType:"Customer",
 itemsCount: (o.items || []).reduce((sum, i) => sum + i.qty, 0),
 time: o.time ||"N/A",
 date: o.date || new Date().toLocaleDateString(),
 paymentMethod: o.paymentMethod ||"Cash",
 server: o.server ||"System",
 breakdown: o.items || [],
 };
 })
 .reverse();
 }, [orders]);

 const filteredOrders = useMemo(() => {
 const term = searchTerm.trim().toLowerCase();

 return ordersList.filter((order) => {
 const matchesSearch =
 !term ||
 order.customer.toLowerCase().includes(term) ||
 order.id.toLowerCase().includes(term) ||
 order.table.toLowerCase().includes(term) ||
 order.paymentMethod.toLowerCase().includes(term);
 const matchesTab = activeTab ==="All" || order.status === activeTab;

 return matchesSearch && matchesTab;
 });
 }, [activeTab, ordersList, searchTerm]);

 const stats = useMemo(() => {
 const completedOrders = ordersList.filter(
 (order) => order.status ==="Completed"
 );
 const cancelledOrders = ordersList.filter(
 (order) => order.status ==="Cancelled"
 );
 const totalItems = completedOrders.reduce(
 (sum, order) => sum + order.itemsCount,
 0
 );

 return {
 totalItems,
 completedCount: completedOrders.length,
 cancelledCount: cancelledOrders.length,
 };
 }, [ordersList]);

 const handleExportCSV = () => {
 setIsExporting(true);

 if (filteredOrders.length === 0) {
 alert("No data to export based on current filters.");
 setIsExporting(false);
 return;
 }

 const headers = [
"Order ID",
"Date",
"Time",
"Customer",
"Table",
"Items Count",
"Items Breakdown",
"Amount",
"Status",
"Payment Method",
"Server"
 ];

 const csvRows = filteredOrders.map((order) => {
 const itemsBreakdown = order.breakdown.map(i => `${i.qty}x ${i.name}`).join(";");
 return [
 order.id,
 order.date ||"N/A",
 order.time ||"N/A",
 `"${order.customer ||"Guest"}"`,
 `"${order.table ||"Walk-in"}"`,
 order.itemsCount,
 `"${itemsBreakdown}"`,
 order.amount,
 order.status,
 order.paymentMethod ||"Cash",
 `"${order.server ||"System"}"`
 ].join(",");
 });

 const csvContent = [headers.join(","), ...csvRows].join("\n");
 const blob = new Blob([csvContent], { type:"text/csv;charset=utf-8;" });
 const url = URL.createObjectURL(blob);
 const link = document.createElement("a");
 link.setAttribute("href", url);
 link.setAttribute("download", `Order_History_${activeTab.replace(/\s+/g,"_")}_${new Date().toISOString().split('T')[0]}.csv`);
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);

 window.setTimeout(() => setIsExporting(false), 900);
 };

 const handleExportPDF = () => {
 if (filteredOrders.length === 0) {
 alert("No data to export based on current filters.");
 return;
 }
 
 setTimeout(() => {
 window.print();
 }, 100);
 };

 return (
 <div className="min-h-screen bg-slate-50 p-3 sm:p-6 md:p-8 text-slate-800 font-sans w-full overflow-x-hidden">
 {/* PRINT-ONLY STYLES FOR PDF EXPORT */}
 <style>
 {`
 @media print {
 @page { margin: 10mm; size: A4 portrait; }
 html, body { background: #fff; margin: 0; padding: 0; }
 body * { visibility: hidden; }
 .sidebar, .navbar, header, footer, .history-page > *:not(#printable-order-history) { display: none !important; }
 .history-page { padding: 0 !important; margin: 0 !important; background: transparent !important; }
 #printable-order-history, #printable-order-history * { visibility: visible; }
 #printable-order-history { position: absolute; left: 0; top: 0; width: 100%; margin: 0; font-family:'Arial', sans-serif; color: #000; }
 .print-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
 .print-table th, .print-table td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 12px; }
 .print-table th { background-color: #f8fafc !important; -webkit-print-color-adjust: exact; font-weight: bold; color: #334155; }
 }
 @media screen {
 #printable-order-history { display: none; }
 }
 /* Dropdown item hover */
 .export-dropdown-item:hover {
 background-color: #f8fafc;
 }
 `}
 </style>

 <main className="max-w-[1600px] mx-auto pb-24 lg:pb-12">
 <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
 <div>
 <h1 className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight">Order History</h1>
 <p className="text-slate-400 text-sm mt-0.5 font-medium">
 Dashboard <span className="mx-1.5 text-slate-300">&gt;</span> Order History
 </p>
 </div>

 <div className="relative w-full sm:w-auto" ref={exportMenuRef}>
 <button
 className={`w-full sm:w-auto justify-center bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all ${isExporting ?"opacity-70 cursor-not-allowed" :""}`}
 onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
 disabled={isExporting}
 type="button"
 >
 <Download size={16} />
 {isExporting ?"Preparing..." :"Export History"}
 </button>
 {isExportMenuOpen && (
 <div className="absolute top-full right-0 mt-2 bg-white border border-slate-100 shadow-xl rounded-xl w-48 z-50 overflow-hidden text-left animate-slide-in">
 <button onClick={() => { handleExportPDF(); setIsExportMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors border-b border-slate-50">
 <Printer size={16} className="text-slate-400" /> Print / Save PDF
 </button>
 <button onClick={() => { handleExportCSV(); setIsExportMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors">
 <FileText size={16} className="text-slate-400" /> Download CSV
 </button>
 </div>
 )}
 </div>
 </section>

 <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
 <div
 onClick={() => setActiveTab("All")}
 className={`bg-white rounded-2xl p-6 border shadow-sm flex items-center gap-5 transition-all duration-300 cursor-pointer ${
 activeTab ==="All"
 ?"border-slate-400 shadow-md ring-1 ring-slate-400 -translate-y-1"
 :"border-slate-100 hover:shadow-md hover:-translate-y-1 opacity-80 hover:opacity-100"
 }`}
 >
 <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 shadow-inner border border-slate-100">
 <FileText size={26} strokeWidth={2.5} />
 </div>
 <div>
 <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Items Processed</h4>
 <h2 className="text-3xl font-black text-slate-900 leading-none">{stats.totalItems}</h2>
 </div>
 </div>

 <div
 onClick={() => setActiveTab("Completed")}
 className={`bg-white rounded-2xl p-6 border shadow-sm flex items-center gap-5 transition-all duration-300 cursor-pointer ${
 activeTab ==="Completed"
 ?"border-emerald-400 shadow-md ring-1 ring-emerald-400 -translate-y-1"
 :"border-slate-100 hover:shadow-md hover:-translate-y-1 opacity-80 hover:opacity-100"
 }`}
 >
 <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-inner border border-emerald-100">
 <CheckCircle2 size={26} strokeWidth={2.5} />
 </div>
 <div>
 <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Completed Orders</h4>
 <h2 className="text-3xl font-black text-slate-900 leading-none">{stats.completedCount}</h2>
 </div>
 </div>

 <div
 onClick={() => setActiveTab("Cancelled")}
 className={`bg-white rounded-2xl p-6 border shadow-sm flex items-center gap-5 transition-all duration-300 cursor-pointer ${
 activeTab ==="Cancelled"
 ?"border-rose-400 shadow-md ring-1 ring-rose-400 -translate-y-1"
 :"border-slate-100 hover:shadow-md hover:-translate-y-1 opacity-80 hover:opacity-100"
 }`}
 >
 <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-inner border border-rose-100">
 <XCircle size={26} strokeWidth={2.5} />
 </div>
 <div>
 <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Cancelled Orders</h4>
 <h2 className="text-3xl font-black text-slate-900 leading-none">{stats.cancelledCount}</h2>
 </div>
 </div>
 </section>

 <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
 <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
 <div className="relative w-full md:max-w-md">
 <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
 <input
 type="text"
 placeholder="Search ID, customer, table, payment..."
 value={searchTerm}
 onChange={(event) => setSearchTerm(event.target.value)}
 className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base sm:text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 transition-all placeholder:text-slate-400 shadow-sm"
 />
 </div>

 <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full md:w-auto pb-2 md:pb-0">
 {filters.map((tab) => (
 <button
 key={tab}
 className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex-shrink-0 border-2 ${
 activeTab === tab
 ?"bg-slate-900 text-white border-slate-900 shadow-sm"
 :"bg-white text-slate-500 border-transparent hover:border-slate-200 hover:bg-slate-50 hover:text-slate-800"
 }`}
 onClick={() => setActiveTab(tab)}
 type="button"
 >
 {tab}
 </button>
 ))}
 </div>
 </div>

 <div className="overflow-x-auto min-h-[400px]">
 {filteredOrders.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-20 text-slate-400">
 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-inner">
 <FileText size={32} className="text-slate-300" />
 </div>
 <h2 className="text-xl font-black text-slate-700">No orders found</h2>
 <p className="font-medium mt-1">Try another keyword or switch the status filter.</p>
 </div>
 ) : (
 <table className="w-full text-left border-collapse">
 <thead className="bg-white text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-100">
 <tr>
 <th className="p-4 pl-6">Order ID</th>
 <th className="p-4">Customer Profile</th>
 <th className="p-4">Assigned Table</th>
 <th className="p-4 text-center">Cart Load</th>
 <th className="p-4">Timestamp</th>
 <th className="p-4">Items Ordered</th>
 <th className="p-4 text-center">Workflow Status</th>
 <th className="p-4 pr-6 text-right">Operations</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-sm">
 {filteredOrders.map((order, index) => (
 <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
 <td className="p-4 pl-6 font-black text-slate-900">{order.id}</td>
 <td className="p-4">
 <div className="flex items-center gap-3">
 <div
 className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md bg-gradient-to-br ${
 getAvatarGradient(index)
 }`}
 >
 {order.customer.charAt(0)}
 </div>
 <div>
 <h4 className="font-bold text-slate-900">{order.customer}</h4>
 <p className="text-[11px] font-semibold text-slate-400">{order.customerType}</p>
 </div>
 </div>
 </td>
 <td className="p-4">
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
 <Table2 size={14} className="text-slate-400" />
 {order.table}
 </span>
 </td>
 <td className="p-4 text-center font-bold text-slate-700">{order.itemsCount} Items</td>
 <td className="p-4">
 <div className="flex flex-col gap-0.5">
 <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
 <CalendarDays size={13} className="text-slate-400" />
 {order.date}
 </span>
 <small className="text-[11px] font-semibold text-slate-500 pl-5">{order.time}</small>
 </div>
 </td>
 <td className="p-4">
 <div className="flex flex-col gap-1 max-h-[60px] overflow-y-auto pr-2 scrollbar-hide">
 {order.breakdown.map((item, i) => (
 <span key={i} className="text-xs text-slate-600 font-medium whitespace-nowrap">
 <strong className="text-slate-900">{item.qty}x</strong> {item.name}
 </span>
 ))}
 </div>
 </td>
 <td className="p-4 text-center">
 <span
 className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider w-max mx-auto border ${
 order.status ==="Completed"
 ?"bg-emerald-50 text-emerald-600 border-emerald-100"
 :"bg-rose-50 text-rose-600 border-rose-100"
 }`}
 >
 {order.status ==="Completed" ? (
 <CheckCircle2 size={12} />
 ) : (
 <XCircle size={12} />
 )}
 {order.status}
 </span>
 </td>
 <td className="p-4 pr-6 text-right">
 <button
 className="inline-flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-600 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 font-bold py-1.5 px-3 rounded-lg transition-all shadow-sm text-xs"
 onClick={() => setSelectedOrder(order)}
 type="button"
 >
 <Eye size={14} />
 Receipt
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>
 </div>
 </main>

 {selectedOrder && (
 <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity" onClick={() => setSelectedOrder(null)}>
 <div
 className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-in flex flex-col max-h-[90vh]"
 onClick={(event) => event.stopPropagation()}
 >
 <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
 <div>
 <span className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-1 block">Receipt Preview</span>
 <h2 className="text-lg font-black text-slate-900">Invoice Manifest</h2>
 <p className="text-xs font-semibold text-slate-500">
 {selectedOrder.id} - {selectedOrder.date}
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
 <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><User size={12}/> Customer</span>
 <span className="font-bold text-slate-900 text-sm truncate block">{selectedOrder.customer}</span>
 </div>
 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
 <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Table2 size={12}/> Table</span>
 <span className="font-bold text-slate-900 text-sm truncate block">{selectedOrder.table}</span>
 </div>
 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
 <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><CalendarDays size={12}/> Time</span>
 <span className="font-bold text-slate-900 text-sm truncate block">{selectedOrder.time}</span>
 </div>
 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
 <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Wallet size={12}/> Payment</span>
 <span className="font-bold text-slate-900 text-sm truncate block">{selectedOrder.paymentMethod}</span>
 </div>
 </div>

 <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-2 border-b border-slate-100 pb-2">Itemized Summary</h4>
 <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-2">
 {selectedOrder.breakdown.map((item, i) => (
 <div key={i} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border-l-4 border-slate-300 shadow-sm text-sm text-slate-800">
 <span className="font-semibold">{item.name}</span>
 <strong className="text-slate-500">x{item.qty}</strong>
 </div>
 ))}
 </div>

 <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4">
 <h3 className="font-bold text-slate-600 uppercase tracking-wider text-xs">Total Items</h3>
 <h2 className="text-xl font-black text-slate-900">{selectedOrder.itemsCount}</h2>
 </div>
 </div>

 <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-4">
 <div className="flex justify-center">
 <span
 className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
 selectedOrder.status ==="Completed"
 ?"bg-emerald-50 text-emerald-600 border-emerald-200"
 :"bg-rose-50 text-rose-600 border-rose-200"
 }`}
 >
 {selectedOrder.status ==="Completed" ? (
 <CheckCircle2 size={14} />
 ) : (
 <XCircle size={14} />
 )}
 Invoice State: {selectedOrder.status}
 </span>
 </div>
 <button 
 onClick={() => setSelectedOrder(null)}
 className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm"
 >
 Close Receipt
 </button>
 </div>
 </div>
 </div>
 )}

 {/* DEDICATED PRINTABLE PDF REPORT LAYOUT */}
 <div id="printable-order-history">
 <div style={{ textAlign:"center", marginBottom:"20px" }}>
 <h2 style={{ fontSize:"22px", margin:"0 0 8px 0" }}>ASLENIX RESTAURANT</h2>
 <h3 style={{ fontSize:"16px", margin:"0 0 5px 0", color:"#475569" }}>Order History Report</h3>
 <p style={{ margin:"3px 0", fontSize:"13px" }}><strong>Filter Status:</strong> {activeTab}</p>
 <p style={{ margin:"3px 0", fontSize:"13px" }}><strong>Generated On:</strong> {new Date().toLocaleString()}</p>
 </div>
 
 <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"20px", fontSize:"13px", backgroundColor:"#f8fafc", padding:"12px", border:"1px solid #e2e8f0", borderRadius:"8px", WebkitPrintColorAdjust:"exact" }}>
 <div><strong>Orders Displayed:</strong> {filteredOrders.length}</div>
 <div><strong>Items Processed:</strong> {stats.totalItems}</div>
 <div><strong>Completed Orders:</strong> {stats.completedCount}</div>
 <div><strong>Cancelled Orders:</strong> {stats.cancelledCount}</div>
 </div>

 <table className="print-table">
 <thead>
 <tr>
 <th>Order ID</th>
 <th>Date & Time</th>
 <th>Customer</th>
 <th>Table</th>
 <th>Items Ordered</th>
 <th style={{ textAlign:"center" }}>Status</th>
 </tr>
 </thead>
 <tbody>
 {filteredOrders.map((order, idx) => {
 const itemsBreakdown = order.breakdown.map(i => `${i.qty}x ${i.name}`).join(";");
 return (
 <tr key={idx}>
 <td style={{ fontWeight:"bold" }}>{order.id}</td>
 <td>{order.date ||"N/A"} {order.time ||""}</td>
 <td>{order.customer ||"Guest"}</td>
 <td>{order.table ||"Walk-in"}</td>
 <td>{itemsBreakdown}</td>
 <td style={{ textAlign:"center" }}>{order.status}</td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 );
};

export default History;
