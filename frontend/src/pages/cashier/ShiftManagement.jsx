import React, { useState, useMemo, useEffect } from "react";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { PlayCircle, LogOut, ArrowDownCircle, Printer, X, AlertTriangle, DollarSign, CreditCard, Banknote, Clock } from "lucide-react";
import apiClient from "../../api/apiClient";
import { useToast } from "../../context/ToastContext";

const ShiftManagement = () => {
 const { orders = [] } = useOrders() || {};
 const { user } = useAuth() || {};
 const { showToast } = useToast();

 // --- STATE MANAGEMENT ---
 const [shift, setShift] = useState({
 active: false,
 startTime: null,
 startingFloat: 0,
 payouts: [],
 _id: null
 });

 // Modal & input state
 const [isStartModalOpen, setIsStartModalOpen] = useState(false);
 const [startFloatInput, setStartFloatInput] = useState("");
 const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
 const [payoutAmountInput, setPayoutAmountInput] = useState("");
 const [payoutReasonInput, setPayoutReasonInput] = useState("");
 const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
 const [isConfirmCloseModalOpen, setIsConfirmCloseModalOpen] = useState(false);

 const fetchActiveShift = async () => {
 if (!user) return;
 try {
 const { data } = await apiClient.get(`/api/shifts/active?cashierName=${user.name || user.username}`);
 if (data) {
 setShift({
 active: true,
 startTime: data.startTime,
 startingFloat: data.startingCash,
 payouts: data.payouts || [],
 _id: data._id
 });
 }
 } catch (error) {
 console.error("Failed to fetch active shift:", error);
 }
 };

 useEffect(() => {
 fetchActiveShift();
 }, [user]);

 // --- DATA CALCULATION ---
 const shiftMetrics = useMemo(() => {
 if (!shift.active) {
 return {
 cashSales: 0,
 digitalSales: 0,
 totalPayouts: 0,
 expectedInDrawer: 0,
 };
 }

 const shiftStartTime = new Date(shift.startTime);
 const salesInShift = orders.filter(
 (o) => o.status ==="Completed" && new Date(o.timestamp) >= shiftStartTime
 );

 const cashSales = salesInShift
 .filter((o) => o.paymentMethod ==="Cash")
 .reduce((sum, o) => sum + o.amount, 0);

 const digitalSales = salesInShift
 .filter((o) => o.paymentMethod !=="Cash")
 .reduce((sum, o) => sum + o.amount, 0);

 const totalPayouts = shift.payouts.reduce((sum, p) => sum + p.amount, 0);

 const expectedInDrawer = shift.startingFloat + cashSales - totalPayouts;

 return { cashSales, digitalSales, totalPayouts, expectedInDrawer };
 }, [orders, shift]);

 // --- HANDLER FUNCTIONS ---
 const handleStartShift = async (e) => {
 e.preventDefault();
 const floatAmount = parseFloat(startFloatInput) || 0;
 try {
 const { data } = await apiClient.post("/api/shifts/start", {
 cashierName: user?.name || user?.username ||"Unknown",
 startingCash: floatAmount
 });
 setShift({
 active: true,
 startTime: data.startTime,
 startingFloat: data.startingCash,
 payouts: data.payouts || [],
 _id: data._id
 });
 setIsStartModalOpen(false);
 setStartFloatInput("");
 showToast("Shift started successfully!", "success");
 } catch (error) {
 console.error("Failed to start shift:", error);
 showToast("Failed to start shift.", "error");
 }
 };

 const handleAddPayout = async (e) => {
 e.preventDefault();
 const payoutAmount = parseFloat(payoutAmountInput) || 0;
 if (payoutAmount <= 0) return;

 const newPayouts = [
 ...shift.payouts,
 {
 amount: payoutAmount,
 reason: payoutReasonInput ||"General Payout",
 time: new Date().toLocaleTimeString([], {
 hour:"2-digit",
 minute:"2-digit",
 }),
 },
 ];

 try {
 await apiClient.put(`/api/shifts/${shift._id}`, { payouts: newPayouts });
 setShift((prev) => ({ ...prev, payouts: newPayouts }));
 setIsPayoutModalOpen(false);
 setPayoutAmountInput("");
 setPayoutReasonInput("");
 showToast("Payout recorded successfully!", "success");
 } catch (error) {
 console.error("Failed to add payout:", error);
 showToast("Failed to add payout.", "error");
 }
 };

 const handleCloseShift = () => {
 setIsConfirmCloseModalOpen(true);
 };

 const executeCloseShift = async () => {
 // Logic to print Z-Report can be added here
 window.print();

 try {
 await apiClient.put(`/api/shifts/end/${shift._id}`, {
 actualEndingCash: shiftMetrics.expectedInDrawer,
 expectedEndingCash: shiftMetrics.expectedInDrawer
 });

 setTimeout(() => {
 setShift({
 active: false,
 startTime: null,
 startingFloat: 0,
 payouts: [],
 _id: null
 });
 setIsCloseModalOpen(false);
 setIsConfirmCloseModalOpen(false);
 showToast("Shift closed successfully!", "success");
 }, 200); // Give a moment for the print dialog to appear
 } catch (error) {
 console.error("Failed to close shift:", error);
 showToast("Failed to close shift.", "error");
 }
 };

 // --- RENDER LOGIC ---
 if (!shift.active) {
 return (
 <div className="p-6 flex flex-col items-center justify-center text-center min-h-[calc(100vh-150px)]">
 <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-100 max-w-md">
 <LogOut size={48} className="mx-auto text-slate-300 mb-4" />
 <h2 className="text-2xl font-black text-slate-900">
 No Active Shift
 </h2>
 <p className="text-slate-500 mt-2 mb-6">
 Start a new shift to begin tracking sales and cash flow.
 </p>
 <button
 onClick={() => setIsStartModalOpen(true)}
 className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition shadow-md flex items-center justify-center gap-3 text-lg"
 >
 <PlayCircle size={20} /> Start New Shift
 </button>
 </div>
 {isStartModalOpen && (
 <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
 <div className="bg-white rounded-xl shadow-md w-full max-w-sm p-6 animate-slide-in">
 <h2 className="text-xl font-black text-slate-900 mb-4">
 Enter Starting Cash
 </h2>
 <form onSubmit={handleStartShift}>
 <input
 id="startFloatInput"
 name="startFloatInput"
 type="number"
 value={startFloatInput}
 onChange={(e) => setStartFloatInput(e.target.value)}
 className="w-full border border-slate-300 rounded-xl px-4 py-3 text-center text-2xl font-bold text-slate-900 bg-white outline-none focus:border-indigo-500 transition"
 placeholder="Rs. 0.00"
 autoFocus
 required
 />
 <div className="flex gap-3 mt-6">
 <button
 type="button"
 onClick={() => setIsStartModalOpen(false)}
 className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl"
 >
 Cancel
 </button>
 <button
 type="submit"
 className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl"
 >
 Begin Shift
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
 }

 return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Shift & Drawer</h1>
          <p className="text-slate-500 mt-1">
            Manage your cash flow and daily closing reports
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-bold text-sm shadow-sm border border-emerald-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Active Shift
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 screen-only">
        {/* Starting Float */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400">Opened at {new Date(shift.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Starting Float</h3>
            <p className="text-2xl font-black text-slate-900">Rs. {shift.startingFloat.toLocaleString()}</p>
          </div>
        </div>

        {/* Cash Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Banknote size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Cash Sales</h3>
            <p className="text-2xl font-black text-slate-900">Rs. {shiftMetrics.cashSales.toLocaleString()}</p>
          </div>
        </div>

        {/* Digital Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <CreditCard size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Digital Sales</h3>
            <p className="text-2xl font-black text-slate-900">Rs. {shiftMetrics.digitalSales.toLocaleString()}</p>
          </div>
        </div>

        {/* Payouts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <ArrowDownCircle size={20} />
            </div>
            <span className="text-xs font-bold text-rose-500">{shift.payouts.length} drops</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Cash Payouts</h3>
            <p className="text-2xl font-black text-rose-600">- Rs. {shiftMetrics.totalPayouts.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* EXPECTED DRAWER AND ACTIONS */}
      <div className="bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-900/10 flex flex-col md:flex-row items-center justify-between gap-6 screen-only border border-slate-800">
        <div>
          <h3 className="text-slate-400 font-bold uppercase tracking-wider text-sm mb-2 flex items-center gap-2">
            <Clock size={16} /> Expected Cash in Drawer
          </h3>
          <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight">
            Rs. {shiftMetrics.expectedInDrawer.toLocaleString()}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <button
            onClick={() => setIsPayoutModalOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2"
          >
            <ArrowDownCircle size={18} /> Record Payout
          </button>
          <button
            onClick={() => setIsCloseModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Close Shift
          </button>
        </div>
      </div>

 {/* MODALS */}
 {isPayoutModalOpen && (
 <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
 <div className="bg-white rounded-xl shadow-md w-full max-w-sm p-6 animate-slide-in">
 <h2 className="text-xl font-black text-slate-900 mb-4">
 Record a Cash Payout
 </h2>
 <form onSubmit={handleAddPayout} className="space-y-4">
 <input
 id="payoutAmount"
 name="payoutAmount"
 type="number"
 value={payoutAmountInput}
 onChange={(e) => setPayoutAmountInput(e.target.value)}
 className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition"
 placeholder="Amount (e.g., 5000)"
 required
 />
 <input
 id="payoutReason"
 name="payoutReason"
 type="text"
 value={payoutReasonInput}
 onChange={(e) => setPayoutReasonInput(e.target.value)}
 className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition"
 placeholder="Reason (optional, e.g., Safe drop)"
 />
 <div className="flex gap-3 pt-2">
 <button
 type="button"
 onClick={() => setIsPayoutModalOpen(false)}
 className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl"
 >
 Cancel
 </button>
 <button
 type="submit"
 className="flex-1 bg-amber-500 text-white font-bold py-3 rounded-xl"
 >
 Record Payout
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 {isCloseModalOpen && (
 <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
 <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6 animate-slide-in">
 <div className="flex justify-between items-start">
 <h2 className="text-xl font-black text-slate-900 mb-4">
 End of Shift Report (Z)
 </h2>
 <button
 onClick={() => setIsCloseModalOpen(false)}
 className="text-slate-400 hover:text-slate-600"
 >
 <X size={20} />
 </button>
 </div>
 <div className="space-y-3 text-sm">
 <div className="flex justify-between">
 <span className="text-slate-500">Shift Started:</span>{""}
 <span className="font-bold">
 {new Date(shift.startTime).toLocaleString()}
 </span>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-500">Starting Float:</span>{""}
 <span className="font-bold">
 Rs. {shift.startingFloat.toLocaleString()}
 </span>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-500">Cash Sales:</span>{""}
 <span className="font-bold">
 Rs. {shiftMetrics.cashSales.toLocaleString()}
 </span>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-500">Digital Sales:</span>{""}
 <span className="font-bold">
 Rs. {shiftMetrics.digitalSales.toLocaleString()}
 </span>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-500">Total Payouts:</span>{""}
 <span className="font-bold text-rose-600">
 - Rs. {shiftMetrics.totalPayouts.toLocaleString()}
 </span>
 </div>
 <div className="flex justify-between text-lg font-black text-emerald-600 pt-3 border-t border-slate-200 mt-3">
 <span className="text-slate-900">Expected in Drawer:</span>{""}
 <span>
 Rs. {shiftMetrics.expectedInDrawer.toLocaleString()}
 </span>
 </div>
 </div>
 <button
 onClick={handleCloseShift}
 className="w-full mt-6 bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 transition flex items-center justify-center gap-2"
 >
 <Printer size={16} /> Print & Close Shift
 </button>
 </div>
 </div>
 )}

 {isConfirmCloseModalOpen && (
 <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex justify-center items-center p-4">
 <div className="bg-white rounded-xl shadow-md w-full max-w-sm p-6 text-center animate-slide-in">
 <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
 <AlertTriangle size={28} className="text-rose-500" />
 </div>
 <h2 className="text-xl font-black text-slate-900 mb-2">
 Close Shift?
 </h2>
 <p className="text-sm text-slate-500 font-medium mb-6">
 Are you sure you want to close the current shift? This action cannot be undone.
 </p>
 <div className="flex gap-3">
 <button
 onClick={() => setIsConfirmCloseModalOpen(false)}
 className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition"
 >
 Cancel
 </button>
 <button
 onClick={executeCloseShift}
 className="flex-1 bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 shadow-md shadow-rose-200 transition"
 >
 Yes, Close Shift
 </button>
 </div>
 </div>
 </div>
 )}

 {/* PRINT-ONLY Z-REPORT */}
 <div id="printable-z-report">
 <div style={{ textAlign:"center", marginBottom:"15px" }}>
 <h2 style={{ fontSize:"16px", margin:"0 0 5px 0" }}>मिठ्ठो चिया & Tiffin घर</h2>
 <p style={{ margin:"2px 0" }}>End of Shift Report (Z-Report)</p>
 </div>
 
 <div style={{ borderBottom:"1px dashed #000", paddingBottom:"10px", marginBottom:"10px" }}>
 <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
 <span>Opened:</span> <span>{new Date(shift.startTime).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</span>
 </div>
 <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
 <span>Closed:</span> <span>{new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</span>
 </div>
 <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
 <span>Date:</span> <span>{new Date().toLocaleDateString()}</span>
 </div>
 <div style={{ display:"flex", justifyContent:"space-between" }}>
 <span>Cashier:</span> <span>{user?.name || user?.username ||"System"}</span>
 </div>
 </div>

 <h3 style={{ fontSize:"14px", margin:"10px 0" }}>Sales Summary</h3>
 <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
 <span>Starting Float:</span> <span>Rs. {shift.startingFloat.toLocaleString()}</span>
 </div>
 <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
 <span>Cash Sales:</span> <span>Rs. {shiftMetrics.cashSales.toLocaleString()}</span>
 </div>
 <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
 <span>Digital Sales:</span> <span>Rs. {shiftMetrics.digitalSales.toLocaleString()}</span>
 </div>
 <div style={{ display:"flex", justifyContent:"space-between", fontWeight:"bold", borderTop:"1px dashed #000", paddingTop:"5px", marginTop:"5px" }}>
 <span>Total Sales:</span> <span>Rs. {(shiftMetrics.cashSales + shiftMetrics.digitalSales).toLocaleString()}</span>
 </div>

 <h3 style={{ fontSize:"14px", margin:"15px 0 10px 0", borderTop:"1px dashed #000", paddingTop:"10px" }}>Cash Drawer Reconciliation</h3>
 <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
 <span>Cash Payouts:</span> <span>- Rs. {shiftMetrics.totalPayouts.toLocaleString()}</span>
 </div>
 <div style={{ display:"flex", justifyContent:"space-between", fontWeight:"bold", fontSize:"14px", marginTop:"10px", borderTop:"1px dashed #000", borderBottom:"1px dashed #000", padding:"10px 0" }}>
 <span>Expected Cash:</span> <span>Rs. {shiftMetrics.expectedInDrawer.toLocaleString()}</span>
 </div>

 <div style={{ textAlign:"center", marginTop:"20px" }}>
 <p>End of Report</p>
 </div>
 </div>

 <style>{`
 @media print {
 @page { margin: 0; size: 80mm auto; }
 body * { visibility: hidden; }
 html, body { height: 100%; margin: 0; padding: 0; background: #fff; }
 #printable-z-report, #printable-z-report * { visibility: visible; }
 #printable-z-report {
 position: absolute;
 top: 0;
 left: 0;
 width: 80mm;
 padding: 5mm;
 font-family:'Courier New', monospace;
 font-size: 12px;
 color: #000;
 }
 }
 @media screen {
 #printable-z-report { display: none; }
 }
 `}</style>
 </div>
 );
};

export default ShiftManagement;
