import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AdminLayout = () => {
  const links = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: "📊",
    },

    {
      path: "/admin/menu",
      label: "Menu",
      icon: "🍔",
    },

    {
      path: "/admin/orders",
      label: "Orders",
      icon: "🧾",
    },

    {
      path: "/admin/kitchen",
      label: "Kitchen",
      icon: "👨‍🍳",
    },

    {
      path: "/admin/billing",
      label: "Billing",
      icon: "💰",
    },

    {
      path: "/admin/inventory",
      label: "Inventory",
      icon: "📦",
    },

    {
      path: "/admin/reports",
      label: "Reports",
      icon: "📈",
    },

    {
      path: "/admin/tables",
      label: "Tables",
      icon: "🍽️",
    },

    {
      path: "/admin/settings",
      label: "Settings",
      icon: "⚙️",
    },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar
        links={links}
        title="ASLENIX"
      />

      <div className="main-content">
        <Navbar title="Admin Panel" />

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;