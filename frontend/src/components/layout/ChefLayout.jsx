import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const ChefLayout = () => {
  const links = [
    {
      path: "/chef",
      label: "Dashboard",
      icon: "📊",
    },

    {
      path: "/chef/pending",
      label: "Pending",
      icon: "🕒",
    },

    {
      path: "/chef/cooking",
      label: "Cooking",
      icon: "🔥",
    },

    {
      path: "/chef/ready",
      label: "Ready",
      icon: "✅",
    },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar
        links={links}
        title="ASLENIX"
      />

      <div className="main-content">
        <Navbar title="Kitchen Panel" />

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChefLayout;