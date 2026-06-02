import React from "react";
import { 
  Save, 
  Store, 
  Receipt, 
  Printer, 
  CreditCard, 
  Settings as SettingsIcon,
  UserCircle,
  Shield,
  ShieldCheck,
  Smartphone,
  History,
  LogOut,
  Database,
  Download,
  Upload,
  RefreshCw,
  Crown,
  Camera,
  ChevronDown
} from "lucide-react";

import "../../styles/settings.css"; // Kept for any global custom overrides

const Settings = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto pb-12">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Settings</h1>
            <p className="text-slate-400 text-sm mt-0.5 font-medium">
              Dashboard <span className="mx-1.5 text-slate-300">&gt;</span> Settings
            </p>
          </div>
          <button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all">
            <Save size={16} /> Save Changes
          </button>
        </div>

        {/* MAIN WORKSPACE SPLIT */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: PRIMARY CONFIGURATION FORMS */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* RESTAURANT INFO */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Store size={20} />
                </div>
                <h2 className="text-lg font-black text-slate-900">Restaurant Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Restaurant Name</label>
                  <input type="text" defaultValue="Aslenix Restaurant" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-semibold text-sm text-slate-700" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Branch Name</label>
                  <input type="text" defaultValue="Main Branch" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-semibold text-sm text-slate-700" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input type="email" defaultValue="restaurant@gmail.com" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-semibold text-sm text-slate-700" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input type="text" defaultValue="+977 9812345678" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-semibold text-sm text-slate-700" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">PAN / VAT Number</label>
                  <input type="text" defaultValue="123456789" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-semibold text-sm text-slate-700" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Website</label>
                  <input type="text" defaultValue="www.aslenix.com" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-semibold text-sm text-slate-700" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Address</label>
                  <textarea rows="3" defaultValue="Kathmandu, Nepal" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-semibold text-sm text-slate-700 resize-none" />
                </div>
              </div>
            </div>

            {/* TWO COLUMN SUB-GRID FOR TAX & PRINTER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* TAX SETTINGS */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Receipt size={20} />
                  </div>
                  <h2 className="text-lg font-black text-slate-900">Tax & Billing</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">VAT (%)</label>
                    <input type="number" defaultValue="13" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 transition-all font-semibold text-sm text-slate-700" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Service Charge (%)</label>
                    <input type="number" defaultValue="10" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 transition-all font-semibold text-sm text-slate-700" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Default Discount (%)</label>
                    <input type="number" defaultValue="0" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 transition-all font-semibold text-sm text-slate-700" />
                  </div>
                </div>
              </div>

              {/* PRINTER SETTINGS */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <Printer size={20} />
                  </div>
                  <h2 className="text-lg font-black text-slate-900">Hardware Integration</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kitchen Printer</label>
                    <input type="text" defaultValue="Kitchen Printer 1" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-amber-500 transition-all font-semibold text-sm text-slate-700" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">POS Billing Printer</label>
                    <input type="text" defaultValue="Main POS Printer" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-amber-500 transition-all font-semibold text-sm text-slate-700" />
                  </div>
                  <div className="relative">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Paper Size</label>
                    <select className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-amber-500 transition-all font-semibold text-sm text-slate-700 appearance-none cursor-pointer">
                      <option>80mm (Standard)</option>
                      <option>58mm (Compact)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-[34px] text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

            </div>

            {/* PAYMENT METHODS */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-lg font-black text-slate-900">Accepted Payment Methods</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: "Cash", active: true },
                  { name: "Credit/Debit Card", active: true },
                  { name: "eSewa", active: true },
                  { name: "Khalti", active: true },
                  { name: "FonePay", active: false },
                  { name: "General QR", active: true }
                ].map((method) => (
                  <label key={method.name} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${method.active ? 'border-purple-200 bg-purple-50/30' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                    <span className={`text-sm font-bold ${method.active ? 'text-purple-900' : 'text-slate-600'}`}>{method.name}</span>
                    <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${method.active ? 'bg-purple-600' : 'bg-slate-200'}`}>
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${method.active ? 'translate-x-4' : 'translate-x-1'}`} />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* SYSTEM PREFERENCES */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <SettingsIcon size={20} />
                </div>
                <h2 className="text-lg font-black text-slate-900">System Preferences</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { title: "Dark Mode Interface", desc: "Switch dashboard to dark appearance", active: false },
                  { title: "Push Notifications", desc: "Enable browser alerts for new orders", active: true },
                  { title: "Automated Daily Backups", desc: "Securely backup database at 3:00 AM", active: true },
                ].map((pref) => (
                  <label key={pref.title} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/60 cursor-pointer transition-all">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{pref.title}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{pref.desc}</p>
                    </div>
                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pref.active ? 'bg-slate-900' : 'bg-slate-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pref.active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: PROFILE & QUICK ACTIONS */}
          <div className="xl:col-span-4 space-y-6">

            {/* PROFILE CARD */}
            <div className="bg-slate-900 rounded-2xl shadow-sm p-8 text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20" />
              
              <div className="relative inline-block mb-4">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Admin" className="w-24 h-24 rounded-full border-4 border-slate-900 shadow-xl object-cover relative z-10 mx-auto" />
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center border-2 border-slate-900 z-20 hover:bg-blue-400 transition-colors">
                  <Camera size={14} />
                </button>
              </div>
              
              <h2 className="text-xl font-black mb-1 relative z-10">Admin User</h2>
              <p className="text-slate-400 text-sm font-medium mb-6 relative z-10">Super Administrator</p>
              
              <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold py-2.5 rounded-xl transition-all text-sm relative z-10">
                View Public Profile
              </button>
            </div>

            {/* ROLE MANAGEMENT */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                <UserCircle size={18} className="text-slate-400" /> Role & Access
              </h3>
              <div className="space-y-2">
                {[
                  { name: "Admin (Full Access)", icon: "👑" },
                  { name: "Manager", icon: "📋" },
                  { name: "Cashier", icon: "💰" },
                  { name: "Chef / Kitchen", icon: "👨‍🍳" },
                  { name: "Waiter / Staff", icon: "🍽️" },
                ].map((role) => (
                  <button key={role.name} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-all text-left">
                    <span className="text-lg">{role.icon}</span> {role.name}
                  </button>
                ))}
              </div>
            </div>

            {/* SECURITY */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                <Shield size={18} className="text-rose-400" /> Account Security
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all text-left">
                  <ShieldCheck size={16} className="text-slate-400"/> Change Password
                </button>
                <button className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all text-left">
                  <Smartphone size={16} className="text-slate-400"/> Two-Factor Authentication
                </button>
                <button className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all text-left">
                  <History size={16} className="text-slate-400"/> Login Activity Log
                </button>
                <button className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-sm transition-all text-left mt-2">
                  <LogOut size={16} /> Terminate All Sessions
                </button>
              </div>
            </div>

            {/* BACKUP & RESTORE */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                <Database size={18} className="text-blue-400" /> Backup & Restore
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 font-semibold text-xs transition-all text-center">
                  <Download size={18} /> Backup DB
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 font-semibold text-xs transition-all text-center">
                  <Upload size={18} /> Export CSV
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 font-semibold text-xs transition-all text-center">
                  <Download size={18} className="rotate-180" /> Import CSV
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 font-semibold text-xs transition-all text-center">
                  <RefreshCw size={18} /> Restore
                </button>
              </div>
            </div>

            {/* BILLING & SUBSCRIPTION */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-purple-100 shadow-sm p-6">
              <h3 className="font-black text-purple-900 mb-4 flex items-center gap-2">
                <Crown size={18} className="text-purple-500" /> Subscription Plan
              </h3>
              
              <div className="space-y-2 mb-5">
                <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl">
                  <span className="text-xs font-bold text-slate-500 uppercase">Current Plan</span>
                  <span className="text-sm font-black text-purple-700">Premium Pro</span>
                </div>
                <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl">
                  <span className="text-xs font-bold text-slate-500 uppercase">Renewal Date</span>
                  <span className="text-sm font-bold text-slate-900">June 25, 2026</span>
                </div>
                <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl">
                  <span className="text-xs font-bold text-slate-500 uppercase">Payment</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    Visa •••• 4242
                  </span>
                </div>
              </div>

              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-purple-200 text-sm">
                Manage Subscription
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default Settings;