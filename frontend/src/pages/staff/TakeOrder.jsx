import React, { useState, useEffect, useCallback } from"react";
import {
 Plus,
 Minus,
 Trash2,
 CheckCircle2,
 UtensilsCrossed,
 XCircle,
 User,
 Table2,
 Package,
 ShoppingCart,
 Star,
 AlertTriangle,
 Zap,
 ChevronDown,
} from "lucide-react";
import Skeleton from "../../components/ui/Skeleton";
import Modal from "../../components/ui/Modal";
import { io } from "socket.io-client";
import "../../styles/takeorders.css"; // Kept for any global custom overrides
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { useTables } from "../../context/TableContext";
import { useMenuData } from "../../hooks/useMenuData";

const API_URL = `http://${window.location.hostname}:5001`;

export default function TakeOrder() {
 const { addOrder, orders = [] } = useOrders();
 const { user } = useAuth();
 const { tables, updateTableStatus, fetchTables } = useTables() || {
 tables: [],
 };
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedTable, setSelectedTable] = useState("All Tables");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [orderNote, setOrderNote] = useState("");
  const [quickAddTable, setQuickAddTable] = useState(null);

  const { data: rawMenuItems = [], isLoading: isMenuLoading } = useMenuData();
  const menuItems = rawMenuItems
    .filter((item) => item.isAvailable !== false)
    .map((item) => ({ ...item, id: item._id || item.id }));

 const serverName =
 user?.name || user?.username || user?.role || "Staff Member";

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

  useEffect(() => {
    if (fetchTables) fetchTables();
  }, [fetchTables]);

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

 const handleSendToKitchen = async () => {
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

 const orderData = {
 table: selectedTable,
 server: serverName,
 channel: selectedTable === "Pickup" ? "Takeaway" : "Dine In",
 priority: "Normal",
 station: "Hot Line",
 notes: orderNote,
  items: cart.map(({ id, name, qty, price, category, image }) => ({
  id,
  name,
  qty,
  price,
  category: category || "Mains",
  station: "Hot Line",
  image: image || "",
  })),
 subtotal,
 total: parseFloat(total.toFixed(2)),
 status: "Pending",
 };

 try {
  const token = localStorage.getItem("token");
  
  // -- OFFLINE SUPPORT --
  if (!navigator.onLine) {
  const now = new Date().getTime();
  const offlineOrder = {
  ...orderData,
  id: `OFFLINE-${now}`,
  _id: `OFFLINE-${now}`,
  sync_pending: true,
  date: new Date().toLocaleDateString(),
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  
  const existingOffline = JSON.parse(localStorage.getItem("offline_orders") || "[]");
  localStorage.setItem("offline_orders", JSON.stringify([...existingOffline, offlineOrder]));
  
  addOrder(offlineOrder);
  
  const tableObj = tables.find((t) => (t.name || `Table ${t.id}`) === selectedTable);
  if (tableObj) updateTableStatus(tableObj.id, "Occupied", "Dining In");

  showNotification(`You are offline! Order saved locally and will sync when connected.`, "warning");
  setCart([]);
  setSelectedTable("All Tables");
  setOrderNote("");
  return;
  }
  // ---------------------

  const response = await fetch(`${API_URL}/api/orders`, {
  method: "POST",
  headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(orderData),
  });

 if (!response.ok) {
 const errData = await response.json();
 throw new Error(errData.message || "Failed to create order");
 }

 const savedOrder = await response.json();
 addOrder(savedOrder);

 // Mark the table as Occupied globally
 const tableObj = tables.find(
 (t) => (t.name || `Table ${t.id}`) === selectedTable
 );
 if (tableObj) {
 updateTableStatus(tableObj.id, "Occupied", "Dining In");
 }

 showNotification(
 `Order for ${selectedTable} successfully sent to the kitchen!`,
 "success"
 );
 setCart([]);
 setSelectedTable("All Tables");
 setOrderNote("");
 } catch (error) {
 console.error("Error creating order:", error);
 showNotification(error.message, "error");
 }
 };

  const handleQuickReorder = async (item, table) => {
    const orderData = {
      table,
      customer: "Guest",
      server: serverName,
      items: [{
        id: item.id || item._id,
        name: item.name,
        qty: 1,
        price: item.price,
        category: item.category || "Drinks",
        station: item.station || "Hot Line",
        image: item.image || ""
      }],
      subtotal: item.price,
      total: item.price,
      status: "Pending"
    };

    try {
      const token = localStorage.getItem("token");
      
      // Offline support for quick add
      if (!navigator.onLine) {
        const now2 = new Date().getTime();
        const offlineOrder = { ...orderData, id: `OFFLINE-${now2}`, _id: `OFFLINE-${now2}`, sync_pending: true, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        const existingOffline = JSON.parse(localStorage.getItem("offline_orders") || "[]");
        localStorage.setItem("offline_orders", JSON.stringify([...existingOffline, offlineOrder]));
        addOrder(offlineOrder);
        showNotification(`Offline! +1 ${item.name} saved locally.`, "success");
        setQuickAddTable(null);
        return;
      }

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Failed to quick reorder");
      
      await response.json();
      
      showNotification(`+1 ${item.name} sent to kitchen!`, "success");
      setQuickAddTable(null);
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

 const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
 const total = subtotal; // VAT is already included in the menu price

 return (
 <div className="min-h-screen bg-slate-50 p-3 sm:p-6 md:p-8 text-slate-800 font-sans w-full overflow-x-hidden">
      {/* CENTERED NOTIFICATION MODAL */}
      <Modal
        isOpen={!!notification}
        onClose={() => setNotification(null)}
        hideHeader={true}
        maxWidth="max-w-sm"
        zIndex="z-[99999]"
      >
        <div className="p-6 text-center flex flex-col items-center gap-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              notification?.type === "error"
                ? "bg-rose-100 text-rose-500"
                : "bg-emerald-100 text-emerald-500"
            }`}
          >
            {notification?.type === "error" ? (
              <XCircle size={32} />
            ) : (
              <CheckCircle2 size={32} />
            )}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              {notification?.type === "error"
                ? "Action Required"
                : "Order Sent!"}
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
              {notification?.message}
            </p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className={`mt-3 w-full font-bold py-3.5 rounded-xl transition-all ${
              notification?.type === "error"
                ? "bg-rose-500 hover:bg-rose-600 text-white"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            }`}
          >
            {notification?.type === "error" ? "Got it" : "Continue"}
          </button>
        </div>
      </Modal>

 <main className="max-w-[1600px] mx-auto pb-28 lg:pb-12">
 {/* PAGE HEADER */}
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 lg:mb-8 pb-6 border-b border-slate-200/60">
 <div>
 <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
 <UtensilsCrossed className="text-indigo-600" size={28} />
 Take Order
 </h1>
 <p className="text-slate-500 text-sm mt-1 font-medium">
 Select a table and add items to send to the kitchen.
 </p>
 </div>
 <div className="bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
 <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center border border-indigo-100">
 <User size={18} />
 </div>
 <div>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
 Current Server
 </p>
 <p className="text-sm font-black text-slate-900 leading-none">
 {serverName}
 </p>
 </div>
 </div>
 </div>

 {/* TABLE SELECTION BAR */}
 <div className="mb-6 md:mb-8">
 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
 <Table2 size={16} />
 Select Table
 </h3>
 <div className="flex flex-wrap items-center gap-4">
   <div className="flex flex-wrap gap-3 w-full">
     {dynamicTables.map((table, index) => {
       const isUrgent = orders.some(o => o.table === table && o.status !== "Completed" && (o.elapsedMinutes || 0) >= 15);
       const isSelected = selectedTable === table;
       const tableObj = tables.find(t => (t.name || `Table ${t.id}`) === table);
       
       let statusColor = "bg-slate-50 text-slate-500 border-slate-200";
       let statusText = "";
       if (tableObj) {
         if (tableObj.status === "Available") {
           statusColor = "bg-emerald-50 text-emerald-600 border-emerald-200";
           statusText = "Available";
         } else if (tableObj.status === "Occupied") {
           statusColor = "bg-rose-50 text-rose-600 border-rose-200";
           statusText = "Occupied";
         } else if (tableObj.status === "Reserved") {
           statusColor = "bg-amber-50 text-amber-600 border-amber-200";
           statusText = "Reserved";
         }
       }

       return (
         <button
           key={index}
           onClick={() => setSelectedTable(table)}
           className={`flex flex-col items-start p-3 border-2 rounded-xl transition-all shadow-sm flex-grow sm:flex-grow-0 sm:min-w-[140px] ${
             isSelected
               ? "border-indigo-500 bg-indigo-50/50 scale-[1.02]"
               : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20"
           }`}
         >
           <div className="flex justify-between items-center w-full gap-2">
             <span className={`font-black text-sm tracking-wide whitespace-nowrap ${isSelected ? "text-indigo-700" : "text-slate-700"}`}>
               {table}
             </span>
             {isUrgent && (
               <span className="flex items-center gap-1 text-[9px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded font-black uppercase tracking-widest shadow-sm whitespace-nowrap">
                 <AlertTriangle size={10} />
               </span>
             )}
           </div>
           {tableObj && (
             <span className={`text-[9px] px-2 py-0.5 mt-2 rounded border font-black uppercase tracking-widest whitespace-nowrap ${statusColor}`}>
               {statusText}
             </span>
           )}
         </button>
       );
     })}
   </div>

   {(() => {
     if (selectedTable === "All Tables") return null;
     const activeOrder = orders.find(o => o.table === selectedTable && o.status !== "Completed" && o.status !== "Cancelled");
     const hasDrinks = activeOrder?.items?.some(i => i.category?.toLowerCase() === "drinks" || i.category?.toLowerCase() === "beverages");
     
     if (hasDrinks) {
       return (
         <button 
           onClick={() => setQuickAddTable(activeOrder)}
           className="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 rounded-xl py-3 px-5 font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm transform active:scale-95"
         >
           <Zap size={14} fill="currentColor" /> Quick Reorder Drinks
         </button>
       );
     }
     return null;
   })()}
 </div>
 </div>

 {/* MAIN WORKSPACE SPLIT */}
 <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
 {/* LEFT: CATEGORIES SIDEBAR */}
 <div className="lg:col-span-2 flex flex-col gap-2">
 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1 flex items-center gap-2">
 <Package size={16} />
 Categories
 </h3>
 <div className="relative w-full">
   <button
     onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
     className={`w-full flex items-center justify-between p-3.5 px-5 border-2 rounded-xl font-bold transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-slate-100 ${
       isCategoryDropdownOpen 
         ? "border-slate-800 bg-slate-900 text-white" 
         : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
     }`}
   >
     <span className="text-sm truncate pr-2">
       {selectedCategory}
     </span>
     <ChevronDown size={18} className={`transition-transform duration-300 flex-shrink-0 ${isCategoryDropdownOpen ? 'rotate-180 text-white' : 'text-slate-400'}`} />
   </button>

   {isCategoryDropdownOpen && (
     <>
       <div className="fixed inset-0 z-40" onClick={() => setIsCategoryDropdownOpen(false)} />
       <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
         {categories.map((category, index) => {
           const isSelected = selectedCategory === category;
           return (
             <button
               key={index}
               onClick={() => {
                 setSelectedCategory(category);
                 setIsCategoryDropdownOpen(false);
               }}
               className={`w-full text-left px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors flex items-center gap-3 group ${isSelected ? 'bg-slate-50' : ''}`}
             >
               <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isSelected ? 'bg-slate-800' : 'bg-transparent group-hover:bg-slate-200 transition-colors'}`} />
               <span className={`font-black text-sm tracking-wide ${isSelected ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-800'}`}>
                 {category}
               </span>
             </button>
           );
         })}
       </div>
     </>
   )}
 </div>
 </div>

 {/* MIDDLE: MENU ITEMS GRID */}
 <div className="lg:col-span-7">
 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
 {isMenuLoading ? (
  Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col h-full">
      <Skeleton className="w-full h-32 rounded-lg mb-4" />
      <Skeleton className="w-3/4 h-5 mb-2" />
      <Skeleton className="w-1/2 h-4 mb-4" />
      <div className="mt-auto flex justify-between items-center">
        <Skeleton className="w-1/3 h-6" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
    </div>
  ))
) : (
  filteredItems.map((item) => (
 <div
 className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group cursor-pointer"
 key={item.id}
 onClick={() => addToCart(item)}
 >
 {/* Image Container with Badge */}
 <div className="relative rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-slate-100">
 <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg z-10 shadow-sm">
 Available
 </span>
 {item.isSpecial && (
 <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg z-10 shadow-sm flex items-center gap-1">
 <Star size={10} fill="currentColor" /> Special
 </span>
 )}
 <img
 src={
 item.image ||
"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80"
 }
 alt={item.name}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
 />
 </div>

 {/* Item Meta */}
 <div className="flex flex-col flex-1">
 <h4 className="font-black text-slate-900 text-base leading-tight group-hover:text-indigo-600 transition-colors">
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
 className="w-10 h-10 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
 >
 <Plus size={18} />
 </button>
 </div>
 </div>
 </div>
 ))
)}
 </div>
 </div>

 {/* RIGHT: CURRENT ORDER / CART */}
 <div id="cart-section" className="w-full lg:col-span-3 bg-white rounded-xl border border-slate-100 shadow-md shadow-slate-200/40 p-5 sm:p-6 flex flex-col h-auto max-h-[60vh] lg:max-h-none lg:h-[calc(100vh-140px)] lg:sticky top-6 order-last mb-24 lg:mb-0">
 {/* Cart Header */}
 <div className="mb-5 pb-5 border-b border-slate-100">
 <div className="flex justify-between items-start mb-4">
 <div>
 <h3 className="font-black text-slate-900 text-xl tracking-tight flex items-center gap-2">
 <ShoppingCart size={20} className="text-indigo-600" /> Cart
 </h3>
 <p className="text-xs font-medium text-slate-500 mt-1">
 Review and send to kitchen
 </p>
 </div>
 <span className="bg-indigo-50 text-indigo-700 font-black text-xs px-3 py-1.5 rounded-lg shadow-sm border border-indigo-200">
 {selectedTable}
 </span>
 </div>
 {/* EXPLICIT STAFF INDICATOR IN CART */}
 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
 <div className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-sm">
 <User size={14} />
 </div>
 <div>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
 Order taken by
 </p>
 <p className="text-sm font-bold text-slate-800">
 {serverName}
 </p>
 </div>
 </div>
 </div>

 {/* Cart Items List */}
 <div
 className="flex-1 overflow-y-auto space-y-2 pr-2"
 style={{ scrollbarWidth:"thin" }}
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
 <div
 className="flex gap-3 items-center group p-2 hover:bg-slate-50 rounded-xl transition-colors"
 key={item.id}
 >
 <img
 src={
 item.image ||
"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80"
 }
 alt={item.name}
 className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm"
 />
 <div className="flex-1 min-w-0">
 <h4 className="font-black text-slate-900 text-sm truncate pr-2">
 {item.name}
 </h4>

 <div className="flex justify-between items-center mt-1">
 {/* Quantity Controls */}
 <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-1.5 py-0.5 shadow-sm">
 <button
 onClick={() => decreaseQty(item.id)}
 className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors p-1"
 >
 <Minus size={12} />
 </button>
 <span className="text-xs font-bold text-slate-700 w-4 text-center">
 {item.qty}
 </span>
 <button
 onClick={() => increaseQty(item.id)}
 className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors p-1"
 >
 <Plus size={12} />
 </button>
 </div>

 <button
 onClick={() => removeItem(item.id)}
 className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all p-1.5"
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
 placeholder="Kitchen instructions or notes..."
 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all resize-none"
 rows="2"
 />
 </div>
 <div className="flex justify-between text-sm font-medium text-slate-500">
 <span>Subtotal</span>
 <span className="text-slate-900 font-bold">Rs. {subtotal}</span>
 </div>
 <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-100">
 <span className="font-black text-indigo-600 text-xl">
 Total
 </span>
 <span className="font-black text-indigo-600 text-2xl">
 Rs. {total.toFixed(0)}
 </span>
 </div>

 <button
 onClick={handleSendToKitchen}
 className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-sm shadow-indigo-200 flex justify-center items-center gap-2 active:scale-[0.98]"
 >
 Send To Kitchen
 </button>
 </div>
 </div>
 </div>
 </main>

 {/* MOBILE FLOATING CART BUTTON */}
 {cart.length > 0 && (
 <div className="lg:hidden fixed bottom-6 left-4 right-4 z-40">
 <button
 onClick={() => document.getElementById('cart-section')?.scrollIntoView({ behavior:'smooth' })}
 className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-md flex justify-between items-center px-6 border border-slate-700 active:scale-[0.98] transition-transform"
 >
 <div className="flex items-center gap-2">
 <ShoppingCart size={20} />
 <span>{cart.reduce((sum, item) => sum + item.qty, 0)} Items</span>
 </div>
 <span>Review Cart &rarr;</span>
 </button>
 </div>
 )}

 {/* QUICK REORDER MODAL */}
 {quickAddTable && (
 <Modal
 isOpen={true}
 onClose={() => setQuickAddTable(null)}
 title={`Quick Reorder - ${quickAddTable.table}`}
 maxWidth="max-w-md"
 >
 <div className="p-4 sm:p-6 bg-slate-50">
 <p className="text-sm font-medium text-slate-500 mb-4">
 Tap a drink below to instantly add another round to this table.
 </p>
 <div className="flex flex-col gap-3">
 {quickAddTable.items
 .filter(i => i.category?.toLowerCase() === "drinks" || i.category?.toLowerCase() === "beverages")
 .filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i)
 .map((item, idx) => (
 <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center hover:border-indigo-200 transition-colors">
 <div>
 <h4 className="font-bold text-slate-800">{item.name}</h4>
 <p className="text-xs font-semibold text-slate-400">Rs. {item.price}</p>
 </div>
 <button
 onClick={() => handleQuickReorder(item, quickAddTable.table)}
 className="bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white transition-colors h-10 w-10 rounded-full flex items-center justify-center shadow-sm font-black text-lg"
 >
 +1
 </button>
 </div>
 ))}
 </div>
 <button
 onClick={() => setQuickAddTable(null)}
 className="mt-6 w-full py-3 bg-white border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50"
 >
 Cancel
 </button>
 </div>
 </Modal>
 )}

 </div>
 );
}
