import React from "react";
import { ShoppingCart } from "lucide-react";

const POS = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Point of Sale</h1>
        <p className="text-slate-500">Fast checkout for walk-in customers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Grid (Left Side) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-black mb-4">Categories</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 font-bold transition">
              🍔 Burgers
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 font-bold transition">
              🍕 Pizzas
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 font-bold transition">
              🍹 Drinks
            </div>
          </div>
          <div className="min-h-[300px] border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-medium">
            Select a category to view items
          </div>
        </div>

        {/* Cart / Ticket (Right Side) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px]">
          <h2 className="text-lg font-black flex items-center gap-2 mb-4">
            <ShoppingCart size={20} className="text-emerald-500" /> Current Ticket
          </h2>
          <div className="flex-1 border border-slate-100 bg-slate-50/50 rounded-xl flex flex-col items-center justify-center text-slate-400 font-medium mb-4 p-4">
            Cart is empty
          </div>
          <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition shadow-md">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;