import {
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import Navbar from "./Navbar";

import "../../styles/layout.css";

const AdminLayout = () => {

  const navigate =
    useNavigate();

  const { logout } =
    useAuth();

  // LOGOUT
  const handleLogout = () => {

    logout();

    navigate("/");
  };

  return (
    <div className="layout">

      {/* SIDEBAR */}

      <div className="sidebar">

        <h1 className="logo">
          ASLENIX
        </h1>

        <nav className="sidebar-menu">

          {/* DASHBOARD */}

          <NavLink
            to="/admin"
            end
            className="menu-item"
          >
            📊 Dashboard
          </NavLink>

          {/* MENU */}

          <NavLink
            to="/admin/menu"
            className="menu-item"
          >
            🍔 Menu
          </NavLink>

          {/* ORDERS */}

          <NavLink
            to="/admin/orders"
            className="menu-item"
          >
            📦 Orders
          </NavLink>

          {/* KITCHEN */}

          <NavLink
            to="/admin/kitchen"
            className="menu-item"
          >
            👨‍🍳 Kitchen
          </NavLink>

          {/* BILLING */}

          <NavLink
            to="/admin/billing"
            className="menu-item"
          >
            💰 Billing
          </NavLink>

          {/* INVENTORY */}

          <NavLink
            to="/admin/inventory"
            className="menu-item"
          >
            📦 Inventory
          </NavLink>

          {/* REPORTS */}

          <NavLink
            to="/admin/reports"
            className="menu-item"
          >
            📈 Reports
          </NavLink>

          {/* TABLES */}

          <NavLink
            to="/admin/tables"
            className="menu-item"
          >
            🍽️ Tables
          </NavLink>

          {/* EMPLOYEES */}

          <NavLink
            to="/admin/employees"
            className="menu-item"
          >
            👥 Employees
          </NavLink>

          {/* SETTINGS */}

          <NavLink
            to="/admin/settings"
            className="menu-item"
          >
            ⚙️ Settings
          </NavLink>

        </nav>

        {/* LOGOUT */}

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </div>

      {/* MAIN */}

      <div className="main">

        <Navbar title="Admin Panel" />

        <div className="content">

          <Outlet />

        </div>

      </div>

    </div>
  );
};

export default AdminLayout;