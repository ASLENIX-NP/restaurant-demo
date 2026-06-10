import React, { useEffect, useState } from "react";
import { Search, ShoppingCart, Plus, Minus, UtensilsCrossed, ChevronRight, X, Trash2 } from "lucide-react";

// The complete scanned menu from Mitho Chiya & Tiffin Ghar
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

export default function CustomerMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const loadProducts = () => {
      const data = localStorage.getItem("restaurant_menu");
      if (data) {
        setMenuItems(JSON.parse(data));
      } else {
        // Automatically seed the local storage with the image data if empty
        localStorage.setItem("restaurant_menu", JSON.stringify(initialMenuData));
        setMenuItems(initialMenuData);
      }
    };
    loadProducts();

    const handleStorageChange = (e) => {
      if (e.key === "restaurant_menu_updated") {
        loadProducts();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Group and Filter Items
  const visibleItems = menuItems.filter(
    (item) =>
      item.isAvailable !== false &&
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoriesMap = visibleItems.reduce((acc, item) => {
    const cat = (item.category || "OTHER").toUpperCase();
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const specialItems = visibleItems.filter((item) => item.isSpecial);
  if (specialItems.length > 0 && !searchTerm) {
    categoriesMap["OUR SPECIAL"] = specialItems;
  }

  // Define the exact category display order matching your layout
  const categoryOrder = [
    "OUR SPECIAL",
    "BREAKFAST",
    "SNACKS",
    "HOT BEVERAGE",
    "COLD BEVERAGE",
    "MOMO",
    "KEEMA NOODLES",
    "KHAJA SET",
    "CURRENT COMBO",
    "CHATPATE",
    "CHOWMEIN",
    "THUKPA",
    "FRIED RICE",
    "LAPHING",
    "CHAT",
    "SANDWICH",
    "HOOKAH",
    "BURGER",
    "CORN"
  ];

  // Map the corresponding emojis to the headers
  const categoryEmojis = {
    "OUR SPECIAL": "🥘",
    "BREAKFAST": "🍳",
    "SNACKS": "🍟",
    "HOT BEVERAGE": "☕",
    "COLD BEVERAGE": "🥤",
    "MOMO": "🥟",
    "KEEMA NOODLES": "🍜",
    "KHAJA SET": "🍛",
    "CURRENT COMBO": "🍱",
    "CHATPATE": "🥗",
    "CHOWMEIN": "🍝",
    "THUKPA": "🍲",
    "FRIED RICE": "🍚",
    "LAPHING": "🥙",
    "CHAT": "🥟",
    "SANDWICH": "🥪",
    "HOOKAH": "💨",
    "BURGER": "🍔",
    "CORN": "🌽"
  };

  const categoriesList = Object.keys(categoriesMap).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    
    // Fallback to alphabetical if a category isn't in the specific list
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    
    return indexA - indexB;
  });

  useEffect(() => {
    if (categoriesList.length > 0 && !activeCategory) {
      setActiveCategory(categoriesList[0]);
    }
  }, [categoriesList, activeCategory]);

  // Cart Functions
  const updateCart = (item, delta) => {
    setCart((prev) => {
      const itemId = item.id || item._id;
      const currentQty = prev[itemId]?.qty || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      if (newQty === 0) {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      }
      
      return {
        ...prev,
        [itemId]: { ...item, qty: newQty }
      };
    });
  };

  const cartTotal = Object.values(cart).reduce((acc, item) => acc + (item.price * item.qty), 0);
  const cartCount = Object.values(cart).reduce((acc, item) => acc + item.qty, 0);

  // Scroll to category
  const scrollToCategory = (cat) => {
    setActiveCategory(cat);
    const element = document.getElementById(`category-${cat}`);
    if (element) {
      // Adjust scroll offset based on screen size (mobile sticky header vs desktop)
      const isDesktop = window.innerWidth >= 768;
      const offset = isDesktop ? 40 : 180;
      const y = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = () => {
    alert("Order placed successfully! A waiter will confirm your table shortly.");
    setCart({});
    setIsCartOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-slate-800 relative">
      
      {/* SIDEBAR (Desktop) / TOP HEADER (Mobile) */}
      <div className="md:w-72 md:fixed md:h-screen bg-white md:border-r border-b md:border-b-0 border-slate-200 z-40 flex flex-col shadow-sm md:shadow-none sticky top-0 md:static">
        <div className="px-4 py-4 md:p-6 border-b border-slate-100 bg-white z-10">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-3 md:mb-5">
            Mitho Chiya & Tiffin Ghar
          </h1>
          <div className="relative w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500 transition-all text-slate-900 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Categories List */}
        {categoriesList.length > 0 && (
          <div 
            className="p-3 md:p-4 flex md:flex-col gap-2 md:gap-1.5 overflow-x-auto md:overflow-y-auto md:flex-1 bg-white" 
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <span className="hidden md:block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2 mt-2">
              Menu Categories
            </span>
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => scrollToCategory(cat)}
                className={`flex-shrink-0 md:w-full flex items-center gap-2.5 px-4 md:px-4 py-2 md:py-3 rounded-full md:rounded-xl text-sm font-bold transition-all text-left ${
                  activeCategory === cat
                    ? "bg-amber-500 text-white md:bg-amber-50 md:text-amber-600 md:border md:border-amber-200 shadow-md md:shadow-none"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 md:bg-transparent md:hover:bg-slate-50"
                }`}
              >
                {categoryEmojis[cat] && <span className="text-base md:text-lg">{categoryEmojis[cat]}</span>}
                <span className="whitespace-nowrap">{cat}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 md:ml-72 pb-28 md:pb-12 pt-5 md:pt-8 px-4 sm:px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
        {categoriesList.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <UtensilsCrossed size={48} className="mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">No items found</h3>
            <p className="text-sm font-medium">Try adjusting your search query.</p>
          </div>
        ) : (
          categoriesList.map((cat) => (
            <div id={`category-${cat}`} key={cat} className="mb-10 scroll-mt-48 md:scroll-mt-10">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase mb-5 tracking-tight flex items-center gap-2 border-b border-slate-200 pb-3">
                <span>{categoryEmojis[cat] || "🍽️"}</span> {cat}
              </h2>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {categoriesMap[cat].map((item, idx) => {
                  const itemId = item._id || item.id || idx;

                  return (
                    <div
                      className="flex gap-3 p-3.5 bg-white rounded-[20px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                      key={itemId}
                    >
                      {/* Text Content */}
                      <div className="flex flex-col flex-1 justify-center min-w-0 pr-1">
                        <h3 className="text-[15px] md:text-base font-bold text-slate-900 leading-snug truncate">
                          {item.name}
                        </h3>
                        {item.price && (
                          <span className="text-[13px] font-black text-slate-700 mt-1 block">
                            Rs. {item.price}
                          </span>
                        )}
                        {item.description && (
                          <p className="text-[11px] font-medium text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Image */}
                      <div className="flex flex-col items-center shrink-0 w-[90px]">
                        <div className="w-[90px] h-[90px] bg-slate-50 rounded-xl overflow-hidden shadow-sm relative z-0 border border-slate-100">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <UtensilsCrossed className="text-slate-300" size={20} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-4 md:left-[300px] right-4 z-50 animate-fade-in-up pointer-events-none">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full max-w-md mx-auto bg-amber-500 text-white rounded-2xl p-4 flex items-center justify-between shadow-[0_8px_30px_rgb(245,158,11,0.4)] hover:bg-amber-600 transition-colors border border-amber-400 pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-full">
                <ShoppingCart size={18} className="text-white" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold text-amber-100 uppercase tracking-widest leading-none">{cartCount} Item{cartCount > 1 ? 's' : ''}</span>
                <span className="text-lg font-black leading-none mt-1">Rs. {cartTotal}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-black text-sm uppercase tracking-wide bg-white/20 px-3.5 py-2 rounded-xl">
              View Cart <ChevronRight size={16} />
            </div>
          </button>
        </div>
      )}

      {/* CART MODAL (Bottom Sheet on Mobile, Centered on Desktop) */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-center items-end md:items-center p-0 md:p-4 transition-opacity" 
          onClick={() => setIsCartOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-lg md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white">
              <h2 className="text-xl font-black text-slate-900">Your Order</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
              {Object.values(cart).length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <ShoppingCart size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="font-medium text-slate-500">Your cart is empty</p>
                </div>
              ) : (
                Object.values(cart).map((item) => (
                  <div key={item.id || item._id} className="flex gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <UtensilsCrossed size={20} className="text-slate-300" />
                      )}
                    </div>
                    <div className="flex flex-col flex-1 justify-between py-0.5">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">{item.name}</h4>
                        <button onClick={() => updateCart(item, -item.qty)} className="text-slate-300 hover:text-rose-500 p-1 -mt-1 -mr-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-black text-slate-800 text-sm">Rs. {item.price * item.qty}</span>
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-lg p-1">
                          <button onClick={() => updateCart(item, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-rose-600">
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-sm text-slate-700 w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateCart(item, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-emerald-600">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            {Object.values(cart).length > 0 && (
              <div className="p-5 bg-white border-t border-slate-100 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] pb-8 md:pb-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-500 font-bold">Total Amount</span>
                  <span className="text-2xl font-black text-slate-900">Rs. {cartTotal}</span>
                </div>
                <button 
                  onClick={handlePlaceOrder}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-xl shadow-lg shadow-amber-500/30 transition-all text-lg"
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}