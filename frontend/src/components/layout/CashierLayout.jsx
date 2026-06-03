import { Outlet, NavLink } from "react-router-dom";

import Navbar from "./Navbar";

import "../../styles/layout.css";

const CashierLayout = () => {
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
            to="/cashier"
            end
            className="menu-item"
          >
            📊 Dashboard
          </NavLink>

          {/* PENDING BILLS */}

          <NavLink
            to="/cashier/pending-bills"
            className="menu-item"
          >
            🧾 Pending Bills
          </NavLink>

          {/* POS */}

          <NavLink
            to="/cashier/pos"
            className="menu-item"
          >
            🛒 POS Screen
          </NavLink>

          {/* MENU */}

          <NavLink
            to="/cashier/menu"
            className="menu-item"
          >
            🍔 Menu
          </NavLink>

          {/* QR MENU */}

          <NavLink
            to="/cashier/qr-menu"
            className="menu-item"
          >
            📱 QR Menu
          </NavLink>

          {/* TABLES */}

          <NavLink
            to="/cashier/tables"
            className="menu-item"
          >
            🍽️ Tables
          </NavLink>

          {/* PAYMENTS */}

          <NavLink
            to="/cashier/payments"
            className="menu-item"
          >
            💳 Payments
          </NavLink>

          {/* INVOICES */}

          <NavLink
            to="/cashier/invoices"
            className="menu-item"
          >
            📄 Invoices
          </NavLink>

          {/* SALES */}

          <NavLink
            to="/cashier/sales"
            className="menu-item"
          >
            📈 Sales
          </NavLink>

          {/* SHIFT */}

          <NavLink
            to="/cashier/shift"
            className="menu-item"
          >
            🏦 Shift & Drawer
          </NavLink>

        </nav>

      </div>

      {/* MAIN */}

      <div className="main">

        <Navbar title="Cashier Panel" />

        <div className="content">

          <Outlet />

        </div>

      </div>

    </div>
  );
};

export default CashierLayout;