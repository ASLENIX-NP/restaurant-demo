import React, { useState, useMemo } from "react";
import "../../styles/chef.css";

const Dashboard = () => {
  // Utility tool states
  const [activeStation, setActiveStation] = useState("Hot Line");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock data representing synchronized incoming feed from Staff panels
  const [liveOrders] = useState([
    {
      id: "#TH1250",
      type: "Dine In",
      table: "Table 4",
      time: "10:30 AM",
      status: "Cooking",
      priority: "HIGH",
      notes: "Extra spicy, no onions",
      items: [
        { name: "Grilled Chicken", qty: 2, category: "Mains" },
        { name: "Butter Naan", qty: 3, category: "Bread" },
      ],
      elapsedMinutes: 14,
    },
    {
      id: "#TH1249",
      type: "Takeaway",
      table: "N/A",
      time: "10:42 AM",
      status: "Pending",
      priority: "NORMAL",
      notes: "Pack items separately",
      items: [
        { name: "Veg Biryani", qty: 1, category: "Mains" },
        { name: "Raita", qty: 1, category: "Sides" },
      ],
      elapsedMinutes: 4,
    },
    {
      id: "#TH1248",
      type: "Delivery",
      table: "N/A",
      time: "10:15 AM",
      status: "Ready",
      priority: "CRITICAL",
      notes: "Allergy: Peanut-free environment required",
      items: [
        { name: "Margherita Pizza", qty: 1, category: "Mains" },
        { name: "Garlic Bread", qty: 1, category: "Sides" },
      ],
      elapsedMinutes: 22,
    },
  ]);

  const [completedHistory] = useState([
    { id: "#TH1245", type: "Dine In", itemsCount: 4, clearedAt: "10:22 AM" },
    { id: "#TH1244", type: "Delivery", itemsCount: 2, clearedAt: "10:11 AM" },
    { id: "#TH1243", type: "Takeaway", itemsCount: 1, clearedAt: "09:58 AM" },
  ]);

  const [statusFilter, setStatusFilter] = useState("ALL");

  // Toggle fullscreen browser view helper
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Trigger browser print dialog for current view log
  const handlePrintManifest = () => {
    window.print();
  };

  // Metrics and Prep Combinations computations
  const metrics = useMemo(() => {
    const totalActive = liveOrders.length;
    const pending = liveOrders.filter((o) => o.status === "Pending").length;
    const cooking = liveOrders.filter((o) => o.status === "Cooking").length;
    const ready = liveOrders.filter((o) => o.status === "Ready").length;

    const prepIngredientsMap = {};
    liveOrders
      .filter((o) => o.status !== "Ready")
      .forEach((order) => {
        order.items.forEach((item) => {
          prepIngredientsMap[item.name] = (prepIngredientsMap[item.name] || 0) + item.qty;
        });
      });

    const masterPrepList = Object.entries(prepIngredientsMap).map(([name, qty]) => ({ name, qty }));

    return { totalActive, pending, cooking, ready, masterPrepList };
  }, [liveOrders]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "ALL") return liveOrders;
    return liveOrders.filter((o) => o.status.toUpperCase() === statusFilter);
  }, [liveOrders, statusFilter]);

  return (
    <div className="chef-dashboard-container">
      {/* HEADER BAR */}
      <header className="dashboard-header">
        <div className="header-text">
          <h1>
            Kitchen KDS Panel <span className="live-pulse-badge">MONITOR MODE</span>
          </h1>
          <p>Read-only kitchen production display synchronized with Staff Station</p>
        </div>
        <div className="header-actions">
          <div className="clock-display">
            System Active: <strong>May 31, 2026</strong>
          </div>
        </div>
      </header>

      {/* NEW: QUICK TOOLS SECTION BAR */}
      <section className="kds-utilities-bar">
        <div className="util-left">
          <label className="util-select-group">
            <span>Station:</span>
            <select 
              value={activeStation} 
              onChange={(e) => setActiveStation(e.target.value)}
              className="util-dropdown"
            >
              <option value="Hot Line">🔥 Hot Line Station</option>
              <option value="Cold Prep">🥗 Cold Prep Station</option>
              <option value="Bakery/Oven">🍕 Oven Station</option>
              <option value="Desserts">🍦 Dessert Counter</option>
            </select>
          </label>
        </div>

        <div className="util-right">
          <button 
            className={`util-btn ${isAudioMuted ? "muted" : ""}`}
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            title={isAudioMuted ? "Unmute Alerts" : "Mute Alerts"}
          >
            {isAudioMuted ? "🔇 Muted" : "🔊 Sound On"}
          </button>

          <button className="util-btn" onClick={handlePrintManifest} title="Print Active Batch Ticket">
            🖨️ Print Batch
          </button>

          <button className="util-btn toggle-fs" onClick={toggleFullscreen}>
            {isFullscreen ? "📴 Exit Fullscreen" : "📺 Fullscreen KDS"}
          </button>
        </div>
      </section>

      {/* METRIC COUNTER TAB ROW */}
      <section className="top-stats-row">
        <div className={`glass-stat-card ${statusFilter === "ALL" ? "active-tab" : ""}`} onClick={() => setStatusFilter("ALL")}>
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{metrics.totalActive}</h3>
            <p>Active Tickets</p>
          </div>
        </div>
        <div className={`glass-stat-card ${statusFilter === "PENDING" ? "active-tab" : ""}`} onClick={() => setStatusFilter("PENDING")}>
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{metrics.pending}</h3>
            <p>Incoming Queue</p>
          </div>
        </div>
        <div className={`glass-stat-card ${statusFilter === "COOKING" ? "active-tab" : ""}`} onClick={() => setStatusFilter("COOKING")}>
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <h3>{metrics.cooking}</h3>
            <p>On Range/Grill</p>
          </div>
        </div>
        <div className={`glass-stat-card ${statusFilter === "READY" ? "active-tab" : ""}`} onClick={() => setStatusFilter("READY")}>
          <div className="stat-icon">🛎️</div>
          <div className="stat-info">
            <h3>{metrics.ready}</h3>
            <p>At Expo Window</p>
          </div>
        </div>
      </section>

      {/* MAIN TWO COLUMN LAYOUT */}
      <main className="main-dashboard-content advanced-layout">
        
        {/* COLUMN 1: LIVE ORDERS QUEUE MATRIX */}
        <section className="queue-section display-panel">
          <div className="section-title">
            <h2>Live Production Board ({filteredOrders.length})</h2>
            <span className="sync-timestamp">Last auto-update: Just Now</span>
          </div>

          <div className="order-grid">
            {filteredOrders.map((order) => (
              <div key={order.id} className={`order-neon-card priority-${order.priority.toLowerCase()}`}>
                <div className="card-top">
                  <div>
                    <span className="order-id">{order.id}</span>
                    <span className="table-assignment">{order.type === "Dine In" ? order.table : order.type}</span>
                  </div>
                  <span className={`status-badge state-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-details">
                  <ul className="items-list-advanced">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        <span className="item-count-bubble">{item.qty}x</span>
                        <div className="item-text-details">
                          <span className="dish-title">{item.name}</span>
                          <span className="dish-subcat">{item.category}</span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {order.notes && (
                    <div className="kitchen-notes-alert">
                      <strong>⚠️ Mod Notes:</strong> {order.notes}
                    </div>
                  )}
                </div>

                <div className="card-bottom">
                  <div className={`timer-ticker ${order.elapsedMinutes >= 15 ? "delayed" : ""}`}>
                    ⏱️ {order.elapsedMinutes} mins elapsed
                  </div>
                  <div className="order-timestamp-tag">Placed at {order.time}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COLUMN 2: OPERATIONS SIDEBAR MATRIX */}
        <aside className="sidebar-stats advanced-sidebar">
          
          <div className="sidebar-card prep-aggregation-card">
            <h3>Total Master Cumulative Prep</h3>
            <p className="sidebar-card-sub">Total quantities required for active batches</p>
            <div className="cumulative-items-list">
              {metrics.masterPrepList.length === 0 ? (
                <div className="empty-notice">No items currently on grills.</div>
              ) : (
                metrics.masterPrepList.map((item, idx) => (
                  <div className="cumulative-row" key={idx}>
                    <span className="cumulative-qty">{item.qty}</span>
                    <span className="cumulative-name">{item.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="sidebar-card completions-card clean-dark">
            <h3>Passed to Waitstaff Feed</h3>
            <div className="mini-history-list">
              {completedHistory.map((historyItem) => (
                <div className="history-item-row" key={historyItem.id}>
                  <div className="history-left">
                    <span className="history-ticket-id">{historyItem.id}</span>
                    <span className="history-meta">{historyItem.type} • {historyItem.itemsCount} items</span>
                  </div>
                  <div className="history-right">
                    <span className="history-time">{historyItem.clearedAt}</span>
                    <span className="delivery-check">✔</span>
                  </div>
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