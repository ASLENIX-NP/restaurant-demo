import React from "react";
import { Search } from "lucide-react";

const Customers = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Loyalty & Customers</h1>
        <p className="text-slate-500">Track returning guests and points</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative w-full md:w-1/2 mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by phone number or name..." 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 transition font-medium"
          />
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="p-4 rounded-tl-xl">Name</th>
              <th className="p-4">Phone Number</th>
              <th className="p-4">Total Visits</th>
              <th className="p-4">Loyalty Points</th>
              <th className="p-4 rounded-tr-xl">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            <tr>
              <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">
                No customers found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;