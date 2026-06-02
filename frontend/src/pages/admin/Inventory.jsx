import React, { useState } from "react";
import {
  Search,
  Plus,
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Edit2,
  Trash2,
  SlidersHorizontal,
  History,
  Settings2,
  FolderPlus,
  Truck,
  X
} from "lucide-react";

import "../../styles/inventory.css"; // Kept for any global custom overrides

// Initial dummy data
const initialInventoryItems = [
  {
    code: "INV-001",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=120&auto=format&fit=crop",
    name: "Olive Oil",
    category: "Oils & Sauces",
    unit: "Ltr",
    qty: "12.50",
    status: "In Stock",
    updated: "10:30 AM",
  },
  {
    code: "INV-002",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=120&auto=format&fit=crop",
    name: "Basmati Rice",
    category: "Grains",
    unit: "Kg",
    qty: "45.00",
    status: "In Stock",
    updated: "09:45 AM",
  },
  {
    code: "INV-003",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=120&auto=format&fit=crop",
    name: "Chicken Breast",
    category: "Meat & Poultry",
    unit: "Kg",
    qty: "8.20",
    status: "Low Stock",
    updated: "09:20 AM",
  },
  {
    code: "INV-004",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=120&auto=format&fit=crop",
    name: "Tomatoes",
    category: "Vegetables",
    unit: "Kg",
    qty: "3.00",
    status: "Low Stock",
    updated: "09:10 AM",
  },
  {
    code: "INV-005",
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=120&auto=format&fit=crop",
    name: "Mozzarella Cheese",
    category: "Dairy",
    unit: "Kg",
    qty: "0.00",
    status: "Out of Stock",
    updated: "08:55 AM",
  },
];

const Inventory = () => {
  // State to manage inventory data
  const [items, setItems] = useState(initialInventoryItems);

  // Form/Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemCode, setCurrentItemCode] = useState("");
  
  // Form input fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Grains");
  const [formUnit, setFormUnit] = useState("Kg");
  const [formQty, setFormQty] = useState("0.00");

  // Helper to automatically assign status based on quantity
  const getStatus = (qty) => {
    const q = parseFloat(qty);
    if (q <= 0) return "Out of Stock";
    if (q <= 10) return "Low Stock";
    return "In Stock";
  };

  // Helper for status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "In Stock": return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Low Stock": return "bg-amber-50 text-amber-600 border-amber-200";
      case "Out of Stock": return "bg-rose-50 text-rose-600 border-rose-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // --- ACTIONS ---

  // Open modal for adding a new item
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setFormName("");
    setFormCategory("Grains");
    setFormUnit("Kg");
    setFormQty("0.00");
    setIsModalOpen(true);
  };

  // Open modal pre-filled for editing an existing item
  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setCurrentItemCode(item.code);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormUnit(item.unit);
    setFormQty(item.qty);
    setIsModalOpen(true);
  };

  // Handle Form Submission (Add or Update)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isEditing) {
      // Update existing item
      setItems(items.map(item => 
        item.code === currentItemCode 
          ? { 
              ...item, 
              name: formName, 
              category: formCategory, 
              unit: formUnit, 
              qty: parseFloat(formQty).toFixed(2), 
              status: getStatus(formQty),
              updated: currentTime 
            } 
          : item
      ));
    } else {
      // Create new item
      const newCode = `INV-00${items.length + 1}`;
      const newItem = {
        code: newCode,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=120&auto=format&fit=crop", // default mockup image
        name: formName,
        category: formCategory,
        unit: formUnit,
        qty: parseFloat(formQty).toFixed(2),
        status: getStatus(formQty),
        updated: currentTime
      };
      setItems([...items, newItem]);
    }
    setIsModalOpen(false);
  };

  // Delete Item Action
  const handleDeleteItem = (code) => {
    if (window.confirm(`Are you sure you want to delete item ${code}?`)) {
      setItems(items.filter(item => item.code !== code));
    }
  };

  // Placeholder actions
  const handlePlaceholderAction = (actionName) => {
    alert(`${actionName} feature coming soon!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
              Inventory
            </h1>
            <p className="text-slate-400 text-sm mt-0.5 font-medium">
              Dashboard <span className="mx-1.5 text-slate-300">&gt;</span> Inventory
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => handlePlaceholderAction("Stock Adjustment")}
              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
            >
              <Settings2 size={16} /> Stock Adjustment
            </button>
            <button 
              onClick={() => handlePlaceholderAction("Purchase History")}
              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
            >
              <History size={16} /> Purchase History
            </button>
            <button 
              onClick={handleOpenAddModal}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>
        </div>

        {/* METRICS & STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {/* Total Items */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
              <Package size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Items</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">{items.length}</h2>
              <p className="text-xs font-bold text-slate-400 mt-0.5">All inventory items</p>
            </div>
          </div>

          {/* In Stock */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">In Stock</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {items.filter(i => i.status === "In Stock").length}
              </h2>
              <p className="text-xs font-bold text-emerald-500 mt-0.5">Active availability</p>
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Low Stock</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {items.filter(i => i.status === "Low Stock").length}
              </h2>
              <p className="text-xs font-bold text-amber-500 mt-0.5">Requires attention</p>
            </div>
          </div>

          {/* Out of Stock */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <XCircle size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Out of Stock</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {items.filter(i => i.status === "Out of Stock").length}
              </h2>
              <p className="text-xs font-bold text-rose-500 mt-0.5">Needs immediate reorder</p>
            </div>
          </div>
        </div>

        {/* MAIN WORKSPACE SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: TABLE SECTION */}
          <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            
            {/* Filter Bar */}
            <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-center bg-slate-50/50">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search item..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-400 transition-all placeholder:text-slate-400"
                />
              </div>
              <select className="bg-white border border-slate-200 text-slate-600 text-sm rounded-xl px-4 py-2 outline-none focus:border-purple-400 font-medium">
                <option>All Categories</option>
              </select>
              <select className="bg-white border border-slate-200 text-slate-600 text-sm rounded-xl px-4 py-2 outline-none focus:border-purple-400 font-medium">
                <option>All Units</option>
              </select>
              <select className="bg-white border border-slate-200 text-slate-600 text-sm rounded-xl px-4 py-2 outline-none focus:border-purple-400 font-medium">
                <option>All Status</option>
              </select>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition">
                <SlidersHorizontal size={14} /> Filter
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white text-slate-400 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                  <tr>
                    <th className="p-4 pl-6">Item Code</th>
                    <th className="p-4">Item Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Unit</th>
                    <th className="p-4 text-center">Stock Qty</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4">Last Updated</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {items.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4 pl-6 font-bold text-slate-600">{item.code}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-sm"
                          />
                          <span className="font-bold text-slate-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-500">{item.category}</td>
                      <td className="p-4 font-medium text-slate-500">{item.unit}</td>
                      <td className="p-4 text-center font-black text-slate-900">{item.qty}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider border ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-400 text-xs">{item.updated}</td>
                      <td className="p-4 pr-6">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item.code)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: SIDEBAR WIDGETS */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Low Stock Alerts */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" /> Low Stock Alerts
              </h3>
              <div className="space-y-3">
                {items.filter(i => i.status === "Low Stock" || i.status === "Out of Stock").map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.category}</p>
                    </div>
                    <span className={`font-black text-sm ${item.status === "Out of Stock" ? "text-rose-600" : "text-amber-600"}`}>
                      {item.qty} {item.unit}
                    </span>
                  </div>
                ))}
                {items.filter(i => i.status === "Low Stock" || i.status === "Out of Stock").length === 0 && (
                  <p className="text-sm text-slate-400 font-medium text-center py-4">No alerts at this time.</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-black text-slate-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleOpenAddModal} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-purple-50 hover:text-purple-600 text-slate-600 rounded-xl border border-slate-100 transition-colors font-semibold text-xs">
                  <Plus size={20} /> Add Item
                </button>
                <button onClick={() => handlePlaceholderAction("Stock Adjustment")} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-orange-50 hover:text-orange-600 text-slate-600 rounded-xl border border-slate-100 transition-colors font-semibold text-xs text-center leading-tight">
                  <Settings2 size={20} /> Stock Adjust
                </button>
                <button onClick={() => handlePlaceholderAction("Add Category")} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 rounded-xl border border-slate-100 transition-colors font-semibold text-xs text-center leading-tight">
                  <FolderPlus size={20} /> Category
                </button>
                <button onClick={() => handlePlaceholderAction("Suppliers")} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-xl border border-slate-100 transition-colors font-semibold text-xs">
                  <Truck size={20} /> Suppliers
                </button>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* STYLED MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-in">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                {isEditing ? <Edit2 size={18} className="text-blue-500"/> : <Plus size={18} className="text-purple-500"/>}
                {isEditing ? "Edit Inventory Item" : "Add New Item"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Item Name</label>
                <input 
                  type="text" 
                  required 
                  value={formName} 
                  onChange={(e) => setFormName(e.target.value)} 
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                  placeholder="e.g. Olive Oil"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Category</label>
                  <select 
                    value={formCategory} 
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                  >
                    <option value="Oils & Sauces">Oils & Sauces</option>
                    <option value="Grains">Grains</option>
                    <option value="Meat & Poultry">Meat & Poultry</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Dairy">Dairy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Unit</label>
                  <select 
                    value={formUnit} 
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                  >
                    <option value="Kg">Kg</option>
                    <option value="Ltr">Ltr</option>
                    <option value="Pcs">Pcs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Stock Quantity</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  value={formQty} 
                  onChange={(e) => setFormQty(e.target.value)} 
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-black text-slate-900"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 mt-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 shadow-md transition"
                >
                  {isEditing ? "Save Changes" : "Add Item"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Inventory;