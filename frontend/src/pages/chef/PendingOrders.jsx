import React from "react";
import "../../styles/pendingorder.css";

const orders = [
  {
    id: "#TH1250",
    type: "Dine In",
    table: "Table 4",
    customer: "John Doe",
    items: ["Grilled Chicken", "Butter Naan"],
    time: "10:30 AM",
    waiting: "12 mins",
    priority: "High",
  },
  {
    id: "#TH1249",
    type: "Takeaway",
    table: "Table 2",
    customer: "Emily Smith",
    items: ["Veg Biryani", "Raita"],
    time: "10:15 AM",
    waiting: "8 mins",
    priority: "Medium",
  },
  {
    id: "#TH1248",
    type: "Delivery",
    table: "Table 7",
    customer: "Michael Lee",
    items: ["Margherita Pizza", "Garlic Bread"],
    time: "10:05 AM",
    waiting: "15 mins",
    priority: "High",
  },
  {
    id: "#TH1247",
    type: "Delivery",
    table: "Table 5",
    customer: "Sarah Wilson",
    items: ["Paneer Tikka", "Jeera Rice"],
    time: "09:50 AM",
    waiting: "10 mins",
    priority: "Medium",
  },
];

const PendingOrders = () => {
  return (
    <div className="pending-page">

      {/* HEADER */}
      <div className="pending-header">
        <div>
          <h1>Pending Orders</h1>
          <p>Dashboard &gt; Pending Orders</p>
        </div>

        <button className="date-btn">
          📅 Today, May 31, 2025
        </button>
      </div>

      {/* STATS */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon yellow">📋</div>

          <div>
            <h2>24</h2>
            <h4>Total Pending</h4>
            <p>All pending orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">⚡</div>

          <div>
            <h2>12m</h2>
            <h4>Average Waiting Time</h4>
            <p>Across all pending orders</p>
          </div>
        </div>

      </div>

      {/* QUEUE */}
      <div className="queue-wrapper">

        <div className="queue-header">
          <h2>Pending Orders Queue</h2>

          <a href="/">View All Orders</a>
        </div>

        <div className="orders-grid">

          {orders.map((order, index) => (
            <div className="order-card" key={index}>

              <div className="order-top">

                <h3>{order.id}</h3>

                <span
                  className={
                    order.priority === "High"
                      ? "badge high"
                      : "badge medium"
                  }
                >
                  {order.priority}
                </span>
              </div>

              <p className="order-info">
                {order.type} • {order.table}
              </p>

              <p className="customer">
                👤 {order.customer}
              </p>

              <div className="divider"></div>

              <ul className="items-list">
                {order.items.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>

              <div className="time-row">

                <div className="time-box">
                  <span>Order Time</span>
                  <h4>{order.time}</h4>
                </div>

                <div className="time-box">
                  <span>Waiting Time</span>
                  <h4>{order.waiting}</h4>
                </div>

              </div>

              <button className="cook-btn">
                🍳 Start Cooking
              </button>

            </div>
          ))}

        </div>

        {/* PAGINATION */}
        <div className="pagination">

          <button>{"<"}</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>{">"}</button>

        </div>

      </div>

    </div>
  );
};

export default PendingOrders;