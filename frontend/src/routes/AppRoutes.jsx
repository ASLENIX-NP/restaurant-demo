import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

/* LOGIN */
import Login from "../pages/auth/Login";

/* CUSTOMER MENU */
import MenuView from "../pages/customer/MenuView";

/* PROTECTED ROUTE */
import ProtectedRoute from "./ProtectedRoute";

/* LAYOUTS */
import AdminLayout from "../components/layout/AdminLayout";
import StaffLayout from "../components/layout/StaffLayout";
import CashierLayout from "../components/layout/CashierLayout";
import ChefLayout from "../components/layout/ChefLayout";

/* ADMIN */
import AdminDashboard from "../pages/admin/Dashboard";
import MenuManagement from "../pages/admin/MenuManagement";
import Orders from "../pages/admin/Orders";
import KitchenMonitoring from "../pages/admin/KitchenMonitoring";
import Billing from "../pages/admin/Billing";
import Inventory from "../pages/admin/Inventory";
import Reports from "../pages/admin/Reports";
import Settings from "../pages/admin/Settings";
import TableManagement from "../pages/admin/TableManagement";
import Employees from "../pages/admin/Employees";

/* STAFF */
import StaffDashboard from "../pages/staff/Dashboard";
import TakeOrder from "../pages/staff/TakeOrder";
import Tables from "../pages/staff/Tables";
import Reservations from "../pages/staff/Reservations";
import OrderHistory from "../pages/staff/OrderHistory";

/* CASHIER */
import CashierDashboard from "../pages/cashier/Dashboard";
import Payments from "../pages/cashier/Payments";
import PendingBills from "../pages/cashier/PendingBills";
import Invoices from "../pages/cashier/Invoices";
import SalesHistory from "../pages/cashier/SalesHistory";

/* CHEF */
import ChefDashboard from "../pages/chef/Dashboard";
import PendingOrders from "../pages/chef/PendingOrders";
import CookingOrders from "../pages/chef/CookingOrders";
import ReadyOrders from "../pages/chef/ReadyOrders";

const AppRoutes = () => {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* CUSTOMER MENU QR PAGE */}

        <Route
          path="/menu/table/:tableId"
          element={<MenuView />}
        />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">

              <AdminLayout />

            </ProtectedRoute>
          }
        >

          <Route
            index
            element={
              <AdminDashboard />
            }
          />

          <Route
            path="menu"
            element={
              <MenuManagement />
            }
          />

          <Route
            path="orders"
            element={<Orders />}
          />

          <Route
            path="kitchen"
            element={
              <KitchenMonitoring />
            }
          />

          <Route
            path="billing"
            element={<Billing />}
          />

          <Route
            path="inventory"
            element={
              <Inventory />
            }
          />

          <Route
            path="reports"
            element={<Reports />}
          />

          <Route
            path="tables"
            element={
              <TableManagement />
            }
          />

          <Route
            path="employees"
            element={
              <Employees />
            }
          />

          <Route
            path="settings"
            element={
              <Settings />
            }
          />

        </Route>

        {/* STAFF */}

        <Route
          path="/staff"
          element={
            <ProtectedRoute role="staff">

              <StaffLayout />

            </ProtectedRoute>
          }
        >

          <Route
            index
            element={
              <StaffDashboard />
            }
          />

          <Route
            path="dashboard"
            element={
              <StaffDashboard />
            }
          />

          <Route
            path="take-order"
            element={
              <TakeOrder />
            }
          />

          <Route
            path="tables"
            element={<Tables />}
          />

          <Route
            path="reservations"
            element={
              <Reservations />
            }
          />

          <Route
            path="history"
            element={
              <OrderHistory />
            }
          />

        </Route>

        {/* CASHIER */}

        <Route
          path="/cashier"
          element={
            <ProtectedRoute role="cashier">

              <CashierLayout />

            </ProtectedRoute>
          }
        >

          <Route
            index
            element={
              <CashierDashboard />
            }
          />

          <Route
            path="payments"
            element={
              <Payments />
            }
          />

          {/* NEW PENDING BILLS */}

          <Route
            path="pending-bills"
            element={
              <PendingBills />
            }
          />

          <Route
            path="invoices"
            element={
              <Invoices />
            }
          />

          <Route
            path="sales"
            element={
              <SalesHistory />
            }
          />

        </Route>

        {/* CHEF */}

        <Route
          path="/chef"
          element={
            <ProtectedRoute role="chef">

              <ChefLayout />

            </ProtectedRoute>
          }
        >

          <Route
            index
            element={
              <ChefDashboard />
            }
          />

          <Route
            path="pending"
            element={
              <PendingOrders />
            }
          />

          <Route
            path="cooking"
            element={
              <CookingOrders />
            }
          />

          <Route
            path="ready"
            element={
              <ReadyOrders />
            }
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;