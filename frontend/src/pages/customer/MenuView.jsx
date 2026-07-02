import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../api/apiClient";
import Skeleton from "../../components/ui/Skeleton";
import { Utensils } from "lucide-react";
import "../../styles/menuview.css";

const MenuView = () => {
 const { tableId } = useParams();
 const [menuItems, setMenuItems] = useState([]);
 const [loading, setLoading] = useState(true);
 const [activeCategory, setActiveCategory] = useState("All");

 useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await apiClient.get("/api/menu");
        const items = Array.isArray(data) ? data : (data?.items || []);
        setMenuItems(items.filter(item => item.isAvailable !== false));
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

 const categories = ["All", ...new Set(menuItems.map(item => item.category))];

 const filteredMenu = activeCategory ==="All" 
 ? menuItems 
 : menuItems.filter(item => item.category === activeCategory);

 return (
 <div className="menu-view-page min-h-screen bg-slate-50 pb-12 transition-colors duration-300">
 <div className="menu-header bg-white text-slate-900 p-6 rounded-b-[40px] mb-8 shadow-sm border-b border-slate-200 flex flex-col items-center">
 <img src="/logo.svg" alt="Logo" className="h-24 md:h-32 object-contain mb-4" />
 <h1 className="text-3xl font-black text-center tracking-tighter text-[#2F4858]">मिठ्ठो चिया <span className="text-[#F37021]">& Tiffin घर</span></h1>
 <p className="text-center text-[#F37021] font-bold mt-1 text-sm uppercase tracking-widest">Table {tableId ||"Walk-in"}</p>
 </div>

 <div className="category-scroll-container px-4 mb-8 flex gap-3 overflow-x-auto scrollbar-hide py-1">
 {categories.map(cat => (
 <button 
 key={cat}
 onClick={() => setActiveCategory(cat)}
 className={`px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all ${
 activeCategory === cat 
 ?"bg-[#F37021] text-white shadow-md ring-2 ring-[#F37021] ring-offset-2" 
 :"bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
 }`}
 >
 {cat}
 </button>
 ))}
 </div>

 <div className="menu-section px-4">
 <h2 className="text-xl font-black text-slate-900 mb-6 capitalize px-2">{activeCategory} Menu</h2>
 
 {loading ? (
 <div className="food-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {[1, 2, 3, 4, 5, 6].map(i => (
 <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
 <Skeleton className="h-52 w-full rounded-none" />
 <div className="p-5 pt-4">
 <Skeleton className="h-6 w-3/4 mb-2" />
 <Skeleton className="h-4 w-full" />
 </div>
 </div>
 ))}
 </div>
 ) : filteredMenu.length === 0 ? (
 <div className="text-center py-12 text-slate-500 font-medium">No items available in this category.</div>
 ) : (
 <div className="food-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {filteredMenu.map(item => (
 <div key={item._id} className={`bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow ${!item.isAvailable ?"opacity-60 grayscale-[50%]" :""}`}>
 <div className="h-52 w-full bg-slate-100 relative p-2 flex items-center justify-center">
 {item.image ? (
 <img loading="lazy" src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
 ) : (
 <Utensils size={48} className="text-slate-300" />
 )}
 {!item.isAvailable && (
 <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center rounded-xl m-2 backdrop-blur-[2px]">
 <span className="bg-rose-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Sold Out</span>
 </div>
 )}
 {item.isAvailable && (
 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-[#2F4858] shadow-sm border border-white/50">
 Rs. {item.price}
 </div>
 )}
 </div>
 <div className="p-5 pt-4">
 <div className="flex justify-between items-start mb-1.5">
 <h3 className="text-[17px] font-black text-[#2F4858] leading-tight pr-4">{item.name}</h3>
 </div>
 <p className="text-[13px] text-slate-500 font-medium leading-relaxed line-clamp-2">{item.description}</p>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
};

export default MenuView;
