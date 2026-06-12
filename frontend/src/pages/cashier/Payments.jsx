import React, { useState, useMemo, useEffect, useRef } from "react";
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
  MoreVertical,
  Printer,
  Eye,
} from "lucide-react";
import { useOrders } from "../../context/OrderContext";

export default function Payments() {
  const { orders = [], fetchOrders } = useOrders() || {};
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const menuRef = useRef(null);
  const ITEMS_PER_PAGE = 7;

  useEffect(() => {
    if (fetchOrders) fetchOrders();
  }, [fetchOrders]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamically generate payments from completed orders
  const paymentsData = useMemo(() => {
    return orders
      .filter((order) => order.status === "Completed")
      .map((order) => {
        const subtotal = (order.items || []).reduce(
          (sum, item) => sum + item.qty * (parseFloat(item.price) || 0),
          0
        );
        const rawAmount = order.amount || subtotal + (subtotal > 0 ? 50 : 0);

        return {
          paymentId: `PAY-${String(order.id).replace(/\D/g, "")}`,
          orderId: order.id,
          customer: order.customer || "Walk-in Customer",
          method: order.paymentMethod || "Cash",
          amount: `Rs. ${rawAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          rawAmount: rawAmount,
          status: "Completed",
          time: `${order.date || new Date().toLocaleDateString()} ${
            order.time || ""
          }`,
        };
      })
      .reverse();
  }, [orders]);

  // Live dynamic filtering
  const filteredPayments = paymentsData.filter(
    (payment) =>
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE) || 1;
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalCollected = paymentsData.reduce((sum, p) => sum + p.rawAmount, 0);
  const avgPayment =
    paymentsData.length > 0 ? totalCollected / paymentsData.length : 0;

  const paymentMethodsStats = useMemo(() => {
    let cash = 0;
    let card = 0;
    let esewa = 0;
    let khalti = 0;

    paymentsData.forEach((p) => {
      if (p.method.toLowerCase().includes("card")) card += p.rawAmount;
      else if (p.method.toLowerCase().includes("esewa")) esewa += p.rawAmount;
      else if (p.method.toLowerCase().includes("khalti")) khalti += p.rawAmount;
      else cash += p.rawAmount;
    });

    const total = cash + card + esewa + khalti || 1;

    return [
      {
        name: "Cash",
        amount: `Rs. ${cash.toLocaleString()}`,
        percent: `${Math.round((cash / total) * 100)}%`,
        color: "bg-emerald-500",
        stroke: "text-emerald-500",
        offset: 100,
      },
      {
        name: "Card",
        amount: `Rs. ${card.toLocaleString()}`,
        percent: `${Math.round((card / total) * 100)}%`,
        color: "bg-blue-500",
        stroke: "text-blue-500",
        offset: 100 - (cash / total) * 100,
      },
      {
        name: "eSewa",
        amount: `Rs. ${esewa.toLocaleString()}`,
        percent: `${Math.round((esewa / total) * 100)}%`,
        color: "bg-green-400",
        stroke: "text-green-400",
        offset: 100 - ((cash + card) / total) * 100,
      },
      {
        name: "Khalti",
        amount: `Rs. ${khalti.toLocaleString()}`,
        percent: `${Math.round((khalti / total) * 100)}%`,
        color: "bg-purple-500",
        stroke: "text-purple-500",
        offset: 100 - ((cash + card + esewa) / total) * 100,
      },
    ];
  }, [paymentsData]);

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-800">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Payments
          </h1>
          <div className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-2">
            <span>Home</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-700">Payments</span>
          </div>
        </div>

        <button className="bg-white border border-slate-200 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-all">
          📅{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          {
            title: "Total Collected",
            value: `Rs. ${totalCollected.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            trend: "0% vs yesterday",
            trendColor: "text-slate-400",
            icon: <DollarSign size={22} className="text-emerald-600" />,
            bg: "bg-emerald-100",
          },
          {
            title: "Total Payments",
            value: paymentsData.length.toString(),
            trend: "0 vs yesterday",
            trendColor: "text-slate-400",
            icon: <Receipt size={22} className="text-blue-600" />,
            bg: "bg-blue-100",
          },
          {
            title: "Average Payment",
            value: `Rs. ${avgPayment.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            trend: "0% vs yesterday",
            trendColor: "text-slate-400",
            icon: <CreditCard size={22} className="text-amber-600" />,
            bg: "bg-amber-100",
          },
          {
            title: "Refunds",
            value: "Rs. 0.00",
            trend: "0% vs yesterday",
            trendColor: "text-slate-400",
            icon: <Undo2 size={22} className="text-purple-600" />,
            bg: "bg-purple-100",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {stat.title}
              </p>
              <h2 className="text-2xl font-bold text-slate-800">
                {stat.value}
              </h2>
              <p className={`text-xs font-semibold mt-1 ${stat.trendColor}`}>
                {stat.trend}
              </p>
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
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
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
                  <th className="py-4 px-6 border-b border-slate-100">
                    Payment ID
                  </th>
                  <th className="py-4 px-6 border-b border-slate-100">
                    Order ID
                  </th>
                  <th className="py-4 px-6 border-b border-slate-100">
                    Customer
                  </th>
                  <th className="py-4 px-6 border-b border-slate-100">
                    Method
                  </th>
                  <th className="py-4 px-6 border-b border-slate-100 text-right">
                    Amount
                  </th>
                  <th className="py-4 px-6 border-b border-slate-100 text-center">
                    Status
                  </th>
                  <th className="py-4 px-6 border-b border-slate-100">Time</th>
                  <th className="py-4 px-6 border-b border-slate-100"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="py-12 text-center text-slate-400 font-medium"
                    >
                      No payments found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedPayments.map((payment, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
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
                        <span className="font-medium text-slate-700">
                          {payment.method}
                        </span>
                      </td>
                      <td className="py-4 px-6 border-b border-slate-50 font-bold text-slate-800 text-right">
                        {payment.amount}
                      </td>
                      <td className="py-4 px-6 border-b border-slate-50 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            payment.status === "Completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : payment.status === "Refunded"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 border-b border-slate-50 text-slate-500 whitespace-nowrap">
                        {payment.time}
                      </td>
                      <td className="py-4 px-6 border-b border-slate-50 text-right relative">
                        <button
                          onClick={() => setActiveDropdownId(activeDropdownId === payment.paymentId ? null : payment.paymentId)}
                          className={`text-slate-400 hover:text-purple-600 transition-colors p-1.5 rounded-md hover:bg-purple-50 ${
                            activeDropdownId === payment.paymentId ? "bg-purple-50 text-purple-600" : ""
                          }`}
                        >
                          <MoreVertical size={18} />
                        </button>

                        {/* Floating Action Menu */}
                        {activeDropdownId === payment.paymentId && (
                          <div ref={menuRef} className="absolute right-12 top-10 bg-white border border-slate-100 shadow-xl rounded-xl w-40 z-50 overflow-hidden animate-slide-in">
                            <button className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors border-b border-slate-50">
                              <Eye size={16} className="text-blue-500" /> View Details
                            </button>
                            <button 
                              onClick={() => { setActiveDropdownId(null); window.print(); }} 
                              className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                            >
                              <Printer size={16} className="text-emerald-500" /> Print Receipt
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 mt-auto">
            <span>
              Showing {filteredPayments.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredPayments.length)} of {filteredPayments.length} entries
            </span>
            <div className="flex gap-1">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-colors shadow-sm ${
                    currentPage === i + 1
                      ? "bg-purple-600 text-white border-transparent"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: OVERVIEW CHART */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6">
            Payment Methods Overview
          </h2>

          <div className="flex justify-center mb-8 relative">
            {/* Elegant SVG Donut Chart Approach matching Recharts styling */}
            <div className="w-48 h-48 relative">
              <svg
                viewBox="0 0 36 36"
                className="w-full h-full transform -rotate-90 drop-shadow-sm"
              >
                {paymentMethodsStats.map((stat, idx) => (
                  <path
                    key={idx}
                    className={stat.stroke}
                    stroke="currentColor"
                    strokeWidth="4.5"
                    strokeDasharray={`${parseFloat(stat.percent)}, 100`}
                    strokeDashoffset={`-${100 - stat.offset}`}
                    fill="none"
                    strokeLinecap="round"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                ))}
              </svg>

              {/* Center Content Data Hole */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Total
                </span>
                <span className="text-xl font-black text-slate-800">
                  Rs. {totalCollected.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-auto">
            {paymentMethodsStats.map((method, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3.5 h-3.5 rounded-full shadow-sm ${method.color}`}
                  ></div>
                  <span className="font-semibold text-slate-700">
                    {method.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    {method.amount}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md w-14 text-center">
                    {method.percent}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
