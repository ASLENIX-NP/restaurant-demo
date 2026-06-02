import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  DollarSign, 
  Receipt, 
  CreditCard, 
  Undo2,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from "lucide-react";
// import "../../styles/payments.css"; // Optional: Can be removed if fully relying on Tailwind

const initialPayments = [
  {
    paymentId: "PAY-10048",
    orderId: "TXN-10048",
    customer: "Walk-in Customer",
    method: "Cash",
    amount: "Rs. 250.00",
    status: "Completed",
    time: "10:34 AM",
  },
  {
    paymentId: "PAY-10047",
    orderId: "TXN-10047",
    customer: "Arman Sharma",
    method: "Card",
    amount: "Rs. 350.00",
    status: "Completed",
    time: "10:15 AM",
  },
  {
    paymentId: "PAY-10046",
    orderId: "TXN-10046",
    customer: "Neha Verma",
    method: "eSewa",
    amount: "Rs. 180.00",
    status: "Completed",
    time: "10:04 AM",
  },
  {
    paymentId: "PAY-10045",
    orderId: "TXN-10045",
    customer: "Rohan Das",
    method: "Khalti",
    amount: "Rs. 120.00",
    status: "Completed",
    time: "09:56 AM",
  },
  {
    paymentId: "PAY-10044",
    orderId: "TXN-10044",
    customer: "Walk-in Customer",
    method: "Cash",
    amount: "Rs. 200.00",
    status: "Completed",
    time: "09:42 AM",
  },
];

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("");

  // Live dynamic filtering
  const filteredPayments = initialPayments.filter((payment) => 
    payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-800">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payments</h1>
          <div className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-2">
            <span>Home</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-700">Payments</span>
          </div>
        </div>
        
        <button className="bg-white border border-slate-200 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-all">
          📅 May 15, 2024
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { title: "Total Collected", value: "Rs. 2,000.00", trend: "↑ 12.5% vs yesterday", trendColor: "text-emerald-500", icon: <DollarSign size={22} className="text-emerald-600" />, bg: "bg-emerald-100" },
          { title: "Total Payments", value: "24", trend: "↑ 5 vs yesterday", trendColor: "text-emerald-500", icon: <Receipt size={22} className="text-blue-600" />, bg: "bg-blue-100" },
          { title: "Average Payment", value: "Rs. 83.33", trend: "↑ 8.3% vs yesterday", trendColor: "text-emerald-500", icon: <CreditCard size={22} className="text-amber-600" />, bg: "bg-amber-100" },
          { title: "Refunds", value: "Rs. 120.00", trend: "↑ 2.1% vs yesterday", trendColor: "text-rose-500", icon: <Undo2 size={22} className="text-purple-600" />, bg: "bg-purple-100" },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.title}</p>
              <h2 className="text-2xl font-bold text-slate-800">{stat.value}</h2>
              <p className={`text-xs font-semibold mt-1 ${stat.trendColor}`}>{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN WORKSPACE GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: PAYMENTS TABLE */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">All Payments</h2>
            
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search order or customer..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-slate-400"
                />
              </div>
              <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all">
                <Filter size={18} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6 border-b border-slate-100">Payment ID</th>
                  <th className="py-4 px-6 border-b border-slate-100">Order ID</th>
                  <th className="py-4 px-6 border-b border-slate-100">Customer</th>
                  <th className="py-4 px-6 border-b border-slate-100">Method</th>
                  <th className="py-4 px-6 border-b border-slate-100 text-right">Amount</th>
                  <th className="py-4 px-6 border-b border-slate-100 text-center">Status</th>
                  <th className="py-4 px-6 border-b border-slate-100">Time</th>
                  <th className="py-4 px-6 border-b border-slate-100"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredPayments.map((payment, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-6 border-b border-slate-50 font-semibold text-purple-600">
                      {payment.paymentId}
                    </td>
                    <td className="py-4 px-6 border-b border-slate-50 font-medium text-slate-700">
                      {payment.orderId}
                    </td>
                    <td className="py-4 px-6 border-b border-slate-50 text-slate-600">
                      {payment.customer}
                    </td>
                    <td className="py-4 px-6 border-b border-slate-50">
                      <span className="font-medium text-slate-700">{payment.method}</span>
                    </td>
                    <td className="py-4 px-6 border-b border-slate-50 font-bold text-slate-800 text-right">
                      {payment.amount}
                    </td>
                    <td className="py-4 px-6 border-b border-slate-50 text-center">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        payment.status === "Refunded" 
                          ? "bg-rose-100 text-rose-700" 
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 border-b border-slate-50 text-slate-500 whitespace-nowrap">
                      {payment.time}
                    </td>
                    <td className="py-4 px-6 border-b border-slate-50 text-right">
                      <button className="text-slate-400 hover:text-purple-600 transition-colors p-1 rounded-md hover:bg-purple-50">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 mt-auto">
            <span>Showing 1 to {filteredPayments.length} of {initialPayments.length} entries</span>
            <div className="flex gap-1">
              <button className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button className="px-3 py-1.5 bg-purple-600 text-white font-semibold rounded-md shadow-sm">1</button>
              <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 font-semibold text-slate-600 transition-colors">2</button>
              <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 font-semibold text-slate-600 transition-colors">3</button>
              <button className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: OVERVIEW CHART */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Payment Methods Overview</h2>
          
          <div className="flex justify-center mb-8 relative">
            {/* Elegant SVG Donut Chart Approach matching Recharts styling */}
            <div className="w-48 h-48 relative">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 drop-shadow-sm">
                {/* Cash Segment */}
                <path
                  className="text-emerald-500"
                  stroke="currentColor"
                  strokeWidth="4.5"
                  strokeDasharray="37.5, 100"
                  fill="none"
                  strokeLinecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Card Segment */}
                <path
                  className="text-blue-500"
                  stroke="currentColor"
                  strokeWidth="4.5"
                  strokeDasharray="40, 100"
                  strokeDashoffset="-37.5"
                  fill="none"
                  strokeLinecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* eSewa Segment */}
                <path
                  className="text-green-400"
                  stroke="currentColor"
                  strokeWidth="4.5"
                  strokeDasharray="15, 100"
                  strokeDashoffset="-77.5"
                  fill="none"
                  strokeLinecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Khalti Segment */}
                <path
                  className="text-purple-500"
                  stroke="currentColor"
                  strokeWidth="4.5"
                  strokeDasharray="7.5, 100"
                  strokeDashoffset="-92.5"
                  fill="none"
                  strokeLinecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              {/* Center Content Data Hole */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                <span className="text-xl font-black text-slate-800">Rs. 2,000</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-auto">
            {[
              { name: "Cash", amount: "Rs. 750.00", percent: "37.5%", color: "bg-emerald-500" },
              { name: "Card", amount: "Rs. 800.00", percent: "40.0%", color: "bg-blue-500" },
              { name: "eSewa", amount: "Rs. 300.00", percent: "15.0%", color: "bg-green-400" },
              { name: "Khalti", amount: "Rs. 150.00", percent: "7.5%", color: "bg-purple-500" },
            ].map((method, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full shadow-sm ${method.color}`}></div>
                  <span className="font-semibold text-slate-700">{method.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors">{method.amount}</span>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md w-14 text-center">{method.percent}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}