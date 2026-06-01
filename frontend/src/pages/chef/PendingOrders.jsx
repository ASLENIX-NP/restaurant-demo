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
      
      {/* HEADER SECTION */}
      <header className="pending-header">
        <div className="header-titles">
          <h1>Pending Orders</h1>
          <p className="breadcrumbs">Dashboard &gt; <span className="current">Pending Orders</span></p>
        </div>

        <div className="header-actions">
          <div className="live-pulse-indicator">
            <span className="pulse-dot-orange"></span> Monitoring Queue
          </div>
          <button className="date-btn">
            📅 Today, May 31, 2025
          </button>
        </div>
      </header>

      {/* TOP ANALYTICS STRIP */}
      <section className="stats-grid">
        <div className="stat-card pending-summary-card">
          <div className="stat-icon-wrapper gold-glow">📋</div>
          <div className="stat-details">
            <h3>24</h3>
            <h4>Total Pending</h4>
            <p>Active items in live pipeline</p>
          </div>
        </div>

        <div className="stat-card pending-summary-card">
          <div className="stat-icon-wrapper cyan-glow">⚡</div>
          <div className="stat-details">
            <h3>12m</h3>
            <h4>Average Waiting Time</h4>
            <p>Across all current open tickets</p>
          </div>
        </div>
      </section>

      {/* QUEUE CONTROL BAR & MAIN CONTENT */}
      <main className="queue-wrapper">
        <div className="queue-header">
          <div className="title-area">
            <h2>Pending Orders Queue</h2>
            <span className="live-counter-badge">{orders.length} Tickets Loaded</span>
          </div>
          <a href="/" className="view-all-link">View All Orders</a>
        </div>

        {/* MODERN CARDS GRID */}
        <div className="orders-grid">
          {orders.map((order, index) => {
            const priorityClass = order.priority.toLowerCase();
            return (
              <div className={`order-card card-priority-${priorityClass}`} key={index}>
                
                <div className="order-top">
                  <h3>{order.id}</h3>
                  <span className={`priority-tag badge-${priorityClass}`}>
                    {order.priority} Priority
                  </span>
                </div>

                <div className="order-meta-row">
                  <span className="type-pill">{order.type}</span>
                  <span className="table-locator">• {order.table}</span>
                </div>

                <div className="customer-info-box">
                  <span className="avatar-icon">👤</span> 
                  <span className="customer-name">{order.customer}</span>
                </div>

                <div className="cool-divider"></div>

                {/* CRISP FLOATING LINE ITEMS */}
                <div className="items-list-container">
                  {order.items.map((item, i) => (
                    <div className="line-item-row" key={i}>
                      <span className="item-bullet"></span>
                      <span className="item-text-name">{item}</span>
                    </div>
                  ))}
                </div>

                {/* DUAL METRIC TIME METERS */}
                <div className="time-row">
                  <div className="time-box src-time">
                    <span>Order Time</span>
                    <h4>{order.time}</h4>
                  </div>

                  <div className="time-box delta-time">
                    <span>Waiting Time</span>
                    <h4 className={priorityClass === "high" ? "alert-time" : ""}>
                      {order.waiting}
                    </h4>
                  </div>
                </div>

                {/* ACTION TRIGGER BUTTON */}
                <button className="cook-btn-action">
                  <span className="btn-icon">🍳</span> Start Cooking
                </button>

              </div>
            );
          })}
        </div>

        {/* COMPACT CLEAN PAGINATION ROW */}
        <footer className="pagination-container">
          <div className="pagination-wrapper">
            <button className="nav-arrow">{"<"}</button>
            <button className="page-num active-page">1</button>
            <button className="page-num">2</button>
            <button className="page-num">3</button>
            <button className="nav-arrow">{">"}</button>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default PendingOrders;