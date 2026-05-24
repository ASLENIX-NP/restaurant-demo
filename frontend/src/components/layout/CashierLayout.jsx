import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const CashierLayout = () => {
  const links = [
    {
      path: "/cashier",
      label: "Dashboard",
      icon: "📊",
    },

    {
      path: "/cashier/payments",
      label: "Payments",
      icon: "💳",
    },

    {
      path: "/cashier/invoice",
      label: "Invoices",
      icon: "🧾",
    },

    {
      path: "/cashier/sales-history",
      label: "Sales",
      icon: "📈",
    },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar
        links={links}
        title="ASLENIX"
      />

      <div className="main-content">
        <Navbar title="Cashier Panel" />

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CashierLayout;