import { useState, useEffect } from "react";
import {
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  LayoutDashboard,
  Utensils,
  QrCode,
  ClipboardList,
  ChefHat,
  Receipt,
  Package,
  LineChart,
  LayoutGrid,
  Users,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
  CalendarCheck
} from "lucide-react";

import "../../styles/layout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // LOGOUT
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  // SESSION TIMEOUT (30 mins of inactivity)
  useEffect(() => {
    let timeout;
    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        handleLogout();
      }, 30 * 60 * 1000); // 30 mins
    };

    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach((evt) => window.addEventListener(evt, resetTimeout));
    resetTimeout();

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, resetTimeout));
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="layout">
      {/* MOBILE OVERLAY */}
      <div 
        className={`mobile-overlay ${isMobileOpen ? 'active' : ''}`} 
        onClick={closeMobileMenu}
      />

      {/* SIDEBAR */}
      <div className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        
        <div className="sidebar-header flex justify-between items-center">
          <div>
            <div className="brand-logo">
              <Store size={28} className="brand-icon" />
              <h1 className="logo-text">ASLENIX</h1>
            </div>
            <p className="brand-subtitle">ERP System</p>
          </div>
          <button 
            className="md:hidden text-slate-400 hover:text-white"
            onClick={closeMobileMenu}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-menu">

          <NavLink to="/admin" end className="menu-item" onClick={closeMobileMenu}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/menu" className="menu-item" onClick={closeMobileMenu}>
            <Utensils size={20} />
            <span>Menu</span>
          </NavLink>

          <NavLink to="/admin/qr-menu" className="menu-item" onClick={closeMobileMenu}>
            <QrCode size={20} />
            <span>QR Menu</span>
          </NavLink>

          <NavLink to="/admin/orders" className="menu-item" onClick={closeMobileMenu}>
            <ClipboardList size={20} />
            <span>Orders</span>
          </NavLink>

          <NavLink to="/admin/kitchen" className="menu-item" onClick={closeMobileMenu}>
            <ChefHat size={20} />
            <span>Kitchen</span>
          </NavLink>

          <NavLink to="/admin/billing" className="menu-item" onClick={closeMobileMenu}>
            <Receipt size={20} />
            <span>Billing</span>
          </NavLink>

          <NavLink to="/admin/inventory" className="menu-item" onClick={closeMobileMenu}>
            <Package size={20} />
            <span>Inventory</span>
          </NavLink>

          <NavLink to="/admin/reports" className="menu-item" onClick={closeMobileMenu}>
            <LineChart size={20} />
            <span>Reports</span>
          </NavLink>

          <NavLink to="/admin/tables" className="menu-item" onClick={closeMobileMenu}>
            <LayoutGrid size={20} />
            <span>Tables</span>
          </NavLink>

          <NavLink to="/admin/reservations" className="menu-item" onClick={closeMobileMenu}>
            <CalendarCheck size={20} />
            <span>Reservations</span>
          </NavLink>

          <NavLink to="/admin/employees" className="menu-item" onClick={closeMobileMenu}>
            <Users size={20} />
            <span>Employees</span>
          </NavLink>

          <NavLink to="/admin/settings" className="menu-item" onClick={closeMobileMenu}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>

        </nav>

        {/* LOGOUT */}
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

      </div>

      {/* MAIN */}
      <div className="main">
        {/* MOBILE HEADER TABS */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600">
            <Store size={24} />
            <span className="font-black text-xl tracking-tight text-slate-800">ASLENIX</span>
          </div>
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>

    </div>
  );
};

export default AdminLayout;
