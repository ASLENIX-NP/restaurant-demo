// Cooking.jsx

import React from "react";
import "../../styles/cooking.css";

const cookingOrders = [
  {
    id: "#TH1250",
    type: "Dine In",
    table: "Table 4",
    customer: "John Doe",
    chef: "Chef Alex",
    items: ["Grilled Chicken", "Butter Naan"],
    progress: 70,
    timeLeft: "15 mins left",
  },
  {
    id: "#TH1249",
    type: "Takeaway",
    table: "Table 2",
    customer: "Emily Smith",
    chef: "Chef Maria",
    items: ["Veg Biryani", "Raita"],
    progress: 45,
    timeLeft: "20 mins left",
  },
  {
    id: "#TH1248",
    type: "Delivery",
    table: "Table 7",
    customer: "Michael Lee",
    chef: "Chef Ryan",
    items: ["Margherita Pizza", "Garlic Bread"],
    progress: 85,
    timeLeft: "8 mins left",
  },
];

const Cooking = () => {

  const [orders, setOrders] =
    React.useState(cookingOrders);

  const handleProgressChange = (
    index,
    value
  ) => {

    const updatedOrders = [...orders];

    updatedOrders[index].progress =
      value;

    setOrders(updatedOrders);
  };

  return (

    <div className="cooking-page">

      {/* HEADER */}

      <div className="topbar">

        <div className="menu-icon">
          ☰
        </div>

        <div className="topbar-right">

          <div className="notification">
            🔔
            <span>3</span>
          </div>

          <div className="chef-profile">

            <div className="chef-avatar">
              👨‍🍳
            </div>

            <span>
              Chef John
            </span>

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="cooking-content">

        {/* PAGE HEADER */}

        <div className="page-header">

          <div>

            <h1>
              Cooking Orders
            </h1>

            <p>
              Dashboard
              <span> › </span>
              Cooking Orders
            </p>

          </div>

          <button className="date-btn">
            📅 Today, May 31, 2025
          </button>

        </div>

        {/* STATS */}

        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon orange">
              🔥
            </div>

            <div>

              <h2>18</h2>

              <h4>
                Currently Cooking
              </h4>

              <p>
                Orders in kitchen
              </p>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon blue">
              👨‍🍳
            </div>

            <div>

              <h2>6</h2>

              <h4>
                Active Chefs
              </h4>

              <p>
                Working right now
              </p>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green">
              ⚡
            </div>

            <div>

              <h2>14m</h2>

              <h4>
                Average Time
              </h4>

              <p>
                Per cooking order
              </p>

            </div>

          </div>

        </div>

        {/* QUEUE */}

        <div className="queue-section">

          <div className="queue-header">

            <h2>
              Cooking Queue
            </h2>

            <button>
              View All Orders
            </button>

          </div>

          <div className="orders-grid">

            {orders.map((order, index) => (

              <div
                className="order-card"
                key={index}
              >

                <div className="order-top">

                  <h3>
                    {order.id}
                  </h3>

                  <span className="status cooking">
                    Cooking
                  </span>

                </div>

                <div className="order-info">

                  <div className="order-type">
                    {order.type}
                  </div>

                  <div className="order-table">
                    {order.table}
                  </div>

                </div>

                <div className="customer">
                  👤 {order.customer}
                </div>

                <div className="chef">
                  👨‍🍳 {order.chef}
                </div>

                <div className="divider"></div>

                {/* ITEMS */}

                <ul className="items">

                  {order.items.map(
                    (item, i) => (
                      <li key={i}>
                        {item}
                      </li>
                    )
                  )}

                </ul>

                {/* DRAGGABLE PROGRESS */}

                <div className="progress-head">

                  <span>
                    Cooking Progress
                  </span>

                  <span>
                    {order.progress}%
                  </span>

                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={order.progress}
                  className="progress-slider"
                  onChange={(e) =>
                    handleProgressChange(
                      index,
                      e.target.value
                    )
                  }
                />

                {/* TIME */}

                <div className="time-left">
                  ⏱ {order.timeLeft}
                </div>

                {/* BUTTON */}

                <button className="ready-btn">
                  ✔ Mark as Ready
                </button>

              </div>

            ))}

          </div>

          {/* PAGINATION */}

          <div className="pagination">

            <button>‹</button>

            <button className="active">
              1
            </button>

            <button>2</button>

            <button>3</button>

            <button>›</button>

          </div>

          <div className="showing">
            Showing 1 to 3 of 18 orders
          </div>

        </div>

      </div>

    </div>
  );
};

export default Cooking;