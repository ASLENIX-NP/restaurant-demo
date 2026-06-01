// src/pages/chef/ReadyOrders.jsx

import React from "react";
import "../../styles/readyorders.css";

const initialOrders = [
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
      
      {/* HEADER SECTION */}
      <div className="ready-topbar">
        <div>
          <h1>Ready Orders</h1>
          <div className="breadcrumb">
            Dashboard <span className="arrow-divider">›</span> <span className="current-page">Ready Orders</span>
          </div>
        </div>

        <button className="date-btn">
          📅 Today, May 31, 2025
        </button>
      </div>

      {/* STATS STRIP OVERVIEW */}
      <div className="ready-stats">
        <div className="stat-card border-green">
          <div className="stat-icon green-bg">✅</div>
          <div className="stat-info-block">
            <h2>12</h2>
            <h4>Ready to Serve</h4>
            <p>Orders ready for pickup</p>
          </div>
        </div>

        <div className="stat-card border-blue">
          <div className="stat-icon blue-bg">🍽️</div>
          <div className="stat-info-block">
            <h2>8</h2>
            <h4>Dine In Orders</h4>
            <p>Ready to be served</p>
          </div>
        </div>

        <div className="stat-card border-orange">
          <div className="stat-icon orange-bg">🛍️</div>
          <div className="stat-info-block">
            <h2>4</h2>
            <h4>Takeaway/Delivery</h4>
            <p>Ready for handover</p>
          </div>
        </div>
      </div>

      {/* PIPELINE CONTAINER */}
      <div className="ready-queue">
        <div className="queue-header">
          <h2>Ready Orders Queue</h2>
          <button className="view-all-btn">View All Orders</button>
        </div>

        <div className="orders-grid">
          {initialOrders.map((order, index) => (
            <div className="ready-card" key={index}>
              
              <div className="card-top">
                <h3>{order.id}</h3>
                <span className="ready-badge">Ready</span>
              </div>

              {/* SERVICE TYPE BADGES */}
              <div className="order-meta-pills">
                <span className="meta-pill type-pill">{order.type}</span>
                <span className="meta-pill table-pill">{order.table}</span>
              </div>

              {/* DETAILS REGION */}
              <div className="assignment-details">
                <div className="detail-item">
                  <span className="icon">👤</span>
                  <p>Customer: <strong>{order.customer}</strong></p>
                </div>
                <div className="detail-item">
                  <span className="icon">👨‍🍳</span>
                  <p>Chef: <strong>{order.chef}</strong></p>
                </div>
              </div>

              <div className="card-divider"></div>

              {/* PREPARED ITEMS BOX LIST */}
              <div className="items-container">
                {order.items.map((item, i) => (
                  <div className="item-row-entry" key={i}>
                    <span className="item-qty-badge">1x</span>
                    <span className="item-name-text">{item}</span>
                  </div>
                ))}
              </div>

              {/* DELIVERY TIMESTAMPS CONTAINER */}
              <div className="time-boxes">
                <div className="time-card-wrapper">
                  <span className="time-card-label">Completed At</span>
                  <h4 className="time-card-value">{order.completedAt}</h4>
                </div>
              </div>

              {/* CTA INTERACTION */}
              <button className="serve-btn">
                ✔ Serve Now
              </button>

            </div>
          ))}
        </div>

        {/* CUSTOM PAGINATION STICKY WRAPPER */}
        <div className="pagination-container">
          <button className="nav-arrow-btn">‹</button>
          <button className="page-number active">1</button>
          <button className="page-number">2</button>
          <button className="page-number">3</button>
          <button className="nav-arrow-btn">›</button>
        </div>

      </div>
    </div>
  );
};

export default ReadyOrders;