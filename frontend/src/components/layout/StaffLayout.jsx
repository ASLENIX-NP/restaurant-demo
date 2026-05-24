import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const StaffLayout = () => {
  const links = [
    {
      path: "/staff",
      label: "Dashboard",
      icon: "📊",
    },

    {
      path: "/staff/take-order",
      label: "Take Order",
      icon: "📝",
    },

    {
      path: "/staff/tables",
      label: "Tables",
      icon: "🍽️",
    },

    {
      path: "/staff/reservations",
      label: "Reservations",
      icon: "📅",
    },

    {
      path: "/staff/history",
      label: "History",
      icon: "🕒",
    },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar
        links={links}
        title="ASLENIX"
      />

      <div className="main-content">
        <Navbar title="Staff Panel" />

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StaffLayout;