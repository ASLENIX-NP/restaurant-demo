import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Receipt,
  ShoppingCart,
  Utensils,
  QrCode,
  LayoutGrid,
  LineChart,
  CalendarDays,
  Wallet,
  LogOut,
  Store,
  Download,
  Menu,
  X
} from "lucide-react";

import "../../styles/layout.css";
import { usePWAInstall } from "../../hooks/usePWAInstall";

const CashierLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  const { isInstallable, installPWA } = usePWAInstall();

  return (
    <div className="layout">
      {/* MOBILE OVERLAY */}
      <div 
        className={`mobile-overlay ${isMobileOpen ? 'active' : ''}`} 
        onClick={closeMobileMenu}
      />

      {/* SIDEBAR */}
      <div className={`sidebar print:hidden ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header flex justify-between items-center">
          <div>
            <div className="brand-logo">
              <Store size={28} className="brand-icon" />
              <h1 className="logo-text">ASLENIX</h1>
            </div>
            <p className="brand-subtitle">Cashier Panel</p>
          </div>
          <button 
            className="md:hidden text-slate-400 hover:text-white"
            onClick={closeMobileMenu}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-menu">
          {/* DASHBOARD */}
          <NavLink to="/cashier" end className="menu-item" onClick={closeMobileMenu}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          {/* PENDING BILLS */}
          <NavLink to="/cashier/pending-bills" className="menu-item" onClick={closeMobileMenu}>
            <Receipt size={20} />
            <span>Pending Bills</span>
          </NavLink>

          {/* POS */}
          <NavLink to="/cashier/pos" className="menu-item" onClick={closeMobileMenu}>
            <ShoppingCart size={20} />
            <span>POS Screen</span>
          </NavLink>

          {/* MENU */}
          <NavLink to="/cashier/menu" className="menu-item" onClick={closeMobileMenu}>
            <Utensils size={20} />
            <span>Menu</span>
          </NavLink>

          {/* QR MENU */}
          <NavLink to="/cashier/qr-menu" className="menu-item" onClick={closeMobileMenu}>
            <QrCode size={20} />
            <span>QR Menu</span>
          </NavLink>

          {/* TABLES */}
          <NavLink to="/cashier/tables" className="menu-item" onClick={closeMobileMenu}>
            <LayoutGrid size={20} />
            <span>Tables</span>
          </NavLink>

          {/* RESERVATIONS */}
          <NavLink to="/cashier/reservations" className="menu-item" onClick={closeMobileMenu}>
            <CalendarDays size={20} />
            <span>Reservations</span>
          </NavLink>

          {/* SALES */}
          <NavLink to="/cashier/sales" className="menu-item" onClick={closeMobileMenu}>
            <LineChart size={20} />
            <span>Sales</span>
          </NavLink>

          {/* SHIFT */}
          <NavLink to="/cashier/shift" className="menu-item" onClick={closeMobileMenu}>
            <Wallet size={20} />
            <span>Shift & Drawer</span>
          </NavLink>
        </nav>

        {isInstallable && (
          <button className="logout-btn" onClick={installPWA} style={{ marginBottom: '10px', backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
            <Download size={18} />
            <span>Install POS</span>
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
        {/* MOBILE HEADER TABS */}
        <div className="md:hidden print:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
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

        <div className="content flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CashierLayout;
