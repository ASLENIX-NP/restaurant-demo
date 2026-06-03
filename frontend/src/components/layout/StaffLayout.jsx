import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { BellRing, X } from "lucide-react";
import { useOrders } from "../../context/OrderContext";

import Navbar from "./Navbar";

import "../../styles/layout.css";

const StaffLayout = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const [notification, setNotification] = useState(null);
  const prevOrdersRef = useRef(orders);

  useEffect(() => {
    // Detect if an order was just marked as "Ready"
    const newlyReady = orders.find(
      (order) =>
        order.status === "Ready" &&
        prevOrdersRef.current.find((o) => o.id === order.id && o.status !== "Ready")
    );

    if (newlyReady) {
      // Play a soft notification sound
      const audio = new Audio("https://actions.google.com/sounds/v1/alarms/message_alerts.ogg");
      audio.play().catch((err) => console.log("Audio play prevented:", err));

      setNotification({
        id: newlyReady.id,
        table: newlyReady.table,
      });

      // Auto dismiss after 6 seconds
      const timer = setTimeout(() => setNotification(null), 6000);
      return () => clearTimeout(timer);
    }

    prevOrdersRef.current = orders;
  }, [orders]);

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
            to="/staff/ready-orders"
            className="menu-item"
          >
            📦 Ready Orders
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

      {/* --- GLOBAL POPUP NOTIFICATION (ORDER READY) --- */}
      {notification && (
        <div 
          onClick={() => {
            setNotification(null);
            navigate('/staff/ready-orders');
          }}
          className="fixed bottom-6 right-6 bg-white border-l-4 border-emerald-500 rounded-xl shadow-2xl p-5 w-80 animate-slide-in z-[9999] flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-full flex-shrink-0">
            <BellRing size={24} className="animate-bounce" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-black text-slate-900">Order Ready!</h4>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setNotification(null);
                }} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Ticket <strong className="text-slate-800">{notification.id}</strong> for <strong className="text-slate-800">{notification.table || "Queue"}</strong> is ready at the expo window.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffLayout;