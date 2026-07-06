import React, { useState, useEffect } from"react";
import {
 Search,
 Download,
 Wallet,
 FileText,
 CreditCard,
 CheckCircle2,
 Receipt,
 AlertTriangle,
} from"lucide-react";
import { useOrders } from"../../context/OrderContext";

import"../../styles/billing.css"; // Kept for any global custom overrides

const Billing = () => {
 const { orders = [], fetchOrders } = useOrders();
 const [activeTab, setActiveTab] = useState(() => {
 return localStorage.getItem("billing_active_tab") ||"All Bills";
 });

 useEffect(() => {
 localStorage.setItem("billing_active_tab", activeTab);
 }, [activeTab]);
 const [searchTerm, setSearchTerm] = useState("");
 const [selectedBillId, setSelectedBillId] = useState(null);

 useEffect(() => {
 if (fetchOrders) fetchOrders();
 }, [fetchOrders]);

 const billsData = [...orders]
 .sort((a, b) => {
 const timeA = new Date(a.createdAt || a.timestamp || 0).getTime();
 const timeB = new Date(b.createdAt || b.timestamp || 0).getTime();
 return timeB - timeA;
 })
 .map((o) => {
 const subtotal = (o.items || []).reduce(
 (sum, item) => sum + item.qty * item.price,
 0
 );
 const total = o.amount || subtotal + (subtotal > 0 ? 50 : 0);
 return {
 billNo: o.id,
 orderId: o.id,
 table: o.table ||"Walk-in",
 amount: total,
 payment: o.paymentMethod ||"Cash",
 status: o.status ==="Completed" ?"Paid" :"Unpaid",
 time: o.time ||"N/A",
 items: o.items || [],
 };
 });

 // Filter bills based on search input and active tab
 const filteredBills = billsData.filter(
 (bill) =>
 (activeTab ==="All Bills" || bill.status === activeTab) &&
 (bill.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
 bill.table.toLowerCase().includes(searchTerm.toLowerCase()) ||
 bill.orderId.toLowerCase().includes(searchTerm.toLowerCase()))
 );

 // Get active selected bill details
 const activeBill = billsData.find((b) => b.billNo === selectedBillId) || null;

 // Helper function for Payment Method badge styling
 const getPaymentBadgeColor = (method) => {
 switch (method) {
 case"Cash":
 return"bg-emerald-50 text-emerald-600 border-emerald-200";
 case"UPI":
 return"bg-indigo-50 text-indigo-600 border-indigo-200";
 case"Card":
 return"bg-blue-50 text-blue-600 border-blue-200";
 default:
 return"bg-slate-50 text-slate-600 border-slate-200";
 }
 };

 return (
 <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
 {/* PRINT-ONLY STYLES FOR PDF EXPORT */}
 <style>
 {`
 @media print {
 @page { margin: 0; size: 80mm auto; }
 html, body { width: 80mm !important; background: #fff !important; margin: 0 !important; padding: 0 !important; }
 .sidebar, .navbar, header, footer, main { display: none !important; }
 .min-h-screen { padding: 0 !important; margin: 0 !important; background: transparent !important; }
 #printable-receipt { position: absolute !important; left: 0 !important; top: 0 !important; width: 80mm !important; margin: 0 !important; padding: 5mm !important; font-family:'Courier New', monospace; color: #000; font-size: 12px; background: #fff; display: block !important; z-index: 99999; }
 }
 @media screen {
 #printable-receipt {
 display: none;
 }
 }
 `}
 </style>

 <main className="max-w-[1600px] mx-auto">
 {/* HEADER SECTION */}
 <div className="flex justify-between items-center mb-8">
 <div>
 <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
 Billing
 </h1>
 <p className="text-slate-400 text-sm mt-0.5 font-medium">
 Dashboard <span className="mx-1.5 text-slate-300">&gt;</span>{""}
 Billing
 </p>
 </div>
 </div>

 {/* METRICS & STATS GRID */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
 {/* Revenue Stat Card */}
 <div className="group bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
 <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
 <Wallet size={24} />
 </div>
 <div>
 <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">
 Today's Revenue
 </h4>
 <div className="flex items-end gap-2">
 <h2 className="text-2xl font-black text-slate-900">
 Rs.{""}
 {billsData
 .filter((b) => b.status ==="Paid")
 .reduce((sum, b) => sum + b.amount, 0)
 .toLocaleString()}
 </h2>
 </div>
 <p className="text-xs font-bold text-slate-400 mt-1">
 Based on completed bills
 </p>
 </div>
 </div>

 {/* Total Bills Stat Card */}
 <div className="group bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
 <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
 <FileText size={24} />
 </div>
 <div>
 <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">
 Total Bills
 </h4>
 <div className="flex items-end gap-2">
 <h2 className="text-2xl font-black text-slate-900">
 {billsData.length}
 </h2>
 </div>
 <p className="text-xs font-bold text-slate-400 mt-1">
 Generated today
 </p>
 </div>
 </div>

 {/* Average Bill Stat Card */}
 <div className="group bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
 <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
 <CreditCard size={24} />
 </div>
 <div>
 <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">
 Average Bill
 </h4>
 <div className="flex items-end gap-2">
 <h2 className="text-2xl font-black text-slate-900">
 Rs.{""}
 {billsData.filter((b) => b.status ==="Paid").length > 0
 ? Math.round(
 billsData.filter((b) => b.status ==="Paid").reduce((sum, b) => sum + b.amount, 0) /
 billsData.filter((b) => b.status ==="Paid").length
 ).toLocaleString()
 : 0}
 </h2>
 </div>
 <p className="text-xs font-bold text-slate-400 mt-1">
 Per transaction
 </p>
 </div>
 </div>
 </div>

 {/* MAIN WORKSPACE: SPLIT GRID */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 {/* LEFT: DATA TABLE */}
 <div className="lg:col-span-8 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
 {/* Table Controls (Tabs & Search) */}
 <div className="p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
 <div className="inline-flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 overflow-x-auto max-w-full shadow-inner">
 {[
 { name:"All Bills", icon: FileText, activeColor:"text-blue-600", bgActive:"bg-blue-50", ringActive:"ring-blue-200/50" },
 { name:"Paid", icon: CheckCircle2, activeColor:"text-emerald-600", bgActive:"bg-emerald-50", ringActive:"ring-emerald-200/50" },
 { name:"Unpaid", icon: AlertTriangle, activeColor:"text-rose-600", bgActive:"bg-rose-50", ringActive:"ring-rose-200/50" }
 ].map((tab) => {
 const Icon = tab.icon;
 const isActive = activeTab === tab.name;
 const count = tab.name ==="All Bills" ? billsData.length : billsData.filter((b) => b.status === tab.name).length;
 
 return (
 <button
 key={tab.name}
 onClick={() => setActiveTab(tab.name)}
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

 <div className="relative w-full sm:w-72">
 <Search
 size={16}
 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
 />
 <input
 type="text"
 placeholder="Search bill number..."
 className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-400 shadow-sm"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />
 </div>
 </div>

 {/* Table Core */}
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-wider font-bold">
 <tr>
 <th className="p-4 pl-6 border-b border-slate-100">
 Bill No.
 </th>
 <th className="p-4 border-b border-slate-100">Order ID</th>
 <th className="p-4 border-b border-slate-100">Table</th>
 <th className="p-4 border-b border-slate-100">Amount</th>
 <th className="p-4 border-b border-slate-100">Payment</th>
 <th className="p-4 border-b border-slate-100">Status</th>
 <th className="p-4 pr-6 border-b border-slate-100">Time</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-sm">
 {filteredBills.length === 0 ? (
 <tr>
 <td
 colSpan="7"
 className="text-center py-12 text-slate-400 font-medium"
 >
 No bills found matching your criteria.
 </td>
 </tr>
 ) : (
 filteredBills.map((bill) => (
 <tr
 key={bill.billNo}
 onClick={() => setSelectedBillId(bill.billNo)}
 className={`transition-colors cursor-pointer ${
 selectedBillId === bill.billNo
 ?"bg-indigo-50/40"
 :"hover:bg-slate-50/80"
 }`}
 >
 <td className="p-4 pl-6 font-bold text-slate-900">
 {bill.billNo}
 </td>
 <td className="p-4 font-semibold text-slate-500">
 {bill.orderId}
 </td>
 <td className="p-4 font-semibold text-slate-700">
 {bill.table}
 </td>
 <td className="p-4 font-black text-slate-900">
 Rs. {bill.amount.toLocaleString()}
 </td>
 <td className="p-4">
 <span
 className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider border ${getPaymentBadgeColor(
 bill.payment
 )}`}
 >
 {bill.payment}
 </span>
 </td>
 <td className="p-4">
 <span className={`flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-lg w-fit ${
 bill.status ==="Paid" ?"text-emerald-600 bg-emerald-50" :"text-rose-600 bg-rose-50"
 }`}>
 {bill.status ==="Paid" ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />} {bill.status}
 </span>
 </td>
 <td className="p-4 pr-6 font-semibold text-slate-500">
 {bill.time}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* RIGHT: BILL DETAILS (RECEIPT PANE) */}
 <div className="lg:col-span-4 bg-white rounded-xl border border-slate-100 shadow-sm p-6 relative overflow-hidden sticky top-6">
 {/* Top accent line */}
 <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900" />

 {!activeBill ? (
 <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
 <Receipt size={48} className="mb-4 opacity-30" />
 <p className="text-sm font-semibold">No bill selected</p>
 <p className="text-xs text-center mt-1">
 Select a bill from the list to view its details.
 </p>
 </div>
 ) : (
 <>
 <div className="flex justify-between items-start mb-6 pt-1">
 <div>
 <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
 <Receipt size={20} className="text-slate-400" /> Bill
 Details
 </h2>
 </div>
 <span className={`font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full ${activeBill.status ==="Paid" ?"bg-emerald-100 text-emerald-700" :"bg-rose-100 text-rose-700"}`}>
 {activeBill.status}
 </span>
 </div>

 {/* Bill Meta Data */}
 <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100/80 space-y-3 text-sm">
 <div className="flex justify-between">
 <span className="text-slate-500 font-semibold">
 Bill No.
 </span>
 <span className="font-black text-slate-900">
 {activeBill.billNo}
 </span>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-500 font-semibold">Table</span>
 <span className="font-bold text-slate-900">
 {activeBill.table}
 </span>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-500 font-semibold">
 Payment
 </span>
 <span className="font-bold text-slate-900">
 {activeBill.payment}
 </span>
 </div>
 </div>

 {/* Dynamic Items List */}
 <div className="mb-6 space-y-3 relative">
 <div className="border-t-2 border-dashed border-slate-200 mb-4" />

 {activeBill.items.map((item, idx) => (
 <div
 key={idx}
 className="flex justify-between items-center text-sm"
 >
 <span className="font-semibold text-slate-700">
 {item.name}
 </span>
 <span className="font-bold text-slate-900">
 Rs. {item.price.toLocaleString()}
 </span>
 </div>
 ))}

 <div className="border-t-2 border-dashed border-slate-200 mt-4 pt-4 flex justify-between items-end">
 <span className="font-bold text-slate-500 text-sm">
 Total Amount
 </span>
 <span className="text-2xl font-black text-indigo-600">
 Rs. {activeBill.amount.toLocaleString()}
 </span>
 </div>
 </div>

 {/* Download Invoice Button */}
 <button 
 onClick={() => window.print()}
 className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md mt-2"
 >
 <Download size={16} /> Print / Save as PDF
 </button>
 </>
 )}
 </div>
 </div>
 </main>

 {/* DEDICATED PRINTABLE RECEIPT LAYOUT */}
 {activeBill && (
 <div id="printable-receipt">
 <div style={{ textAlign:"center", marginBottom:"15px" }}>
 <h2 style={{ fontSize:"20px", margin:"0 0 5px 0" }}>
 मिठ्ठो चिया & Tiffin घर
 </h2>
 <p style={{ margin:"2px 0" }}>Kathmandu, Nepal</p>
 <p style={{ margin:"2px 0" }}>Tel: +977 9812345678</p>
 </div>

 <div
 style={{
 borderBottom:"1px dashed #000",
 paddingBottom:"10px",
 marginBottom:"10px",
 }}
 >
 <div
 style={{
 display:"flex",
 justifyContent:"space-between",
 marginBottom:"5px",
 }}
 >
 <span>Bill No:</span>{""}
 <span>{activeBill.billNo}</span>
 </div>
 <div
 style={{
 display:"flex",
 justifyContent:"space-between",
 marginBottom:"5px",
 }}
 >
 <span>Date:</span>{""}
 <span>
 {new Date().toLocaleDateString()} {activeBill.time}
 </span>
 </div>
 <div
 style={{
 display:"flex",
 justifyContent:"space-between",
 marginBottom:"5px",
 }}
 >
 <span>Table:</span> <span>{activeBill.table}</span>
 </div>
 <div
 style={{
 display:"flex",
 justifyContent:"space-between",
 marginBottom:"5px",
 }}
 >
 <span>Payment:</span> <span>{activeBill.payment}</span>
 </div>
 <div
 style={{
 display:"flex",
 justifyContent:"space-between",
 marginBottom:"5px",
 }}
 >
 <span>Status:</span> <span>{activeBill.status}</span>
 </div>
 </div>

 <table
 style={{
 width:"100%",
 borderCollapse:"collapse",
 marginTop:"10px",
 marginBottom:"10px",
 borderBottom:"1px dashed #000",
 paddingBottom:"10px",
 }}
 >
 <thead>
 <tr>
 <th
 style={{
 textAlign:"left",
 borderBottom:"1px dashed #000",
 paddingBottom:"5px",
 }}
 >
 Item
 </th>
 <th
 style={{
 textAlign:"center",
 borderBottom:"1px dashed #000",
 paddingBottom:"5px",
 }}
 >
 Qty
 </th>
 <th
 style={{
 textAlign:"right",
 borderBottom:"1px dashed #000",
 paddingBottom:"5px",
 }}
 >
 Amount
 </th>
 </tr>
 </thead>
 <tbody>
 {activeBill.items.map((item, idx) => (
 <tr key={idx}>
 <td style={{ padding:"5px 0" }}>{item.name}</td>
 <td style={{ textAlign:"center", padding:"5px 0" }}>
 {item.qty}
 </td>
 <td style={{ textAlign:"right", padding:"5px 0" }}>
 Rs. {(item.qty * (parseFloat(item.price) || 0)).toLocaleString()}
 </td>
 </tr>
 ))}
 </tbody>
 </table>

 <div
 style={{
 display:"flex",
 justifyContent:"space-between",
 fontWeight:"bold",
 fontSize:"16px",
 marginTop:"10px",
 borderTop:"1px dashed #000",
 paddingTop:"10px",
 }}
 >
 <span>GRAND TOTAL:</span>
 <span>Rs. {activeBill.amount.toLocaleString()}</span>
 </div>

 <div
 style={{
 textAlign:"center",
 marginTop:"20px",
 fontWeight:"bold",
 }}
 >
 <p>Thank you for your visit!</p>
 <p>Please come again.</p>
 </div>
 </div>
 )}
 </div>
 );
};

export default Billing;
