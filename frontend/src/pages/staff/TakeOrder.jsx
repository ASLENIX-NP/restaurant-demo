import React, { useState } from "react";
import "../../styles/takeorders.css";

const categories = [
  "All Categories",
  "Fast Food",
  "Nepali",
  "Beverage",
  "Chinese",
  "Snacks",
  "Desserts",
];

const tables = [
  "All Tables",
  "Table 1",
  "Table 2",
  "Table 3",
  "Table 4",
  "Table 5",
  "Table 6",
  "Table 7",
];

const menuItems = [
  {
    id: 1,
    name: "Chicken Burger",
    category: "Fast Food",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    category: "Fast Food",
    price: 900,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  },
  {
    id: 3,
    name: "Chicken Momo",
    category: "Nepali",
    price: 320,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec",
  },
  {
    id: 4,
    name: "Cold Coffee",
    category: "Beverage",
    price: 250,
    image:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1f846",
  },
  {
    id: 5,
    name: "Chowmein",
    category: "Chinese",
    price: 350,
    image:
      "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841",
  },
  {
    id: 6,
    name: "French Fries",
    category: "Snacks",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1576107232684-1279f390859f",
  },
];

export default function TakeOrder() {
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");

  const [selectedTable, setSelectedTable] =
    useState("Table 5");

  const [cart, setCart] = useState([
    { ...menuItems[0], qty: 1 },
    { ...menuItems[1], qty: 1 },
  ]);

  const filteredItems =
    selectedCategory === "All Categories"
      ? menuItems
      : menuItems.filter(
          (item) =>
            item.category === selectedCategory
        );

  const addToCart = (item) => {
    const exists = cart.find(
      (i) => i.id === item.id
    );

    if (exists) {
      setCart(
        cart.map((i) =>
          i.id === item.id
            ? {
                ...i,
                qty: i.qty + 1,
              }
            : i
        )
      );
    } else {
      setCart([
        ...cart,
        { ...item, qty: 1 },
      ]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: item.qty + 1,
            }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id &&
        item.qty > 1
          ? {
              ...item,
              qty: item.qty - 1,
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(
      cart.filter(
        (item) => item.id !== id
      )
    );
  };

  const subtotal = cart.reduce(
    (acc, item) =>
      acc + item.price * item.qty,
    0
  );

  const vat = subtotal * 0.13;

  const total = subtotal + vat;

  return (
    <div className="takeorder-page">

      {/* MAIN */}

      <main className="takeorder-main">

        {/* TABLE SECTION */}

        <div className="takeorder-table-section">

          <h3>Select Table</h3>

          <div className="takeorder-table-list">

            {tables.map(
              (table, index) => (
                <button
                  key={index}
                  className={
                    selectedTable ===
                    table
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedTable(
                      table
                    )
                  }
                >
                  {table}
                </button>
              )
            )}

          </div>

        </div>

        {/* BODY */}

        <div className="takeorder-body">

          {/* LEFT */}

          <div className="takeorder-left">

            {/* CATEGORY */}

            <div className="takeorder-category-box">

              {categories.map(
                (category, index) => (
                  <button
                    key={index}
                    className={
                      selectedCategory ===
                      category
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setSelectedCategory(
                        category
                      )
                    }
                  >
                    {category}
                  </button>
                )
              )}

            </div>

            {/* MENU */}

            <div className="takeorder-menu-section">

              <div className="takeorder-menu-grid">

                {filteredItems.map(
                  (item) => (
                    <div
                      className="takeorder-card"
                      key={item.id}
                    >

                      <div className="takeorder-badge">
                        Available
                      </div>

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <h4>
                        {item.name}
                      </h4>

                      <p>
                        Delicious freshly
                        prepared food
                      </p>

                      <div className="takeorder-card-bottom">

                        <span>
                          Rs. {item.price}
                        </span>

                        <button
                          onClick={() =>
                            addToCart(
                              item
                            )
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

          </div>

          {/* CART */}

          <div className="takeorder-cart">

            <div className="takeorder-cart-header">

              <h3>
                Current Order
              </h3>

              <span>
                {selectedTable}
              </span>

            </div>

            <div className="takeorder-cart-items">

              {cart.map((item) => (
                <div
                  className="takeorder-cart-item"
                  key={item.id}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="takeorder-cart-info">

                    <h4>
                      {item.name}
                    </h4>

                    <div className="takeorder-qty">

                      <button
                        onClick={() =>
                          decreaseQty(
                            item.id
                          )
                        }
                      >
                        -
                      </button>

                      <span>
                        {item.qty}
                      </span>

                      <button
                        onClick={() =>
                          increaseQty(
                            item.id
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>

                  <div className="takeorder-cart-price">

                    <p>
                      Rs.{" "}
                      {item.price *
                        item.qty}
                    </p>

                    <button
                      onClick={() =>
                        removeItem(
                          item.id
                        )
                      }
                    >
                      🗑
                    </button>

                  </div>

                </div>
              ))}

            </div>

            {/* SUMMARY */}

            <div className="takeorder-summary">

              <div>
                <span>
                  Subtotal
                </span>

                <span>
                  Rs. {subtotal}
                </span>
              </div>

              <div>
                <span>
                  VAT (13%)
                </span>

                <span>
                  Rs.{" "}
                  {vat.toFixed(0)}
                </span>
              </div>

              <div className="total">

                <span>
                  Total
                </span>

                <span>
                  Rs.{" "}
                  {total.toFixed(0)}
                </span>

              </div>

            </div>

            {/* BUTTON */}

            <button className="takeorder-kitchen-btn">
              Send To Kitchen
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}