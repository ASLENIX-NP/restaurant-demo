import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Wallet,
  FileText,
  CreditCard,
  CheckCircle2,
  Receipt,
} from "lucide-react";
import { useOrders } from "../../context/OrderContext";

import "../../styles/billing.css"; // Kept for any global custom overrides

const Billing = () => {
  const { orders = [], fetchOrders } = useOrders();
  const [activeTab, setActiveTab] = useState("All Bills");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBillId, setSelectedBillId] = useState(null);

  useEffect(() => {
    if (fetchOrders) fetchOrders();
  }, [fetchOrders]);

  const billsData = [...orders]
    .sort((a, b) => {
      const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
      const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
      return timeB - timeA;
    })
    .filter((o) => o.status === "Completed")
    .map((o) => {
      const subtotal = (o.items || []).reduce(
        (sum, item) => sum + item.qty * item.price,
        0
      );
      const total = o.amount || subtotal + (subtotal > 0 ? 50 : 0);
      return {
        billNo: o.id,
        orderId: o.id,
        table: o.table || "Walk-in",
        amount: total,
        payment: o.paymentMethod || "Cash",
        status: "Paid",
        time: o.time || "N/A",
        items: o.items || [],
      };
    });

  // Filter bills based on search input
  const filteredBills = billsData.filter(
    (bill) =>
      bill.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.table.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get active selected bill details
  const activeBill = billsData.find((b) => b.billNo === selectedBillId) || null;

  // Helper function for Payment Method badge styling
  const getPaymentBadgeColor = (method) => {
    switch (method) {
      case "Cash":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "UPI":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "Card":
        return "bg-blue-50 text-blue-600 border-blue-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto">
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
              Billing
            </h1>
            <p className="text-slate-400 text-sm mt-0.5 font-medium">
              Dashboard <span className="mx-1.5 text-slate-300">&gt;</span>{" "}
              Billing
            </p>
          </div>
        </div>

        {/* METRICS & STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Revenue Stat Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-yellow-400 shadow-md">
              <Wallet size={24} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">
                Today's Revenue
              </h4>
              <div className="flex items-end gap-2">
                <h2 className="text-2xl font-black text-slate-900">
                  Rs.{" "}
                  {billsData
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
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-md">
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
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-cyan-400 shadow-md">
              <CreditCard size={24} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">
                Average Bill
              </h4>
              <div className="flex items-end gap-2">
                <h2 className="text-2xl font-black text-slate-900">
                  Rs.{" "}
                  {billsData.length > 0
                    ? Math.round(
                        billsData.reduce((sum, b) => sum + b.amount, 0) /
                          billsData.length
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
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Table Controls (Tabs & Search) */}
            <div className="p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
              <div className="flex bg-slate-50 p-1 rounded-xl">
                {["All Bills", "Paid"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                      activeTab === tab
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search bill number..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400 transition-all placeholder:text-slate-400"
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
                            ? "bg-purple-50/40"
                            : "hover:bg-slate-50/80"
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
                            className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider border ${getPaymentBadgeColor(
                              bill.payment
                            )}`}
                          >
                            {bill.payment}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md w-fit">
                            <CheckCircle2 size={12} /> {bill.status}
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
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden sticky top-6">
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
                  <span className="bg-emerald-100 text-emerald-700 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full">
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
                    <span className="text-2xl font-black text-purple-600">
                      Rs. {activeBill.amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Download Invoice Button */}
                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md mt-2">
                  <Download size={16} /> Download Invoice
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Billing;
