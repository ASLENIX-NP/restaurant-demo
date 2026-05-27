// src/pages/chef/ReadyOrders.jsx

import React from "react";
import "../../styles/readyorders.css";

const orders = [
  {
    id: "#TH1250",
    type: "Dine In",
    table: "Table 4",
    customer: "John Doe",
    chef: "Chef Alex",
    items: ["Grilled Chicken", "Butter Naan"],
    completedAt: "10:45 AM",
  },
  {
    id: "#TH1249",
    type: "Takeaway",
    table: "Table 2",
    customer: "Emily Smith",
    chef: "Chef Maria",
    items: ["Veg Biryani", "Raita"],
    completedAt: "10:35 AM",
  },
  {
    id: "#TH1248",
    type: "Delivery",
    table: "Table 7",
    customer: "Michael Lee",
    chef: "Chef Ryan",
    items: ["Margherita Pizza", "Garlic Bread"],
    completedAt: "10:25 AM",
  },
];

const ReadyOrders = () => {
  return (
    <div className="ready-page">

      <div className="ready-topbar">
        <div>
          <h1>Ready Orders</h1>

          <div className="breadcrumb">
            Dashboard <span>›</span> Ready Orders
          </div>
        </div>

        <button className="date-btn">
          📅 Today, May 31, 2025
        </button>
      </div>

      <div className="ready-stats">

        <div className="stat-card">
          <div className="stat-icon green">✅</div>

          <div>
            <h2>12</h2>
            <h4>Ready to Serve</h4>
            <p>Orders ready for pickup</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">🍽️</div>

          <div>
            <h2>8</h2>
            <h4>Dine In Orders</h4>
            <p>Ready to be served</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">🛍️</div>

          <div>
            <h2>4</h2>
            <h4>Takeaway/Delivery</h4>
            <p>Ready for handover</p>
          </div>
        </div>

      </div>

      <div className="ready-queue">

        <div className="queue-header">
          <h2>Ready Orders Queue</h2>

          <button>View All Orders</button>
        </div>

        <div className="orders-grid">

          {orders.map((order, index) => (
            <div className="ready-card" key={index}>

              <div className="card-top">

                <h3>{order.id}</h3>

                <span className="ready-badge">
                  Ready
                </span>

              </div>

              <div className="order-meta">
                {order.type} • {order.table}
              </div>

              <div className="customer">
                👤 {order.customer}
              </div>

              <div className="customer">
                👨‍🍳 {order.chef}
              </div>

              <hr />

              <ul className="items-list">
                {order.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <div className="time-boxes">

                <div className="time-card">
                  <span>Completed At</span>
                  <h4>{order.completedAt}</h4>
                </div>

              </div>

              <button className="serve-btn">
                ✔ Serve Now
              </button>

            </div>
          ))}

        </div>

        <div className="pagination">

          <button>{"<"}</button>

          <button className="active">
            1
          </button>

          <button>2</button>

          <button>3</button>

          <button>{">"}</button>

        </div>

      </div>

    </div>
  );
};

export default ReadyOrders;