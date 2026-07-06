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
  Star,
} from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import Modal from "../../components/ui/Modal";
import { useToast } from "../../context/ToastContext";

import "../../styles/menu.css"; // Kept for any global custom overrides
import apiClient from "../../api/apiClient";
import { useMenuData } from "../../hooks/useMenuData";
import { useQueryClient } from "@tanstack/react-query";

const Menu = () => {
  const queryClient = useQueryClient();
  const { data: menuItems = [], isLoading: loading } = useMenuData();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { showToast } = useToast();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
    isAvailable: true,
    isSpecial: false,
  });

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
    setIsNewCategory(false);
    setNewItem({
      name: "",
      category: "",
      price: "",
      description: "",
      image: "",
      isAvailable: true,
      isSpecial: false,
    });
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setIsEditing(true);
    setEditId(item._id || item.id);
    setIsNewCategory(false);
    setNewItem({
      name: item.name || "",
      category: item.category || "",
      price: item.price || "",
      description: item.description || "",
      image: item.image || "",
      isAvailable: item.isAvailable !== false,
      isSpecial: item.isSpecial || false,
    });
    setShowAddModal(true);
  };

  // Actions
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.category || !newItem.price) {
      showToast("Please fill all required fields", "warning");
      return;
    }

    setSaving(true);
    const url = isEditing
      ? `/api/menu/${editId}`
      : "/api/menu";

    try {
      if (isEditing) {
        await apiClient.put(url, newItem);
      } else {
        await apiClient.post(url, newItem);
      }

      queryClient.invalidateQueries({ queryKey: ['menu'] });

      setShowAddModal(false);
      showToast(isEditing ? "Menu item updated successfully!" : "Menu item added successfully!", "success");
    } catch (error) {
      showToast(`Error: ${error.response?.data?.message || error.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    const id = itemToDelete._id || itemToDelete.id;
    try {
      await apiClient.delete(`/api/menu/${id}`);
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      showToast("Menu item deleted successfully!", "success");
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      showToast(`Error: ${error.response?.data?.message || error.message}`, "error");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("File size must be less than 5MB", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploadingImage(true);
    try {
      const response = await apiClient.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setNewItem({ ...newItem, image: response.data.url });
      showToast("Image uploaded successfully!", "success");
    } catch (error) {
      showToast(`Upload failed: ${error.response?.data?.message || error.message}`, "error");
    } finally {
      setUploadingImage(false);
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
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
            >
              <Plus size={16} /> Add New Item
            </button>
          </div>
        </div>

        {/* METRICS & STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
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

          <div className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
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

          <div className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
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

          <div className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
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

          <div className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
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

          <div className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
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
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
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
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 transition-all placeholder:text-slate-400 shadow-sm"
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
                          #MNU-
                          {(item._id || item.id)
                            ?.toString()
                            .slice(-5)
                            .toUpperCase()}
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
                              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                {item.name}
                                {item.isSpecial && (
                                  <span className="bg-amber-100 text-amber-600 text-[9px] px-1.5 py-0.5 rounded-lg uppercase font-black tracking-wider flex items-center gap-0.5">
                                    <Star size={10} fill="currentColor" />{""}
                                    Special
                                  </span>
                                )}
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
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
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
                              onClick={() => confirmDelete(item)}
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

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={isEditing ? "Edit Menu Item" : "Add New Menu Item"}
        icon={isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
        maxWidth="max-w-lg"
      >
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
              className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all font-medium text-sm"
              placeholder="e.g. Cheese Burger"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Category *
                </label>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsNewCategory(!isNewCategory);
                    setNewItem({ ...newItem, category: "" });
                  }}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider"
                >
                  {isNewCategory ? "Select Existing" : "+ Add New"}
                </button>
              </div>
              
              {isNewCategory ? (
                <input
                  type="text"
                  required
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                  placeholder="Enter new category name"
                />
              ) : (
                <select
                  required
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all font-medium text-sm cursor-pointer"
                >
                  <option value="" disabled>Select a category...</option>
                  {[...new Set(menuItems.map((item) => item.category).filter(Boolean))].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              )}
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
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Food Image
            </label>
            <div className="flex gap-4 items-end">
              <div 
                className="w-24 h-24 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative group"
              >
                {newItem.image ? (
                  <>
                    <img 
                      src={newItem.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        type="button"
                        onClick={() => setNewItem({...newItem, image: ""})}
                        className="p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 shadow-md transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                ) : (
                  <ImageIcon size={28} className="text-slate-300" />
                )}
              </div>
              <div className="flex-1 pb-1">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/jpeg, image/png, image/webp, image/gif, image/svg+xml"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <label 
                  htmlFor="imageUpload"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm cursor-pointer transition-colors border ${
                    uploadingImage 
                      ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed" 
                      : "bg-white border-slate-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200"
                  }`}
                >
                  <FolderOpen size={16} />
                  {uploadingImage ? "Uploading..." : "Upload Image"}
                </label>
                <p className="text-[10px] font-medium text-slate-400 mt-2 ml-1">
                  Max size: 5MB. Formats: JPG, PNG, WEBP, GIF.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all font-medium text-sm cursor-pointer"
              >
                <option value="true">Active (Available)</option>
                <option value="false">Inactive (Unavailable)</option>
              </select>
            </div>

            {/* Special Checkbox */}
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newItem.isSpecial}
                  onChange={(e) =>
                    setNewItem({ ...newItem, isSpecial: e.target.checked })
                  }
                  className="w-5 h-5 accent-amber-500 border-slate-300 rounded cursor-pointer"
                />
                <span className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Star
                    size={16}
                    className="text-amber-500"
                    fill="currentColor"
                  />{" "}
                  Chef's Special
                </span>
              </label>
            </div>
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
              className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all font-medium text-sm resize-none"
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
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Menu Item"
        icon={<Trash2 size={18} className="text-rose-500" />}
        maxWidth="max-w-sm"
      >
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-4 shadow-sm">
              <Trash2 size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Delete Item</h3>
            <p className="text-sm text-slate-500 font-medium mb-8">
              Are you sure you want to delete <span className="font-bold text-slate-700">{itemToDelete?.name}</span>? This action cannot be undone.
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-rose-600 text-white font-bold py-3 rounded-xl hover:bg-rose-700 shadow-md transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Menu;
