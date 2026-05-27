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

          <NavLink
            to="/cashier"
            end
            className="menu-item"
          >
            📊 Dashboard
          </NavLink>

          <NavLink
            to="/cashier/payments"
            className="menu-item"
          >
            💳 Payments
          </NavLink>

          <NavLink
            to="/cashier/invoices"
            className="menu-item"
          >
            🧾 Invoices
          </NavLink>

          <NavLink
            to="/cashier/sales"
            className="menu-item"
          >
            📈 Sales
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