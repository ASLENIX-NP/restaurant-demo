import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* =========================
   AUTH PAGE
========================= */

import Login from "../pages/auth/Login";

/* =========================
   LAYOUTS
========================= */

import AdminLayout from "../components/layout/AdminLayout";
import StaffLayout from "../components/layout/StaffLayout";
import CashierLayout from "../components/layout/CashierLayout";
import ChefLayout from "../components/layout/ChefLayout";

/* =========================
   ADMIN PAGES
========================= */

import Dashboard from "../pages/admin/Dashboard";
import MenuManagement from "../pages/admin/MenuManagement";
import Orders from "../pages/admin/Orders";
import KitchenMonitoring from "../pages/admin/KitchenMonitoring";
import Billing from "../pages/admin/Billing";
import Inventory from "../pages/admin/Inventory";
import Reports from "../pages/admin/Reports";
import Settings from "../pages/admin/Settings";
import TableManagement from "../pages/admin/TableManagement";

/* =========================
   STAFF PAGES
========================= */

import StaffDashboard from "../pages/staff/Dashboard";
import TakeOrder from "../pages/staff/TakeOrder";
import StaffTableManagement from "../pages/staff/TableManagement";
import Reservations from "../pages/staff/Reservations";
import OrderHistory from "../pages/staff/OrderHistory";

/* =========================
   CASHIER PAGES
========================= */

import CashierDashboard from "../pages/cashier/Dashboard";
import Payments from "../pages/cashier/Payments";
import InvoicePrinting from "../pages/cashier/InvoicePrinting";
import SalesHistory from "../pages/cashier/SalesHistory";

/* =========================
   CHEF PAGES
========================= */

import ChefDashboard from "../pages/chef/Dashboard";
import PendingOrders from "../pages/chef/PendingOrders";
import CookingOrders from "../pages/chef/CookingOrders";
import ReadyOrders from "../pages/chef/ReadyOrders";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            LOGIN
        ========================= */}
        <Route path="/" element={<Login />} />

        {/* =========================
            ADMIN ROUTES
        ========================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="orders" element={<Orders />} />
          <Route
            path="kitchen"
            element={<KitchenMonitoring />}
          />
          <Route path="billing" element={<Billing />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route
            path="tables"
            element={<TableManagement />}
          />
        </Route>

        {/* =========================
            STAFF ROUTES
        ========================= */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route
            index
            element={<StaffDashboard />}
          />

          <Route
            path="take-order"
            element={<TakeOrder />}
          />

          <Route
            path="tables"
            element={<StaffTableManagement />}
          />

          <Route
            path="reservations"
            element={<Reservations />}
          />

          <Route
            path="history"
            element={<OrderHistory />}
          />
        </Route>

        {/* =========================
            CASHIER ROUTES
        ========================= */}
        <Route
          path="/cashier"
          element={<CashierLayout />}
        >
          <Route
            index
            element={<CashierDashboard />}
          />

          <Route
            path="payments"
            element={<Payments />}
          />

          <Route
            path="invoice"
            element={<InvoicePrinting />}
          />

          <Route
            path="sales-history"
            element={<SalesHistory />}
          />
        </Route>

        {/* =========================
            CHEF ROUTES
        ========================= */}
        <Route path="/chef" element={<ChefLayout />}>
          <Route
            index
            element={<ChefDashboard />}
          />

          <Route
            path="pending"
            element={<PendingOrders />}
          />

          <Route
            path="cooking"
            element={<CookingOrders />}
          />

          <Route
            path="ready"
            element={<ReadyOrders />}
          />
        </Route>

        {/* =========================
            FALLBACK ROUTE
        ========================= */}
        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;