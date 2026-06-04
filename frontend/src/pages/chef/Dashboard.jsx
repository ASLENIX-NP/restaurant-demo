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
  Salad,
  Timer,
  UtensilsCrossed,
} from "lucide-react";
import "../../styles/chef.css";
import { useOrders } from "../../context/OrderContext";

const completedHistory = [
  { id: "#TH1245", channel: "Dine In", itemsCount: 4, clearedAt: "10:22 AM" },
  { id: "#TH1244", channel: "Delivery", itemsCount: 2, clearedAt: "10:11 AM" },
  { id: "#TH1243", channel: "Takeaway", itemsCount: 1, clearedAt: "09:58 AM" },
];

const stationOptions = [
  "All Stations",
  "Hot Line",
  "Cold Prep",
  "Oven",
  "Dessert",
];
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
  const { orders, startCooking, markReady } = useOrders();

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
    const pending = orders.filter((order) => order.status === "Pending").length;
    const cooking = orders.filter((order) => order.status === "Cooking").length;
    const ready = orders.filter((order) => order.status === "Ready").length;
    const delayed = orders.filter(
      (order) => (order.elapsedMinutes || 0) >= 15 && order.status !== "Ready"
    ).length;

    const prepMap = {};
    orders
      .filter((order) => order.status !== "Ready")
      .forEach((order) => {
        (order.items || []).forEach((item) => {
          prepMap[item.name] = (prepMap[item.name] || 0) + item.qty;
        });
      });

    return {
      totalActive: orders.length,
      pending,
      cooking,
      ready,
      delayed,
      prepList: Object.entries(prepMap).map(([name, qty]) => ({ name, qty })),
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const stationMatches =
          activeStation === "All Stations" ||
          order.station === activeStation ||
          (order.items || []).some((item) => item.station === activeStation);
        const statusMatches =
          statusFilter === "All" || order.status === statusFilter;

        return stationMatches && statusMatches;
      })
      .sort((a, b) => {
        // 1. Push orders marked as "Ready" to the bottom of the list
        if (a.status === "Ready" && b.status !== "Ready") return 1;
        if (a.status !== "Ready" && b.status === "Ready") return -1;

        // 2. Put newest incoming active orders at the top of the queue
        const timeA = new Date(a.timestamp || 0).getTime();
        const timeB = new Date(b.timestamp || 0).getTime();
        return timeB - timeA;
      });
  }, [activeStation, orders, statusFilter]);

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
          <button className="util-btn" onClick={toggleFullscreen} type="button">
            <Maximize2 size={15} />
            {isFullscreen ? "Exit KDS" : "Fullscreen"}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 mt-6">
        <button
          className={`rounded-2xl p-6 border shadow-sm flex items-center gap-4 transition-all duration-300 text-left ${
            statusFilter === "All"
              ? "border-blue-300 bg-blue-50 ring-4 ring-blue-100 scale-[1.02]"
              : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md hover:bg-slate-50"
          }`}
          type="button"
          onClick={() => setStatusFilter("All")}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              statusFilter === "All"
                ? "bg-blue-100 text-blue-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <ClipboardList size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-none">
              {metrics.totalActive}
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
              Active Tickets
            </p>
          </div>
        </button>

        <button
          className={`rounded-2xl p-6 border shadow-sm flex items-center gap-4 transition-all duration-300 text-left ${
            statusFilter === "Pending"
              ? "border-slate-400 bg-slate-100 ring-4 ring-slate-200 scale-[1.02]"
              : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md hover:bg-slate-50"
          }`}
          type="button"
          onClick={() => setStatusFilter("Pending")}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              statusFilter === "Pending"
                ? "bg-slate-300 text-slate-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <Timer size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-none">
              {metrics.pending}
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
              Incoming Queue
            </p>
          </div>
        </button>

        <button
          className={`rounded-2xl p-6 border shadow-sm flex items-center gap-4 transition-all duration-300 text-left ${
            statusFilter === "Cooking"
              ? "border-orange-300 bg-orange-50 ring-4 ring-orange-100 scale-[1.02]"
              : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md hover:bg-slate-50"
          }`}
          type="button"
          onClick={() => setStatusFilter("Cooking")}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              statusFilter === "Cooking"
                ? "bg-orange-100 text-orange-600"
                : "bg-orange-50 text-orange-400"
            }`}
          >
            <Flame size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-none">
              {metrics.cooking}
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
              On Range/Grill
            </p>
          </div>
        </button>

        <button
          className={`rounded-2xl p-6 border shadow-sm flex items-center gap-4 transition-all duration-300 text-left ${
            statusFilter === "Ready"
              ? "border-emerald-300 bg-emerald-50 ring-4 ring-emerald-100 scale-[1.02]"
              : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md hover:bg-slate-50"
          }`}
          type="button"
          onClick={() => setStatusFilter("Ready")}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              statusFilter === "Ready"
                ? "bg-emerald-100 text-emerald-600"
                : "bg-emerald-50 text-emerald-500"
            }`}
          >
            <PackageCheck size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-none">
              {metrics.ready}
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
              Ready / Takeaway
            </p>
          </div>
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
                <article
                  key={order.id}
                  className={`order-neon-card priority-${(
                    order.priority || "normal"
                  ).toLowerCase()}`}
                >
                  <div className="card-top">
                    <div>
                      <span className="order-id">{order.id}</span>
                      <span className="table-assignment">
                        {order.channel || "System"} - {order.table || "Queue"} •
                        Server: {order.server || "System"}
                      </span>
                    </div>
                    <span
                      className={`status-badge state-${(
                        order.status || "Pending"
                      ).toLowerCase()}`}
                    >
                      {StatusIcon && <StatusIcon size={13} />}
                      {order.status}
                    </span>
                  </div>

                  <ul className="items-list-advanced">
                    {(order.items || []).map((item) => (
                      <li key={`${order.id}-${item.name}`}>
                        <span className="item-count-bubble">{item.qty}x</span>
                        <div className="item-text-details">
                          <span className="dish-title">{item.name}</span>
                          <span className="dish-subcat">
                            {item.category} - {item.station}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {order.notes && (
                    <div className="kitchen-notes-alert">
                      <AlarmClock size={14} />
                      <span>
                        <strong>Mod Notes:</strong> {order.notes}
                      </span>
                    </div>
                  )}

                  <div className="ticket-action-row">
                    {order.status === "Pending" && (
                      <button
                        className="ticket-action-btn start"
                        type="button"
                        onClick={() => startCooking(order.id)}
                      >
                        <Flame size={15} />
                        Start Cooking
                      </button>
                    )}

                    {order.status === "Cooking" && (
                      <button
                        className="ticket-action-btn ready"
                        type="button"
                        onClick={() => markReady(order.id)}
                      >
                        <CheckCircle2 size={15} />
                        Mark Ready
                      </button>
                    )}

                    {order.status === "Ready" && (
                      <div className="ticket-ready-state">
                        <PackageCheck size={15} />
                        Ready for expo pickup
                      </div>
                    )}
                  </div>

                  <div className="card-bottom">
                    <div
                      className={`timer-ticker ${
                        (order.elapsedMinutes || 0) >= 15 ? "delayed" : ""
                      }`}
                    >
                      <Timer size={14} />
                      {order.elapsedMinutes || 0} mins
                    </div>
                    <span className="order-timestamp-tag">
                      Placed {order.time}
                    </span>
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
              <span
                style={{ width: `${Math.min(metrics.totalActive * 18, 100)}%` }}
              />
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
            <p className="sidebar-card-sub">
              Quantities required for active batches
            </p>
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
                    <span className="history-meta">
                      {historyItem.channel} - {historyItem.itemsCount} items
                    </span>
                  </div>
                  <div className="history-right">
                    <span className="history-time">
                      {historyItem.clearedAt}
                    </span>
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
