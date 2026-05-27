import React, { useState } from "react";
import "../../styles/takeorder.css";

const menuItems = [
  {
    id: 1,
    name: "Chicken Burger",
    category: "Fast Food",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
    available: true,
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    category: "Fast Food",
    price: 900,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
    available: true,
  },
  {
    id: 3,
    name: "Chicken Momo",
    category: "Nepali",
    price: 320,
    image:
      "https://images.unsplash.com/photo-1628294896516-7c4ff7b6dfb4?q=80&w=800&auto=format&fit=crop",
    available: true,
  },
  {
    id: 4,
    name: "Cold Coffee",
    category: "Beverage",
    price: 250,
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800&auto=format&fit=crop",
    available: true,
  },
  {
    id: 5,
    name: "Chowmein",
    category: "Chinese",
    price: 280,
    image:
      "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=800&auto=format&fit=crop",
    available: true,
  },
  {
    id: 6,
    name: "French Fries",
    category: "Snacks",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=800&auto=format&fit=crop",
    available: true,
  },
];

const categories = [
  "All",
  "Fast Food",
  "Nepali",
  "Beverage",
  "Chinese",
  "Snacks",
];

const TakeOrder = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  const filteredItems = menuItems.filter((item) => {
    const categoryMatch =
      selectedCategory === "All" ||
      item.category === selectedCategory;

    const searchMatch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  const addToCart = (item) => {
    const existing = cart.find((i) => i.id === item.id);

    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === item.id
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const vat = subtotal * 0.13;

  const total = subtotal + vat;

  return (
    <div className="takeorder-page">
      <div className="takeorder-header">
        <div>
          <h1>Take Orders 🍽️</h1>
          <p>
            Manage customer dine-in orders professionally
          </p>
        </div>

        <div className="header-actions">
          <button className="live-btn">
            🔴 Live Orders
          </button>

          <button className="new-order-btn">
            + New Order
          </button>
        </div>
      </div>

      <div className="top-controls">
        <select className="table-select">
          <option>Select Table</option>
          <option>Table 1</option>
          <option>Table 2</option>
          <option>Table 3</option>
          <option>Table 4</option>
        </select>

        <input
          type="text"
          placeholder="Search menu..."
          className="search-input"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={
              selectedCategory === cat
                ? "active-category"
                : ""
            }
            onClick={() =>
              setSelectedCategory(cat)
            }
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="takeorder-content">
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <div className="food-card" key={item.id}>
              <div className="food-image-wrapper">
                <img
                  src={item.image}
                  alt={item.name}
                  className="food-image"
                />

                <span className="available-badge">
                  Available
                </span>
              </div>

              <div className="food-info">
                <h2>{item.name}</h2>

                <p>
                  Fresh delicious restaurant food
                </p>

                <div className="food-bottom">
                  <h3>Rs. {item.price}</h3>

                  <button
                    onClick={() =>
                      addToCart(item)
                    }
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-section">
          <div className="cart-header">
            <h2>Current Order</h2>
            <span>Table 2</span>
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                No Items Added
              </div>
            ) : (
              cart.map((item) => (
                <div
                  className="cart-item"
                  key={item.id}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>Qty : {item.qty}</p>
                  </div>

                  <h5>
                    Rs.{" "}
                    {item.price * item.qty}
                  </h5>
                </div>
              ))
            )}
          </div>

          <div className="bill-section">
            <div>
              <span>Subtotal</span>
              <span>Rs. {subtotal}</span>
            </div>

            <div>
              <span>VAT</span>
              <span>
                Rs. {vat.toFixed(0)}
              </span>
            </div>

            <div className="total-row">
              <span>Total</span>
              <span>
                Rs. {total.toFixed(0)}
              </span>
            </div>

            <button className="send-kitchen-btn">
              Send To Kitchen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeOrder;
