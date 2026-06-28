import { useMemo, useState, useEffect, useRef } from"react";
import { useLocation, useNavigate } from "react-router-dom";
import {
 Banknote,
 CalendarDays,
 CheckCircle,
 ChefHat,
 Clock,
 Coins,
 CreditCard,
 Filter,
 Percent,
 Printer,
 Receipt,
 Search,
 Smartphone,
 Table2,
 User,
 Wallet,
 X,
 XCircle,
 Hourglass,
 Utensils,
 FileText,
} from"lucide-react";
import { useOrders } from"../../context/OrderContext";
import { useTables } from"../../context/TableContext";
import apiClient from"../../api/apiClient";
import { io } from"socket.io-client";

// IMPORTANT: Ensure this path is correct for your project structure
import"../../styles/pendingBills.css";

const filters = ["All","Pending","Cooking","Ready","Served"];

export default function PendingBillsPage() {
 const location = useLocation();
 const navigate = useNavigate();
 const autoOpened = useRef(false);

 const {
 orders = [],
 completeOrder,
 cancelOrder,
 fetchOrders,
 } = useOrders() || {};
 const {
 tables = [],
 editTable,
 updateTableStatus,
 fetchTables,
 } = useTables() || {};

 useEffect(() => {
 if (fetchOrders) fetchOrders();
 if (fetchTables) fetchTables();
 }, [fetchOrders, fetchTables]);

 // Dynamically generate pending bills from live global orders
 const pendingBillsData = useMemo(() => {
 const activeOrders = orders.filter(
 (order) => order.status !=="Completed" && order.status !=="Cancelled"
 ); // Only show unpaid and active orders
 const grouped = {};

 activeOrders.forEach((order) => {
 const isTable =
 order.table && order.table !=="Walk-in" && order.table !=="Queue";
 const key = isTable ? order.table : order.id; // Group by table if seated, else by ID

 if (!grouped[key]) {
 grouped[key] = {
 id: key,
 orderIds: [order.id],
 table: order.table ||"Walk-in",
 customer: order.customer ||"Guest",
 server: order.server ||"System",
 subtotal: 0,
 paymentStatus:"Unpaid",
 statuses: [order.status],
 priority: order.priority ||"Normal",
 guests: order.guests || 1,
 time:
 order.time ||
 new Date().toLocaleTimeString([], {
 hour:"2-digit",
 minute:"2-digit",
 }),
 date: order.date || new Date().toLocaleDateString(),
 section: order.channel ||"Dining",
 items: [],
 };
 } else {
 grouped[key].orderIds.push(order.id);
 grouped[key].statuses.push(order.status);
 }

 const orderSubtotal = (order.items || []).reduce(
 (acc, item) => acc + item.qty * (parseFloat(item.price) || 0),
 0
 );
 grouped[key].subtotal += orderSubtotal;

 // Merge identical items
 (order.items || []).forEach((item) => {
 const existingItem = grouped[key].items.find(
 (i) => i.name === item.name && i.price === item.price
 );
 if (existingItem) {
 existingItem.qty += item.qty;
 } else {
 grouped[key].items.push({ ...item });
 }
 });
 });

 return Object.values(grouped).map((group) => {
 // Determine highest priority kitchen status across merged orders
 let overallStatus ="Served";
 if (group.statuses.includes("Pending")) overallStatus ="Pending";
 else if (group.statuses.includes("Cooking")) overallStatus ="Cooking";
 else if (group.statuses.includes("Ready")) overallStatus ="Ready";

 return {
 ...group,
 amount: group.subtotal,
 kitchenStatus: overallStatus,
 };
 });
 }, [orders]);

 const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
 const [paymentMethod, setPaymentMethod] = useState("Cash");
 const [discountType, setDiscountType] = useState("percentage");
 const [discountValue, setDiscountValue] = useState(0);
 const [serviceCharge, setServiceCharge] = useState(0);
 const [activeFilter, setActiveFilter] = useState("All");
 const [searchTerm, setSearchTerm] = useState("");
 const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
 const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
 const [activePaymentMethods, setActivePaymentMethods] = useState([]);

 // Helper to parse payment methods from settings data
 const applyPaymentMethods = (data) => {
 if (data && data.paymentMethods) {
 const newMethods = data.paymentMethods.filter(m => m.active).map(m => {
 let icon = CreditCard;
 if (m.name.toLowerCase().includes("cash")) icon = Banknote;
 else if (m.name.toLowerCase().includes("esewa") || m.name.toLowerCase().includes("fonepay") || m.name.toLowerCase().includes("qr")) icon = Smartphone;
 else if (m.name.toLowerCase().includes("khalti")) icon = Wallet;
 return { name: m.name, icon };
 });
 setActivePaymentMethods(newMethods);
 setPaymentMethod(prev => newMethods.find(m => m.name === prev) ? prev : (newMethods[0]?.name ||""));
 } else {
 const defaultMethods = [
 { name:"Cash", icon: Banknote },
 { name:"Credit/Debit Card", icon: CreditCard }
 ];
 setActivePaymentMethods(defaultMethods);
 setPaymentMethod(defaultMethods[0].name);
 }
 };

 // Load on mount
 useEffect(() => {
 const loadMethods = async () => {
 try {
 const { data } = await apiClient.get("/api/settings");
 applyPaymentMethods(data);
 } catch (err) {
 console.error("Failed to load payment methods from settings API", err);
 }
 };
 loadMethods();
 }, []);

 // Listen for real-time settings changes from admin
 useEffect(() => {
 const socket = io(import.meta.env.VITE_API_URL ||"http://localhost:5001");
 socket.on("settingsUpdated", (updatedSettings) => {
 applyPaymentMethods(updatedSettings);
 });
 return () => socket.disconnect();
 }, []);

 const selectedInvoice = pendingBillsData.find(
 (bill) => bill.id === selectedInvoiceId
 );

 const filteredBills = useMemo(() => {
 const term = searchTerm.trim().toLowerCase();

 return pendingBillsData.filter((bill) => {
 const matchesFilter =
 activeFilter ==="All" || bill.kitchenStatus === activeFilter;
 const matchesSearch =
 !term ||
 bill.id.toLowerCase().includes(term) ||
 bill.orderIds.some((id) => id.toLowerCase().includes(term)) ||
 bill.table.toLowerCase().includes(term) ||
 bill.customer.toLowerCase().includes(term);

 return matchesFilter && matchesSearch;
 });
 }, [activeFilter, searchTerm, pendingBillsData]);

 const metrics = useMemo(() => {
 const totalDue = pendingBillsData.reduce(
 (sum, bill) => sum + bill.amount,
 0
 );
 const unpaid = pendingBillsData.filter(
 (bill) => bill.paymentStatus ==="Unpaid"
 ).length;
 const partial = pendingBillsData.filter(
 (bill) => bill.paymentStatus ==="Partial"
 ).length;
 const largestBill =
 pendingBillsData.length > 0
 ? Math.max(...pendingBillsData.map((bill) => bill.amount))
 : 0;

 return { totalDue, unpaid, partial, largestBill };
 }, [pendingBillsData]);

 const subtotal = selectedInvoice
 ? selectedInvoice.items.reduce(
 (acc, item) => acc + item.qty * (parseFloat(item.price) || 0),
 0
 )
 : 0;

 const discountAmount = selectedInvoice
 ? discountType ==="percentage"
 ? subtotal * (Math.min(Math.max(discountValue || 0, 0), 100) / 100)
 : Math.min(Math.max(discountValue || 0, 0), subtotal)
 : 0;

 const safeServiceCharge = serviceCharge || 0;
 const total = subtotal - discountAmount + safeServiceCharge;

 // Auto-open invoice if redirected from another page (e.g., Table Management)
 useEffect(() => {
 if (location.state?.openTable && !autoOpened.current && pendingBillsData.length > 0) {
 const billToOpen = pendingBillsData.find(
 (b) => b.table === location.state.openTable
 );
 if (billToOpen) {
 handleSelectInvoice(billToOpen.id);
 autoOpened.current = true;
 }
 }
 }, [location.state, pendingBillsData]);

 const handleSelectInvoice = (billId) => {
 setSelectedInvoiceId(billId);
 setDiscountValue(0);
 setServiceCharge(0);
 setIsPaymentSuccess(false);
 };

 const handleFinalizePayment = (shouldPrint) => {
  setTimeout(() => {
  const tableObj = tables.find((t) => t.name === selectedInvoice.table);
  if (tableObj) {
  if (editTable) {
  editTable(tableObj._id || tableObj.id, {
  status:"Available",
  currentCustomer:"No Customer",
  reservationTime: null,
  });
  } else if (updateTableStatus) {
  updateTableStatus(
  tableObj._id || tableObj.id,
  "Available",
  "No Customer"
  );
  }
  } else {
  const match = selectedInvoice.table.match(/\d+/);
  if (match) {
  updateTableStatus(parseInt(match[0], 10),"Available","No Customer");
  }
  }

  try {
  const savedRes = localStorage.getItem("restaurant_reservations");
  if (savedRes) {
  let parsedRes = JSON.parse(savedRes);
  const filteredRes = parsedRes.filter(
  (r) => r.table !== selectedInvoice.table
  );
  if (filteredRes.length !== parsedRes.length) {
  localStorage.setItem(
  "restaurant_reservations",
  JSON.stringify(filteredRes)
  );
  window.dispatchEvent(new Event("storage"));
  }
  }
  } catch (e) {
  console.error("Failed to clear reservation:", e);
  }

  const finalDetails = {
  paymentMethod,
  discountAmount,
  serviceCharge: safeServiceCharge,
  amount: total,
  };

  if (selectedInvoice.orderIds) {
  const splitDetails = {
  ...finalDetails,
  amount: total / selectedInvoice.orderIds.length,
  discountAmount: discountAmount / selectedInvoice.orderIds.length,
  serviceCharge: safeServiceCharge / selectedInvoice.orderIds.length,
  };
  selectedInvoice.orderIds.forEach((id) =>
  completeOrder(id, splitDetails)
  );
  if (shouldPrint) {
  navigate(`/cashier/invoice/${encodeURIComponent(selectedInvoice.orderIds[0])}`);
  }
  } else {
  completeOrder(selectedInvoice.id, finalDetails);
  if (shouldPrint) {
  navigate(`/cashier/invoice/${encodeURIComponent(selectedInvoice.id)}`);
  }
  }

  setIsPaymentSuccess(false);
  setSelectedInvoiceId(null);

  setTimeout(() => {
  if (fetchOrders) fetchOrders();
  if (fetchTables) fetchTables();
  }, 500);
  }, 100);
  };

 const handleCancelBillClick = () => {
 setIsCancelConfirmOpen(true);
 };

 const executeCancelBill = () => {
 const tableObj = tables.find((t) => t.name === selectedInvoice.table);
 if (tableObj) {
 if (editTable) {
 editTable(tableObj._id || tableObj.id, {
 status:"Available",
 currentCustomer:"No Customer",
 reservationTime: null,
 });
 } else if (updateTableStatus) {
 updateTableStatus(
 tableObj._id || tableObj.id,
"Available",
"No Customer"
 );
 }
 } else {
 const match = selectedInvoice.table.match(/\d+/);
 if (match) {
 updateTableStatus(parseInt(match[0], 10),"Available","No Customer");
 }
 }

 try {
 const savedRes = localStorage.getItem("restaurant_reservations");
 if (savedRes) {
 let parsedRes = JSON.parse(savedRes);
 const filteredRes = parsedRes.filter(
 (r) => r.table !== selectedInvoice.table
 );
 if (filteredRes.length !== parsedRes.length) {
 localStorage.setItem(
"restaurant_reservations",
 JSON.stringify(filteredRes)
 );
 window.dispatchEvent(new Event("storage"));
 }
 }
 } catch (e) {
 console.error("Failed to clear reservation:", e);
 }

 if (selectedInvoice.orderIds) {
 selectedInvoice.orderIds.forEach((id) => cancelOrder(id));
 } else {
 cancelOrder(selectedInvoice.id);
 }
 setIsCancelConfirmOpen(false);
 setSelectedInvoiceId(null);

 setTimeout(() => {
 if (fetchOrders) fetchOrders();
 if (fetchTables) fetchTables();
 }, 500);
 };

 return (
 <div className="pending-bills-modern p-4 sm:p-6 bg-slate-50 min-h-screen">
 {/* PRINT-ONLY STYLES */}
 <style>
 {`
 @media print {
 @page { margin: 0; size: 80mm auto; }
 html, body { width: 80mm !important; background: #fff !important; margin: 0 !important; padding: 0 !important; }
 .sidebar, .navbar, header, footer, .pending-shell, .checkout-popout-backdrop, .print-modal-hide { display: none !important; }
 .pending-bills-modern { padding: 0 !important; margin: 0 !important; background: transparent !important; }
 #printable-receipt { position: absolute !important; left: 0 !important; top: 0 !important; width: 80mm !important; margin: 0 !important; padding: 5mm !important; font-family:'Courier New', monospace; color: #000; font-size: 12px; background: #fff; display: block !important; z-index: 99999; }
 }
 @media screen {
 #printable-receipt { display: none; }
 }
 `}
 </style>

 <main className="pending-shell max-w-7xl mx-auto space-y-6">
 <section className="pending-hero flex flex-col md:flex-row md:items-end justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4">
 <div>
 <span className="pending-eyebrow flex items-center gap-2 text-sm font-bold text-purple-600 mb-2 uppercase tracking-wider">
 <Receipt size={16} />
 Cashier Checkout Desk
 </span>
 <h1 className="text-3xl font-black text-slate-900 mb-1">Pending Bills</h1>
 <p className="text-slate-500 font-medium">
 Settle open restaurant checks, apply discounts, and close tables faster.
 </p>
 </div>

 <div className="pending-hero-actions flex flex-wrap items-center gap-3">
 <div className="pending-search flex items-center bg-slate-100 rounded-xl px-4 py-2.5 gap-2 border border-slate-200/60 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-400 transition-all">
 <Search size={17} className="text-slate-400" />
 <input
 id="searchBills"
 name="searchBills"
 value={searchTerm}
 onChange={(event) => setSearchTerm(event.target.value)}
 placeholder="Search table or guest..."
 className="bg-transparent border-none outline-none text-sm font-medium w-full min-w-[200px]"
 />
 </div>
 <button className="pending-date-btn flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition" type="button">
 <CalendarDays size={17} />
 Today
 </button>
 </div>
 </section>

 <section className="pending-metrics grid grid-cols-1 md:grid-cols-3 gap-4">
 <div className="pending-metric-card bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
 <span className="metric-icon w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
 <Wallet size={22} />
 </span>
 <div>
 <p className="text-sm font-bold text-slate-500">Total Due</p>
 <strong className="text-xl font-black text-slate-900">Rs. {metrics.totalDue.toLocaleString()}</strong>
 </div>
 </div>
 <div className="pending-metric-card bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
 <span className="metric-icon w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
 <Receipt size={22} />
 </span>
 <div>
 <p className="text-sm font-bold text-slate-500">Unpaid Checks</p>
 <strong className="text-xl font-black text-slate-900">{metrics.unpaid}</strong>
 </div>
 </div>
 <div className="pending-metric-card bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
 <span className="metric-icon w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
 <ChefHat size={22} />
 </span>
 <div>
 <p className="text-sm font-bold text-slate-500">Largest Table</p>
 <strong className="text-xl font-black text-slate-900">Rs. {metrics.largestBill.toLocaleString()}</strong>
 </div>
 </div>
 </section>

 <section className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 mt-4">
 <div className="inline-flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 overflow-x-auto max-w-full shadow-inner">
 {[
 { name:"All", icon: FileText, activeColor:"text-blue-600", bgActive:"bg-blue-50", ringActive:"ring-blue-200/50" },
 { name:"Pending", icon: Hourglass, activeColor:"text-amber-600", bgActive:"bg-amber-50", ringActive:"ring-amber-200/50" },
 { name:"Cooking", icon: ChefHat, activeColor:"text-orange-600", bgActive:"bg-orange-50", ringActive:"ring-orange-200/50" },
 { name:"Ready", icon: CheckCircle, activeColor:"text-emerald-600", bgActive:"bg-emerald-50", ringActive:"ring-emerald-200/50" },
 { name:"Served", icon: Utensils, activeColor:"text-purple-600", bgActive:"bg-purple-50", ringActive:"ring-purple-200/50" },
 ].map((tab) => {
 const Icon = tab.icon;
 const isActive = activeFilter === tab.name;
 const count = tab.name ==="All" ? pendingBillsData.length : pendingBillsData.filter((b) => b.kitchenStatus === tab.name).length;
 return (
 <button
 key={tab.name}
 onClick={() => setActiveFilter(tab.name)}
 className={`group flex items-center whitespace-nowrap gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 transform active:scale-95 ${isActive ?"bg-white text-slate-900 shadow-md ring-1 ring-slate-200/50 scale-[1.02] z-10" :"text-slate-500 hover:text-slate-700 hover:bg-white/60 hover:shadow-sm"
 }`}
 >
 <Icon size={16} className={`transition-colors duration-300 ${isActive ? tab.activeColor :"text-slate-400 group-hover:text-slate-500"}`} />
 {tab.name}
 <span className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-colors duration-300 ${isActive ? `${tab.bgActive} ${tab.activeColor} ring-1 ${tab.ringActive}` :"bg-slate-200/50 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500"}`}>
 {count}
 </span>
 </button>
 );
 })}
 </div>
 </section>

 <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
 {filteredBills.map((bill) => {
 const isSelected = selectedInvoiceId === bill.id;
 const statusStyles = {
 pending: { bg:"bg-amber-50", text:"text-amber-600", dot:"bg-amber-500", gradient:"from-amber-50 to-transparent" },
 cooking: { bg:"bg-orange-50", text:"text-orange-600", dot:"bg-orange-500", gradient:"from-orange-50 to-transparent" },
 ready: { bg:"bg-emerald-50", text:"text-emerald-600", dot:"bg-emerald-500", gradient:"from-emerald-50 to-transparent" },
 served: { bg:"bg-blue-50", text:"text-blue-600", dot:"bg-blue-500", gradient:"from-blue-50 to-transparent" },
 };
 const style = statusStyles[bill.kitchenStatus.toLowerCase()] || statusStyles.pending;

 return (
 <div
 key={bill.id}
 onClick={() => handleSelectInvoice(bill.id)}
 className={`group relative bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 text-left ${isSelected ?"ring-4 ring-purple-500/20 border-purple-300 scale-[1.02]" :"border-slate-100 hover:border-slate-200"
 }`}
 >
 <div className={`absolute inset-0 bg-gradient-to-b ${style.gradient} opacity-50 pointer-events-none`} />
 <div className={`h-1.5 w-full ${style.dot} transition-all duration-300 group-hover:h-2`} />
 <div className="p-6 relative z-10">
 <div className="flex justify-between items-start mb-5">
 <div className="flex items-center gap-3">
 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${style.bg} ${style.text} group-hover:scale-110 transition-transform duration-300`}>
 <Table2 size={24} />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">{bill.table}</h3>
 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 line-clamp-1">
 {bill.orderIds[0]} {bill.orderIds.length > 1 ? `(+${bill.orderIds.length - 1})` :""}
 </p>
 </div>
 </div>
 </div>

 <div className="flex items-center justify-between mb-5 p-3 rounded-xl bg-white/60 border border-slate-100/50 backdrop-blur-sm">
 <div className="flex items-center gap-3">
 <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400`}>
 <User size={16} />
 </div>
 <div>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Guest</p>
 <h4 className="text-sm font-bold text-slate-900 truncate max-w-[100px]">{bill.customer}</h4>
 </div>
 </div>
 <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm border ${style.bg} ${style.text} border-white/50`}>
 {bill.kitchenStatus}
 </span>
 </div>

 <div className="grid grid-cols-2 gap-2 mb-5 text-[11px] font-bold text-slate-500">
 <div className="flex items-center gap-1.5"><Clock size={14} /> {bill.time}</div>
 <div className="flex items-center gap-1.5"><User size={14} /> {bill.guests} guests</div>
 </div>

 <div className="bg-slate-50/80 rounded-xl p-3.5 flex justify-between items-center border border-slate-100 group-hover:bg-slate-100 transition-colors">
 <div className="flex items-center gap-2">
 <Receipt size={16} className="text-slate-500" />
 <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Due</span>
 </div>
 <span className="font-black text-slate-900 text-sm">Rs. {bill.amount.toLocaleString()}</span>
 </div>
 </div>
 </div>
 );
 })}
 </section>

 {filteredBills.length === 0 && (
 <div className="empty-bill-state flex flex-col items-center justify-center p-12 text-slate-400">
 <Receipt size={40} className="mb-4 opacity-50" />
 <h2 className="text-lg font-bold text-slate-600">No bills found</h2>
 <p className="text-sm">Try another search term or change the filter.</p>
 </div>
 )}

 {/* CHECKOUT MODAL */}
 {selectedInvoice && (
 <div
 className="fixed inset-0 z-[60] bg-black/40 flex justify-center items-center p-4 sm:p-6 transition-all"
 onClick={() => setSelectedInvoiceId(null)}
 >
 <div
 className="bg-white w-full max-w-[760px] max-h-[92vh] rounded-2xl shadow-xl flex flex-col overflow-y-auto animate-slide-in"
 onClick={(event) => event.stopPropagation()}
 >
 {/* Header */}
 <div className="bg-slate-800 text-white px-8 py-6 rounded-t-2xl">
 <div className="flex justify-between items-start">
 <div>
 <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Checkout</p>
 <h2 className="text-2xl font-bold">{selectedInvoice.table}</h2>
 <p className="text-slate-400 text-sm mt-1">
 {selectedInvoice.orderIds.join(",")} &middot; {selectedInvoice.customer}
 </p>
 </div>
 <button
 className="text-slate-400 hover:text-white transition-colors p-1"
 type="button"
 onClick={() => setSelectedInvoiceId(null)}
 >
 <X size={22} />
 </button>
 </div>
 <div className="flex gap-6 mt-5 text-sm">
 <span className="flex flex-col"><span className="text-slate-500 text-[11px] uppercase tracking-wide">Date</span><strong>{selectedInvoice.date}</strong></span>
 <span className="flex flex-col"><span className="text-slate-500 text-[11px] uppercase tracking-wide">Time</span><strong>{selectedInvoice.time}</strong></span>
 <span className="flex flex-col"><span className="text-slate-500 text-[11px] uppercase tracking-wide">Guests</span><strong>{selectedInvoice.guests}</strong></span>
 </div>
 </div>

 {/* Body */}
 <div className="px-8 py-6 space-y-6">

 {/* Items Table */}
 <div>
 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Order Items</h3>
 <div className="border border-slate-200 rounded-xl overflow-hidden">
 <table className="w-full text-sm">
 <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
 <tr>
 <th className="text-left px-5 py-3 font-semibold">Item</th>
 <th className="text-center px-5 py-3 font-semibold">Qty</th>
 <th className="text-right px-5 py-3 font-semibold">Amount</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {selectedInvoice.items.map((item) => (
 <tr key={item.name} className="hover:bg-slate-50/60 transition-colors">
 <td className="px-5 py-3.5">
 <span className="font-semibold text-slate-800">{item.name}</span>
 <span className="text-xs text-slate-400 block mt-0.5">
 Rs. {item.price || 0} each {item.station ? `· ${item.station}` :""}
 </span>
 </td>
 <td className="px-5 py-3.5 text-center font-semibold text-slate-600">{item.qty}</td>
 <td className="px-5 py-3.5 text-right font-bold text-slate-800">
 Rs. {(item.qty * (parseFloat(item.price) || 0)).toLocaleString()}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Two-Column: Payment + Discount */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 {/* Payment Method */}
 <div>
 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Method</h3>
 <div className="grid grid-cols-2 gap-2">
 {activePaymentMethods.map(({ name, icon: Icon }) => (
 <button
 key={name}
 type="button"
 onClick={() => setPaymentMethod(name)}
 className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-semibold transition-all ${paymentMethod === name
 ?"border-slate-800 bg-slate-800 text-white shadow-sm"
 :"border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
 }`}
 >
 <Icon size={16} />
 {name}
 </button>
 ))}
 </div>
 </div>

 {/* Discount */}
 <div>
 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Discount</h3>
 <div className="flex bg-slate-100 p-1 rounded-lg mb-3">
 <button
 type="button"
 onClick={() => { setDiscountType("percentage"); setDiscountValue(0); }}
 className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-semibold transition-all ${discountType ==="percentage" ?"bg-white shadow-sm text-slate-800" :"text-slate-500 hover:text-slate-700"}`}
 >
 <Percent size={13} /> Percent
 </button>
 <button
 type="button"
 onClick={() => { setDiscountType("flat"); setDiscountValue(0); }}
 className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-semibold transition-all ${discountType ==="flat" ?"bg-white shadow-sm text-slate-800" :"text-slate-500 hover:text-slate-700"}`}
 >
 <Coins size={13} /> Flat
 </button>
 </div>
 <input
 id="discountInput"
 name="discountInput"
 type="number"
 min="0"
 max={discountType ==="percentage" ? 100 : subtotal}
 value={discountValue ||""}
 onChange={(event) => setDiscountValue(event.target.value ==="" ? 0 : parseFloat(event.target.value))}
 placeholder={discountType ==="percentage" ?"Enter %" :"Enter amount"}
 className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg font-semibold text-slate-800 focus:ring-2 focus:ring-slate-300 focus:border-slate-400 outline-none transition-all text-sm"
 />
 </div>
 </div>

 {/* Service Charge */}
 <div>
 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Service Charge</h3>
 <input
 id="serviceChargeInput"
 name="serviceChargeInput"
 type="number"
 min="0"
 value={serviceCharge === 0 ?"" : serviceCharge}
 onChange={(event) => setServiceCharge(event.target.value ==="" ? 0 : parseFloat(event.target.value))}
 placeholder="Enter service charge amount"
 className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg font-semibold text-slate-800 focus:ring-2 focus:ring-slate-300 focus:border-slate-400 outline-none transition-all text-sm max-w-xs"
 />
 </div>

 {/* Summary */}
 <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3">
 <div className="flex justify-between text-sm text-slate-500">
 <span>Subtotal (Excl. VAT)</span>
 <span className="font-semibold text-slate-700">Rs. {(subtotal / 1.13).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
 </div>
 <div className="flex justify-between text-sm text-slate-500">
 <span>VAT (13%)</span>
 <span className="font-semibold text-slate-700">Rs. {(subtotal - subtotal / 1.13).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
 </div>
 <div className="flex justify-between text-sm text-red-500">
 <span>Discount</span>
 <span className="font-semibold">- Rs. {discountAmount.toFixed(2)}</span>
 </div>
 <div className="flex justify-between text-sm text-slate-500">
 <span>Service Charge</span>
 <span className="font-semibold text-slate-700">Rs. {safeServiceCharge.toFixed(2)}</span>
 </div>
 <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-slate-200">
 <span className="text-base font-bold text-slate-800">Grand Total</span>
 <span className="text-2xl font-black text-slate-900">Rs. {total.toFixed(2)}</span>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex flex-wrap gap-3 pt-2">
 <button
 className="flex items-center justify-center gap-2 px-5 py-3 border border-red-200 text-red-500 bg-red-50 rounded-lg font-semibold text-sm hover:bg-red-100 transition-colors"
 type="button"
 onClick={handleCancelBillClick}
 title="Cancel and Void Bill"
 >
 <XCircle size={16} /> Cancel
 </button>
 <button
 className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 text-slate-600 bg-white rounded-lg font-semibold text-sm hover:bg-slate-50 transition-colors"
 type="button"
 onClick={() => window.print()}
 title="Print Receipt"
 >
 <Printer size={16} /> Print
 </button>
 <button
 className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-base shadow-sm transition-all active:scale-[0.98]"
 type="button"
 onClick={() => setIsPaymentSuccess(true)}
 >
 <CheckCircle size={20} />
 Complete Checkout
 </button>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* SUCCESS / PRINT MODAL */}
 {isPaymentSuccess && selectedInvoice && (
 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex justify-center items-center p-4 transition-opacity print-modal-hide">
 <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-slide-in">
 <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
 <CheckCircle size={28} className="text-emerald-500" />
 </div>
 <h2 className="text-xl font-black text-slate-900 mb-2">
 Payment Completed!
 </h2>
 <p className="text-sm text-slate-500 font-medium mb-6">
 Payment of <strong>Rs. {total.toFixed(2)}</strong> received
 successfully. The table is now free. Would you like to print the
 receipt?
 </p>
 <div className="flex gap-3">
 <button
 onClick={() => handleFinalizePayment(false)}
 className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition"
 >
 No, Thanks
 </button>
 <button
 onClick={() => handleFinalizePayment(true)}
 className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 shadow-md shadow-emerald-200 transition flex justify-center items-center gap-2"
 >
 <Printer size={18} /> Print Receipt
 </button>
 </div>
 </div>
 </div>
 )}

 {/* CANCEL CONFIRMATION MODAL */}
 {isCancelConfirmOpen && selectedInvoice && (
 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex justify-center items-center p-4 transition-opacity print-modal-hide">
 <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-slide-in">
 <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
 <XCircle size={28} className="text-rose-500" />
 </div>
 <h2 className="text-xl font-black text-slate-900 mb-2">
 Cancel Bill?
 </h2>
 <p className="text-sm text-slate-500 font-medium mb-6">
 Are you sure you want to void this bill for{""}
 <strong>{selectedInvoice.table}</strong>? This action cannot be
 undone and will be recorded in the ledger.
 </p>
 <div className="flex gap-3">
 <button
 onClick={() => setIsCancelConfirmOpen(false)}
 className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition"
 >
 No, Keep It
 </button>
 <button
 onClick={executeCancelBill}
 className="flex-1 bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 shadow-md shadow-rose-200 transition"
 >
 Yes, Void Bill
 </button>
 </div>
 </div>
 </div>
 )}
 </main>

 {/* DEDICATED PRINTABLE RECEIPT LAYOUT */}
 {selectedInvoice && (
 <div id="printable-receipt">
 <div style={{ textAlign:"center", marginBottom:"15px" }}>
 <h2 style={{ fontSize:"20px", margin:"0 0 5px 0" }}>
 ASLENIX RESTAURANT
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
 <span>{selectedInvoice.orderIds.join(",")}</span>
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
 {selectedInvoice.date} {selectedInvoice.time}
 </span>
 </div>
 <div
 style={{
 display:"flex",
 justifyContent:"space-between",
 marginBottom:"5px",
 }}
 >
 <span>Table:</span> <span>{selectedInvoice.table}</span>
 </div>
 <div
 style={{
 display:"flex",
 justifyContent:"space-between",
 marginBottom:"5px",
 }}
 >
 <span>Customer:</span> <span>{selectedInvoice.customer}</span>
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
 {selectedInvoice.items.map((item, idx) => (
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
 marginBottom:"5px",
 }}
 >
 <span>Subtotal (Excl. VAT):</span>{""}
 <span>Rs. {(subtotal / 1.13).toFixed(2)}</span>
 </div>
 <div
 style={{
 display:"flex",
 justifyContent:"space-between",
 marginBottom:"5px",
 }}
 >
 <span>VAT (13%):</span>{""}
 <span>Rs. {(subtotal - subtotal / 1.13).toFixed(2)}</span>
 </div>
 {discountAmount > 0 && (
 <div
 style={{
 display:"flex",
 justifyContent:"space-between",
 marginBottom:"5px",
 }}
 >
 <span>Discount:</span>{""}
 <span>- Rs. {discountAmount.toFixed(2)}</span>
 </div>
 )}
 {serviceCharge > 0 && (
 <div
 style={{
 display:"flex",
 justifyContent:"space-between",
 marginBottom:"5px",
 }}
 >
 <span>Service Charge:</span>{""}
 <span>Rs. {serviceCharge.toFixed(2)}</span>
 </div>
 )}

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
 <span>Rs. {total.toFixed(2)}</span>
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
}
