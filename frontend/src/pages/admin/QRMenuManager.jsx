import React, { useState, useEffect } from"react";
import { QrCode, Star, Eye, EyeOff, Search, Printer, X } from"lucide-react";
import { QRCodeSVG } from"qrcode.react";
import { io } from "socket.io-client";
import apiClient from "../../api/apiClient";
import { useToast } from "../../context/ToastContext";
import { useMenuData } from "../../hooks/useMenuData";
import { useQueryClient } from "@tanstack/react-query";

const QRMenuManager = () => {
  const queryClient = useQueryClient();
  const { data: menuItems = [] } = useMenuData();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const { showToast } = useToast();

  const [showQRModal, setShowQRModal] = useState(false);
  // Redirects the user to the Customer Menu page
  const targetUrl = `${window.location.origin}/menu`;

  const toggleVisibility = async (item) => {
    const updatedStatus = item.isAvailable === false ? true : false;
    const { _id, __v, createdAt, updatedAt, id, ...rest } = item;
    try {
      await apiClient.put(`/api/menu/${item._id || item.id}`, {
        ...rest,
        isAvailable: updatedStatus,
      });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      showToast(updatedStatus ? "Item is now visible" : "Item is now hidden", "success");
    } catch (error) {
      console.error("Error updating visibility:", error);
      showToast(
        `Failed to update visibility: ${error.response?.data?.message || error.message}`,
        "error"
      );
    }
  };

  const toggleSpecial = async (item) => {
    const updatedSpecial = !item.isSpecial;
    const { _id, __v, createdAt, updatedAt, id, ...rest } = item;
    try {
      await apiClient.put(`/api/menu/${item._id || item.id}`, {
        ...rest,
        isSpecial: updatedSpecial,
      });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      showToast(updatedSpecial ? "Marked as Chef's Special" : "Removed Chef's Special", "success");
    } catch (error) {
      console.error("Error updating special status:", error);
      showToast(
        `Failed to save the Star status: ${error.response?.data?.message || error.message}`,
        "error"
      );
    }
  };

 const filteredItems = menuItems.filter((item) => {
 const matchesSearch = item.name
 ?.toLowerCase()
 .includes(search.toLowerCase());
 const matchesCategory =
 categoryFilter ==="All Categories" || item.category === categoryFilter;
 return matchesSearch && matchesCategory;
 });

 const categories = [
"All Categories",
 ...new Set(menuItems.map((item) => item.category).filter(Boolean)),
 ];

 return (
 <div className="p-6 max-w-7xl mx-auto bg-slate-50 min-h-screen">
 {/* PRINT-ONLY STYLES FOR QR */}
 <style>
 {`
 @media print {
 @page { margin: 0; size: auto; }
 body * {
 visibility: hidden;
 }
 html, body {
 height: 100%;
 margin: 0;
 padding: 0;
 }
 #printable-qr, #printable-qr * {
 visibility: visible;
 }
 #printable-qr {
 position: fixed;
 top: 0;
 left: 0;
 width: 100vw;
 height: 100vh;
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 text-align: center;
 }
 .qr-print-title {
 font-size: 52px;
 font-weight: 900;
 margin-bottom: 16px;
 color: #2F4858;
 }
 .qr-print-subtitle {
 font-size: 24px;
 margin-bottom: 40px;
 color: #F37021;
 }
 .qr-print-footer {
 margin-top: 40px;
 font-size: 18px;
 color: #2F4858;
 font-weight: bold;
 }
 }
 @media screen {
 #printable-qr {
 display: none;
 }
 }
 `}
 </style>
 {/* Header Section */}
 <div className="flex justify-between items-center mb-8">
 <div>
 <h1 className="text-3xl font-bold text-slate-800">QR Menu Manager</h1>
 <p className="text-slate-500 mt-1">
 Control what customers see on their digital menu
 </p>
 </div>
 <div className="flex gap-3">
 <button
 onClick={() => setShowQRModal(true)}
 className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
 >
 <QrCode size={20} />
 Generate Table QR Codes
 </button>
 </div>
 </div>

 {/* Search and Filter */}
 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4">
 <div className="relative flex-1">
 <Search
 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
 size={20}
 />
 <input
 type="text"
 placeholder="Search menu items..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
 />
 </div>
 <select
 value={categoryFilter}
 onChange={(e) => setCategoryFilter(e.target.value)}
 className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
 >
 {categories.map((cat) => (
 <option key={cat} value={cat}>
 {cat}
 </option>
 ))}
 </select>
 </div>

 {/* Menu List */}
 <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
 <table className="w-full text-left">
 <thead className="bg-slate-100 text-slate-600 text-sm">
 <tr>
 <th className="p-4 font-semibold">Item Name</th>
 <th className="p-4 font-semibold">Category</th>
 <th className="p-4 font-semibold">Price (Rs.)</th>
 <th className="p-4 font-semibold text-center">
 Customer Visibility
 </th>
 <th className="p-4 font-semibold text-center">Chef's Special</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {filteredItems.map((item) => (
 <tr
 key={item._id || item.id}
 className="hover:bg-slate-50 transition-colors"
 >
 <td className="p-4 font-medium text-slate-800">{item.name}</td>
 <td className="p-4 text-slate-500">{item.category}</td>
 <td className="p-4 text-slate-800 font-semibold">
 {item.price}
 </td>

 {/* Visibility Toggle */}
 <td className="p-4 text-center">
 <button
 onClick={() => toggleVisibility(item)}
 className={`flex items-center justify-center gap-2 mx-auto px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
 item.isAvailable !== false
 ?"bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
 :"bg-slate-100 text-slate-500 hover:bg-slate-200"
 }`}
 >
 {item.isAvailable !== false ? (
 <>
 <Eye size={16} /> Visible
 </>
 ) : (
 <>
 <EyeOff size={16} /> Hidden
 </>
 )}
 </button>
 </td>

 {/* Special Toggle */}
 <td className="p-4 text-center">
 <button
 onClick={() => toggleSpecial(item)}
 className={`p-2 rounded-full transition-colors mx-auto block ${
 item.isSpecial
 ?"bg-amber-100 text-amber-500 hover:bg-amber-200"
 :"bg-slate-100 text-slate-300 hover:bg-slate-200"
 }`}
 >
 <Star
 size={20}
 fill={item.isSpecial ?"currentColor" :"none"}
 />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* QR Code Generation Modal */}
 {showQRModal && (
 <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity">
 <div className="bg-white rounded-xl shadow-md w-full max-w-sm overflow-hidden animate-slide-in">
 <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
 <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
 <QrCode size={18} className="text-emerald-500" />
 Scan to Access Portal
 </h2>
 <button
 onClick={() => setShowQRModal(false)}
 className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-lg border border-slate-200 shadow-sm transition"
 >
 <X size={16} />
 </button>
 </div>
 <div className="p-8 flex flex-col items-center justify-center">
 <div className="bg-white p-4 rounded-xl border-2 border-slate-100 shadow-sm mb-4">
 <QRCodeSVG value={targetUrl} size={200} />
 </div>
 <p className="text-center text-sm text-slate-500 font-medium">
 Scan this code from any device to open the menu editor portal.
 </p>
 <button
 onClick={() => window.print()}
 className="mt-6 w-full flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition"
 >
 <Printer size={16} /> Print QR Code
 </button>
 </div>
 </div>
 </div>
 )}

 {/* DEDICATED PRINTABLE QR LAYOUT */}
 {showQRModal && (
 <div id="printable-qr">
 <img src="/logo.png" alt="Logo" style={{ height: "150px", margin: "0 auto 20px auto", display: "block" }} />
 <h1 className="qr-print-title">Scan for Menu!</h1>
 <p className="qr-print-subtitle">
 Point your phone camera here to view our delicious offerings.
 </p>
 <QRCodeSVG value={targetUrl} size={300} fgColor="#2F4858" />
 <p className="qr-print-footer">मिठ्ठो चिया & Tiffin घर</p>
 </div>
 )}
 </div>
 );
};

export default QRMenuManager;
