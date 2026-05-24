import {
  createContext,
  useContext,
  useState,
} from "react";

const OrderContext = createContext();

export const OrderProvider = ({
  children,
}) => {

  const [orders, setOrders] =
    useState([]);

  // ADD ORDER
  const addOrder = (order) => {

    const newOrder = {
      id: Date.now(),
      ...order,
      status: "pending",
    };

    console.log(
      "ADDING ORDER:",
      newOrder
    );

    setOrders((prev) => [
      ...prev,
      newOrder,
    ]);
  };

  // UPDATE STATUS
  const updateOrderStatus = (
    id,
    status
  ) => {

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id
          ? {
              ...order,
              status,
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
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () =>
  useContext(OrderContext);