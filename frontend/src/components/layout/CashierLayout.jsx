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
  Store
} from "lucide-react";

import "../../styles/layout.css";

const CashierLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="brand-logo">
            <Store size={28} className="brand-icon" />
            <h1 className="logo-text">ASLENIX</h1>
          </div>
          <p className="brand-subtitle">Cashier Panel</p>
        </div>

        <nav className="sidebar-menu">
          {/* DASHBOARD */}
          <NavLink
            to="/cashier"
            end
            className="menu-item"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          {/* PENDING BILLS */}
          <NavLink
            to="/cashier/pending-bills"
            className="menu-item"
          >
            <Receipt size={20} />
            <span>Pending Bills</span>
          </NavLink>

          {/* POS */}
          <NavLink
            to="/cashier/pos"
            className="menu-item"
          >
            <ShoppingCart size={20} />
            <span>POS Screen</span>
          </NavLink>

          {/* MENU */}
          <NavLink
            to="/cashier/menu"
            className="menu-item"
          >
            <Utensils size={20} />
            <span>Menu</span>
          </NavLink>

          {/* QR MENU */}
          <NavLink
            to="/cashier/qr-menu"
            className="menu-item"
          >
            <QrCode size={20} />
            <span>QR Menu</span>
          </NavLink>

          {/* TABLES */}
          <NavLink
            to="/cashier/tables"
            className="menu-item"
          >
            <LayoutGrid size={20} />
            <span>Tables</span>
          </NavLink>

          {/* RESERVATIONS */}
          <NavLink
            to="/cashier/reservations"
            className="menu-item"
          >
            <CalendarDays size={20} />
            <span>Reservations</span>
          </NavLink>

          {/* SALES */}
          <NavLink
            to="/cashier/sales"
            className="menu-item"
          >
            <LineChart size={20} />
            <span>Sales</span>
          </NavLink>

          {/* SHIFT */}
          <NavLink
            to="/cashier/shift"
            className="menu-item"
          >
            <Wallet size={20} />
            <span>Shift & Drawer</span>
          </NavLink>
        </nav>

        {/* LOGOUT */}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      {/* MAIN */}
      <div className="main">
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CashierLayout;