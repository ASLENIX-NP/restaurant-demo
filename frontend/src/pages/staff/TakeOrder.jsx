import { useState } from "react";

import { useOrders } from "../../context/OrderContext";

import "../../styles/staff.css";

const menuItems = [
  {
    name: "Burger",
    price: 450,
  },

  {
    name: "Pizza",
    price: 850,
  },

  {
    name: "Pasta",
    price: 650,
  },

  {
    name: "Cold Coffee",
    price: 300,
  },
];

const TakeOrder = () => {
  const { addOrder } = useOrders();

  const [selectedItems, setSelectedItems] =
    useState([]);

  // ADD ITEM
  const addItem = (item) => {
    setSelectedItems((prev) => [
      ...prev,
      item,
    ]);
  };

  // TOTAL
  const total =
    selectedItems.reduce(
      (acc, item) => acc + item.price,
      0
    );

  // SEND ORDER
  const handleSubmit = () => {

    if (selectedItems.length === 0) {
      alert("Please add items");
      return;
    }

    const newOrder = {
      table:
        Math.floor(Math.random() * 10) + 1,

      items: selectedItems.map(
        (item) => item.name
      ),

      total,
    };

    console.log(
      "NEW ORDER:",
      newOrder
    );

    addOrder(newOrder);

    alert("Order Sent To Kitchen");

    setSelectedItems([]);
  };

  return (
    <div>

      {/* HEADER */}
      <div className="page-header">
        <h1>Take Order</h1>

        <p>Create customer orders</p>
      </div>

      <div className="take-order-layout">

        {/* MENU */}
        <div className="menu-section">
          <h2>Menu Items</h2>

          <div className="menu-grid">

            {menuItems.map((item) => (
              <div
                className="menu-card"
                key={item.name}
              >
                <h3>{item.name}</h3>

                <p>
                  Rs. {item.price}
                </p>

                <button
                  onClick={() =>
                    addItem(item)
                  }
                >
                  Add
                </button>
              </div>
            ))}

          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="order-summary">
          <h2>Current Order</h2>

          <div className="summary-items">

            {selectedItems.map(
              (item, index) => (
                <div
                  className="summary-item"
                  key={index}
                >
                  <span>
                    {item.name}
                  </span>

                  <span>
                    Rs. {item.price}
                  </span>
                </div>
              )
            )}

          </div>

          <div className="summary-total">
            <h3>Total</h3>

            <h2>
              Rs. {total}
            </h2>
          </div>

          <button
            className="submit-order-btn"
            onClick={handleSubmit}
          >
            Send To Kitchen
          </button>

        </div>
      </div>
    </div>
  );
};

export default TakeOrder;