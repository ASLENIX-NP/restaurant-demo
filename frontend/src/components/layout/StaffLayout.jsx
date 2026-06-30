import { Outlet, NavLink, useNavigate } from"react-router-dom";
import { useState, useEffect, useRef } from"react";
import { 
 BellRing, 
 X,
 LayoutDashboard,
 PenLine,
 LayoutGrid,
 PackageCheck,
 CalendarDays,
 Clock,
 LogOut,
 Store,
 ChevronLeft,
 ChevronRight,
 Menu,
 Download
} from"lucide-react";
import { useOrders } from"../../context/OrderContext";
import { useAuth } from"../../context/AuthContext";
import { usePWAInstall } from "../../hooks/usePWAInstall";

import"../../styles/layout.css";

const StaffLayout = () => {
 const navigate = useNavigate();
 const { orders } = useOrders();
 const [notification, setNotification] = useState(null);
 const [isCollapsed, setIsCollapsed] = useState(false);
 const [isMobileOpen, setIsMobileOpen] = useState(false);
 const { logout } = useAuth();
 const prevOrdersRef = useRef(orders);
 const { isInstallable, installPWA } = usePWAInstall();

 useEffect(() => {
 // Detect if an order was just marked as"Ready"
 const newlyReady = orders.find(
 (order) =>
 order.status ==="Ready" &&
 prevOrdersRef.current.find(
 (o) => o.id === order.id && o.status !=="Ready"
 )
 );

 let timer;
 if (newlyReady) {
 // Play a soft notification sound
 const audio = new Audio(
"https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
 );
 audio.play().catch((err) => console.log("Audio play prevented:", err));

 setNotification({
 id: newlyReady.id,
 table: newlyReady.table,
 });

 // Auto dismiss after 6 seconds
 timer = setTimeout(() => setNotification(null), 6000);
 }

 prevOrdersRef.current = orders;

 return () => {
 if (timer) clearTimeout(timer);
 };
 }, [orders]);

 const handleLogout = () => {
 logout();
    navigate("/login");
 };

 return (
 <div className="layout relative">
      {/* MOBILE OVERLAY */}
      <div 
        className={`mobile-overlay ${isMobileOpen ? "active" : ""}`} 
        onClick={() => setIsMobileOpen(false)}
      ></div>

 {/* SIDEBAR */}
 <div className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isMobileOpen ? "mobile-open" : ""}`}>
  <div className="sidebar-header flex justify-between items-center">
    <div>
      <div className="brand-logo">
        <Store size={28} className="brand-icon" />
        <h1 className="logo-text">ASLENIX</h1>
      </div>
      <p className="brand-subtitle">Staff Panel</p>
    </div>
         {/* Mobile Close Button */}
         <button 
           className="md:hidden text-slate-400 hover:text-white"
           onClick={() => setIsMobileOpen(false)}
         >
           <X size={24} />
         </button>
  </div>

 <nav className="sidebar-menu">
 <NavLink to="/staff" end className="menu-item" onClick={() => setIsMobileOpen(false)}>
 <LayoutDashboard size={20} />
 <span>Dashboard</span>
 </NavLink>

 <NavLink to="/staff/take-order" className="menu-item" onClick={() => setIsMobileOpen(false)}>
 <PenLine size={20} />
 <span>Take Order</span>
 </NavLink>

 <NavLink to="/staff/tables" className="menu-item" onClick={() => setIsMobileOpen(false)}>
 <LayoutGrid size={20} />
 <span>Tables</span>
 </NavLink>

 <NavLink to="/staff/ready-orders" className="menu-item" onClick={() => setIsMobileOpen(false)}>
 <PackageCheck size={20} />
 <span>Ready Orders</span>
 </NavLink>

 <NavLink to="/staff/reservations" className="menu-item" onClick={() => setIsMobileOpen(false)}>
 <CalendarDays size={20} />
 <span>Reservations</span>
 </NavLink>

 <NavLink to="/staff/history" className="menu-item" onClick={() => setIsMobileOpen(false)}>
 <Clock size={20} />
 <span>History</span>
 </NavLink>
 </nav>

 {/* COLLAPSE TOGGLE */}
 <button 
   className="collapse-toggle-btn"
   onClick={() => setIsCollapsed(!isCollapsed)}
 >
   {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
 </button>

 {isInstallable && !isCollapsed && (
    <button className="logout-btn" onClick={installPWA} style={{ marginBottom: '10px', backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
      <Download size={18} />
      <span>Install App</span>
    </button>
  )}

  {isInstallable && isCollapsed && (
    <button className="logout-btn" onClick={installPWA} style={{ marginBottom: '10px', backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '12px' }} title="Install App">
      <Download size={18} style={{ margin: 0 }} />
    </button>
  )}

 {/* LOGOUT */}
 <button className="logout-btn" onClick={handleLogout}>
 <LogOut size={18} />
 <span>Logout</span>
 </button>
 </div>

 {/* MAIN */}
 <div className="main flex flex-col min-h-screen">
      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="text-slate-600 hover:text-slate-900 focus:outline-none"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Store size={20} className="text-blue-600" />
            <span className="font-bold text-slate-900 tracking-tight">ASLENIX</span>
          </div>
        </div>
      </div>

 <div className="content flex-1">
 <Outlet />
 </div>
 </div>

 {/* --- GLOBAL POPUP NOTIFICATION (ORDER READY) --- */}
 {notification && (
 <div
 onClick={() => {
 setNotification(null);
 navigate("/staff/ready-orders");
 }}
 className="fixed bottom-6 right-6 bg-white border-l-4 border-emerald-500 rounded-xl shadow-md p-5 w-80 animate-slide-in z-[9999] flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
 >
 <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-full flex-shrink-0">
 <BellRing size={24} className="animate-bounce" />
 </div>
 <div className="flex-1">
 <div className="flex justify-between items-start">
 <h4 className="text-sm font-black text-slate-900">
 Order Ready!
 </h4>
 <button
 onClick={(e) => {
 e.stopPropagation();
 setNotification(null);
 }}
 className="text-slate-400 hover:text-slate-600 transition-colors"
 >
 <X size={14} />
 </button>
 </div>
 <p className="text-xs font-medium text-slate-500 mt-1">
 Ticket{""}
 <strong className="text-slate-800">{notification.id}</strong> for{""}
 <strong className="text-slate-800">
 {notification.table ||"Queue"}
 </strong>{""}
 is ready at the expo window.
 </p>
 </div>
 </div>
 )}
 </div>
 );
};

export default StaffLayout;
