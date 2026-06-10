import React, { useState, useEffect } from "react";
import { QrCode, Star, Eye, EyeOff, Search, Printer, X, RefreshCw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const initialMenuData = [
  // OUR SPECIAL
  { id: "sp1", name: "Buff Sukuti/Chiura", price: 300, category: "OUR SPECIAL", isSpecial: true, isAvailable: true },
  { id: "sp2", name: "Piro Aaloo/Chiura", price: 180, category: "OUR SPECIAL", isSpecial: true, isAvailable: true },
  { id: "sp3", name: "Chicken Chop", price: 250, category: "OUR SPECIAL", isSpecial: true, isAvailable: true },
  { id: "sp4", name: "Buff Choila", price: 350, category: "OUR SPECIAL", isSpecial: true, isAvailable: true },
  { id: "sp5", name: "Chicken Choila", price: 370, category: "OUR SPECIAL", isSpecial: true, isAvailable: true },
  { id: "sp6", name: "Chiura", price: 40, category: "OUR SPECIAL", isSpecial: true, isAvailable: true },
  { id: "sp7", name: "Chicken Chopsy", price: 350, category: "OUR SPECIAL", isSpecial: true, isAvailable: true },
  { id: "sp8", name: "American Chopsy", price: 380, category: "OUR SPECIAL", isSpecial: true, isAvailable: true },

  // BREAKFAST
  { id: "bf1", name: "Boiled Egg", price: 80, category: "BREAKFAST", isAvailable: true },
  { id: "bf2", name: "Plain Omelette", price: 80, category: "BREAKFAST", isAvailable: true },
  { id: "bf3", name: "Masala Omelette", price: 100, category: "BREAKFAST", isAvailable: true },
  { id: "bf4", name: "Bread Omelette", price: 180, category: "BREAKFAST", isAvailable: true },

  // SNACKS
  { id: "sn1", name: "French Fries", price: 140, category: "SNACKS", isAvailable: true },
  { id: "sn2", name: "Masala French Fries", price: 180, category: "SNACKS", isAvailable: true },
  { id: "sn3", name: "Chilly French Fries", price: 230, category: "SNACKS", isAvailable: true },
  { id: "sn4", name: "Aaloo Chop", price: 100, category: "SNACKS", isAvailable: true },
  { id: "sn5", name: "Slice Chop", price: 100, category: "SNACKS", isAvailable: true },
  { id: "sn6", name: "Pakoda", price: 100, category: "SNACKS", isAvailable: true },
  { id: "sn7", name: "Samosa (2pcs)", price: 70, category: "SNACKS", isAvailable: true },
  { id: "sn8", name: "Mustang Aaloo", price: 180, category: "SNACKS", isAvailable: true },
  { id: "sn9", name: "Chicken Chilly", price: 320, category: "SNACKS", isAvailable: true },
  { id: "sn10", name: "Chau Chau Sadeko", price: 110, category: "SNACKS", isAvailable: true },
  { id: "sn11", name: "Nimki", price: 50, category: "SNACKS", isAvailable: true },
  { id: "sn12", name: "Sausage 2Pcs (Buff)", price: 100, category: "SNACKS", isAvailable: true },
  { id: "sn13", name: "Sausage 2Pcs (Chicken)", price: 110, category: "SNACKS", isAvailable: true },
  { id: "sn14", name: "Peanuts Sadeko", price: 160, category: "SNACKS", isAvailable: true },
  { id: "sn15", name: "Bhatmas Sadeko", price: 150, category: "SNACKS", isAvailable: true },

  // HOT BEVERAGE
  { id: "hb1", name: "Milk Tea (Masala)", price: 40, category: "HOT BEVERAGE", isAvailable: true },
  { id: "hb2", name: "Black Tea", price: 30, category: "HOT BEVERAGE", isAvailable: true },
  { id: "hb3", name: "Masala Black Tea", price: 35, category: "HOT BEVERAGE", isAvailable: true },
  { id: "hb4", name: "Lemon Tea", price: 35, category: "HOT BEVERAGE", isAvailable: true },
  { id: "hb5", name: "Hot Lemon", price: 70, category: "HOT BEVERAGE", isAvailable: true },
  { id: "hb6", name: "Hot Lemon With Honey", price: 120, category: "HOT BEVERAGE", isAvailable: true },
  { id: "hb7", name: "Black Coffee", price: 110, category: "HOT BEVERAGE", isAvailable: true },
  { id: "hb8", name: "Milk Coffee", price: 130, category: "HOT BEVERAGE", isAvailable: true },
  { id: "hb9", name: "Peach Tea", price: 160, category: "HOT BEVERAGE", isAvailable: true },

  // COLD BEVERAGE
  { id: "cb1", name: "Coke/Fanta/Sprite", price: 80, category: "COLD BEVERAGE", isAvailable: true },
  { id: "cb2", name: "Masala Coke/Sprite", price: 120, category: "COLD BEVERAGE", isAvailable: true },
  { id: "cb3", name: "Peach Ice Tea", price: 150, category: "COLD BEVERAGE", isAvailable: true },
  { id: "cb4", name: "Cold Lemon", price: 90, category: "COLD BEVERAGE", isAvailable: true },
  { id: "cb5", name: "Soda", price: 120, category: "COLD BEVERAGE", isAvailable: true },
  { id: "cb6", name: "Plain Lassi", price: 150, category: "COLD BEVERAGE", isAvailable: true },
  { id: "cb7", name: "Milk Cold Coffee", price: 220, category: "COLD BEVERAGE", isAvailable: true },
  { id: "cb8", name: "Black Cold Coffee", price: 160, category: "COLD BEVERAGE", isAvailable: true },

  // MOMO (Chicken)
  { id: "m1", name: "Chicken Momo (Steam)", price: 170, category: "MOMO", isAvailable: true },
  { id: "m2", name: "Chicken Momo (Fried)", price: 200, category: "MOMO", isAvailable: true },
  { id: "m3", name: "Chicken Momo (C)", price: 230, category: "MOMO", isAvailable: true },
  { id: "m4", name: "Chicken Momo (Jhol)", price: 230, category: "MOMO", isAvailable: true },
  { id: "m5", name: "Chicken Momo (Kothey)", price: 210, category: "MOMO", isAvailable: true },
  { id: "m6", name: "Chicken Momo (Kurkure)", price: 250, category: "MOMO", isAvailable: true },
  { id: "m7", name: "Chicken Momo (Chatpate)", price: 230, category: "MOMO", isAvailable: true },

  // MOMO (Buff)
  { id: "m8", name: "Buff Momo (Steam)", price: 160, category: "MOMO", isAvailable: true },
  { id: "m9", name: "Buff Momo (Fried)", price: 200, category: "MOMO", isAvailable: true },
  { id: "m10", name: "Buff Momo (C)", price: 220, category: "MOMO", isAvailable: true },
  { id: "m11", name: "Buff Momo (Jhol)", price: 220, category: "MOMO", isAvailable: true },
  { id: "m12", name: "Buff Momo (Kothey)", price: 200, category: "MOMO", isAvailable: true },
  { id: "m13", name: "Buff Momo (Kurkure)", price: 240, category: "MOMO", isAvailable: true },
  { id: "m14", name: "Buff Momo (Chatpate)", price: 220, category: "MOMO", isAvailable: true },

  // MOMO (Veg)
  { id: "m15", name: "Veg Momo (Steam)", price: 130, category: "MOMO", isAvailable: true },
  { id: "m16", name: "Veg Momo (Fried)", price: 160, category: "MOMO", isAvailable: true },
  { id: "m17", name: "Veg Momo (C)", price: 180, category: "MOMO", isAvailable: true },
  { id: "m18", name: "Veg Momo (Jhol)", price: 180, category: "MOMO", isAvailable: true },
  { id: "m19", name: "Veg Momo (Kothey)", price: 170, category: "MOMO", isAvailable: true },
  { id: "m20", name: "Veg Momo (Kurkure)", price: 210, category: "MOMO", isAvailable: true },
  { id: "m21", name: "Veg Momo (Chatpate)", price: 190, category: "MOMO", isAvailable: true },

  // KEEMA NOODLES
  { id: "kn1", name: "Keema Noodles (Veg)", price: 190, category: "KEEMA NOODLES", isAvailable: true },
  { id: "kn2", name: "Keema Noodles (Chicken)", price: 230, category: "KEEMA NOODLES", isAvailable: true },
  { id: "kn3", name: "Keema Noodles (Buff)", price: 220, category: "KEEMA NOODLES", isAvailable: true },

  // KHAJA SET
  { id: "ks1", name: "Khaja Set (Veg)", price: 250, category: "KHAJA SET", isAvailable: true },
  { id: "ks2", name: "Khaja Set (Chicken)", price: 380, category: "KHAJA SET", isAvailable: true },
  { id: "ks3", name: "Khaja Set (Buff)", price: 350, category: "KHAJA SET", isAvailable: true },

  // CURRENT COMBO
  { id: "cc1", name: "Current Combo (Chicken)", price: 290, category: "CURRENT COMBO", isAvailable: true },
  { id: "cc2", name: "Current Combo (Buff)", price: 280, category: "CURRENT COMBO", isAvailable: true },

  // CHATPATE
  { id: "cp1", name: "Chatpate (Normal)", price: 120, category: "CHATPATE", isAvailable: true },
  { id: "cp2", name: "Chatpate (Nimki)", price: 160, category: "CHATPATE", isAvailable: true },
  { id: "cp3", name: "Chatpate (Sausage)", price: 220, category: "CHATPATE", isAvailable: true },
  { id: "cp4", name: "Chatpate (Keema)", price: 180, category: "CHATPATE", isAvailable: true },

  // CHOWMEIN
  { id: "cw1", name: "Chowmein (Veg)", price: 130, category: "CHOWMEIN", isAvailable: true },
  { id: "cw2", name: "Chowmein (Chicken)", price: 180, category: "CHOWMEIN", isAvailable: true },
  { id: "cw3", name: "Chowmein (Buff)", price: 160, category: "CHOWMEIN", isAvailable: true },
  { id: "cw4", name: "Chowmein (Egg)", price: 160, category: "CHOWMEIN", isAvailable: true },
  { id: "cw5", name: "Chowmein (Mixed)", price: 220, category: "CHOWMEIN", isAvailable: true },

  // THUKPA
  { id: "th1", name: "Thukpa (Veg)", price: 140, category: "THUKPA", isAvailable: true },
  { id: "th2", name: "Thukpa (Chicken)", price: 170, category: "THUKPA", isAvailable: true },
  { id: "th3", name: "Thukpa (Buff)", price: 160, category: "THUKPA", isAvailable: true },
  { id: "th4", name: "Thukpa (Egg)", price: 160, category: "THUKPA", isAvailable: true },
  { id: "th5", name: "Thukpa (Mixed)", price: 280, category: "THUKPA", isAvailable: true },

  // FRIED RICE
  { id: "fr1", name: "Fried Rice (Veg)", price: 150, category: "FRIED RICE", isAvailable: true },
  { id: "fr2", name: "Fried Rice (Chicken)", price: 190, category: "FRIED RICE", isAvailable: true },
  { id: "fr3", name: "Fried Rice (Buff)", price: 180, category: "FRIED RICE", isAvailable: true },
  { id: "fr4", name: "Fried Rice (Egg)", price: 180, category: "FRIED RICE", isAvailable: true },
  { id: "fr5", name: "Fried Rice (Mixed)", price: 240, category: "FRIED RICE", isAvailable: true },

  // LAPHING
  { id: "lp1", name: "Laphing (Plain)", price: 100, category: "LAPHING", isAvailable: true },
  { id: "lp2", name: "Laphing (ChauChau)", price: 110, category: "LAPHING", isAvailable: true },
  { id: "lp3", name: "Laphing (Chips)", price: 120, category: "LAPHING", isAvailable: true },
  { id: "lp4", name: "Laphing (Mix)", price: 130, category: "LAPHING", isAvailable: true },
  { id: "lp5", name: "Jhol Extra", price: 20, category: "LAPHING", isAvailable: true },

  // CHAT
  { id: "ch1", name: "Samosa Chat", price: 190, category: "CHAT", isAvailable: true },
  { id: "ch2", name: "Nimki Chat", price: 160, category: "CHAT", isAvailable: true },
  { id: "ch3", name: "Aaloo Chat", price: 160, category: "CHAT", isAvailable: true },

  // SANDWICH
  { id: "sw1", name: "Sandwich (Veg)", price: 160, category: "SANDWICH", isAvailable: true },
  { id: "sw2", name: "Sandwich (Chicken)", price: 190, category: "SANDWICH", isAvailable: true },

  // HOOKAH
  { id: "hk1", name: "Hookah (Normal)", price: 350, category: "HOOKAH", isAvailable: true },
  { id: "hk2", name: "Hookah (Cloud)", price: 450, category: "HOOKAH", isAvailable: true },

  // BURGER
  { id: "bg1", name: "Burger (Veg)", price: 150, category: "BURGER", isAvailable: true },
  { id: "bg2", name: "Burger (Chicken)", price: 180, category: "BURGER", isAvailable: true },

  // CORN
  { id: "cr1", name: "Boiled Corn", price: 180, category: "CORN", isAvailable: true },
  { id: "cr2", name: "Corn Sadeko", price: 220, category: "CORN", isAvailable: true }
];

const QRMenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const [showQRModal, setShowQRModal] = useState(false);
  // Redirects the user to the Customer Menu page
  const targetUrl = `${window.location.origin}/menu`;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const data = localStorage.getItem("restaurant_menu");
    let parsed = [];
    try {
      if (data) parsed = JSON.parse(data);
    } catch (e) {}

    if (parsed.length > 0) {
      setMenuItems(parsed);
    } else {
      // Seed local storage if it's empty or has 0 items
      localStorage.setItem("restaurant_menu", JSON.stringify(initialMenuData));
      setMenuItems(initialMenuData);
    }
  };

  const toggleVisibility = (item) => {
    const updatedStatus = item.isAvailable === false ? true : false;
    const updatedList = menuItems.map((m) =>
      (m._id || m.id) === (item._id || item.id)
        ? { ...m, isAvailable: updatedStatus }
        : m
    );
    setMenuItems(updatedList);
    localStorage.setItem("restaurant_menu", JSON.stringify(updatedList));
    localStorage.setItem("restaurant_menu_updated", Date.now().toString());
  };

  const toggleSpecial = (item) => {
    const updatedSpecial = !item.isSpecial;
    const updatedList = menuItems.map((m) =>
      (m._id || m.id) === (item._id || item.id)
        ? { ...m, isSpecial: updatedSpecial }
        : m
    );
    setMenuItems(updatedList);
    localStorage.setItem("restaurant_menu", JSON.stringify(updatedList));
    localStorage.setItem("restaurant_menu_updated", Date.now().toString());
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "All Categories" || item.category === categoryFilter;
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
            color: #000;
          }
          .qr-print-subtitle {
            font-size: 24px;
            margin-bottom: 40px;
            color: #333;
          }
          .qr-print-footer {
            margin-top: 40px;
            font-size: 18px;
            color: #555;
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
            onClick={() => {
              if(window.confirm("Reset to default menu items? This will override current menu changes.")) {
                localStorage.setItem("restaurant_menu", JSON.stringify(initialMenuData));
                setMenuItems(initialMenuData);
              }
            }}
            className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <RefreshCw size={20} />
            Reset Menu
          </button>
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
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
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
                        ? "bg-amber-100 text-amber-500 hover:bg-amber-200"
                        : "bg-slate-100 text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    <Star
                      size={20}
                      fill={item.isSpecial ? "currentColor" : "none"}
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-in">
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
          <h1 className="qr-print-title">Scan for Menu!</h1>
          <p className="qr-print-subtitle">
            Point your phone camera here to view our delicious offerings.
          </p>
          <QRCodeSVG value={targetUrl} size={300} />
          <p className="qr-print-footer">Aslenix Restaurant</p>
        </div>
      )}
    </div>
  );
};

export default QRMenuManager;
