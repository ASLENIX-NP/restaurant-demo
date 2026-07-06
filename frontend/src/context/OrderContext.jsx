import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSocket } from "./SocketContext";
import apiClient from "../api/apiClient";
import { useToast } from "./ToastContext";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket();
  const { showToast } = useToast();

  const fetchOrders = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await apiClient.get("/api/orders?limit=1000");
      // Handle both the old array format and the new paginated object format
      setOrders(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync offline orders when back online
  const syncOfflineOrders = useCallback(async () => {
    const offlineOrders = JSON.parse(localStorage.getItem("offline_orders") || "[]");
    if (offlineOrders.length === 0) return;

    console.log(`Syncing ${offlineOrders.length} offline orders...`);
    showToast(`You're back online! Syncing ${offlineOrders.length} offline orders...`, "info");
    
    const token = localStorage.getItem("token");
    const remainingOrders = [];
    let syncedCount = 0;
    
    for (const order of offlineOrders) {
      try {
        // Strip mock offline IDs before sending to server
        const { id, _id, sync_pending, ...orderPayload } = order;
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(orderPayload)
        });
        
        if (!response.ok) {
          throw new Error("Failed to sync order to server");
        }
        syncedCount++;
      } catch (err) {
        console.error("Failed to sync an offline order:", err);
        remainingOrders.push(order);
      }
    }
    
    // Clear successfully synced orders from local storage, keep remaining
    localStorage.setItem("offline_orders", JSON.stringify(remainingOrders));
    
    if (syncedCount > 0) {
      showToast(`Successfully synced ${syncedCount} offline orders!`, "success");
      fetchOrders();
    }
    if (remainingOrders.length > 0) {
      showToast(`${remainingOrders.length} orders failed to sync. Will try again later.`, "error");
    }
  }, [fetchOrders, showToast]);

  useEffect(() => {
    window.addEventListener("online", syncOfflineOrders);
    // Also try to sync on mount if online
    if (navigator.onLine) syncOfflineOrders();

    return () => window.removeEventListener("online", syncOfflineOrders);
  }, [syncOfflineOrders]);

  useEffect(() => {
    fetchOrders();

    if (!socket) return;

    const handleNewOrder = (newOrder) => {
      setOrders((prevOrders) => {
        // Prevent duplicates just in case
        if (
          prevOrders.find((o) => o.id === newOrder.id || o._id === newOrder._id)
        )
          return prevOrders;
        return [newOrder, ...prevOrders];
      });
    };

    const handleOrderUpdate = (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id || order._id === updatedOrder._id
            ? updatedOrder
            : order
        )
      );
    };

    socket.on("newOrder", handleNewOrder);
    socket.on("orderUpdated", handleOrderUpdate);
    socket.on("orderStatusUpdated", handleOrderUpdate);
    socket.on("orderCompleted", handleOrderUpdate);
    socket.on("orderCancelled", handleOrderUpdate);

    return () => {
      socket.off("newOrder", handleNewOrder);
      socket.off("orderUpdated", handleOrderUpdate);
      socket.off("orderStatusUpdated", handleOrderUpdate);
      socket.off("orderCompleted", handleOrderUpdate);
      socket.off("orderCancelled", handleOrderUpdate);
    };
  }, [fetchOrders, socket]);

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
      // Optimistic update for snappy UI
      setOrders((prev) =>
        prev.map((o) => (o.id === id || o._id === id ? { ...o, status } : o))
      );

      await apiClient.put(`/api/orders/${encodeURIComponent(id)}/status`, {
        status,
      });
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

      await apiClient.put(
        `/api/orders/${encodeURIComponent(id)}/complete`,
        finalDetails
      );
    } catch (err) {
      console.error(err);
      fetchOrders();
    }
  };

  // CANCEL
  const cancelOrder = async (id) => {
    try {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id || order._id === id
            ? { ...order, status: "Cancelled" }
            : order
        )
      );

      await apiClient.put(`/api/orders/${encodeURIComponent(id)}/cancel`);
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
        isLoading,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
