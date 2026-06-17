import React, { useState, useEffect, useCallback } from "react";
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
  X,
} from "lucide-react";
import { useSocket } from "../../context/SocketContext";

import "../../styles/inventory.css";

const Inventory = () => {
  const socket = useSocket();
  const [items, setItems] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [categories, setCategories] = useState(["Oils & Sauces", "Grains", "Meat & Poultry", "Vegetables", "Dairy"]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemCode, setCurrentItemCode] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [adjustmentItemCode, setAdjustmentItemCode] = useState("");
  const [adjustmentType, setAdjustmentType] = useState("add");
  const [adjustmentQty, setAdjustmentQty] = useState("");

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Grains");
  const [formUnit, setFormUnit] = useState("Kg");
  const [formQty, setFormQty] = useState("0.00");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All Categories");

  const fetchInventory = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/inventory", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.map(item => ({
          ...item,
          updated: new Date(item.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        })));
      }
    } catch (err) { console.error(err); }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/inventory/logs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPurchaseHistory(data.map(log => ({
          id: log._id,
          date: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
          item: log.itemName,
          qty: log.qtyString,
          action: log.action
        })));
      }
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    fetchInventory();
    fetchLogs();
    
    if (!socket) return;
    
    const handleUpdate = () => { fetchInventory(); fetchLogs(); };
    socket.on("inventoryUpdated", handleUpdate);
    
    return () => socket.off("inventoryUpdated", handleUpdate);
  }, [fetchInventory, fetchLogs, socket]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "In Stock": return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Low Stock": return "bg-amber-50 text-amber-600 border-amber-200";
      case "Out of Stock": return "bg-rose-50 text-rose-600 border-rose-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setFormName("");
    setFormCategory(categories[0] || "Grains");
    setFormUnit("Kg");
    setFormQty("0.00");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setCurrentItemCode(item.code);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormUnit(item.unit);
    setFormQty(item.qty);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing 
        ? `http://localhost:5001/api/inventory/${currentItemCode}`
        : `http://localhost:5001/api/inventory`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
        name: formName,
        category: formCategory,
        unit: formUnit,
          qty: formQty,
          image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=120&auto=format&fit=crop"
        })
      });

      if (response.ok) {
        setIsModalOpen(false);
      } else {
        const err = await response.json();
        alert(err.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = (code) => {
    setItemToDelete(code);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`http://localhost:5001/api/inventory/${itemToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenAdjustmentModal = () => {
    setAdjustmentItemCode(items.length > 0 ? items[0].code : "");
    setAdjustmentType("add");
    setAdjustmentQty("");
    setIsAdjustmentModalOpen(true);
  };

  const handleAdjustmentSubmit = async (e) => {
    e.preventDefault();
    if (!adjustmentItemCode || !adjustmentQty || parseFloat(adjustmentQty) <= 0) return;
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`http://localhost:5001/api/inventory/${adjustmentItemCode}/adjust`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: adjustmentType, qty: adjustmentQty })
      });
      if (response.ok) {
        setIsAdjustmentModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (newCategoryName && !categories.includes(newCategoryName)) {
      setCategories([...categories, newCategoryName]);
    }
    setNewCategoryName("");
    setIsCategoryModalOpen(false);
  };

  const handlePlaceholderAction = (actionName) => {
    alert(`${actionName} feature coming soon!`);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All Categories" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Inventory</h1>
            <p className="text-slate-400 text-sm mt-0.5 font-medium">Dashboard <span className="mx-1.5 text-slate-300">&gt;</span> Inventory</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleOpenAdjustmentModal} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all">
              <Settings2 size={16} /> Stock Adjustment
            </button>
            <button onClick={() => setIsHistoryModalOpen(true)} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all">
              <History size={16} /> Purchase History
            </button>
            <button onClick={handleOpenAddModal} className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all">
              <Plus size={16} /> Add Item
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Package size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Items</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{items.length}</h2>
              <p className="text-xs font-bold text-slate-400 mt-0.5">All inventory items</p>
            </div>
          </div>
          <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">In Stock</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{items.filter((i) => i.status === "In Stock").length}</h2>
              <p className="text-xs font-bold text-emerald-500 mt-0.5">Active availability</p>
            </div>
          </div>
          <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Low Stock</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{items.filter((i) => i.status === "Low Stock").length}</h2>
              <p className="text-xs font-bold text-amber-500 mt-0.5">Requires attention</p>
            </div>
          </div>
          <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <XCircle size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Out of Stock</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{items.filter((i) => i.status === "Out of Stock").length}</h2>
              <p className="text-xs font-bold text-rose-500 mt-0.5">Needs immediate reorder</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex flex-col xl:flex-row gap-4 justify-between items-center bg-slate-50/50">
              
              {/* Categories Tab Bar */}
              <div className="inline-flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 overflow-x-auto max-w-full shadow-inner mb-2 xl:mb-0 w-full xl:w-auto">
                {["All Categories", ...categories].map((cat, index) => {
                  const isActive = filterCategory === cat;
                  const count = cat === "All Categories" ? items.length : items.filter(item => item.category === cat).length;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setFilterCategory(cat)}
                      className={`group flex items-center whitespace-nowrap gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 transform active:scale-95 ${
                        isActive
                          ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-200/50 scale-[1.02] z-10"
                          : "text-slate-500 hover:text-slate-700 hover:bg-white/60 hover:shadow-sm"
                      }`}
                    >
                      {cat}
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-colors duration-300 ${
                          isActive
                            ? "bg-slate-200 text-slate-800 ring-1 ring-slate-300/50"
                            : "bg-slate-200/50 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full xl:max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search item or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 transition-all placeholder:text-slate-400 shadow-sm"
                />
              </div>
            </div>

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
                  {filteredItems.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4 pl-6 font-bold text-slate-600">{item.code}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-sm" />
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
                          <button onClick={() => handleOpenEditModal(item)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteClick(item.code)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-slate-500">No items found matching your filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" /> Low Stock Alerts
              </h3>
              <div className="space-y-3">
                {items.filter((i) => i.status === "Low Stock" || i.status === "Out of Stock").map((item, idx) => (
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
                {items.filter((i) => i.status === "Low Stock" || i.status === "Out of Stock").length === 0 && (
                  <p className="text-sm text-slate-400 font-medium text-center py-4">No alerts at this time.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-black text-slate-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleOpenAddModal} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-purple-50 hover:text-purple-600 text-slate-600 rounded-xl border border-slate-100 transition-colors font-semibold text-xs">
                  <Plus size={20} /> Add Item
                </button>
                <button onClick={handleOpenAdjustmentModal} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-orange-50 hover:text-orange-600 text-slate-600 rounded-xl border border-slate-100 transition-colors font-semibold text-xs text-center leading-tight">
                  <Settings2 size={20} /> Stock Adjust
                </button>
                <button onClick={() => setIsCategoryModalOpen(true)} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 rounded-xl border border-slate-100 transition-colors font-semibold text-xs text-center leading-tight">
                  <FolderPlus size={20} /> Category
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-in">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                {isEditing ? <Edit2 size={18} className="text-blue-500" /> : <Plus size={18} className="text-purple-500" />}
                {isEditing ? "Edit Inventory Item" : "Add New Item"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-lg border border-slate-200 shadow-sm"><X size={16} /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Item Name</label>
                <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm" placeholder="e.g. Olive Oil" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Category</label>
                  <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm">
                    {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Unit</label>
                  <select value={formUnit} onChange={(e) => setFormUnit(e.target.value)} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm">
                    <option value="Kg">Kg</option>
                    <option value="Ltr">Ltr</option>
                    <option value="Pcs">Pcs</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Stock Quantity</label>
                <input type="number" step="0.01" min="0" value={formQty} onChange={(e) => setFormQty(e.target.value)} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-black text-slate-900" />
              </div>
              <div className="flex gap-3 pt-4 mt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 shadow-md transition">{isEditing ? "Save Changes" : "Add Item"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADJUSTMENT MODAL */}
      {isAdjustmentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-in">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Settings2 size={18} className="text-orange-500" />
                Stock Adjustment
              </h2>
              <button onClick={() => setIsAdjustmentModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-lg border border-slate-200 shadow-sm"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdjustmentSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Select Item</label>
                <select required value={adjustmentItemCode} onChange={(e) => setAdjustmentItemCode(e.target.value)} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-all font-medium text-sm">
                  <option value="" disabled>Select an item</option>
                  {items.map((item) => <option key={item.code} value={item.code}>{item.name} ({item.code}) - {item.qty} {item.unit}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Adjustment Type</label>
                  <select value={adjustmentType} onChange={(e) => setAdjustmentType(e.target.value)} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-all font-medium text-sm">
                    <option value="add">Add Stock (+)</option>
                    <option value="subtract">Deduct Stock (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Quantity</label>
                  <input type="number" required step="0.01" min="0.01" value={adjustmentQty} onChange={(e) => setAdjustmentQty(e.target.value)} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-all font-black text-slate-900" placeholder="e.g. 5" />
                </div>
              </div>
              <div className="flex gap-3 pt-4 mt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsAdjustmentModalOpen(false)} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 shadow-md transition">Confirm Adjustment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PURCHASE HISTORY MODAL */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-slide-in">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <History size={18} className="text-blue-500" />
                Purchase & Adjustment History
              </h2>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-lg border border-slate-200 shadow-sm"><X size={16} /></button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {purchaseHistory.length === 0 ? (
                <p className="text-center text-slate-500 py-4">No history available.</p>
              ) : (
                <div className="space-y-4">
                  {purchaseHistory.map((record) => (
                    <div key={record.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{record.item}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{record.date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`font-black text-sm block ${record.action.includes('Added') || record.action === 'Purchased' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {record.action.includes('Deducted') ? '-' : '+'}{record.qty}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{record.action}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-in">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FolderPlus size={18} className="text-emerald-500" />
                Add Category
              </h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-lg border border-slate-200 shadow-sm"><X size={16} /></button>
            </div>
            <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Category Name</label>
                <input type="text" required value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 transition-all font-medium text-sm" placeholder="e.g. Beverages" />
              </div>
              <div className="flex gap-3 pt-4 mt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 shadow-md transition">Add Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-slide-in">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-rose-500" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Delete Item?</h2>
            <p className="text-sm text-slate-500 font-medium mb-6">Are you sure you want to remove item <strong>{itemToDelete}</strong>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => { setIsDeleteModalOpen(false); setItemToDelete(null); }} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleConfirmDelete} className="flex-1 bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 shadow-md shadow-rose-200 transition">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
