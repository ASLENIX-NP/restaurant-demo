import { createContext, useContext, useEffect, useState } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  // LOAD FROM LOCAL STORAGE
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("restaurant_orders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("restaurant_orders", JSON.stringify(orders));
  }, [orders]);

  // SYNC ACROSS TABS (CRUCIAL FOR MULTI-DEVICE SIMULATION)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "restaurant_orders") {
        setOrders(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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

  // ADD ORDER
  const addOrder = (order) => {
    const newOrder = {
      id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,

      ...order,

      status: "Pending",
    };

    setOrders((prev) => [...prev, newOrder]);
  };

  // START COOKING
  const startCooking = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              status: "Cooking",
            }
          : order
      )
    );
  };

  // READY
  const markReady = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              status: "Ready",
            }
          : order
      )
    );
  };

  // SERVE
  const serveOrder = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              status: "Served",
            }
          : order
      )
    );
  };

  // COMPLETE
  const completeOrder = (id, finalDetails = {}) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              ...finalDetails,
              status: "Completed",
            }
          : order
      )
    );
  };

  // CANCEL
  const cancelOrder = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: "Cancelled" } : order
      )
    );
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
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
