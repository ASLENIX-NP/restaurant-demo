import React from "react";

const ShiftManagement = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Shift & Drawer</h1>
        <p className="text-slate-500">Manage your cash flow and daily closing reports</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900">Current Shift Details</h2>
          <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">Active</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-500 font-medium">Starting Cash Float</span>
            <span className="font-bold text-slate-900">Rs. 0</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-500 font-medium">Cash Sales Today</span>
            <span className="font-bold text-slate-900">Rs. 0</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-500 font-medium">Card/Digital Sales</span>
            <span className="font-bold text-slate-900">Rs. 0</span>
          </div>
          <div className="flex justify-between pt-3">
            <span className="text-lg font-black text-slate-900">Expected Cash in Drawer</span>
            <span className="text-lg font-black text-emerald-600">Rs. 0</span>
          </div>
        </div>
        <div className="mt-8 flex gap-4">
          <button className="flex-1 bg-amber-100 text-amber-600 border border-amber-200 font-bold py-3 rounded-xl hover:bg-amber-200 transition">Cash Payout / Drop</button>
          <button className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-md">Close Shift (Z-Report)</button>
        </div>
      </div>
    </div>
  );
};

export default ShiftManagement;