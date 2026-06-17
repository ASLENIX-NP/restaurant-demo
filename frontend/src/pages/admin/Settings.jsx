import React, { useState } from "react";
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
  Camera,
  ChevronDown,
  ChevronRight,
  Crown,
  ClipboardList,
  Banknote,
  ChefHat,
  Utensils
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../../styles/settings.css"; // Kept for any global custom overrides

const Settings = () => {
  // State for accepted payment methods toggles
  const [paymentMethods, setPaymentMethods] = useState([
    { name: "Cash", active: true },
    { name: "Credit/Debit Card", active: true },
    { name: "eSewa", active: true },
    { name: "Khalti", active: true },
    { name: "FonePay", active: false },
    { name: "General QR", active: true }
  ]);

  // State for system preferences toggles
  const [systemPreferences, setSystemPreferences] = useState([
    { title: "Push Notifications", desc: "Enable browser alerts for new orders", active: true },
    { title: "Automated Daily Backups", desc: "Securely backup database at 3:00 AM", active: true },
  ]);

  // State for tax and billing defaults
  const [taxSettings, setTaxSettings] = useState(() => {
    const saved = localStorage.getItem("restaurant_tax_settings");
    if (saved) return JSON.parse(saved);
    return { vat: 13, serviceCharge: 10, defaultDiscount: 0 };
  });

  const navigate = useNavigate();
  // Tab Navigation State
  const [activeTab, setActiveTab] = useState("General");
  const tabs = [
    { id: "General", icon: Store, desc: "Profile & basic info" },
    { id: "Billing", icon: CreditCard, desc: "Taxes, payments & plans" },
    { id: "Hardware", icon: Printer, desc: "Printers & devices" },
    { id: "Security", icon: Shield, desc: "Access & authentication" },
    { id: "Advanced", icon: SettingsIcon, desc: "System & backups" },
  ];

  // Handle toggling the payment method status
  const togglePaymentMethod = (name) => {
    setPaymentMethods((prevMethods) => 
      prevMethods.map((method) => 
        method.name === name ? { ...method, active: !method.active } : method
      )
    );
  };

  // Handle toggling the system preference status
  const togglePreference = (title) => {
    setSystemPreferences((prevPrefs) =>
      prevPrefs.map((pref) =>
        pref.title === title ? { ...pref, active: !pref.active } : pref
      )
    );
  };

  const handleTaxChange = (e) => {
    const { name, value } = e.target;
    setTaxSettings((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem("restaurant_tax_settings", JSON.stringify(taxSettings));
    alert("Settings saved successfully!");
  };

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
          <button onClick={handleSaveSettings} className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all">
            <Save size={16} /> Save Changes
          </button>
        </div>

        {/* MAIN WORKSPACE: TABBED SETTINGS LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT: SETTINGS NAVIGATION */}
          <div className="w-full lg:w-72 shrink-0 space-y-2 lg:sticky lg:top-6">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group ${
                    isActive 
                      ? "bg-white border-transparent shadow-sm ring-1 ring-slate-200" 
                      : "bg-transparent border-transparent hover:bg-slate-200/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner transition-colors ${
                    isActive ? "bg-slate-900 text-white" : "bg-white text-slate-500 border border-slate-200 group-hover:text-slate-800"
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${isActive ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"}`}>{tab.id}</h3>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">{tab.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
            
          {/* RIGHT: TAB CONTENT */}
          <div className="flex-1 w-full min-w-0">

            {/* ================= GENERAL TAB ================= */}
            {activeTab === "General" && (
              <div className="space-y-6 animate-slide-in">
                
                {/* PROFILE CARD */}
                <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-3xl shadow-2xl p-8 md:p-10 relative overflow-hidden text-white flex flex-col md:flex-row items-center gap-8 border border-slate-600/50 group">
                  <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/30 transition-all duration-700" />
                  <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-purple-500/30 transition-all duration-700" />
                  
                  <div className="relative inline-block shrink-0">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Admin" className="w-28 h-28 rounded-full ring-4 ring-slate-700 shadow-2xl object-cover relative z-10" />
                    <button className="absolute bottom-1 right-1 w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center border-4 border-slate-700 z-20 hover:bg-blue-400 hover:scale-110 transition-all shadow-md">
                      <Camera size={14} />
                    </button>
                  </div>
                  
                  <div className="relative z-10 text-center md:text-left flex-1">
                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-2">
                      <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Admin User</h2>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-md">
                        <ShieldCheck size={14} className="text-blue-400" /> Super Administrator
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-6 max-w-md mx-auto md:mx-0">Manage your personal account settings and organizational access controls from this secure portal.</p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <button className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold py-2.5 px-6 rounded-xl transition-all text-sm backdrop-blur-md flex items-center gap-2">
                        <UserCircle size={16} /> Edit Profile
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all text-sm shadow-lg shadow-blue-900/50 flex items-center gap-2">
                        <Store size={16} /> View Public Page
                      </button>
                    </div>
                  </div>
                </div>

                {/* RESTAURANT INFO */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                  <div className="flex items-center gap-3 mb-8 pb-5 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                      <Store size={22} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900">Restaurant Information</h2>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Manage your public details</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Restaurant Name</label>
                      <input type="text" defaultValue="Aslenix Restaurant" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-sm text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Branch Name</label>
                      <input type="text" defaultValue="Main Branch" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-sm text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input type="email" defaultValue="restaurant@gmail.com" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-sm text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                      <input type="text" defaultValue="+977 9812345678" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-sm text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">PAN / VAT Number</label>
                      <input type="text" defaultValue="123456789" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-sm text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Website</label>
                      <input type="text" defaultValue="www.aslenix.com" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-sm text-slate-900" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Full Address</label>
                      <textarea rows="3" defaultValue="Kathmandu, Nepal" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-sm text-slate-900 resize-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= BILLING & TAXES TAB ================= */}
            {activeTab === "Billing" && (
              <div className="space-y-6 animate-slide-in">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* TAX SETTINGS */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                        <Receipt size={20} />
                      </div>
                      <h2 className="text-lg font-black text-slate-900">Tax & Config</h2>
                    </div>
                    <div className="space-y-5 flex-1">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">VAT (%)</label>
                        <input type="number" name="vat" value={taxSettings.vat} onChange={handleTaxChange} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-black text-sm text-slate-900" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Service Charge (%)</label>
                        <input type="number" name="serviceCharge" value={taxSettings.serviceCharge} onChange={handleTaxChange} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-black text-sm text-slate-900" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Default Discount (%)</label>
                        <input type="number" name="defaultDiscount" value={taxSettings.defaultDiscount} onChange={handleTaxChange} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-black text-sm text-slate-900" />
                      </div>
                    </div>
                  </div>

                  {/* PAYMENT METHODS */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                        <CreditCard size={20} />
                      </div>
                      <h2 className="text-lg font-black text-slate-900">Accepted Methods</h2>
                    </div>
                    
                    <div className="flex flex-col gap-3 flex-1">
                      {paymentMethods.map((method) => (
                        <div 
                          key={method.name} 
                          onClick={() => togglePaymentMethod(method.name)}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${method.active ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'}`}
                        >
                          <span className={`text-sm font-bold ${method.active ? 'text-emerald-900' : 'text-slate-600'}`}>{method.name}</span>
                          <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${method.active ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${method.active ? 'translate-x-6' : 'translate-x-1'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= HARDWARE TAB ================= */}
            {activeTab === "Hardware" && (
              <div className="space-y-6 animate-slide-in">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                  <div className="flex items-center gap-3 mb-8 pb-5 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
                      <Printer size={22} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900">Hardware Integration</h2>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Configure devices and POS hardware</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Kitchen Printer</label>
                      <input type="text" defaultValue="Kitchen Printer 1" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-50 transition-all font-bold text-sm text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">POS Billing Printer</label>
                      <input type="text" defaultValue="Main POS Printer" className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-50 transition-all font-bold text-sm text-slate-900" />
                    </div>
                    <div className="relative">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Paper Size</label>
                      <select className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-50 transition-all font-bold text-sm text-slate-900 appearance-none cursor-pointer">
                        <option>80mm (Standard)</option>
                        <option>58mm (Compact)</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-[38px] text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECURITY TAB ================= */}
            {activeTab === "Security" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in">
                
                {/* ROLE MANAGEMENT */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 shadow-inner">
                      <UserCircle size={20} />
                    </div>
                    <h2 className="text-lg font-black text-slate-900">Role & Access</h2>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: "Admin (Full Access)", icon: Crown, iconColor: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100/60" },
                      { name: "Manager", icon: ClipboardList, iconColor: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100/60" },
                      { name: "Cashier", icon: Banknote, iconColor: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100/60" },
                      { name: "Chef / Kitchen", icon: ChefHat, iconColor: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100/60" },
                      { name: "Waiter / Staff", icon: Utensils, iconColor: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100/60" },
                    ].map((role) => {
                      const Icon = role.icon;
                      return (
                        <button key={role.name} className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 hover:shadow-sm transition-all text-left group">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border ${role.bg} ${role.border}`}>
                              <Icon size={20} className={role.iconColor} />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{role.name}</h4>
                              <p className="text-[11px] font-medium text-slate-400 mt-0.5">Manage permissions & access</p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SECURITY */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-inner">
                      <Shield size={20} />
                    </div>
                    <h2 className="text-lg font-black text-slate-900">Account Security</h2>
                  </div>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all text-left shadow-sm">
                      <ShieldCheck size={18} className="text-slate-400"/> Change Password
                    </button>
                    <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all text-left shadow-sm">
                      <Smartphone size={18} className="text-slate-400"/> Two-Factor Authentication
                    </button>
                    <button onClick={() => navigate("/admin/user-log")} className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all text-left shadow-sm">
                      <History size={18} className="text-slate-400"/> Login Activity Log
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-300 font-black text-sm transition-all text-left mt-6 shadow-sm">
                      <LogOut size={16} /> Terminate All Sessions
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= ADVANCED TAB ================= */}
            {activeTab === "Advanced" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in">
                
                {/* SYSTEM PREFERENCES */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shadow-inner">
                      <SettingsIcon size={20} />
                    </div>
                    <h2 className="text-lg font-black text-slate-900">System Preferences</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {systemPreferences.map((pref) => (
                      <div 
                        key={pref.title} 
                        onClick={() => togglePreference(pref.title)}
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/60 cursor-pointer transition-all"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{pref.title}</h4>
                          <p className="text-[11px] font-medium text-slate-500 mt-0.5">{pref.desc}</p>
                        </div>
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pref.active ? 'bg-slate-900' : 'bg-slate-200'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${pref.active ? 'translate-x-6' : 'translate-x-1'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BACKUP & RESTORE */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-inner">
                      <Database size={20} />
                    </div>
                    <h2 className="text-lg font-black text-slate-900">Backup & Restore</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 font-bold text-xs transition-all text-center shadow-sm">
                      <Download size={20} /> Backup DB
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 font-bold text-xs transition-all text-center shadow-sm">
                      <Upload size={20} /> Export CSV
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 font-bold text-xs transition-all text-center shadow-sm">
                      <Download size={20} className="rotate-180" /> Import CSV
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 font-bold text-xs transition-all text-center shadow-sm">
                      <RefreshCw size={20} /> Restore
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;