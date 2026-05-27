import "../../styles/kitchen.css";

const Kitchen = () => {
  return (
    <div className="kitchen-page">

      {/* HEADER */}

      <div className="kitchen-header">

        <div>
          <h1>Kitchen Dashboard</h1>
          <p>Manage and track kitchen orders in real-time</p>
        </div>

        <div className="kitchen-header-buttons">
          <button className="kds-btn">
            Kitchen Display
          </button>

          <button className="refresh-btn">
            Refresh
          </button>
        </div>

      </div>

      {/* STATS */}

      <div className="kitchen-stats">

        <div className="kitchen-stat-card new">
          <div className="kitchen-stat-icon">📋</div>

          <div>
            <h2>8</h2>
            <p>New Orders</p>
          </div>
        </div>

        <div className="kitchen-stat-card preparing">
          <div className="kitchen-stat-icon">⏳</div>

          <div>
            <h2>12</h2>
            <p>Preparing</p>
          </div>
        </div>

        <div className="kitchen-stat-card ready">
          <div className="kitchen-stat-icon">🍽️</div>

          <div>
            <h2>15</h2>
            <p>Ready</p>
          </div>
        </div>

        <div className="kitchen-stat-card completed">
          <div className="kitchen-stat-icon">✅</div>

          <div>
            <h2>128</h2>
            <p>Completed Today</p>
          </div>
        </div>

      </div>

      {/* ORDER COLUMNS */}

      <div className="kitchen-columns">

        {/* NEW ORDERS */}

        <div className="kitchen-column">

          <div className="column-header orange">
            <h3>New Orders</h3>
            <span>8</span>
          </div>

          <div className="kitchen-order-card">

            <div className="order-top">
              <h4>#TH1250</h4>
              <span>10:30 AM</span>
            </div>

            <p>Table 5 • Dine In</p>

            <ul>
              <li>Grilled Chicken</li>
              <li>Alfredo Pasta</li>
            </ul>

            <button className="start-btn">
              Start Preparing
            </button>

          </div>

        </div>

        {/* PREPARING */}

        <div className="kitchen-column">

          <div className="column-header yellow">
            <h3>Preparing</h3>
            <span>12</span>
          </div>

          <div className="kitchen-order-card">

            <div className="order-top">
              <h4>#TH1248</h4>
              <span>10:15 AM</span>
            </div>

            <p>Table 3 • Delivery</p>

            <ul>
              <li>Paneer Pizza</li>
              <li>Garlic Bread</li>
            </ul>

            <button className="ready-btn">
              Mark Ready
            </button>

          </div>

        </div>

        {/* READY */}

        <div className="kitchen-column">

          <div className="column-header green">
            <h3>Ready</h3>
            <span>15</span>
          </div>

          <div className="kitchen-order-card">

            <div className="order-top">
              <h4>#TH1245</h4>
              <span>10:05 AM</span>
            </div>

            <p>Table 7 • Takeaway</p>

            <ul>
              <li>Margherita Pizza</li>
              <li>Ice Tea</li>
            </ul>

            <button className="complete-btn">
              Complete Order
            </button>

          </div>

        </div>

        {/* COMPLETED */}

        <div className="kitchen-column">

          <div className="column-header dark">
            <h3>Completed</h3>
            <span>128</span>
          </div>

          <div className="kitchen-order-card completed-card">

            <div className="order-top">
              <h4>#TH1242</h4>
              <span>09:58 AM</span>
            </div>

            <p>Table 2 • Dine In</p>

            <ul>
              <li>Veg Sandwich</li>
              <li>Lemonade</li>
            </ul>

            <div className="done-label">
              Completed
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Kitchen;