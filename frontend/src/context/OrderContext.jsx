import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { io } from "socket.io-client";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;
      const response = await fetch("http://localhost:5001/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    const socket = io("http://localhost:5001");

    socket.on("newOrder", fetchOrders);
    socket.on("orderUpdated", fetchOrders);
    socket.on("orderStatusUpdated", fetchOrders);
    socket.on("orderCompleted", fetchOrders);
    socket.on("orderCancelled", fetchOrders);

    return () => socket.disconnect();
  }, [fetchOrders]);

  // AUTO-INCREMENT ELAPSED TIME
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          // Only increment timer for active kitchen orders
          if (order.status === "Pending" || order.status === "Cooking") {
            return {
              ...order,
              elapsedMinutes: (order.elapsedMinutes || 0) + 1,
            };
          }
          return order;
        })
      );
    }, 60000); // Runs every 60,000ms (1 minute)
    return () => clearInterval(timer);
  }, []);

  // ADD ORDER (Frontend state update, backend handles the actual creation via POST in TakeOrder.jsx)
  const addOrder = (order) => {
    setOrders((prev) => [order, ...prev]);
  };

  // STATUS UPDATES
  const updateStatus = async (id, status) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      // Optimistic update for snappy UI
      setOrders((prev) =>
        prev.map((o) => (o.id === id || o._id === id ? { ...o, status } : o))
      );

      await fetch(
        `http://localhost:5001/api/orders/${encodeURIComponent(id)}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
    } catch (err) {
      console.error(err);
      fetchOrders(); // Revert on failure
    }
  };

  const startCooking = (id) => updateStatus(id, "Cooking");
  const markReady = (id) => updateStatus(id, "Ready");
  const serveOrder = (id) => updateStatus(id, "Served");

  // COMPLETE
  const completeOrder = async (id, finalDetails = {}) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      // Optimistic update
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id === id || order._id === id) {
            let finalAmount = finalDetails.amount;
            if (!finalAmount) {
              const subtotal = (order.items || []).reduce(
                (sum, i) => sum + i.qty * (parseFloat(i.price) || 0),
                0
              );
              finalAmount = subtotal + (subtotal > 0 ? 50 : 0);
            }
            return {
              ...order,
              ...finalDetails,
              amount: finalAmount,
              status: "Completed",
            };
          }
          return order;
        })
      );

      await fetch(
        `http://localhost:5001/api/orders/${encodeURIComponent(id)}/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(finalDetails),
        }
      );
    } catch (err) {
      console.error(err);
      fetchOrders();
    }
  };

  // CANCEL
  const cancelOrder = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id || order._id === id
            ? { ...order, status: "Cancelled" }
            : order
        )
      );

      await fetch(
        `http://localhost:5001/api/orders/${encodeURIComponent(id)}/cancel`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error(err);
      fetchOrders();
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,

        setOrders,

        addOrder,

        startCooking,

        markReady,

        serveOrder,

        completeOrder,

        cancelOrder,
        fetchOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
