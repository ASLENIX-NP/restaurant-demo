import React from "react";
import "../../styles/chef.css";

const Dashboard = () => {
  const queueOrders = [
    { id: "#TH1250", type: "Dine In", time: "10:30 AM", status: "In Progress", items: ["Grilled Chicken", "Butter Naan"], duration: "12 mins" },
    { id: "#TH1249", type: "Takeaway", time: "10:15 AM", status: "Preparing", items: ["Veg Biryani", "Raita"], duration: "8 mins" },
    { id: "#TH1248", type: "Delivery", time: "10:05 AM", status: "Pending", items: ["Margherita Pizza", "Garlic Bread"], duration: "15 mins" },
  ];

  const completedOrders = [
    { id: "#TH1245", time: "11:32 AM" },
    { id: "#TH1244", time: "11:15 AM" },
    { id: "#TH1243", time: "10:54 AM" },
  ];

  return (
    <div className="chef-dashboard-container">
      {/* GLOSS HEADER */}
      <header className="dashboard-header">
        <div className="header-text">
          <h1>Kitchen Command <span>Live</span></h1>
          <p>Real-time order synchronization active</p>
        </div>
        <div className="header-actions">
          <div className="live-indicator"><span className="dot-pulse"></span> System Live</div>
          <button className="date-pill">May 31, 2025</button>
        </div>
      </header>

      {/* TOP METRICS - NEW NEUMORPHIC STYLE */}
      <section className="top-stats-row">
        {[
          { label: "Total Orders", val: "78", icon: "📋", color: "gold" },
          { label: "In Progress", val: "24", icon: "🍳", color: "blue" },
          { label: "Ready", val: "18", icon: "🍽️", color: "green" },
          { label: "Completed", val: "56", icon: "✅", color: "purple" }
        ].map((s, i) => (
          <div className="glass-stat-card" key={i}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-info">
              <h3>{s.val}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </section>

      <main className="main-dashboard-content">
        {/* LEFT: PRIMARY QUEUE (Wide & Dynamic) */}
        <section className="queue-section">
          <div className="section-title">
            <h2>Active Queue</h2>
            <div className="filter-group">
              <button className="active">All</button>
              <button>Dine In</button>
              <button>Takeaway</button>
            </div>
          </div>

          <div className="order-grid">
            {queueOrders.map((order, idx) => (
              <div className="order-neon-card" key={idx}>
                <div className="card-top">
                  <span className="order-id">{order.id}</span>
                  <span className={`badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="order-details">
                  <p className="type-tag">{order.type} • {order.time}</p>
                  <ul className="items-list">
                    {order.items.map((item, i) => (
                      <li key={i}><span>1</span> {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="card-bottom">
                  <div className="time-left">⏱ {order.duration}</div>
                  <button className="btn-glow">Cook Now</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT: SIDEBAR COMMANDS */}
        <aside className="sidebar-stats">
          <div className="sidebar-card performance-card">
             <h3>Kitchen Health</h3>
             <div className="performance-rings">
                <div className="performance-item">
                  <span className="p-val">92%</span>
                  <span className="p-label">On-Time</span>
                </div>
                <div className="performance-item">
                  <span className="p-val">18m</span>
                  <span className="p-label">Avg. Prep</span>
                </div>
             </div>
          </div>

          <div className="sidebar-card history-card">
            <h3>Recent Completions</h3>
            <div className="mini-history-list">
              {completedOrders.map((o, i) => (
                <div className="history-item" key={i}>
                  <span>{o.id}</span>
                  <span className="time">{o.time}</span>
                  <span className="check">✓</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Dashboard;