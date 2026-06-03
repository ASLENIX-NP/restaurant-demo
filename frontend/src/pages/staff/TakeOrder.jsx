import React, { useState } from "react";
import { Plus, Minus, Trash2, CheckCircle2, UtensilsCrossed } from "lucide-react";
import "../../styles/takeorders.css"; // Kept for any global custom overrides
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { useTables } from "../../context/TableContext";

const categories = [
  "All Categories",
  "Fast Food",
  "Nepali",
  "Beverage",
  "Chinese",
  "Snacks",
  "Desserts",
];

const tables = [
  "All Tables", 
  "Table 1",
  "Table 2",
  "Table 3",
  "Table 4",
  "Table 5",
  "Table 6",
  "Table 7",
];

const menuItems = [
  {
    id: 1,
    name: "Chicken Burger",
    category: "Fast Food",
    price: 450,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    category: "Fast Food",
    price: 900,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Chicken Momo",
    category: "Nepali",
    price: 320,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Cold Coffee",
    category: "Beverage",
    price: 250,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1f846?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Chowmein",
    category: "Chinese",
    price: 350,
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "French Fries",
    category: "Snacks",
    price: 200,
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=400&auto=format&fit=crop",
  },
];

export default function TakeOrder() {
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const { updateTableStatus } = useTables();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedTable, setSelectedTable] = useState("Table 5");
  const [cart, setCart] = useState([
    { ...menuItems[0], qty: 1 },
    { ...menuItems[1], qty: 1 },
  ]);

  const filteredItems =
    selectedCategory === "All Categories"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const addToCart = (item) => {
    const exists = cart.find((i) => i.id === item.id);
    if (exists) {
      setCart(cart.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(cart.map((item) => item.id === id ? { ...item, qty: item.qty + 1 } : item));
  };

  const decreaseQty = (id) => {
    setCart(cart.map((item) => item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item));
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleSendToKitchen = () => {
    if (cart.length === 0) {
      alert("Your cart is empty! Please add items before sending to the kitchen.");
      return;
    }
    if (selectedTable === "All Tables") {
      alert("Please select a valid table number.");
      return;
    }

    const orderTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    const orderDate = new Date().toISOString().split('T')[0]; 

    const orderData = {
      table: selectedTable,
      server: user?.name || "Staff Member",
      channel: selectedTable === "Pickup" ? "Takeaway" : "Dine In",
      priority: "Normal",
      station: "Hot Line",
      notes: "",
      elapsedMinutes: 0,
      items: cart.map(({ id, name, qty, price, category }) => ({ id, name, qty, price, category: category || "Mains", station: "Hot Line" })),
      subtotal,
      vat: parseFloat(vat.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      time: orderTime,
      date: orderDate,
      timestamp: new Date().toISOString(),
    };

    addOrder(orderData);

    // Mark the table as Occupied globally
    const match = selectedTable.match(/\d+/);
    if (match) {
      updateTableStatus(parseInt(match[0], 10), "Occupied", "Dining In");
    }

    console.log("Sending enriched order to kitchen API...", orderData);
    alert(`Order for ${selectedTable} successfully sent to the kitchen at ${orderTime}!`);

    setCart([]);
    setSelectedTable("All Tables"); 
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const vat = subtotal * 0.13;
  const total = subtotal + vat;

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto">
        
        {/* TABLE SELECTION BAR */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Select Table</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {tables.map((table, index) => (
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
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Categories</h3>
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
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full group" key={item.id}>
                  
                  {/* Image Container with Badge */}
                  <div className="relative rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-slate-100">
                    <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg z-10 shadow-sm">
                      Available
                    </span>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>

                  {/* Item Meta */}
                  <div className="flex flex-col flex-1">
                    <h4 className="font-bold text-slate-900 text-base leading-tight">{item.name}</h4>
                    <p className="text-xs text-slate-400 font-medium mt-1 mb-4 line-clamp-2">
                      Delicious freshly prepared food
                    </p>
                    
                    {/* Price and Add Button */}
                    <div className="mt-auto flex justify-between items-center">
                      <span className="font-black text-slate-900 text-lg">Rs. {item.price}</span>
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
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-lg">Current Order</h3>
              <span className="bg-purple-50 text-purple-600 font-bold text-xs px-3 py-1 rounded-lg border border-purple-100">
                {selectedTable}
              </span>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2" style={{ scrollbarWidth: 'thin' }}>
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-70">
                  <UtensilsCrossed size={48} className="mb-3 opacity-50" />
                  <p className="text-sm font-semibold">Your cart is empty</p>
                  <p className="text-xs">Add items from the menu to get started.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div className="flex gap-3 items-center group" key={item.id}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-14 h-14 rounded-xl object-cover border border-slate-100 shadow-sm" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate pr-2">{item.name}</h4>
                      
                      <div className="flex justify-between items-center mt-1">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-1.5 py-1">
                          <button 
                            onClick={() => decreaseQty(item.id)} 
                            className="text-slate-400 hover:text-purple-600 transition-colors p-1"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold text-slate-700 w-4 text-center">{item.qty}</span>
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
              <div className="flex justify-between text-sm font-medium text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-900 font-bold">Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-slate-500">
                <span>VAT (13%)</span>
                <span className="text-slate-900 font-bold">Rs. {vat.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-100">
                <span className="font-black text-purple-600 text-xl">Total</span>
                <span className="font-black text-purple-600 text-2xl">Rs. {total.toFixed(0)}</span>
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