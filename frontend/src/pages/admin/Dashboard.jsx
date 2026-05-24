import "../../styles/dashboard.css";

const Dashboard = () => {
  return (
    <div>
      {/* PAGE HEADER */}
      <div className="page-header">
        <h1>Dashboard</h1>

        <p>
          Welcome back, Admin 👋
        </p>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <h3>Total Orders</h3>
            <h2>1,248</h2>
          </div>

          <span>🧾</span>
        </div>

        <div className="stat-card">
          <div>
            <h3>Revenue</h3>
            <h2>Rs. 84,500</h2>
          </div>

          <span>💰</span>
        </div>

        <div className="stat-card">
          <div>
            <h3>Customers</h3>
            <h2>328</h2>
          </div>

          <span>👥</span>
        </div>

        <div className="stat-card">
          <div>
            <h3>Pending Orders</h3>
            <h2>14</h2>
          </div>

          <span>⏳</span>
        </div>
      </div>

      {/* DASHBOARD GRID */}
      <div className="dashboard-grid">
        {/* RECENT ORDERS */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Recent Orders</h2>
          </div>

          <div className="orders-list">
            <div className="order-item">
              <div>
                <h4>Order #1024</h4>
                <p>Table 4 • Rs. 2,400</p>
              </div>

              <span className="status preparing">
                Preparing
              </span>
            </div>

            <div className="order-item">
              <div>
                <h4>Order #1025</h4>
                <p>Table 7 • Rs. 1,850</p>
              </div>

              <span className="status ready">
                Ready
              </span>
            </div>

            <div className="order-item">
              <div>
                <h4>Order #1026</h4>
                <p>Table 2 • Rs. 3,100</p>
              </div>

              <span className="status pending">
                Pending
              </span>
            </div>
          </div>
        </div>

        {/* INVENTORY ALERTS */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Inventory Alerts</h2>
          </div>

          <div className="alert-list">
            <div className="alert-item danger-alert">
              ⚠️ Cheese stock low
            </div>

            <div className="alert-item warning-alert">
              ⚠️ Tomato stock running out
            </div>

            <div className="alert-item success-alert">
              ✅ Inventory synced
            </div>
          </div>
        </div>
      </div>

      {/* ANALYTICS */}
      <div className="dashboard-card analytics-card">
        <div className="card-header">
          <h2>Sales Analytics</h2>
        </div>

        <div className="analytics-placeholder">
          📈 Revenue Chart Coming Soon
        </div>
      </div>
    </div>
  );
};

export default Dashboard;