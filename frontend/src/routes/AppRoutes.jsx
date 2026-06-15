import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import CustomerMenu from "../pages/CustomerMenu";

// ================= CONTEXT =================
import { TableProvider } from "../context/TableContext";

// ================= ADMIN =================
import AdminLayout from "../components/layout/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import MenuManagement from "../pages/admin/MenuManagement";
import Orders from "../pages/admin/Orders";
import KitchenMonitoring from "../pages/admin/KitchenMonitoring";
import Billing from "../pages/admin/Billing";
import Inventory from "../pages/admin/Inventory";
import Reports from "../pages/admin/Reports";
import TableManagement from "../pages/admin/TableManagement";
import Employees from "../pages/admin/Employees";
import Settings from "../pages/admin/Settings";
import QRMenuManager from "../pages/admin/QRMenuManager";
import UserLog from "../pages/admin/UserLog";

// <-- 1. IMPORT ADDED HERE

// ================= STAFF =================
import StaffLayout from "../components/layout/StaffLayout";
import StaffDashboard from "../pages/staff/Dashboard";
import TakeOrder from "../pages/staff/TakeOrder";
import Tables from "../pages/staff/Tables";
import Reservations from "../pages/staff/Reservations";
import OrderHistory from "../pages/staff/OrderHistory";
import ReadyOrders from "../pages/staff/ReadyOrders";

// ================= CHEF =================
import ChefLayout from "../components/layout/ChefLayout";
import ChefDashboard from "../pages/chef/Dashboard";

// ================= CASHIER =================
import CashierLayout from "../components/layout/CashierLayout";
import CashierDashboard from "../pages/cashier/Dashboard";
import PendingBills from "../pages/cashier/PendingBills";
import SalesHistory from "../pages/cashier/SalesHistory";
import POS from "../pages/cashier/POS";
import ShiftManagement from "../pages/cashier/ShiftManagement";
import CashierReservations from "../pages/cashier/Reservations";
import TotalOrders from "../pages/cashier/TotalOrders";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <TableProvider>
        <Routes>
          {/* LOGIN */}
          <Route path="/" element={<Login />} />

          {/* PUBLIC CUSTOMER MENU */}
          <Route path="/menu" element={<CustomerMenu />} />

          {/* ================= ADMIN ================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="qr-menu" element={<QRMenuManager />} />{" "}
            {/* <-- 2. ROUTE ADDED HERE */}
            <Route path="orders" element={<Orders />} />
            <Route path="kitchen" element={<KitchenMonitoring />} />
            <Route path="billing" element={<Billing />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="reports" element={<Reports />} />
            <Route path="tables" element={<TableManagement />} />
            <Route path="employees" element={<Employees />} />
            <Route path="settings" element={<Settings />} />
            <Route path="user-log" element={<UserLog />} />
          </Route>

          {/* ================= STAFF ================= */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute role="staff">
                <StaffLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StaffDashboard />} />
            <Route path="take-order" element={<TakeOrder />} />
            <Route path="tables" element={<Tables />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="history" element={<OrderHistory />} />
            <Route path="ready-orders" element={<ReadyOrders />} />
          </Route>

          {/* ================= CHEF PANEL ================= */}
          <Route
            path="/chef"
            element={
              <ProtectedRoute role="chef">
                <ChefLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ChefDashboard />} />
            <Route path="*" element={<Navigate to="/chef" replace />} />
          </Route>

          {/* ================= CASHIER ================= */}
          <Route
            path="/cashier"
            element={
              <ProtectedRoute role="cashier">
                <CashierLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CashierDashboard />} />
            <Route path="pos" element={<POS />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="qr-menu" element={<QRMenuManager />} />
            <Route path="tables" element={<TableManagement />} />
            <Route path="reservations" element={<CashierReservations />} />
            <Route path="pending-bills" element={<PendingBills />} />
            <Route path="sales" element={<SalesHistory />} />
            <Route path="total-orders" element={<TotalOrders />} />
            <Route path="shift" element={<ShiftManagement />} />
            
            {/* Redirect old deleted routes to the unified ledger */}
            <Route path="payments" element={<Navigate to="/cashier/sales" replace />} />
            <Route path="invoices" element={<Navigate to="/cashier/sales" replace />} />
          </Route>
        </Routes>
      </TableProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
