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
  Store
} from "lucide-react";

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
        
        <div className="sidebar-header">
          <div className="brand-logo">
            <Store size={28} className="brand-icon" />
            <h1 className="logo-text">ASLENIX</h1>
          </div>
          <p className="brand-subtitle">ERP System</p>
        </div>

        <nav className="sidebar-menu">

          {/* DASHBOARD */}

          <NavLink
            to="/admin"
            end
            className="menu-item"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          {/* MENU */}

          <NavLink
            to="/admin/menu"
            className="menu-item"
          >
            <Utensils size={20} />
            <span>Menu</span>
          </NavLink>

          {/* QR MENU (NEW) */}

          <NavLink
            to="/admin/qr-menu"
            className="menu-item"
          >
            <QrCode size={20} />
            <span>QR Menu</span>
          </NavLink>

          {/* ORDERS */}

          <NavLink
            to="/admin/orders"
            className="menu-item"
          >
            <ClipboardList size={20} />
            <span>Orders</span>
          </NavLink>

          {/* KITCHEN */}

          <NavLink
            to="/admin/kitchen"
            className="menu-item"
          >
            <ChefHat size={20} />
            <span>Kitchen</span>
          </NavLink>

          {/* BILLING */}

          <NavLink
            to="/admin/billing"
            className="menu-item"
          >
            <Receipt size={20} />
            <span>Billing</span>
          </NavLink>

          {/* INVENTORY */}

          <NavLink
            to="/admin/inventory"
            className="menu-item"
          >
            <Package size={20} />
            <span>Inventory</span>
          </NavLink>

          {/* REPORTS */}

          <NavLink
            to="/admin/reports"
            className="menu-item"
          >
            <LineChart size={20} />
            <span>Reports</span>
          </NavLink>

          {/* TABLES */}

          <NavLink
            to="/admin/tables"
            className="menu-item"
          >
            <LayoutGrid size={20} />
            <span>Tables</span>
          </NavLink>

          {/* EMPLOYEES */}

          <NavLink
            to="/admin/employees"
            className="menu-item"
          >
            <Users size={20} />
            <span>Employees</span>
          </NavLink>

          {/* SETTINGS */}

          <NavLink
            to="/admin/settings"
            className="menu-item"
          >
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

        <div className="content">

          <Outlet />

        </div>

      </div>

    </div>
  );
};

export default AdminLayout;
