import React, { useState } from "react";
import {
  Search,
  Printer,
  CreditCard,
  Wallet,
  Receipt,
  CheckCircle,
  Percent,
  Coins
} from "lucide-react";

const pendingBillsData = [
  {
    id: "INV-1025",
    table: "Table 2",
    customer: "Walk-in Customer",
    amount: 1150,
    status: "Unpaid",
    time: "7:45 PM",
    date: "2026/05/27",
    items: [
      { name: "Burger", qty: 1, price: 350 },
      { name: "Pizza", qty: 1, price: 700 },
      { name: "Coke", qty: 1, price: 100 },
    ],
  },
  {
    id: "INV-1026",
    table: "Table 5",
    customer: "John Doe",
    amount: 600,
    status: "Partial",
    time: "8:10 PM",
    date: "2026/05/27",
    items: [
      { name: "Pizza", qty: 1, price: 600 },
    ],
  },
  {
    id: "INV-1027",
    table: "Table 1",
    customer: "Emily Smith",
    amount: 800,
    status: "Unpaid",
    time: "8:25 PM",
    date: "2026/05/27",
    items: [
      { name: "Burger", qty: 2, price: 350 },
      { name: "Coke", qty: 1, price: 100 },
    ],
  },
];

export default function PendingBillsPage() {
  const [selectedInvoice, setSelectedInvoice] = useState(pendingBillsData[0]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  
  // Dynamic Discount Tracking Hooks
  const [discountType, setDiscountType] = useState("percentage"); // "percentage" | "flat"
  const [discountValue, setDiscountValue] = useState(0);

  // 1. Calculate Base Item Subtotal
  const subtotal = selectedInvoice.items.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  // 2. Compute discount dynamic reductions sequence safely
  let discountAmount = 0;
  if (discountType === "percentage") {
    const safePercent = Math.min(Math.max(discountValue, 0), 100);
    discountAmount = subtotal * (safePercent / 100);
  } else if (discountType === "flat") {
    discountAmount = Math.min(Math.max(discountValue, 0), subtotal);
  }

  // 3. Compute subsequent conditional Taxable Base, VAT and final Grand Total
  const taxableAmount = subtotal - discountAmount;
  const vat = taxableAmount * 0.13; // 13% standard VAT calculated post-discount
  const serviceCharge = 50;
  const total = taxableAmount + vat + serviceCharge;

  // Reset local discount tracking inputs whenever active selected layout targets switch
  const handleSelectInvoice = (bill) => {
    setSelectedInvoice(bill);
    setDiscountValue(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto">
        
        {/* PAGE HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
              Pending Bills
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Manage all unpaid customer invoices
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-sm w-64 focus-within:border-purple-400 transition-all">
              <Search size={16} className="text-slate-400" />
              <input
                placeholder="Search..."
                className="outline-none bg-transparent text-sm w-full placeholder:text-slate-400"
              />
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm shadow-purple-200 transition">
              Today
            </button>
          </div>
        </div>

        {/* SUMMARY METRIC OVERVIEW CARDS */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          {[
            { title: "Pending Bills", value: "28", color: "text-red-500" },
            { title: "Total Due", value: "Rs. 24,500", color: "text-purple-600" },
            { title: "Partial Payments", value: "12", color: "text-orange-500" },
            { title: "Completed Today", value: "45", color: "text-green-500" },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                {card.title}
              </p>
              <h2 className={`text-[26px] font-bold mt-1.5 ${card.color}`}>
                {card.value}
              </h2>
            </div>
          ))}
        </div>

        {/* MAIN WORKSPACE CONTENT SPLIT */}
        <div className="grid grid-cols-12 gap-6 items-start">
          
          {/* LEFT INVOICES LIST */}
          <div className="col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col max-h-[calc(100vh-320px)] overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-2">
              <h2 className="text-base font-bold text-slate-900">
                Pending Invoices
              </h2>
              <div className="bg-slate-50 border border-slate-200/60 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 max-w-[150px] focus-within:max-w-[180px] transition-all">
                <Search size={14} className="text-slate-400" />
                <input
                  placeholder="Search..."
                  className="bg-transparent outline-none text-xs w-full text-slate-600 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {pendingBillsData.map((bill) => {
                const isSelected = selectedInvoice.id === bill.id;
                return (
                  <div
                    key={bill.id}
                    onClick={() => handleSelectInvoice(bill)}
                    className={`border rounded-2xl p-4 transition-all cursor-pointer ${
                      isSelected
                        ? "border-purple-500 bg-purple-50/20 shadow-sm"
                        : "border-slate-200/80 bg-white hover:shadow-md hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{bill.id}</h3>
                        <p className="text-slate-400 text-xs mt-0.5">{bill.customer}</p>
                      </div>
                      <div className="text-right">
                        <h3 className="font-bold text-slate-900 text-sm">Rs. {bill.amount}</h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                            bill.status === "Unpaid"
                              ? "bg-red-50 text-red-500"
                              : "bg-orange-50 text-orange-500"
                          }`}
                        >
                          {bill.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between mt-3.5 text-xs text-slate-400 font-medium">
                      <span>{bill.table}</span>
                      <span>{bill.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT DETAILED PREVIEW AND PAYMENT COMPONENT */}
          <div className="col-span-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            
            {/* INVOICE DETAIL CONTROL HEADER */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Invoice Details</h2>
                <p className="text-purple-600 font-semibold text-xs mt-0.5">{selectedInvoice.id}</p>
              </div>
              <button className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow-sm shadow-purple-100">
                <Printer size={14} />
                Print Bill
              </button>
            </div>

            {/* CUSTOMER INFO BREAKDOWN METRICS */}
            <div className="grid grid-cols-4 gap-3.5 mb-6">
              {[
                ["Customer", selectedInvoice.customer],
                ["Table", selectedInvoice.table],
                ["Date", selectedInvoice.date],
                ["Time", selectedInvoice.time],
              ].map(([label, value]) => (
                <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                  <p className="text-slate-400 text-[11px] font-medium tracking-wide uppercase">{label}</p>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5 truncate">{value}</h3>
                </div>
              ))}
            </div>

            {/* SEGMENTED ITEMS DISH LISTING TABLE */}
            <div className="overflow-hidden rounded-xl border border-slate-100 mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50/70 border-b border-slate-100 font-semibold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 pl-4">Item</th>
                    <th className="p-3.5 text-center">Qty</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5 pr-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {selectedInvoice.items.map((item) => (
                    <tr key={item.name} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-3.5 pl-4 text-slate-900 font-semibold">{item.name}</td>
                      <td className="p-3.5 text-center text-slate-500">{item.qty}</td>
                      <td className="p-3.5 text-slate-500">Rs. {item.price}</td>
                      <td className="p-3.5 pr-4 text-right text-slate-900 font-semibold">Rs. {item.qty * item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CONTROLS SUB-GRID REGION */}
            <div className="grid grid-cols-12 gap-6">
              
              {/* CHANNELS GATEWAY BUTTONS GRID */}
              <div className="col-span-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Payment Method</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "Cash", icon: <Wallet size={16} /> },
                      { name: "Card", icon: <CreditCard size={16} /> },
                      { name: "eSewa", icon: <Receipt size={16} /> },
                      { name: "Khalti", icon: <Wallet size={16} /> },
                    ].map((method) => {
                      const isActive = paymentMethod === method.name;
                      return (
                        <button
                          key={method.name}
                          onClick={() => setPaymentMethod(method.name)}
                          className={`border rounded-xl p-3.5 flex items-center justify-center gap-2 font-semibold text-xs transition-all ${
                            isActive
                              ? "bg-purple-600 border-purple-600 text-white shadow-sm shadow-purple-100"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {method.icon}
                          {method.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DYNAMIC DISCOUNT INPUT BLOCK */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Apply Bill Discount</h3>
                  
                  {/* Selector Tabs for Rate Options */}
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => { setDiscountType("percentage"); setDiscountValue(0); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                        discountType === "percentage" 
                          ? "bg-purple-50 border-purple-200 text-purple-700" 
                          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <Percent size={13} /> Percentage (%)
                    </button>
                    <button
                      onClick={() => { setDiscountType("flat"); setDiscountValue(0); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                        discountType === "flat" 
                          ? "bg-purple-50 border-purple-200 text-purple-700" 
                          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <Coins size={13} /> Flat Rate (Rs.)
                    </button>
                  </div>

                  {/* Operational Input Box */}
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      min="0"
                      max={discountType === "percentage" ? 100 : subtotal}
                      value={discountValue || ""}
                      onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                      placeholder={discountType === "percentage" ? "Enter percentage (e.g. 10)" : "Enter amount (e.g. 150)"}
                      className="w-full bg-white border border-slate-200 text-sm px-3 py-2.5 rounded-xl outline-none focus:border-purple-400 shadow-sm placeholder:text-slate-400"
                    />
                    <span className="absolute right-4 text-xs font-bold text-slate-400 pointer-events-none">
                      {discountType === "percentage" ? "%" : "Rs."}
                    </span>
                  </div>
                </div>
              </div>

              {/* CALCULATION BILL BREAKDOWN AREA */}
              <div className="col-span-6 bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3.5">
                    Payment Summary
                  </h3>
                  <div className="space-y-2 text-xs font-medium text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-slate-900 font-semibold">Rs. {subtotal}</span>
                    </div>

                    {/* Live Recalculating Discount Row */}
                    <div className="flex justify-between text-red-500">
                      <span>Discount ({discountType === "percentage" ? `${Math.min(Math.max(discountValue, 0), 100)}%` : "Flat"})</span>
                      <span className="font-semibold">- Rs. {discountAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-slate-400 text-[11px] italic">
                      <span>Taxable Amount</span>
                      <span>Rs. {taxableAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>VAT (13%)</span>
                      <span className="text-slate-900 font-semibold">Rs. {vat.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between pb-3 border-b border-slate-200/60">
                      <span>Service Charge</span>
                      <span className="text-slate-900 font-semibold">Rs. {serviceCharge}</span>
                    </div>
                    
                    <div className="pt-2.5 flex justify-between items-baseline text-purple-600">
                      <span className="font-bold text-sm">Total</span>
                      <span className="text-xl font-extrabold">Rs. {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* FINAL PROCESSING ACTION DISPATCH BUTTONS */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-3 rounded-xl transition shadow-sm shadow-orange-100">
                    Partial Payment
                  </button>
                  <button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-95 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm shadow-purple-100">
                    <CheckCircle size={14} />
                    Complete Payment
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}