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
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    category: "Fast Food",
    price: 900,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  },
  {
    id: 3,
    name: "Chicken Momo",
    category: "Nepali",
    price: 320,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec",
  },
  {
    id: 4,
    name: "Cold Coffee",
    category: "Beverage",
    price: 250,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1f846",
  },
  {
    id: 5,
    name: "Chowmein",
    category: "Chinese",
    price: 350,
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841",
  },
  {
    id: 6,
    name: "French Fries",
    category: "Snacks",
    price: 200,
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f",
  },
];

export default function TakeOrder() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedTable, setSelectedTable] = useState("Table 5");
  const [cart, setCart] = useState([
    { ...menuItems[0], qty: 1 },
    { ...menuItems[1], qty: 1 },
  ]);

  const filteredItems =
    selectedCategory === "All Categories"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const addToCart = (item) => {
    const exists = cart.find((i) => i.id === item.id);

    if (exists) {
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // --- Send to Kitchen Handler ---
  const handleSendToKitchen = () => {
    // 1. Guard clause: Ensure cart isn't empty
    if (cart.length === 0) {
      alert("Your cart is empty! Please add items before sending to the kitchen.");
      return;
    }

    // 2. Guard clause: Ensure a valid table is selected (not "All Tables")
    if (selectedTable === "All Tables") {
      alert("Please select a valid table number.");
      return;
    }

    // 3. CAPTURE ORDER TAKEN TIME
    // Formats time exactly like your dashboard views (e.g., "11:05 AM")
    const orderTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    // Full current date string for your History ledger database matching
    const orderDate = new Date().toISOString().split('T')[0]; 

    // 4. Construct the order payload with temporal metrics
    const orderData = {
      table: selectedTable,
      items: cart.map(({ id, name, qty, price }) => ({ id, name, qty, price })),
      subtotal,
      vat: parseFloat(vat.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      time: orderTime,       // <-- Aesthetic localized dispatch time string sent here!
      date: orderDate,       // <-- Standard uniform date tracking signature
      timestamp: new Date().toISOString(),
    };

    // 5. Simulate sending data (Replace this console.log with an API call later)
    console.log("Sending enriched order to kitchen API...", orderData);
    
    alert(`Order for ${selectedTable} successfully sent to the kitchen at ${orderTime}!`);

    // 6. Reset Cart and state for next customer
    setCart([]);
    setSelectedTable("All Tables"); 
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
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
            {tables.map((table, index) => (
              <button
                key={index}
                className={selectedTable === table ? "active" : ""}
                onClick={() => setSelectedTable(table)}
              >
                {table}
              </button>
            ))}
          </div>
        </div>

        {/* BODY */}
        <div className="takeorder-body">
          {/* LEFT */}
          <div className="takeorder-left">
            {/* CATEGORY */}
            <div className="takeorder-category-box">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={selectedCategory === category ? "active" : ""}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* MENU */}
            <div className="takeorder-menu-section">
              <div className="takeorder-menu-grid">
                {filteredItems.map((item) => (
                  <div className="takeorder-card" key={item.id}>
                    <div className="takeorder-badge">Available</div>
                    <img src={item.image} alt={item.name} />
                    <h4>{item.name}</h4>
                    <p>Delicious freshly prepared food</p>
                    <div className="takeorder-card-bottom">
                      <span>Rs. {item.price}</span>
                      <button onClick={() => addToCart(item)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CART */}
          <div className="takeorder-cart">
            <div className="takeorder-cart-header">
              <h3>Current Order</h3>
              <span>{selectedTable}</span>
            </div>

            <div className="takeorder-cart-items">
              {cart.map((item) => (
                <div className="takeorder-cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="takeorder-cart-info">
                    <h4>{item.name}</h4>
                    <div className="takeorder-qty">
                      <button onClick={() => decreaseQty(item.id)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => increaseQty(item.id)}>+</button>
                    </div>
                  </div>
                  <div className="takeorder-cart-price">
                    <p>Rs. {item.price * item.qty}</p>
                    <button onClick={() => removeItem(item.id)}>🗑</button>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="takeorder-summary">
              <div>
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div>
                <span>VAT (13%)</span>
                <span>Rs. {vat.toFixed(0)}</span>
              </div>
              <div className="total">
                <span>Total</span>
                <span>Rs. {total.toFixed(0)}</span>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button 
              className="takeorder-kitchen-btn"
              onClick={handleSendToKitchen}
            >
              Send To Kitchen
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}