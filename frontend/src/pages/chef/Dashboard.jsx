import "../../styles/chef.css";

const Dashboard = () => {
  const queueOrders = [
    {
      id: "#TH1250",
      type: "Dine In",
      time: "10:30 AM",
      status: "In Progress",
      items: ["Grilled Chicken", "Butter Naan"],
      duration: "12 mins",
    },
    {
      id: "#TH1249",
      type: "Takeaway",
      time: "10:15 AM",
      status: "Preparing",
      items: ["Veg Biryani", "Raita"],
      duration: "8 mins",
    },
    {
      id: "#TH1248",
      type: "Delivery",
      time: "10:05 AM",
      status: "Pending",
      items: ["Margherita Pizza", "Garlic Bread"],
      duration: "15 mins",
    },
  ];

  const completedOrders = [
    "#TH1245",
    "#TH1244",
    "#TH1243",
    "#TH1242",
  ];

  const topItems = [
    { name: "Margherita Pizza", orders: 42 },
    { name: "Grilled Chicken", orders: 36 },
    { name: "Paneer Tikka", orders: 29 },
    { name: "Veg Biryani", orders: 27 },
  ];

  return (
    <div className="chef-dashboard-page">

      {/* HEADER */}
      <div className="chef-header">
        <div>
          <h1>Chef Dashboard</h1>
          <p>Manage and track kitchen orders in real-time</p>
        </div>

        <button className="date-btn">
          📅 Today, May 31, 2025
        </button>
      </div>

      {/* STATS */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="icon yellow">📋</div>

          <div>
            <h3>78</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon blue">🍳</div>

          <div>
            <h3>24</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon green">🍽️</div>

          <div>
            <h3>18</h3>
            <p>Ready to Serve</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon purple">✅</div>

          <div>
            <h3>56</h3>
            <p>Completed</p>
          </div>
        </div>

      </div>

      {/* MAIN GRID */}
      <div className="dashboard-grid">

        {/* LEFT SIDE */}
        <div className="panel-card">

          <div className="card-header">
            <h2>Kitchen Queue</h2>

            <button>View All</button>
          </div>

          {queueOrders.map((order, index) => (
            <div className="queue-order" key={index}>

              <div className="order-top">

                <div>
                  <h4>{order.id}</h4>

                  <span>
                    {order.type} • {order.time}
                  </span>
                </div>

                <div
                  className={`status ${order.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {order.status}
                </div>

              </div>

              <div className="order-items">
                {order.items.map((item, i) => (
                  <p key={i}>1x {item}</p>
                ))}
              </div>

              <div className="order-footer">

                <span>⏱ {order.duration}</span>

                <button className="action-btn">
                  Start Cooking
                </button>

              </div>

            </div>
          ))}
        </div>

        {/* MIDDLE */}
        <div className="middle-column">

          <div className="panel-card">

            <div className="card-header">
              <h2>Order Overview</h2>
            </div>

            <div className="overview-circle">

              <div className="circle">
                <h2>78</h2>
                <span>Total Orders</span>
              </div>

            </div>

            <div className="overview-stats">
              <div>
                <span className="dot yellow"></span>
                In Progress (24)
              </div>

              <div>
                <span className="dot blue"></span>
                Preparing (18)
              </div>

              <div>
                <span className="dot green"></span>
                Ready (18)
              </div>

              <div>
                <span className="dot gray"></span>
                Completed (56)
              </div>
            </div>

          </div>

          {/* TOP ITEMS */}
          <div className="panel-card">

            <div className="card-header">
              <h2>Top Ordered Items</h2>
            </div>

            {topItems.map((item, index) => (
              <div className="top-item" key={index}>

                <div>
                  <h4>{item.name}</h4>
                </div>

                <span>{item.orders} orders</span>

              </div>
            ))}

          </div>

        </div>

        {/* RIGHT */}
        <div className="right-column">

          <div className="panel-card">

            <div className="card-header">
              <h2>Recent Completed</h2>
            </div>

            {completedOrders.map((order, index) => (
              <div className="completed-order" key={index}>

                <div>
                  <h4>{order}</h4>
                  <span>Completed Successfully</span>
                </div>

                <div className="completed-badge">
                  Completed
                </div>

              </div>
            ))}

          </div>

          {/* PERFORMANCE */}
          <div className="panel-card">

            <div className="card-header">
              <h2>Kitchen Performance</h2>
            </div>

            <div className="performance-grid">

              <div className="performance-box">
                <h3>18 mins</h3>
                <p>Avg Prep Time</p>
              </div>

              <div className="performance-box">
                <h3>92.3%</h3>
                <p>On-time Rate</p>
              </div>

              <div className="performance-box">
                <h3>96.1%</h3>
                <p>Accuracy</p>
              </div>

              <div className="performance-box">
                <h3>2.4%</h3>
                <p>Food Waste</p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;