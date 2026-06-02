import { useMemo, useState } from "react";
import {
  AlarmClock,
  Bell,
  BellOff,
  CheckCircle2,
  ChefHat,
  ClipboardList,
  Flame,
  Maximize2,
  PackageCheck,
  Printer,
  Salad,
  Timer,
  UtensilsCrossed,
} from "lucide-react";
import "../../styles/chef.css";

const liveOrders = [
  {
    id: "#TH1250",
    channel: "Dine In",
    table: "Table 4",
    time: "10:30 AM",
    status: "Cooking",
    priority: "High",
    station: "Hot Line",
    notes: "Extra spicy, no onions",
    items: [
      { name: "Grilled Chicken", qty: 2, category: "Mains", station: "Hot Line" },
      { name: "Butter Naan", qty: 3, category: "Bread", station: "Oven" },
    ],
    elapsedMinutes: 14,
  },
  {
    id: "#TH1249",
    channel: "Takeaway",
    table: "Pickup",
    time: "10:42 AM",
    status: "Pending",
    priority: "Normal",
    station: "Cold Prep",
    notes: "Pack items separately",
    items: [
      { name: "Veg Biryani", qty: 1, category: "Mains", station: "Hot Line" },
      { name: "Raita", qty: 1, category: "Sides", station: "Cold Prep" },
    ],
    elapsedMinutes: 4,
  },
  {
    id: "#TH1248",
    channel: "Delivery",
    table: "Driver Queue",
    time: "10:15 AM",
    status: "Ready",
    priority: "Critical",
    station: "Oven",
    notes: "Peanut allergy. Keep prep area separate.",
    items: [
      { name: "Margherita Pizza", qty: 1, category: "Mains", station: "Oven" },
      { name: "Garlic Bread", qty: 1, category: "Sides", station: "Oven" },
    ],
    elapsedMinutes: 22,
  },
  {
    id: "#TH1247",
    channel: "Dine In",
    table: "Table 9",
    time: "10:47 AM",
    status: "Cooking",
    priority: "Normal",
    station: "Hot Line",
    notes: "",
    items: [
      { name: "Chicken Chowmein", qty: 2, category: "Mains", station: "Hot Line" },
      { name: "Masala Tea", qty: 2, category: "Drinks", station: "Cold Prep" },
    ],
    elapsedMinutes: 8,
  },
];

const completedHistory = [
  { id: "#TH1245", channel: "Dine In", itemsCount: 4, clearedAt: "10:22 AM" },
  { id: "#TH1244", channel: "Delivery", itemsCount: 2, clearedAt: "10:11 AM" },
  { id: "#TH1243", channel: "Takeaway", itemsCount: 1, clearedAt: "09:58 AM" },
];

const stationOptions = ["All Stations", "Hot Line", "Cold Prep", "Oven", "Dessert"];
const statusOptions = ["All", "Pending", "Cooking", "Ready"];

const statusIcons = {
  Pending: Timer,
  Cooking: Flame,
  Ready: CheckCircle2,
};

const Dashboard = () => {
  const [activeStation, setActiveStation] = useState("All Stations");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
      return;
    }

    document.exitFullscreen();
    setIsFullscreen(false);
  };

  const metrics = useMemo(() => {
    const pending = liveOrders.filter((order) => order.status === "Pending").length;
    const cooking = liveOrders.filter((order) => order.status === "Cooking").length;
    const ready = liveOrders.filter((order) => order.status === "Ready").length;
    const delayed = liveOrders.filter((order) => order.elapsedMinutes >= 15).length;

    const prepMap = {};
    liveOrders
      .filter((order) => order.status !== "Ready")
      .forEach((order) => {
        order.items.forEach((item) => {
          prepMap[item.name] = (prepMap[item.name] || 0) + item.qty;
        });
      });

    return {
      totalActive: liveOrders.length,
      pending,
      cooking,
      ready,
      delayed,
      prepList: Object.entries(prepMap).map(([name, qty]) => ({ name, qty })),
    };
  }, []);

  const filteredOrders = useMemo(() => {
    return liveOrders.filter((order) => {
      const stationMatches =
        activeStation === "All Stations" ||
        order.station === activeStation ||
        order.items.some((item) => item.station === activeStation);
      const statusMatches = statusFilter === "All" || order.status === statusFilter;

      return stationMatches && statusMatches;
    });
  }, [activeStation, statusFilter]);

  return (
    <div className="chef-dashboard-container">
      <header className="kds-hero">
        <div className="kds-title-group">
          <span className="kds-eyebrow">
            <ChefHat size={16} />
            Kitchen Display System
          </span>
          <h1>Kitchen KDS Panel</h1>
          <p>Live production board for line cooks, expo, and station prep.</p>
        </div>

        <div className="kds-live-status">
          <span className="live-dot" />
          <div>
            <span>System Active</span>
            <strong>June 2, 2026</strong>
          </div>
        </div>
      </header>

      <section className="kds-utilities-bar">
        <label className="util-select-group">
          <span>Station</span>
          <select
            value={activeStation}
            onChange={(event) => setActiveStation(event.target.value)}
            className="util-dropdown"
          >
            {stationOptions.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </label>

        <div className="status-tabs" aria-label="Ticket status filter">
          {statusOptions.map((status) => (
            <button
              key={status}
              type="button"
              className={statusFilter === status ? "active" : ""}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="util-right">
          <button
            className={`util-btn ${isAudioMuted ? "muted" : ""}`}
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            type="button"
          >
            {isAudioMuted ? <BellOff size={15} /> : <Bell size={15} />}
            {isAudioMuted ? "Muted" : "Sound On"}
          </button>
          <button className="util-btn" onClick={() => window.print()} type="button">
            <Printer size={15} />
            Print Batch
          </button>
          <button className="util-btn" onClick={toggleFullscreen} type="button">
            <Maximize2 size={15} />
            {isFullscreen ? "Exit KDS" : "Fullscreen"}
          </button>
        </div>
      </section>

      <section className="top-stats-row">
        <button className="glass-stat-card active-tab" type="button" onClick={() => setStatusFilter("All")}>
          <span className="stat-icon active"><ClipboardList size={22} /></span>
          <span className="stat-info">
            <strong>{metrics.totalActive}</strong>
            <small>Active Tickets</small>
          </span>
        </button>
        <button className="glass-stat-card" type="button" onClick={() => setStatusFilter("Pending")}>
          <span className="stat-icon"><Timer size={22} /></span>
          <span className="stat-info">
            <strong>{metrics.pending}</strong>
            <small>Incoming Queue</small>
          </span>
        </button>
        <button className="glass-stat-card" type="button" onClick={() => setStatusFilter("Cooking")}>
          <span className="stat-icon heat"><Flame size={22} /></span>
          <span className="stat-info">
            <strong>{metrics.cooking}</strong>
            <small>On Range/Grill</small>
          </span>
        </button>
        <button className="glass-stat-card" type="button" onClick={() => setStatusFilter("Ready")}>
          <span className="stat-icon ready"><PackageCheck size={22} /></span>
          <span className="stat-info">
            <strong>{metrics.ready}</strong>
            <small>At Expo Window</small>
          </span>
        </button>
      </section>

      <main className="main-dashboard-content advanced-layout">
        <section className="queue-section display-panel">
          <div className="section-title">
            <div>
              <h2>Live Production Board ({filteredOrders.length})</h2>
              <p>{activeStation} production queue</p>
            </div>
            <span className="sync-timestamp">Auto-update: just now</span>
          </div>

          <div className="order-grid">
            {filteredOrders.map((order) => {
              const StatusIcon = statusIcons[order.status];

              return (
                <article key={order.id} className={`order-neon-card priority-${order.priority.toLowerCase()}`}>
                  <div className="card-top">
                    <div>
                      <span className="order-id">{order.id}</span>
                      <span className="table-assignment">{order.channel} - {order.table}</span>
                    </div>
                    <span className={`status-badge state-${order.status.toLowerCase()}`}>
                      <StatusIcon size={13} />
                      {order.status}
                    </span>
                  </div>

                  <ul className="items-list-advanced">
                    {order.items.map((item) => (
                      <li key={`${order.id}-${item.name}`}>
                        <span className="item-count-bubble">{item.qty}x</span>
                        <div className="item-text-details">
                          <span className="dish-title">{item.name}</span>
                          <span className="dish-subcat">{item.category} - {item.station}</span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {order.notes && (
                    <div className="kitchen-notes-alert">
                      <AlarmClock size={14} />
                      <span><strong>Mod Notes:</strong> {order.notes}</span>
                    </div>
                  )}

                  <div className="card-bottom">
                    <div className={`timer-ticker ${order.elapsedMinutes >= 15 ? "delayed" : ""}`}>
                      <Timer size={14} />
                      {order.elapsedMinutes} mins
                    </div>
                    <span className="order-timestamp-tag">Placed {order.time}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="sidebar-stats advanced-sidebar">
          <div className="sidebar-card station-load-card">
            <div className="sidebar-card-heading">
              <UtensilsCrossed size={18} />
              <h3>Station Load</h3>
            </div>
            <div className="load-meter">
              <span style={{ width: `${Math.min(metrics.totalActive * 18, 100)}%` }} />
            </div>
            <div className="load-copy">
              <strong>{metrics.delayed}</strong>
              <span>tickets need attention</span>
            </div>
          </div>

          <div className="sidebar-card prep-aggregation-card">
            <div className="sidebar-card-heading">
              <Salad size={18} />
              <h3>Total Master Prep</h3>
            </div>
            <p className="sidebar-card-sub">Quantities required for active batches</p>
            <div className="cumulative-items-list">
              {metrics.prepList.map((item) => (
                <div className="cumulative-row" key={item.name}>
                  <span className="cumulative-qty">{item.qty}</span>
                  <span className="cumulative-name">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-card completions-card">
            <h3>Passed to Waitstaff Feed</h3>
            <div className="mini-history-list">
              {completedHistory.map((historyItem) => (
                <div className="history-item-row" key={historyItem.id}>
                  <div>
                    <span className="history-ticket-id">{historyItem.id}</span>
                    <span className="history-meta">{historyItem.channel} - {historyItem.itemsCount} items</span>
                  </div>
                  <div className="history-right">
                    <span className="history-time">{historyItem.clearedAt}</span>
                    <CheckCircle2 size={15} />
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
