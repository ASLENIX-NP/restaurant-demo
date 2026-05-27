import { Outlet, NavLink } from "react-router-dom";

import Navbar from "./Navbar";

import "../../styles/layout.css";

const StaffLayout = () => {
  return (
    <div className="layout">

      {/* SIDEBAR */}
      <div className="sidebar">

        <h1 className="logo">
          ASLENIX
        </h1>

        <nav className="sidebar-menu">

          <NavLink
            to="/staff"
            end
            className="menu-item"
          >
            📊 Dashboard
          </NavLink>

          <NavLink
            to="/staff/take-order"
            className="menu-item"
          >
            📝 Take Order
          </NavLink>

          <NavLink
            to="/staff/tables"
            className="menu-item"
          >
            🍽️ Tables
          </NavLink>

          <NavLink
            to="/staff/reservations"
            className="menu-item"
          >
            🗓️ Reservations
          </NavLink>

          <NavLink
            to="/staff/history"
            className="menu-item"
          >
            🕓 History
          </NavLink>

        </nav>
      </div>

      {/* MAIN */}
      <div className="main">

        <Navbar title="Staff Panel" />

        <div className="content">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default StaffLayout;