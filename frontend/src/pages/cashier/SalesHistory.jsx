import"../../styles/saleshistory.css";
import React, { useState, useMemo, useEffect, useRef } from"react";
import { useNavigate } from "react-router-dom";
import {
 Search,
 DollarSign,
 Receipt,
 CreditCard,
 Eye,
 Printer,
 ChevronLeft,
 ChevronRight,
 MoreVertical,
 XCircle,
 Package,
 X,
 Filter,
 Plus,
 Trash2,
 CheckCircle,
 User,
 Table2,
 Clock,
 Download,
 FileText,
 TrendingUp,
 ShoppingCart,
 Calendar,
} from"lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from"recharts";
import DatePicker from"react-datepicker";
import"react-datepicker/dist/react-datepicker.css";
import { useOrders } from"../../context/OrderContext";
import apiClient from"../../api/apiClient";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const ITEMS_PER_PAGE = 8;

export default function SalesHistory() {
 const { orders = [], fetchOrders, cancelOrder, addOrder } = useOrders() || {};
 const { showToast } = useToast();
 const { user } = useAuth();
 const navigate = useNavigate();

 useEffect(() => {
 if (fetchOrders) fetchOrders();
 }, [fetchOrders]);

 const [searchTerm, setSearchTerm] = useState("");
 const [activeTab, setActiveTab] = useState(() => {
 return localStorage.getItem("sales_active_tab") ||"All";
 });
 const [paymentFilter, setPaymentFilter] = useState("All");
 const [viewMode, setViewMode] = useState(() => {
 return localStorage.getItem("sales_view_mode") ||"ledger";
 }); //'ledger','invoices','payments','eod'

 useEffect(() => {
 localStorage.setItem("sales_active_tab", activeTab);
 }, [activeTab]);

 useEffect(() => {
 localStorage.setItem("sales_view_mode", viewMode);
 }, [viewMode]);
 const [currentPage, setCurrentPage] = useState(1);
 const [selectedInvoice, setSelectedInvoice] = useState(null);
 const [printMode, setPrintMode] = useState("ledger"); //'ledger','single','batch','summary','eod'
 const [activeDropdownId, setActiveDropdownId] = useState(null);
 const [isExporting, setIsExporting] = useState(false);
 const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
 const [selectedTxns, setSelectedTxns] = useState([]);
 const menuRef = useRef(null);
 const exportMenuRef = useRef(null);

 // New Custom Invoice Modal State (Imported from Invoices.jsx)
 const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
 const [newInvoiceData, setNewInvoiceData] = useState({
 customer:"",
 method:"Cash",
 items: [],
 });
 const [newItemInput, setNewItemInput] = useState({
 name:"",
 qty: 1,
 price: 0,
 });

 // Date Range Filter State
 const [dateRange, setDateRange] = useState([null, null]);
 const [startDate, endDate] = dateRange;
 const [activePaymentMethods, setActivePaymentMethods] = useState([]);

 useEffect(() => {
 const loadMethods = async () => {
 try {
 const { data } = await apiClient.get("/api/settings");
 if (data && data.paymentMethods) {
 setActivePaymentMethods(data.paymentMethods.filter(m => m.active).map(m => m.name));
 } else {
 setActivePaymentMethods(["Cash","Card","eSewa","Khalti"]);
 }
 } catch (err) {
 console.error("Failed to load payment methods", err);
 setActivePaymentMethods(["Cash","Card","eSewa","Khalti"]);
 }
 };
 loadMethods();
 }, []);

 // Reset page when filters change
 useEffect(() => {
 setCurrentPage(1);
 setSelectedTxns([]); // Clear selections when filters change
 }, [searchTerm, activeTab, paymentFilter, viewMode, startDate, endDate]);

 // Reset search and dropdown filters when changing tabs for a fresh view
 useEffect(() => {
 setActiveTab("All");
 setPaymentFilter("All");
 setSearchTerm("");
 }, [viewMode]);

 // Keyboard Shortcuts: Close modals on'Escape'
 useEffect(() => {
 const handleKeyDown = (e) => {
 if (e.key ==="Escape") {
 setIsNewInvoiceOpen(false);
 setSelectedInvoice(null);
 }
 };
 window.addEventListener("keydown", handleKeyDown);
 return () => window.removeEventListener("keydown", handleKeyDown);
 }, []);

 // Custom Invoice Handlers
 const handleAddNewItem = () => {
 if (!newItemInput.name || newItemInput.price < 0 || newItemInput.qty < 1)
 return;
 setNewInvoiceData({
 ...newInvoiceData,
 items: [...newInvoiceData.items, newItemInput],
 });
 setNewItemInput({ name:"", qty: 1, price: 0 });
 };

 const handleCreateInvoice = () => {
 if (newInvoiceData.items.length === 0) {
 showToast("Please add at least one item to the invoice.", "warning");
 return;
 }

 const subtotal = newInvoiceData.items.reduce(
 (sum, i) => sum + i.qty * i.price,
 0
 );
 const newInv = {
 id: `INV-${Math.floor(Math.random() * 90000) + 10000}`,
 customer: newInvoiceData.customer ||"Walk-in Customer",
 paymentMethod: newInvoiceData.method,
 items: newInvoiceData.items,
 amount: subtotal,
 status:"Completed",
 date: new Date().toLocaleDateString(),
 time: new Date().toLocaleTimeString([], {
 hour:"2-digit",
 minute:"2-digit",
 }),
 table:"Walk-in",
 };

 if (addOrder) addOrder(newInv);

 setIsNewInvoiceOpen(false);
 setNewInvoiceData({ customer:"", method:"Cash", items: [] });
 };

 // Date Filtering logic to isolate orders within the picked date range
 const dateFilteredOrders = useMemo(() => {
 if (!startDate || !endDate) return orders;
 return orders.filter((txn) => {
 const txDate = txn.timestamp
 ? new Date(txn.timestamp)
 : txn.date
 ? new Date(txn.date)
 : null;
 if (!txDate) return false;
 const endOfDay = new Date(endDate);
 endOfDay.setHours(23, 59, 59, 999);
 return txDate >= startDate && txDate <= endOfDay;
 });
 }, [orders, startDate, endDate]);

 // Unified Metrics (Updates dynamically based on date range)
 const completedSales = useMemo(() => dateFilteredOrders.filter(
 (o) => o.status ==="Completed"
 ), [dateFilteredOrders]);

 const totalSalesAmount = useMemo(() => completedSales.reduce((acc, order) => {
 const subtotal = (order.items || []).reduce(
 (sum, item) => sum + item.qty * (parseFloat(item.price) || 0),
 0
 );
 return acc + (order.amount || subtotal + (subtotal > 0 ? 50 : 0));
 }, 0), [completedSales]);

 const totalItemsSold = useMemo(() => completedSales.reduce(
 (acc, order) =>
 acc + (order.items || []).reduce((sum, item) => sum + item.qty, 0),
 0
 ), [completedSales]);

 const avgOrderValue =
 completedSales.length > 0 ? totalSalesAmount / completedSales.length : 0;

 // Prepare dynamic data for the Pie Chart
 const paymentData = useMemo(() => {
 let cash = 0,
 card = 0,
 esewa = 0,
 khalti = 0;
 completedSales.forEach((order) => {
 const amt =
 order.amount ||
 (order.items || []).reduce(
 (sum, i) => sum + i.qty * (parseFloat(i.price) || 0),
 0
 ) + 50;
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

 // End of Day (Today's) Metrics (Strictly today, unfiltered by the date picker)
 const allCompletedSales = orders.filter((o) => o.status ==="Completed");
 const eodMetrics = useMemo(() => {
 const todayStr = new Date().toLocaleDateString();
 const todayStrISO = new Date().toISOString().split("T")[0];

 const todayCompleted = allCompletedSales.filter((o) => {
 const oDate =
 o.date ||
 (o.timestamp ? new Date(o.timestamp).toLocaleDateString() :"");
 return (
 oDate === todayStr ||
 oDate === todayStrISO ||
 (o.timestamp &&
 new Date(o.timestamp).toLocaleDateString() ===
 new Date().toLocaleDateString())
 );
 });

 let cash = 0,
 card = 0,
 esewa = 0,
 khalti = 0,
 total = 0;

 todayCompleted.forEach((order) => {
 const subtotal = (order.items || []).reduce(
 (sum, item) => sum + item.qty * (parseFloat(item.price) || 0),
 0
 );
 const amt = order.amount || subtotal + (subtotal > 0 ? 50 : 0);
 total += amt;

 if (order.paymentMethod ==="Card") card += amt;
 else if (order.paymentMethod ==="eSewa") esewa += amt;
 else if (order.paymentMethod ==="Khalti") khalti += amt;
 else cash += amt; // Default to cash
 });

 return {
 ordersCount: todayCompleted.length,
 total,
 cash,
 card,
 esewa,
 khalti,
 orders: todayCompleted,
 };
 }, [allCompletedSales]);

 // Map Orders to Unified Ledger Data
 const ledgerData = useMemo(() => {
 return dateFilteredOrders.map((order) => {
 const subtotal = (order.items || []).reduce(
 (sum, item) => sum + item.qty * (parseFloat(item.price) || 0),
 0
 );
 const total = order.amount || subtotal + (subtotal > 0 ? 50 : 0);
 return {
 ...order,
 transactionId: `TXN-${String(order.id).replace(/\D/g,"")}`,
 totalAmount: total,
 itemCount: (order.items || []).reduce((sum, i) => sum + i.qty, 0),
 };
 });
 }, [dateFilteredOrders]);

 // Filter Logic
 const filteredData = useMemo(() => {
 return ledgerData.filter((txn) => {
 const matchesTab = activeTab ==="All" ? true : txn.status === activeTab;
 const matchesSearch =
 txn.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
 (txn.customer ||"").toLowerCase().includes(searchTerm.toLowerCase()) ||
 txn.id.toLowerCase().includes(searchTerm.toLowerCase());
 const matchesPayment =
 paymentFilter ==="All" ? true : txn.paymentMethod === paymentFilter;

 // Apply view mode specific filters
 let matchesView = true;
 if (viewMode ==="ledger")
 matchesView =
 txn.status ==="Completed" ||
 txn.status ==="Cancelled" ||
 txn.status ==="Refunded";
 if (viewMode ==="payments") matchesView = txn.status ==="Completed"; // Only show finalized payments
 if (viewMode ==="invoices") matchesView = true; // Show all (including Pending)

 return matchesTab && matchesSearch && matchesPayment && matchesView;
 });
 }, [ledgerData, activeTab, searchTerm, paymentFilter, viewMode]);

 // Pagination
 const paginatedData = filteredData.slice(0, currentPage * ITEMS_PER_PAGE);

 const highestSale =
 completedSales.length > 0
 ? Math.max(...completedSales.map((s) => s.amount || 0))
 : 0;
 const lowestSale =
 completedSales.length > 0
 ? Math.min(...completedSales.map((s) => s.amount || 0))
 : 0;

 // Multi-Select Handlers
 const toggleSelection = (id) => {
 setSelectedTxns((prev) =>
 prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
 );
 };

 const toggleAllSelections = () => {
 if (selectedTxns.length === filteredData.length) setSelectedTxns([]);
 else setSelectedTxns(filteredData.map((t) => t.transactionId));
 };

 const handlePrintSingle = (invoice) => {
 navigate(`/cashier/invoice/${encodeURIComponent(invoice.id)}`);
 };

 const handlePrintBatch = () => {
 setPrintMode("batch");
 setTimeout(() => window.print(), 300);
 };

 const handlePrintLedger = () => {
 setPrintMode("ledger");
 setTimeout(() => window.print(), 300);
 };

 const handlePrintSummary = () => {
 setPrintMode("summary");
 setTimeout(() => window.print(), 300);
 };

 const handleUpdateStatus = (id, newStatus) => {
 if (newStatus ==="Cancelled" && cancelOrder) {
 if (window.confirm("Are you sure you want to void this transaction?")) {
 cancelOrder(id);
 setSelectedInvoice(null);
 }
 }
 };

 const handleExportCSV = () => {
 setIsExporting(true);

 const dataToExport =
 selectedTxns.length > 0
 ? filteredData.filter((t) => selectedTxns.includes(t.transactionId))
 : filteredData;

 if (dataToExport.length === 0) {
 showToast("No data to export based on current filters.", "warning");
 setIsExporting(false);
 return;
 }

 const headers = [
"Date",
"Time",
"Transaction ID",
"Order ID",
"Customer",
"Items Count",
"Method",
"Amount",
"Status",
 ];
 const csvRows = dataToExport.map((txn) =>
 [
 txn.date,
 txn.time,
 txn.transactionId,
 txn.id,
 `"${txn.customer ||"Walk-in"}"`,
 txn.itemCount,
 txn.paymentMethod ||"Cash",
 txn.totalAmount,
 txn.status,
 ].join(",")
 );

 const csvContent = [headers.join(","), ...csvRows].join("\n");
 const blob = new Blob([csvContent], { type:"text/csv;charset=utf-8;" });
 const url = URL.createObjectURL(blob);
 const link = document.createElement("a");
 link.setAttribute("href", url);
 link.setAttribute(
"download",
 `Transaction_Ledger_${new Date().toISOString().split("T")[0]}.csv`
 );
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);

 setTimeout(() => setIsExporting(false), 500);
 };

 const CustomTooltip = ({ active, payload }) => {
 if (active && payload && payload.length) {
 return (
 <div className="bg-slate-900 text-white p-3 rounded-lg shadow-md border border-slate-700">
 <p className="font-bold text-slate-300 text-xs mb-1">
 {payload[0].name}
 </p>
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

 const renderReceipt = (invoice) => (
 <div
 key={invoice.transactionId}
 style={{
 pageBreakAfter:"always",
 marginBottom:"20px",
 borderBottom:"1px dashed #000",
 paddingBottom:"20px",
 }}
 >
 <div style={{ textAlign:"center", marginBottom:"15px" }}>
 <h2 style={{ fontSize:"18px", margin:"0 0 5px 0" }}>
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
 <span>Receipt No:</span> <span>{invoice.transactionId}</span>
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
 {invoice.date} {invoice.time}
 </span>
 </div>
 <div
 style={{
 display:"flex",
 justifyContent:"space-between",
 marginBottom:"5px",
 }}
 >
 <span>Customer:</span> <span>{invoice.customer ||"Walk-in"}</span>
 </div>
 <div
 style={{
 display:"flex",
 justifyContent:"space-between",
 marginBottom:"5px",
 }}
 >
 <span>Method:</span> <span>{invoice.paymentMethod ||"Cash"}</span>
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
 {invoice.items?.map((item, idx) => (
 <tr key={idx}>
 <td style={{ padding:"5px 0" }}>{item.name}</td>
 <td style={{ textAlign:"center", padding:"5px 0" }}>
 {item.qty}
 </td>
 <td style={{ textAlign:"right", padding:"5px 0" }}>
 Rs. {(item.qty * (parseFloat(item.price) || 0)).toFixed(2)}
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
 fontSize:"14px",
 marginTop:"10px",
 borderTop:"1px dashed #000",
 paddingTop:"10px",
 }}
 >
 <span>GRAND TOTAL:</span>
 <span>
 Rs.{""}
 {invoice.totalAmount.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </span>
 </div>

 <div
 style={{ textAlign:"center", marginTop:"20px", fontWeight:"bold" }}
 >
 <p>Thank you for your visit!</p>
 <p>Please come again.</p>
 </div>
 </div>
 );

 const renderSummaryReport = () => (
 <div
 key="summary-report"
 style={{
 width:"100%",
 maxWidth:"800px",
 margin:"0 auto",
 padding:"20px",
 fontFamily:"sans-serif",
 color:"#000",
 }}
 >
 <div
 style={{
 textAlign:"center",
 marginBottom:"30px",
 borderBottom:"2px solid #e2e8f0",
 paddingBottom:"20px",
 }}
 >
 <h1 style={{ fontSize:"24px", margin:"0 0 10px 0" }}>
 मिठ्ठो चिया & Tiffin घर
 </h1>
 <h2 style={{ fontSize:"18px", margin:"0 0 5px 0", color:"#475569" }}>
 Sales & Payment Summary Report
 </h2>
 <p style={{ margin: 0, color:"#64748b" }}>
 Generated on: {new Date().toLocaleString()}
 </p>
 <p style={{ margin:"5px 0 0 0", color:"#64748b" }}>
 Current Filter: {activeTab} | Payment Method: {paymentFilter}
 </p>
 </div>

 <div
 style={{
 display:"flex",
 flexWrap:"wrap",
 gap:"20px",
 marginBottom:"30px",
 }}
 >
 <div
 style={{
 flex:"1 1 45%",
 padding:"15px",
 border:"1px solid #e2e8f0",
 borderRadius:"8px",
 backgroundColor:"#f8fafc",
 }}
 >
 <h3
 style={{
 margin:"0 0 10px 0",
 fontSize:"14px",
 color:"#64748b",
 textTransform:"uppercase",
 }}
 >
 Total Revenue
 </h3>
 <p
 style={{
 margin: 0,
 fontSize:"24px",
 fontWeight:"bold",
 color:"#0f172a",
 }}
 >
 Rs.{""}
 {totalSalesAmount.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </p>
 </div>
 <div
 style={{
 flex:"1 1 45%",
 padding:"15px",
 border:"1px solid #e2e8f0",
 borderRadius:"8px",
 backgroundColor:"#f8fafc",
 }}
 >
 <h3
 style={{
 margin:"0 0 10px 0",
 fontSize:"14px",
 color:"#64748b",
 textTransform:"uppercase",
 }}
 >
 Total Orders
 </h3>
 <p
 style={{
 margin: 0,
 fontSize:"24px",
 fontWeight:"bold",
 color:"#0f172a",
 }}
 >
 {completedSales.length}
 </p>
 </div>
 <div
 style={{
 flex:"1 1 45%",
 padding:"15px",
 border:"1px solid #e2e8f0",
 borderRadius:"8px",
 backgroundColor:"#f8fafc",
 }}
 >
 <h3
 style={{
 margin:"0 0 10px 0",
 fontSize:"14px",
 color:"#64748b",
 textTransform:"uppercase",
 }}
 >
 Items Sold
 </h3>
 <p
 style={{
 margin: 0,
 fontSize:"24px",
 fontWeight:"bold",
 color:"#0f172a",
 }}
 >
 {totalItemsSold}
 </p>
 </div>
 <div
 style={{
 flex:"1 1 45%",
 padding:"15px",
 border:"1px solid #e2e8f0",
 borderRadius:"8px",
 backgroundColor:"#f8fafc",
 }}
 >
 <h3
 style={{
 margin:"0 0 10px 0",
 fontSize:"14px",
 color:"#64748b",
 textTransform:"uppercase",
 }}
 >
 Average Order Value
 </h3>
 <p
 style={{
 margin: 0,
 fontSize:"24px",
 fontWeight:"bold",
 color:"#0f172a",
 }}
 >
 Rs.{""}
 {avgOrderValue.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </p>
 </div>
 </div>

 <h3
 style={{
 fontSize:"18px",
 borderBottom:"1px solid #e2e8f0",
 paddingBottom:"10px",
 marginBottom:"15px",
 }}
 >
 Payments by Method
 </h3>
 <table
 style={{
 width:"100%",
 borderCollapse:"collapse",
 marginBottom:"30px",
 }}
 >
 <thead>
 <tr>
 <th
 style={{
 textAlign:"left",
 padding:"10px",
 borderBottom:"2px solid #e2e8f0",
 color:"#475569",
 }}
 >
 Method
 </th>
 <th
 style={{
 textAlign:"right",
 padding:"10px",
 borderBottom:"2px solid #e2e8f0",
 color:"#475569",
 }}
 >
 Amount
 </th>
 </tr>
 </thead>
 <tbody>
 {paymentData.map((method, idx) => (
 <tr key={idx}>
 <td
 style={{
 padding:"10px",
 borderBottom:"1px solid #f1f5f9",
 fontWeight:"bold",
 }}
 >
 {method.name}
 </td>
 <td
 style={{
 padding:"10px",
 borderBottom:"1px solid #f1f5f9",
 textAlign:"right",
 }}
 >
 Rs.{""}
 {method.value.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </td>
 </tr>
 ))}
 {paymentData.length === 0 && (
 <tr>
 <td
 colSpan="2"
 style={{
 padding:"15px",
 textAlign:"center",
 color:"#64748b",
 }}
 >
 No payment data available
 </td>
 </tr>
 )}
 </tbody>
 </table>

 <div
 style={{
 textAlign:"center",
 marginTop:"40px",
 fontSize:"12px",
 color:"#94a3b8",
 }}
 >
  <p>This is a system generated report. No signature required.</p>
  </div>
  </div>
  );

  const renderEODReport = () => (
    <div key="eod-report" className="w-full max-w-[800px] mx-auto p-8 font-sans text-slate-900 bg-white">
      {/* Header Section */}
      <div className="text-center mb-8 pb-6 border-b-2 border-slate-200">
        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">मिठ्ठो चिया & Tiffin घर</h1>
        <h2 className="text-xl font-bold text-slate-600 uppercase tracking-widest mb-1">End of Day Summary (Z-Report)</h2>
        <p className="text-sm font-medium text-slate-400">Date: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-8">
        {/* Sales Summary */}
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">Sales Summary</h3>
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr>
                <td className="py-3 font-semibold border-b border-slate-50 text-slate-600">Total Revenue Today</td>
                <td className="py-3 text-right font-black text-lg border-b border-slate-50 text-slate-900">Rs. {eodMetrics.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold border-b border-slate-50 text-slate-600">Total Orders Today</td>
                <td className="py-3 text-right font-bold border-b border-slate-50 text-slate-900">{eodMetrics.ordersCount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Breakdown */}
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">Payment Breakdown</h3>
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr>
                <td className="py-2.5 font-medium border-b border-slate-50 text-slate-600">Cash</td>
                <td className="py-2.5 text-right font-bold border-b border-slate-50 text-slate-900">Rs. {eodMetrics.cash.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium border-b border-slate-50 text-slate-600">Card</td>
                <td className="py-2.5 text-right font-bold border-b border-slate-50 text-slate-900">Rs. {eodMetrics.card.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium border-b border-slate-50 text-slate-600">eSewa</td>
                <td className="py-2.5 text-right font-bold border-b border-slate-50 text-slate-900">Rs. {eodMetrics.esewa.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium border-b border-slate-50 text-slate-600">Khalti</td>
                <td className="py-2.5 text-right font-bold border-b border-slate-50 text-slate-900">Rs. {eodMetrics.khalti.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Expected Drawer */}
      <div className="mt-10 p-6 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center" style={{ WebkitPrintColorAdjust: 'exact' }}>
        <span className="font-bold text-lg text-slate-700 uppercase tracking-wider">Expected Cash in Drawer:</span>
        <span className="font-black text-2xl text-emerald-600">Rs. {eodMetrics.cash.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </div>

      {/* Footer / Signature Block */}
      <div className="mt-24 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-sm text-slate-800">
        <div>
          <div className="w-48 border-b-2 border-slate-400 mb-2"></div>
          <p className="font-bold uppercase tracking-wider">Approved By</p>
          <p className="text-xs text-slate-500 mt-1">Manager / Administrator</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="w-48 border-b-2 border-slate-400 mb-2"></div>
          <p className="font-bold uppercase tracking-wider">{user?.name || user?.username || "Cashier"}</p>
          <p className="text-xs text-slate-500 mt-1">{user?.role || "Cashier"}</p>
        </div>
      </div>
      <div className="text-center mt-12 text-xs font-semibold text-slate-400 uppercase tracking-widest">
        <p className="opacity-50">Generated securely by Restaurant POS</p>
      </div>
    </div>
  );

 return (
 <div className="sales-history-page p-6 md:p-8 bg-slate-50 min-h-screen text-slate-800 font-sans">
 {/* DYNAMIC SMART PRINT-ONLY STYLES */}
 <style>
 {`
 @media print {
 ${
 printMode ==="ledger" || printMode ==="summary" || printMode ==="eod"
 ? `
  @page { margin: 0; size: auto; }
  html, body { 
    width: 100% !important; 
    background: #fff !important; 
    margin: 0 !important; 
    padding: 15mm !important; 
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .sidebar, .navbar, header, footer { display: none !important; }
  .sales-history-page > *:not(.print-container) { display: none !important; }
  .sales-history-page { padding: 0 !important; margin: 0 !important; background: transparent !important; }
  .print-container { 
    position: relative !important; 
    width: 100% !important; 
    margin: 0 !important; 
    padding: 0 !important; 
    display: block !important; 
    z-index: 99999; 
    box-shadow: none !important;
    border: none !important;
  }
  
  /* Print Typography & Spacing Optimization */
  .print-container table { width: 100%; border-collapse: collapse; page-break-inside: auto; text-align: left; }
  .print-container tr { page-break-inside: avoid; page-break-after: auto; }
  .print-container th, .print-container td { border-bottom: 1px solid #e2e8f0; padding: 10px 12px; font-size: 13px; }
  .print-container th { font-weight: bold; color: #475569; background-color: #f8fafc; }
  .print-container h2 { font-size: 24px !important; }
  .print-container h3, .print-container .text-4xl { font-size: 18px !important; }
  .print-container .text-3xl { font-size: 16px !important; }
  .print-container .p-8, .print-container .p-6, .print-container .p-5 { padding: 12px !important; }
  .print-container .mb-8 { margin-bottom: 16px !important; }
  .print-container .mt-8 { margin-top: 16px !important; }
  `
 : `
 @page { margin: 0; size: 80mm auto; }
 html, body { width: 80mm !important; background: #fff !important; margin: 0 !important; padding: 0 !important; }
 .sidebar, .navbar, header, footer { display: none !important; }
 .sales-history-page > *:not(.print-container) { display: none !important; }
 .sales-history-page { padding: 0 !important; margin: 0 !important; background: transparent !important; }
 .print-container { position: absolute !important; left: 0 !important; top: 0 !important; width: 80mm !important; margin: 0 !important; padding: 5mm !important; font-family:'Courier New', monospace; color: #000; font-size: 12px; background: #fff; display: block !important; z-index: 99999; }
 `
 }
 }
 @media screen {
 .print-container { display: none; }
 }
 `}
 </style>

 {/* HEADER */}
 <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 print:hidden">
 <div>
 <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
 {viewMode ==="ledger" &&"Sales Ledger"}
 {viewMode ==="invoices" &&"Invoices"}
 {viewMode ==="payments" &&"Payments History"}
 {viewMode ==="eod" &&"End of Day"}
 </h1>
 <p className="text-slate-500 text-sm mt-1">
 {viewMode ==="ledger" &&
"Unified Ledger: Sales, Payments & Custom Invoices"}
 {viewMode ==="invoices" &&
"Manage all generated bills and pending invoices"}
 {viewMode ==="payments" &&
"View all completed and settled transactions"}
 {viewMode ==="eod" &&
"Review today's total payments and shift metrics"}
 </p>
 </div>
 <div className="flex flex-wrap items-center gap-3">
 <style>{`
 .react-datepicker-wrapper { width: 100%; display: block; }
 .react-datepicker__input-container { display: block; }
 .react-datepicker__close-icon { padding: 0; right: 0; }
 .react-datepicker__close-icon::after { background-color: #f1f5f9; color: #64748b; font-size: 16px; height: 22px; width: 22px; line-height: 20px; border-radius: 6px; transition: all 0.2s ease; }
 .react-datepicker__close-icon:hover::after { background-color: #fee2e2; color: #ef4444; }
 `}</style>
 <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm hover:border-indigo-300 transition-all w-full max-w-[260px] relative z-10">
 <Calendar size={16} className="text-indigo-500 flex-shrink-0" />
 <DatePicker
 selectsRange={true}
 startDate={startDate}
 endDate={endDate}
 onChange={(update) => setDateRange(update)}
 isClearable={true}
 placeholderText="Filter by date range..."
 className="w-full bg-transparent outline-none cursor-pointer text-sm text-slate-700 font-bold placeholder:text-slate-400 placeholder:font-medium"
 dateFormat="MMM d, yyyy"
 maxDate={new Date()}
 />
 </div>
 <div className="relative" ref={exportMenuRef}>
 <button
 onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
 disabled={isExporting}
 className="bg-white border border-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition shadow-sm text-sm"
 >
 <Download size={16} />{""}
 {isExporting
 ?"Exporting..."
 : selectedTxns.length > 0
 ? `Export (${selectedTxns.length})`
 :"Export"}
 </button>
 {isExportMenuOpen && (
 <div className="absolute top-full right-0 mt-2 bg-white border border-slate-100 shadow-md rounded-xl w-56 z-50 overflow-hidden text-left animate-slide-in">
 {selectedTxns.length > 0 ? (
 <>
 <button
 onClick={() => {
 setIsExportMenuOpen(false);
 handlePrintBatch();
 }}
 className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors border-b border-slate-50"
 >
 <Printer size={16} className="text-emerald-500" /> Print
 Selected Receipts
 </button>
 <button
 onClick={() => {
 setIsExportMenuOpen(false);
 handleExportCSV();
 }}
 className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
 >
 <FileText size={16} className="text-blue-500" /> Download
 Selected CSV
 </button>
 </>
 ) : (
 <>
 <button
 onClick={() => {
 setIsExportMenuOpen(false);
 handlePrintSummary();
 }}
 className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors border-b border-slate-50"
 >
 <Printer size={16} className="text-indigo-500" /> Print
 Summary Report
 </button>
 <button
 onClick={() => {
 setIsExportMenuOpen(false);
 handlePrintLedger();
 }}
 className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors border-b border-slate-50"
 >
 <Printer size={16} className="text-emerald-500" /> Print
 Ledger Page
 </button>
 <button
 onClick={() => {
 setIsExportMenuOpen(false);
 handleExportCSV();
 }}
 className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
 >
 <FileText size={16} className="text-blue-500" /> Download
 CSV (All)
 </button>
 </>
 )}
 </div>
 )}
 </div>
 <button
 onClick={() => setIsNewInvoiceOpen(true)}
 className="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition shadow-sm text-sm"
 >
 <Plus size={16} /> Custom Invoice
 </button>
 </div>
 </div>

 {/* UNIFIED VIEW SWITCHER TABS */}
 <div className="flex gap-2 mb-8 mt-6 overflow-x-auto scrollbar-hide print:hidden">
 {[
 { mode:"ledger", label:"Sales Ledger", icon: TrendingUp, color:"emerald" },
 { mode:"invoices", label:"Invoices", icon: FileText, color:"blue" },
 { mode:"payments", label:"Payments", icon: CreditCard, color:"indigo" },
 { mode:"eod", label:"End of Day", icon: DollarSign, color:"amber" },
 ].map((tab) => {
 const Icon = tab.icon;
 const isActive = viewMode === tab.mode;
 const colorMap = {
 emerald: { active:"bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100", icon:"text-emerald-500" },
 blue: { active:"bg-blue-50 text-blue-700 border-blue-200 ring-blue-100", icon:"text-blue-500" },
 indigo: { active:"bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-100", icon:"text-indigo-500" },
 amber: { active:"bg-amber-50 text-amber-700 border-amber-200 ring-amber-100", icon:"text-amber-500" },
 };
 const colors = colorMap[tab.color];
 return (
 <button
 key={tab.mode}
 onClick={() => setViewMode(tab.mode)}
 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
 isActive
 ? `${colors.active} ring-2 shadow-sm`
 :"bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 hover:border-slate-300"
 }`}
 >
 <Icon size={16} className={isActive ? colors.icon :"text-slate-400"} />
 {tab.label}
 </button>
 );
 })}
 </div>

 {viewMode === "eod" ? (
 <div className="max-w-4xl mx-auto my-8 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
 <div className="text-center mb-8 pb-8 border-b border-slate-100">
 <h2 className="text-3xl font-black text-slate-900 mb-2">
 End of Day Report
 </h2>
 <p className="text-slate-500 font-medium">
 Business Date:{""}
 {new Date().toLocaleDateString("en-US", {
 weekday:"long",
 year:"numeric",
 month:"long",
 day:"numeric",
 })}
 </p>
 </div>

 <div className="grid grid-cols-2 gap-6 mb-8">
 <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
 <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">
 Total Revenue Today
 </span>
 <h3 className="text-4xl font-black text-slate-900 mt-2">
 Rs.{""}
 {eodMetrics.total.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </h3>
 </div>
 <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
 <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">
 Total Orders Today
 </span>
 <h3 className="text-4xl font-black text-slate-900 mt-2">
 {eodMetrics.ordersCount}
 </h3>
 </div>
 </div>

 <h3 className="text-lg font-bold text-slate-900 mb-4">
 Payment Breakdown
 </h3>
 <div className="space-y-3 mb-8">
 <div className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-xl shadow-sm">
 <div className="flex items-center gap-3">
 <span className="w-3.5 h-3.5 rounded-full bg-emerald-500"></span>
 <span className="font-bold text-slate-700">Cash Payments</span>
 </div>
 <span className="font-black text-lg text-slate-900">
 Rs.{""}
 {eodMetrics.cash.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </span>
 </div>
 <div className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-xl shadow-sm">
 <div className="flex items-center gap-3">
 <span className="w-3.5 h-3.5 rounded-full bg-blue-500"></span>
 <span className="font-bold text-slate-700">Card Payments</span>
 </div>
 <span className="font-black text-lg text-slate-900">
 Rs.{""}
 {eodMetrics.card.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </span>
 </div>
 <div className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-xl shadow-sm">
 <div className="flex items-center gap-3">
 <span className="w-3.5 h-3.5 rounded-full bg-green-500"></span>
 <span className="font-bold text-slate-700">eSewa</span>
 </div>
 <span className="font-black text-lg text-slate-900">
 Rs.{""}
 {eodMetrics.esewa.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </span>
 </div>
 <div className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-xl shadow-sm">
 <div className="flex items-center gap-3">
 <span className="w-3.5 h-3.5 rounded-full bg-indigo-500"></span>
 <span className="font-bold text-slate-700">Khalti</span>
 </div>
 <span className="font-black text-lg text-slate-900">
 Rs.{""}
 {eodMetrics.khalti.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </span>
 </div>
 </div>

 <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 flex justify-between items-center">
 <div>
 <h4 className="text-lg font-bold text-emerald-800">
 Expected Cash in Drawer
 </h4>
 <p className="text-sm text-emerald-600 font-medium mt-1">
 Sum of all cash payments processed today
 </p>
 </div>
 <span className="text-3xl font-black text-emerald-700">
 Rs.{""}
 {eodMetrics.cash.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </span>
 </div>

 <div className="mt-8">
 <h3 className="text-lg font-bold text-slate-900 mb-4">Today's Orders</h3>
 <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
 <table className="w-full text-left bg-white text-sm">
 <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
 <tr>
 <th className="p-4">Time</th>
 <th className="p-4">Order ID</th>
 <th className="p-4">Customer</th>
 <th className="p-4">Payment</th>
 <th className="p-4 text-right">Amount</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {eodMetrics.orders.map((order) => (
 <tr key={order._id || order.id}>
 <td className="p-4 text-slate-500 whitespace-nowrap">
 {order.timestamp ? new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
 </td>
 <td className="p-4 font-semibold text-slate-900">{(order._id || order.id).substring(0, 8)}...</td>
 <td className="p-4 text-slate-700">{order.customerName || "Walk-in"}</td>
 <td className="p-4">
 <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
 order.paymentMethod === 'Card' ? 'bg-blue-100 text-blue-700' :
 order.paymentMethod === 'eSewa' ? 'bg-green-100 text-green-700' :
 order.paymentMethod === 'Khalti' ? 'bg-indigo-100 text-indigo-700' :
 'bg-emerald-100 text-emerald-700'
 }`}>
 {order.paymentMethod || "Cash"}
 </span>
 </td>
 <td className="p-4 text-right font-black text-slate-900">
 Rs. {((order.amount || (order.items || []).reduce((sum, item) => sum + item.qty * (parseFloat(item.price) || 0), 0) + ((order.items || []).reduce((sum, item) => sum + item.qty * (parseFloat(item.price) || 0), 0) > 0 ? 50 : 0))).toLocaleString(undefined, { minimumFractionDigits: 2 })}
 </td>
 </tr>
 ))}
 {eodMetrics.orders.length === 0 && (
 <tr>
 <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">No orders completed today.</td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>

 <div className="mt-8 flex gap-4 print:hidden">
 <button
 onClick={() => {
 setPrintMode("eod");
 setTimeout(() => window.print(), 300);
 }}
 className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition shadow-md flex items-center justify-center gap-2"
 >
 <Printer size={18} /> Print End of Day Report
 </button>
 </div>
 </div>
 ) : (
 <>
 {/* METRICS GRID - View-specific styling */}
 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
 {(() => {
 const metricSets = {
 ledger: [
 { label:"Total Sales", value: `Rs. ${totalSalesAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: TrendingUp, bg:"bg-emerald-50", text:"text-emerald-600", border:"border-emerald-100" },
 { label:"Total Orders", value: completedSales.length, icon: ShoppingCart, bg:"bg-slate-50", text:"text-slate-600", border:"border-slate-100" },
 { label:"Items Sold", value: totalItemsSold, icon: Package, bg:"bg-amber-50", text:"text-amber-600", border:"border-amber-100" },
 { label:"Avg Order Value", value: `Rs. ${avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: CreditCard, bg:"bg-emerald-50", text:"text-emerald-600", border:"border-emerald-100" },
 ],
 invoices: [
 { label:"Invoices Generated", value: filteredData.length, icon: FileText, bg:"bg-blue-50", text:"text-blue-600", border:"border-blue-100" },
 { label:"Pending Invoices", value: filteredData.filter(t => t.status !=="Completed" && t.status !=="Cancelled").length, icon: Clock, bg:"bg-amber-50", text:"text-amber-600", border:"border-amber-100" },
 { label:"Paid Invoices", value: filteredData.filter(t => t.status ==="Completed").length, icon: CheckCircle, bg:"bg-emerald-50", text:"text-emerald-600", border:"border-emerald-100" },
 { label:"Total Invoiced", value: `Rs. ${totalSalesAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: Receipt, bg:"bg-blue-50", text:"text-blue-600", border:"border-blue-100" },
 ],
 payments: [
 { label:"Total Collected", value: `Rs. ${totalSalesAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign, bg:"bg-indigo-50", text:"text-indigo-600", border:"border-indigo-100" },
 { label:"Settled Payments", value: completedSales.length, icon: CheckCircle, bg:"bg-emerald-50", text:"text-emerald-600", border:"border-emerald-100" },
 { label:"Cash Received", value: `Rs. ${completedSales.filter(s => !s.paymentMethod || s.paymentMethod ==="Cash").reduce((sum, s) => sum + (s.amount || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: Receipt, bg:"bg-amber-50", text:"text-amber-600", border:"border-amber-100" },
 { label:"Digital Payments", value: `Rs. ${completedSales.filter(s => s.paymentMethod && s.paymentMethod !=="Cash").reduce((sum, s) => sum + (s.amount || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: CreditCard, bg:"bg-indigo-50", text:"text-indigo-600", border:"border-indigo-100" },
 ],
 };
 const cards = metricSets[viewMode] || metricSets.ledger;
 return cards.map((card) => {
 const Icon = card.icon;
 return (
 <div key={card.label} className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all">
 <div className={`w-14 h-14 rounded-xl ${card.bg} flex items-center justify-center ${card.text} shadow-inner border ${card.border}`}>
 <Icon size={24} strokeWidth={2.5} />
 </div>
 <div>
 <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
 {card.label}
 </h4>
 <h2 className="text-2xl font-black text-slate-900 leading-none truncate">
 {card.value}
 </h2>
 </div>
 </div>
 );
 });
 })()}
 </div>

 {/* UNIFIED WORKSPACE */}
 <div className="flex flex-col xl:flex-row gap-6">
 {/* LEFT COLUMN: HISTORY LIST */}
 <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
 <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center bg-slate-50/50 print:hidden">
 <div className="relative w-full md:max-w-xs shrink-0">
 <Search
 size={16}
 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
 />
 <input
 id="searchLedger"
 name="searchLedger"
 type="text"
 placeholder="Search ID or Customer..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-400 shadow-sm"
 />
 </div>
 <select
 id="paymentFilter"
 name="paymentFilter"
 value={paymentFilter}
 onChange={(e) => setPaymentFilter(e.target.value)}
 className="w-full md:w-auto px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-400 transition-all shadow-sm"
 >
 <option value="All">All Methods</option>
 {activePaymentMethods.map(method => (
 <option key={method} value={method}>{method}</option>
 ))}
 </select>
 <select
 id="statusFilter"
 name="statusFilter"
 value={activeTab}
 onChange={(e) => setActiveTab(e.target.value)}
 className="w-full md:w-auto px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-400 transition-all shadow-sm"
 >
 <option value="All">All Status</option>
 {viewMode ==="invoices" && (
 <option value="Pending">Pending</option>
 )}
 <option value="Completed">Completed</option>
 <option value="Cancelled">Cancelled</option>
 </select>
 </div>

 <div className="overflow-x-auto min-h-[400px]">
 <table className="w-full text-left border-collapse">
 <thead className="bg-white text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-100">
 <tr>
 <th className="p-4 pl-6">Transaction</th>
 <th className="p-4">Customer</th>
 <th className="p-4 text-center">Items</th>
 <th className="p-4 text-center">Payment</th>
 <th className="p-4 text-right">Amount</th>
 <th className="p-4 text-center">Status</th>
 <th className="p-4 pr-6 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-sm">
 {paginatedData.length > 0 ? (
 paginatedData.map((sale) => (
 <tr
 key={sale.id}
 className="hover:bg-slate-50/50 transition-colors"
 >
 <td className="p-4 pl-6">
 <div className="font-bold text-slate-900 flex items-center gap-1.5">
 <Receipt size={14} className="text-indigo-500" />{""}
 {sale.transactionId}
 </div>
 <div className="text-xs text-slate-500 font-medium mt-0.5">
 {sale.time ||"N/A"}
 </div>
 </td>
 <td className="p-4">
 <div className="font-semibold text-slate-800 flex items-center gap-1.5">
 <User size={13} className="text-slate-400" />{""}
 {sale.customer ||"Walk-in"}
 </div>
 <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
 <Table2 size={13} className="text-slate-400" />{""}
 {sale.channel ||"Dining"}
 </div>
 </td>
 <td className="p-4 text-center">
 <div className="font-bold text-slate-700">
 {sale.itemCount}
 </div>
 <div className="text-[10px] text-slate-400 truncate w-24 mx-auto">
 {sale.items.map((i) => i.name).join(",")}
 </div>
 </td>
 <td className="p-4 text-center">
 <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm flex items-center gap-1.5 w-max mx-auto">
 <CreditCard
 size={12}
 className="text-slate-400"
 />{""}
 {sale.paymentMethod ||"Cash"}
 </span>
 </td>
 <td className="p-4 text-right font-black text-emerald-600 text-base">
 Rs.{""}
 {sale.totalAmount.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </td>
 <td className="p-4 text-center">
 <span
 className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-max mx-auto ${
 sale.status ==="Completed"
 ?"bg-emerald-50 text-emerald-600 border border-emerald-100"
 : sale.status ==="Cancelled"
 ?"bg-rose-50 text-rose-600 border border-rose-100"
 :"bg-amber-50 text-amber-600 border border-amber-100"
 }`}
 >
 {sale.status ==="Completed" ? (
 <CheckCircle size={10} />
 ) : sale.status ==="Cancelled" ? (
 <XCircle size={10} />
 ) : (
 <Clock size={10} />
 )}
 {sale.status}
 </span>
 </td>
 <td className="p-4 pr-6 text-right">
 <div className="flex gap-2 justify-end">
 <button
 className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 flex items-center justify-center transition-all shadow-sm"
 onClick={() => setSelectedInvoice(sale)}
 title="View Details"
 >
 <Eye size={16} />
 </button>
 <button
 className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 flex items-center justify-center transition-all shadow-sm"
 onClick={() => handlePrintSingle(sale)}
 title="Print Receipt"
 >
 <Printer size={16} />
 </button>
 </div>
 </td>
 </tr>
 ))
 ) : (
 <tr>
 <td
 colSpan="7"
 className="p-12 text-center text-slate-500 font-medium"
 >
 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
 <Receipt size={24} className="text-slate-300" />
 </div>
 No transactions found matching your criteria.
 </td>
 </tr>
 )}
 </tbody>
 </table>

 {paginatedData.length < filteredData.length && (
 <div className="p-4 border-t border-slate-100 bg-slate-50/50 print:hidden">
 <button
 className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-all text-sm"
 onClick={() => setCurrentPage((p) => p + 1)}
 >
 Load More Transactions
 </button>
 </div>
 )}
 </div>
 </div>

 {/* RIGHT COLUMN: OVERVIEW CHARTS */}
 <div className="w-full xl:w-[340px] shrink-0 flex flex-col gap-6 print:hidden">
 <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
 <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">
 Sales by Payment Method
 </h3>
 <div className="flex flex-col items-center">
 <div className="relative h-[200px] w-[200px] mb-6 min-w-0 min-h-[200px]">
 <ResponsiveContainer width="99%" height="100%">
 <PieChart>
 <Pie
 data={
 paymentData.length > 0
 ? paymentData
 : [
 {
 name:"No Data",
 value: 1,
 color:"#e2e8f0",
 },
 ]
 }
 cx="50%"
 cy="50%"
 innerRadius={65}
 outerRadius={90}
 paddingAngle={5}
 dataKey="value"
 stroke="none"
 >
 {(paymentData.length > 0
 ? paymentData
 : [{ name:"No Data", value: 1, color:"#e2e8f0" }]
 ).map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.color} />
 ))}
 </Pie>
 <Tooltip content={<CustomTooltip />} />
 </PieChart>
 </ResponsiveContainer>
 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
 Total
 </span>
 <span className="text-xl font-black text-slate-900 mt-0.5">
 {totalSalesAmount > 1000
 ? (totalSalesAmount / 1000).toFixed(1) +"k"
 : totalSalesAmount}
 </span>
 </div>
 </div>
 <div className="flex flex-col gap-3 w-full">
 {paymentData.map((method, idx) => (
 <div
 key={idx}
 className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50"
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
 ? (
 (method.value / totalSalesAmount) *
 100
 ).toFixed(1)
 : 0}
 %
 </span>
 </div>
 </div>
 ))}
 {paymentData.length === 0 && (
 <span className="text-sm text-slate-400 font-medium text-center py-4 bg-slate-50 rounded-xl border border-slate-100">
 No sales data yet
 </span>
 )}
 </div>
 </div>
 </div>

 <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
 <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
 Sales Summary
 </h3>
 <div className="space-y-4">
 <div className="flex justify-between items-center pb-4 border-b border-slate-100">
 <span className="text-xs font-bold text-slate-500 uppercase">
 Total Sales
 </span>
 <strong className="text-sm font-black text-slate-900">
 Rs.{""}
 {totalSalesAmount.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </strong>
 </div>
 <div className="flex justify-between items-center pb-4 border-b border-slate-100">
 <span className="text-xs font-bold text-slate-500 uppercase">
 Total Orders
 </span>
 <strong className="text-sm font-black text-slate-900">
 {completedSales.length}
 </strong>
 </div>
 <div className="flex justify-between items-center pb-4 border-b border-slate-100">
 <span className="text-xs font-bold text-slate-500 uppercase">
 Total Items Sold
 </span>
 <strong className="text-sm font-black text-slate-900">
 {totalItemsSold}
 </strong>
 </div>
 <div className="flex justify-between items-center pb-4 border-b border-slate-100">
 <span className="text-xs font-bold text-slate-500 uppercase">
 Avg Order Value
 </span>
 <strong className="text-sm font-black text-slate-900">
 Rs.{""}
 {avgOrderValue.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </strong>
 </div>
 <div className="flex justify-between items-center pb-4 border-b border-slate-100">
 <span className="text-xs font-bold text-slate-500 uppercase">
 Highest Sale
 </span>
 <strong className="text-sm font-black text-emerald-600">
 Rs.{""}
 {highestSale.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </strong>
 </div>
 <div className="flex justify-between items-center">
 <span className="text-xs font-bold text-slate-500 uppercase">
 Lowest Sale
 </span>
 <strong className="text-sm font-black text-rose-500">
 Rs.{""}
 {lowestSale.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </strong>
 </div>
 </div>
 </div>
 </div>
 </div>
 </>
 )}

 {/* INVOICE PREVIEW MODAL */}
 {selectedInvoice && (
 <div
 className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity"
 onClick={() => setSelectedInvoice(null)}
 >
 <div
 className="bg-white rounded-xl shadow-md w-full max-w-lg overflow-hidden animate-slide-in flex flex-col max-h-[90vh]"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
 <h2 className="text-lg font-black text-slate-900">
 Receipt Details
 </h2>
 <button
 onClick={() => setSelectedInvoice(null)}
 className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition"
 >
 <X size={16} />
 </button>
 </div>

 <div className="p-6 overflow-y-auto">
 <div className="grid grid-cols-2 gap-4 mb-6">
 <div>
 <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
 Transaction ID
 </span>
 <span className="font-bold text-slate-900">
 {selectedInvoice.transactionId}
 </span>
 </div>
 <div>
 <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
 Date & Time
 </span>
 <span className="font-bold text-slate-900">
 {selectedInvoice.date} {selectedInvoice.time}
 </span>
 </div>
 <div>
 <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
 Customer
 </span>
 <span className="font-bold text-slate-900">
 {selectedInvoice.customer ||"Walk-in"}
 </span>
 </div>
 <div>
 <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
 Payment Method
 </span>
 <span className="font-bold text-slate-900">
 {selectedInvoice.paymentMethod ||"Cash"}
 </span>
 </div>
 </div>

 <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
 Itemized Breakdown
 </h4>
 <table className="w-full text-left border-collapse mb-6">
 <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
 <tr>
 <th className="p-3 border-b border-slate-100 rounded-tl-lg">
 Item
 </th>
 <th className="p-3 border-b border-slate-100 text-center">
 Qty
 </th>
 <th className="p-3 border-b border-slate-100 text-right">
 Price
 </th>
 <th className="p-3 border-b border-slate-100 text-right rounded-tr-lg">
 Total
 </th>
 </tr>
 </thead>
 <tbody className="text-sm divide-y divide-slate-50">
 {selectedInvoice.items?.map((item, idx) => (
 <tr key={idx}>
 <td className="p-3 font-medium text-slate-700">
 {item.name}
 </td>
 <td className="p-3 text-center">{item.qty}</td>
 <td className="p-3 text-right">
 Rs. {parseFloat(item.price || 0).toFixed(2)}
 </td>
 <td className="p-3 text-right font-bold">
 Rs.{""}
 {(item.qty * parseFloat(item.price || 0)).toFixed(2)}
 </td>
 </tr>
 ))}
 </tbody>
 </table>

 <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
 <span className="font-bold text-slate-600 uppercase tracking-wider text-xs">
 Grand Total
 </span>
 <span className="text-xl font-black text-indigo-600">
 Rs.{""}
 {selectedInvoice.totalAmount.toLocaleString(undefined, {
 minimumFractionDigits: 2,
 })}
 </span>
 </div>
 </div>

 <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-3">
 <button
 onClick={() => handlePrintSingle(selectedInvoice)}
 className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition shadow-md flex justify-center items-center gap-2"
 >
 <Printer size={18} /> Print Receipt
 </button>
 </div>
 </div>
 </div>
 )}

 {/* THERMAL PRINTER RECEIPT BATCH LAYOUT */}
 <div className="print-container">
 {printMode ==="single" &&
 selectedInvoice &&
 renderReceipt(selectedInvoice)}
 {printMode ==="batch" &&
 filteredData
 .filter((t) => selectedTxns.includes(t.transactionId))
 .map(renderReceipt)}
 {printMode ==="summary" && renderSummaryReport()}
 {printMode ==="eod" && renderEODReport()}
 </div>

 {/* CREATE NEW INVOICE MODAL */}
 {isNewInvoiceOpen && (
 <div
 className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity"
 onClick={() => setIsNewInvoiceOpen(false)}
 >
 <div
 className="bg-white rounded-xl shadow-md w-full max-w-2xl overflow-hidden animate-slide-in flex flex-col"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
 <h2 className="text-lg font-black text-slate-900">
 Create Custom Invoice
 </h2>
 <button
 onClick={() => setIsNewInvoiceOpen(false)}
 className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition"
 >
 <X size={16} />
 </button>
 </div>

 <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
 <div className="flex gap-4">
 <div className="flex-1">
 <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase">
 Customer Name
 </label>
 <input
 id="customInvoiceCustomer"
 name="customInvoiceCustomer"
 type="text"
 value={newInvoiceData.customer}
 onChange={(e) =>
 setNewInvoiceData({
 ...newInvoiceData,
 customer: e.target.value,
 })
 }
 className="w-full rounded-lg border border-slate-200 text-sm p-2 outline-none focus:border-indigo-400"
 placeholder="Walk-in Customer"
 />
 </div>
 <div className="flex-1">
 <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase">
 Payment Method
 </label>
 <select
 id="customInvoiceMethod"
 name="customInvoiceMethod"
 value={newInvoiceData.method}
 onChange={(e) =>
 setNewInvoiceData({
 ...newInvoiceData,
 method: e.target.value,
 })
 }
 className="w-full rounded-lg border border-slate-200 text-sm p-2 outline-none focus:border-indigo-400"
 >
 {activePaymentMethods.map(method => (
 <option key={method} value={method}>{method}</option>
 ))}
 </select>
 </div>
 </div>

 <div>
 <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase">
 Add Items
 </label>
 <div className="flex gap-2 mb-4">
 <input
 id="newItemName"
 name="newItemName"
 type="text"
 placeholder="Item Name"
 value={newItemInput.name}
 onChange={(e) =>
 setNewItemInput({ ...newItemInput, name: e.target.value })
 }
 className="flex-2 w-full rounded-lg border border-slate-200 text-sm p-2 outline-none focus:border-indigo-400"
 />
 <input
 id="newItemQty"
 name="newItemQty"
 type="number"
 placeholder="Qty"
 min="1"
 value={newItemInput.qty ||""}
 onChange={(e) =>
 setNewItemInput({
 ...newItemInput,
 qty: parseInt(e.target.value) || 0,
 })
 }
 className="flex-1 w-20 rounded-lg border border-slate-200 text-sm p-2 outline-none focus:border-indigo-400"
 />
 <input
 id="newItemPrice"
 name="newItemPrice"
 type="number"
 placeholder="Price"
 min="0"
 value={newItemInput.price === 0 ?"" : newItemInput.price}
 onChange={(e) =>
 setNewItemInput({
 ...newItemInput,
 price: parseFloat(e.target.value) || 0,
 })
 }
 className="flex-1 w-24 rounded-lg border border-slate-200 text-sm p-2 outline-none focus:border-indigo-400"
 />
 <button
 onClick={handleAddNewItem}
 className="bg-slate-100 border border-slate-200 text-slate-700 font-bold px-4 rounded-lg hover:bg-slate-200 transition"
 >
 Add
 </button>
 </div>

 <div className="border border-slate-200 rounded-lg overflow-hidden">
 <table className="w-full text-left">
 <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
 <tr>
 <th className="p-2 pl-3">Item</th>
 <th className="p-2 text-center">Qty</th>
 <th className="p-2 text-right">Price</th>
 <th className="p-2 text-center"></th>
 </tr>
 </thead>
 <tbody className="text-sm divide-y divide-slate-100">
 {newInvoiceData.items.map((item, idx) => (
 <tr key={idx}>
 <td className="p-2 pl-3">{item.name}</td>
 <td className="p-2 text-center">{item.qty}</td>
 <td className="p-2 text-right">
 Rs. {item.price.toFixed(2)}
 </td>
 <td className="p-2 text-center">
 <button
 onClick={() => {
 const newItems = [...newInvoiceData.items];
 newItems.splice(idx, 1);
 setNewInvoiceData({
 ...newInvoiceData,
 items: newItems,
 });
 }}
 className="text-rose-500 hover:text-rose-700 transition"
 >
 <Trash2 size={16} />
 </button>
 </td>
 </tr>
 ))}
 {newInvoiceData.items.length === 0 && (
 <tr>
 <td
 colSpan="4"
 className="p-6 text-center text-slate-400"
 >
 No items added yet.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
 <div className="text-lg font-black text-slate-900">
 Total: Rs.{""}
 {newInvoiceData.items
 .reduce((sum, i) => sum + i.qty * i.price, 0)
 .toFixed(2)}
 </div>
 <button
 onClick={handleCreateInvoice}
 className="bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-emerald-600 transition shadow-md flex items-center gap-2"
 >
 <CheckCircle size={18} /> Create & Settle
 </button>
 </div>
 </div>
 </div>
 )}

 {/* LEDGER PRINT CONTAINER */}
 {printMode === "ledger" && (
    <div className="print-container bg-white p-8">
      <div className="text-center mb-6 border-b border-slate-200 pb-6">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Sales Ledger Report</h2>
        <p className="text-slate-500 font-medium mt-1">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
        <p className="text-slate-700 font-bold mt-3 bg-slate-50 inline-block px-4 py-1.5 rounded-full border border-slate-100">
          Date Filter: {startDate ? new Date(startDate).toLocaleDateString() : "All-Time"} to {endDate ? new Date(endDate).toLocaleDateString() : "All-Time"}
        </p>
      </div>
      
      <div className="flex justify-between items-center bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
        <div>
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Transactions</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{filteredData.length}</p>
        </div>
        <div className="text-right">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Ledger Value</span>
          <p className="text-2xl font-black text-slate-900 mt-1">Rs. {totalSalesAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th>Txn ID</th>
            <th>Date & Time</th>
            <th>Customer</th>
            <th>Method</th>
            <th className="text-right">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((sale) => (
            <tr key={sale.id}>
              <td className="font-semibold text-slate-900">{sale.transactionId}</td>
              <td className="text-slate-600">{sale.date} <span className="text-slate-400 ml-1">{sale.time}</span></td>
              <td className="text-slate-800">{sale.customer || "Walk-in"}</td>
              <td className="text-slate-600">{sale.paymentMethod || "Cash"}</td>
              <td className="text-right font-bold text-slate-900">Rs. {sale.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
          {filteredData.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-8 text-slate-400">No transactions found for the selected dates.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-400 font-medium">
        End of Ledger Report. System generated document.
      </div>
    </div>
  )}

 </div>
 );
}
