import React, { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  UtensilsCrossed,
  XCircle,
  User,
} from "lucide-react";
import "../../styles/takeorders.css"; // Kept for any global custom overrides
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { useTables } from "../../context/TableContext";

export default function TakeOrder() {
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const { tables, updateTableStatus } = useTables() || { tables: [] };
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedTable, setSelectedTable] = useState("All Tables");
  const [cart, setCart] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orderNote, setOrderNote] = useState("");

  const dynamicTables = [
    "All Tables",
    ...tables.map((t) => t.name || `Table ${t.id}`),
  ];

  // Custom Popup Notification State
  const [notification, setNotification] = useState(null);
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    if (type === "success") {
      setTimeout(() => setNotification(null), 4000); // Auto-close success after 4s
    }
  };

  // Load dynamic menu data synced with Admin Menu Management
  useEffect(() => {
    const loadProducts = () => {
      const data = localStorage.getItem("restaurant_menu");
      if (data) {
        setMenuItems(
          JSON.parse(data)
            .filter((item) => item.isAvailable !== false)
            .map((item) => ({ ...item, id: item._id || item.id }))
        );
      }
    };
    loadProducts();

    // Listen for real-time cross-tab updates triggered by Admin
    const handleStorageChange = (e) => {
      if (e.key === "restaurant_menu_updated") {
        loadProducts();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const categories = [
    "All Categories",
    ...new Set(menuItems.map((item) => item.category).filter(Boolean)),
  ];

  const filteredItems =
    selectedCategory === "All Categories"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const addToCart = (item) => {
    const exists = cart.find((i) => i.id === item.id);
    if (exists) {
      setCart(
        cart.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleSendToKitchen = () => {
    if (cart.length === 0) {
      showNotification(
        "Your cart is empty! Please add items before sending to the kitchen.",
        "error"
      );
      return;
    }
    if (selectedTable === "All Tables") {
      showNotification("Please select a valid table number.", "error");
      return;
    }

    const orderTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const orderDate = new Date().toISOString().split("T")[0];
    const orderId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`; // Generate ID here

    const orderData = {
      id: orderId,
      table: selectedTable,
      server: user?.name || user?.username || "Staff Member",
      channel: selectedTable === "Pickup" ? "Takeaway" : "Dine In",
      priority: "Normal",
      station: "Hot Line",
      notes: orderNote,
      elapsedMinutes: 0,
      items: cart.map(({ id, name, qty, price, category }) => ({
        id,
        name,
        qty,
        price,
        category: category || "Mains",
        station: "Hot Line",
      })),
      subtotal,
      vat: 0, // VAT was removed previously, so we default it to 0
      total: parseFloat(total.toFixed(2)),
      amount: parseFloat(total.toFixed(2)),
      time: orderTime,
      date: orderDate,
      timestamp: new Date().toISOString(),
      status: "Pending",
    };

    addOrder(orderData);

    // Mark the table as Occupied globally
    const tableObj = tables.find(
      (t) => (t.name || `Table ${t.id}`) === selectedTable
    );
    if (tableObj) {
      updateTableStatus(tableObj.id, "Occupied", "Dining In");
    } else {
      const match = selectedTable.match(/\d+/);
      if (match) {
        updateTableStatus(parseInt(match[0], 10), "Occupied", "Dining In");
      }
    }

    console.log("Sending enriched order to kitchen API...", orderData);
    showNotification(
      `Order for ${selectedTable} successfully sent to the kitchen at ${orderTime}!`,
      "success"
    );

    setCart([]);
    setSelectedTable("All Tables");
    setOrderNote("");
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const total = subtotal; // VAT is already included in the menu price

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
      {/* CENTERED NOTIFICATION MODAL */}
      {notification && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[99999] flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center flex flex-col items-center gap-4 animate-slide-in">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                notification.type === "error"
                  ? "bg-rose-100 text-rose-500"
                  : "bg-emerald-100 text-emerald-500"
              }`}
            >
              {notification.type === "error" ? (
                <XCircle size={32} />
              ) : (
                <CheckCircle2 size={32} />
              )}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                {notification.type === "error"
                  ? "Action Required"
                  : "Order Sent!"}
              </h3>
              <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className={`mt-3 w-full font-bold py-3.5 rounded-xl transition-all ${
                notification.type === "error"
                  ? "bg-rose-500 hover:bg-rose-600 text-white"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              {notification.type === "error" ? "Got it" : "Continue"}
            </button>
          </div>
        </div>
      )}

      <main className="max-w-[1600px] mx-auto">
        {/* TABLE SELECTION BAR */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
            Select Table
          </h3>
          <div
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
            style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            {dynamicTables.map((table, index) => (
              <button
                key={index}
                onClick={() => setSelectedTable(table)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex-shrink-0 border ${
                  selectedTable === table
                    ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {table}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN WORKSPACE SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: CATEGORIES SIDEBAR */}
          <div className="lg:col-span-2 flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">
              Categories
            </h3>
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-left px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap lg:whitespace-normal ${
                    selectedCategory === category
                      ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                      : "bg-transparent text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* MIDDLE: MENU ITEMS GRID */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredItems.map((item) => (
                <div
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full group"
                  key={item.id}
                >
                  {/* Image Container with Badge */}
                  <div className="relative rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-slate-100">
                    <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg z-10 shadow-sm">
                      Available
                    </span>
                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Item Meta */}
                  <div className="flex flex-col flex-1">
                    <h4 className="font-bold text-slate-900 text-base leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium mt-1 mb-4 line-clamp-2">
                      Delicious freshly prepared food
                    </p>

                    {/* Price and Add Button */}
                    <div className="mt-auto flex justify-between items-center">
                      <span className="font-black text-slate-900 text-lg">
                        Rs. {item.price}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-9 h-9 bg-purple-100 text-purple-600 hover:bg-purple-600 hover:text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: CURRENT ORDER / CART */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col h-[calc(100vh-140px)] sticky top-6">
            {/* Cart Header */}
            <div className="mb-5 pb-4 border-b border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-black text-slate-900 text-lg">
                  Current Order
                </h3>
                <span className="bg-purple-50 text-purple-600 font-bold text-xs px-3 py-1 rounded-lg border border-purple-100">
                  {selectedTable}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <User size={14} /> Server: {user?.name || user?.username || "Staff Member"}
              </div>
            </div>

            {/* Cart Items List */}
            <div
              className="flex-1 overflow-y-auto space-y-4 pr-2"
              style={{ scrollbarWidth: "thin" }}
            >
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-70">
                  <UtensilsCrossed size={48} className="mb-3 opacity-50" />
                  <p className="text-sm font-semibold">Your cart is empty</p>
                  <p className="text-xs">
                    Add items from the menu to get started.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div className="flex gap-3 items-center group" key={item.id}>
                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80"
                      }
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-100 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate pr-2">
                        {item.name}
                      </h4>

                      <div className="flex justify-between items-center mt-1">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-1.5 py-1">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="text-slate-400 hover:text-purple-600 transition-colors p-1"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold text-slate-700 w-4 text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => increaseQty(item.id)}
                            className="text-slate-400 hover:text-purple-600 transition-colors p-1"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="font-black text-slate-900 text-sm whitespace-nowrap">
                      Rs. {item.price * item.qty}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Summary & Actions */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 bg-white">
              <div className="mb-3">
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Add special instructions or notes..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400 transition-all resize-none"
                  rows="2"
                />
              </div>
              <div className="flex justify-between text-sm font-medium text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-900 font-bold">Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-100">
                <span className="font-black text-purple-600 text-xl">
                  Total
                </span>
                <span className="font-black text-purple-600 text-2xl">
                  Rs. {total.toFixed(0)}
                </span>
              </div>

              <button
                onClick={handleSendToKitchen}
                className="w-full mt-5 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-purple-200 flex justify-center items-center gap-2"
              >
                Send To Kitchen
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
