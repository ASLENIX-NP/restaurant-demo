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
  const [orders, setOrders] = React.useState(cookingOrders);

  const handleProgressChange = (index, value) => {
    const updatedOrders = [...orders];
    updatedOrders[index].progress = Number(value);
    setOrders(updatedOrders);
  };

  return (
    <div className="cooking-page">
      
      {/* HIGH-END TOPBAR */}
      <div className="topbar">
        <div className="menu-brand-toggle">
          <button className="hamburger-btn">☰</button>
          <span className="panel-context-title">Kitchen Panel</span>
        </div>

        <div className="topbar-right">
          <div className="search-wrapper">
            <input type="text" placeholder="Search items, orders, tables..." className="top-search-input" />
          </div>

          <div className="notification-bell">
            🔔
            <span className="badge-count">3</span>
          </div>

          <div className="chef-profile-pill">
            <div className="chef-avatar-wrapper">👨‍🍳</div>
            <div className="chef-meta-details">
              <span className="chef-name">Chef John</span>
              <span className="chef-role">Head Orchestrator</span>
            </div>
          </div>
          
          <button className="logout-action-btn">Logout</button>
        </div>
      </div>

      {/* VIEWPORT WRAPPER */}
      <div className="cooking-content">
        
        {/* SUBHEADER BLOCK */}
        <div className="page-header">
          <div className="header-titles">
            <h1>Cooking Orders</h1>
            <p className="breadcrumbs">
              Dashboard <span className="arrow-divider">›</span> <span className="current">Cooking Orders</span>
            </p>
          </div>

          <button className="date-btn">
            📅 Today, May 31, 2025
          </button>
        </div>

        {/* ANALYTICS HIGHLIGHT STRIP */}
        <div className="stats-grid">
          <div className="stat-card cook-metric-box">
            <div className="stat-icon-wrapper deep-orange-glow">🔥</div>
            <div className="stat-text-group">
              <h2>18</h2>
              <h4>Currently Cooking</h4>
              <p>Active items on the line</p>
            </div>
          </div>

          <div className="stat-card cook-metric-box">
            <div className="stat-icon-wrapper indigo-glow">🍳</div>
            <div className="stat-text-group">
              <h2>6</h2>
              <h4>Active Chefs</h4>
              <p>Staff clocked in right now</p>
            </div>
          </div>

          <div className="stat-card cook-metric-box">
            <div className="stat-icon-wrapper emerald-glow">⚡</div>
            <div className="stat-text-group">
              <h2>14m</h2>
              <h4>Average Time</h4>
              <p>Per ticket preparation cycle</p>
            </div>
          </div>
        </div>

        {/* QUEUE TIMELINE PIPELINE */}
        <div className="queue-section">
          <div className="queue-header">
            <div className="queue-title-area">
              <h2>Cooking Queue</h2>
              <span className="live-pill-tag">Live Feed</span>
            </div>
            <button className="view-all-link-btn">View All Orders</button>
          </div>

          {/* RENDERING DYNAMIC TICKETS */}
          <div className="orders-grid">
            {orders.map((order, index) => (
              <div className="order-card cooking-card-elevation" key={index}>
                
                <div className="order-top">
                  <h3>{order.id}</h3>
                  <span className="status-pill-cooking">Cooking</span>
                </div>

                <div className="order-meta-info-row">
                  <span className="type-badge">{order.type}</span>
                  <span className="table-badge">{order.table}</span>
                </div>

                <div className="staff-assignment-box">
                  <div className="assignment-row">
                    <span className="label-icon">👤</span>
                    <span className="assigned-text">Client: <strong>{order.customer}</strong></span>
                  </div>
                  <div className="assignment-row">
                    <span className="label-icon">👨‍🍳</span>
                    <span className="assigned-text">Station: <strong>{order.chef}</strong></span>
                  </div>
                </div>

                <div className="cool-divider"></div>

                {/* ITEM CARD CONTAINER BULLETS */}
                <div className="items-list-wrapper">
                  {order.items.map((item, i) => (
                    <div className="cooking-item-row" key={i}>
                      <span className="cooking-dot-bullet"></span>
                      <span className="cooking-item-name">{item}</span>
                    </div>
                  ))}
                </div>

                {/* CONTROLLABLE PROGRESS INTERFACE */}
                <div className="progress-slider-container">
                  <div className="progress-head">
                    <span>Cooking Progress</span>
                    <span className="progress-percentage-label">{order.progress}%</span>
                  </div>
                  
                  <div className="slider-track-wrapper">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={order.progress}
                      className="progress-slider"
                      onChange={(e) => handleProgressChange(index, e.target.value)}
                    />
                    <div 
                      className="progress-fill-bar" 
                      style={{ width: `${order.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* ESTIMATED DELAY COUNTER METRIC */}
                <div className="time-left-badge">
                  <span className="clock-icon">⏱</span> {order.timeLeft}
                </div>

                {/* TRANSITIONAL ACTION BUTTON */}
                <button className="ready-btn-action">
                  ✔ Mark as Ready
                </button>

              </div>
            ))}
          </div>

          {/* LOWER CONTROLS PANEL FOOTER */}
          <footer className="queue-footer-navigation">
            <div className="showing-entries-label">
              Showing <strong>1</strong> to <strong>3</strong> of <strong>18</strong> entries
            </div>

            <div className="pagination-wrapper">
              <button className="nav-arrow">‹</button>
              <button className="page-num active-page">1</button>
              <button className="page-num">2</button>
              <button className="page-num">3</button>
              <button className="nav-arrow">›</button>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
};

export default Cooking;