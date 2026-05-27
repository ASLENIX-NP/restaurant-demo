import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const OrderContext =
  createContext();

export const OrderProvider = ({
  children,
}) => {

  // LOAD FROM LOCAL STORAGE
  const [orders, setOrders] =
    useState(() => {

      const savedOrders =
        localStorage.getItem(
          "restaurant_orders"
        );

      return savedOrders
        ? JSON.parse(savedOrders)
        : [];
    });

  // SAVE TO LOCAL STORAGE
  useEffect(() => {

    localStorage.setItem(
      "restaurant_orders",
      JSON.stringify(orders)
    );

  }, [orders]);

  // ADD ORDER
  const addOrder = (
    order
  ) => {

    const newOrder = {
      id: Date.now(),

      ...order,

      status: "Pending",
    };

    setOrders((prev) => [
      ...prev,
      newOrder,
    ]);
  };

  // START COOKING
  const startCooking = (
    id
  ) => {

    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              status:
                "Cooking",
            }
          : order
      )
    );
  };

  // READY
  const markReady = (
    id
  ) => {

    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              status:
                "Ready",
            }
          : order
      )
    );
  };

  // COMPLETE
  const completeOrder = (
    id
  ) => {

    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              status:
                "Completed",
            }
          : order
      )
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,

        addOrder,

        startCooking,

        markReady,

        completeOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () =>
  useContext(OrderContext);