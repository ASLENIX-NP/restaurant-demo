import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Utensils,
  FolderOpen,
  CheckCircle2,
  XCircle,
  Banknote,
  Flame,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
} from "lucide-react";

import "../../styles/menu.css"; // Kept for any global custom overrides
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../../services/menuService";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
    isAvailable: true,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setMenuItems(data || []);
    } catch (error) {
      console.error("MENU ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Metric Calculations
  const totalItems = menuItems.length;
  const totalCategories = [...new Set(menuItems.map((item) => item.category))]
    .length;
  const activeItems = menuItems.filter(
    (item) => item.isAvailable !== false
  ).length;
  const inactiveItems = menuItems.filter(
    (item) => item.isAvailable === false
  ).length;
  const avgPrice =
    totalItems > 0
      ? Math.round(
          menuItems.reduce((sum, item) => sum + Number(item.price || 0), 0) /
            totalItems
        )
      : 0;
  const popularDish = totalItems > 0 ? menuItems[0]?.name || "-" : "-";

  // Open Add Modal
  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditId(null);
    setNewItem({
      name: "",
      category: "",
      price: "",
      description: "",
      image: "",
      isAvailable: true,
    });
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setIsEditing(true);
    setEditId(item._id || item.id);
    setNewItem({
      name: item.name || "",
      category: item.category || "",
      price: item.price || "",
      description: item.description || "",
      image: item.image || "",
      isAvailable: item.isAvailable !== false,
    });
    setShowAddModal(true);
  };

  // Actions
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.category || !newItem.price) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);

      if (isEditing) {
        const updatedItem = await updateProduct(editId, newItem);
        setMenuItems(
          menuItems.map((item) =>
            item._id === editId || item.id === editId ? updatedItem : item
          )
        );
      } else {
        const addedItem = await addProduct(newItem);
        setMenuItems([...menuItems, addedItem]);
      }

      setIsEditing(false);
      setEditId(null);
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to save product", error);
      alert(
        error.response?.data?.message ||
          "Failed to save menu item. Are you authorized?"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        await deleteProduct(id);
        setMenuItems(
          menuItems.filter((item) => item._id !== id && item.id !== id)
        );
      } catch (error) {
        console.error("Failed to delete product", error);
        alert(error.response?.data?.message || "Failed to delete item.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto pb-12">
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
              Menu Management
            </h1>
            <p className="text-slate-400 text-sm mt-0.5 font-medium">
              Dashboard <span className="mx-1.5 text-slate-300">&gt;</span> Menu
              Management
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
          >
            <Plus size={16} /> Add New Item
          </button>
        </div>

        {/* METRICS & STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Utensils size={18} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                Total Items
              </h4>
              <h2 className="text-xl font-black text-slate-900">
                {totalItems}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <FolderOpen size={18} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                Categories
              </h4>
              <h2 className="text-xl font-black text-slate-900">
                {totalCategories}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                Available
              </h4>
              <h2 className="text-xl font-black text-slate-900">
                {activeItems}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <XCircle size={18} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                Unavailable
              </h4>
              <h2 className="text-xl font-black text-slate-900">
                {inactiveItems}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <Banknote size={18} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                Avg Price
              </h4>
              <h2 className="text-xl font-black text-slate-900">
                Rs. {avgPrice}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <Flame size={18} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                Popular Dish
              </h4>
              <h2 className="text-sm font-black text-slate-900 truncate mt-1">
                {popularDish}
              </h2>
            </div>
          </div>
        </div>

        {/* MAIN DATA TABLE SECTION */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          {/* Controls & Filters Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
            <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
              <button className="px-4 py-1.5 rounded-lg text-sm font-bold bg-slate-900 text-white shadow-sm">
                All Items
              </button>
              {/* Additional category tabs could be mapped here */}
            </div>

            <div className="relative w-full sm:max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search menu items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-400 transition-all placeholder:text-slate-400 shadow-sm"
              />
            </div>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
                <p className="font-semibold text-sm">
                  Loading Menu Products...
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-white text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-100">
                  <tr>
                    <th className="p-4 pl-6 w-16">ID</th>
                    <th className="p-4">Item Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-16 text-slate-400 font-medium"
                      >
                        <Utensils
                          size={32}
                          className="mx-auto mb-3 text-slate-300"
                        />
                        No menu items found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr
                        key={item._id || item.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="p-4 pl-6 font-bold text-slate-400 text-xs">
                          {(item._id || item.id)?.toString().slice(-6)}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                <ImageIcon size={20} />
                              </div>
                            )}
                            <div>
                              <h4 className="font-bold text-slate-900">
                                {item.name}
                              </h4>
                              <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1 max-w-[250px]">
                                {item.description || "No description provided"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-semibold text-slate-600">
                          {item.category || "Uncategorized"}
                        </td>

                        <td className="p-4 font-black text-slate-900">
                          Rs. {item.price}
                        </td>

                        <td className="p-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                              item.isAvailable !== false
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : "bg-rose-50 text-rose-600 border-rose-200"
                            }`}
                          >
                            {item.isAvailable !== false ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="p-4 pr-6">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id || item.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* ADD ITEM MODAL OVERLAY */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-slide-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                {isEditing ? (
                  <Edit2 size={18} className="text-blue-500" />
                ) : (
                  <Plus size={18} className="text-purple-500" />
                )}
                {isEditing ? "Edit Menu Item" : "Add New Menu Item"}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-lg border border-slate-200 shadow-sm transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItem} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                  placeholder="e.g. Cheese Burger"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value })
                    }
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                    placeholder="e.g. Fast Food"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newItem.price}
                    onChange={(e) =>
                      setNewItem({ ...newItem, price: e.target.value })
                    }
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Image URL
                </label>
                <input
                  type="text"
                  value={newItem.image}
                  onChange={(e) =>
                    setNewItem({ ...newItem, image: e.target.value })
                  }
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                  placeholder="https://..."
                />
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  value={newItem.isAvailable}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      isAvailable: e.target.value === "true",
                    })
                  }
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm cursor-pointer"
                >
                  <option value="true">Active (Available)</option>
                  <option value="false">Inactive (Unavailable)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-all font-medium text-sm resize-none"
                  placeholder="Enter a brief description..."
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 mt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 shadow-md transition"
                >
                  {saving
                    ? "Saving..."
                    : isEditing
                    ? "Save Changes"
                    : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
