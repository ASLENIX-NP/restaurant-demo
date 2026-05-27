import "../../styles/dashboard.css";

const Dashboard = () => {

  const topItems = [

    {
      name: "Chicken Burger",
      qty: 120,
      revenue: "Rs. 54,000",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
    },

    {
      name: "Pepperoni Pizza",
      qty: 95,
      revenue: "Rs. 85,500",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
    },

    {
      name: "Buff Momo",
      qty: 160,
      revenue: "Rs. 51,200",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    },

  ];

  const recentOrders = [

    {
      id: "#TH1250",
      customer: "John Doe",
      amount: "Rs. 2,500",
      status: "Completed",
    },

    {
      id: "#TH1249",
      customer: "Sarah Wilson",
      amount: "Rs. 1,800",
      status: "Preparing",
    },

    {
      id: "#TH1248",
      customer: "Michael Brown",
      amount: "Rs. 3,200",
      status: "Pending",
    },

  ];

  return (

    <div className="premium-dashboard">

      {/* TOP */}

      <div className="dashboard-top">

        <div>

          <h1>
            Welcome back, Admin! 👋
          </h1>

          <p>
            Here's what's happening in your restaurant today.
          </p>

        </div>

        <div className="dashboard-date">

          📅 May 01, 2026 - May 31, 2026

        </div>

      </div>

      {/* STATS */}

      <div className="dashboard-stats">

        <div className="dashboard-card">

          <div className="dashboard-icon">
            💰
          </div>

          <div>

            <h4>
              Total Revenue
            </h4>

            <h1>
              Rs. 4,50,000
            </h1>

            <p>
              ↑ 18.6% this month
            </p>

          </div>

        </div>

        <div className="dashboard-card">

          <div className="dashboard-icon">
            📦
          </div>

          <div>

            <h4>
              Total Orders
            </h4>

            <h1>
              540
            </h1>

            <p>
              ↑ 12.4% this month
            </p>

          </div>

        </div>

        <div className="dashboard-card">

          <div className="dashboard-icon">
            👥
          </div>

          <div>

            <h4>
              Customers
            </h4>

            <h1>
              482
            </h1>

            <p>
              ↑ 15.3% this month
            </p>

          </div>

        </div>

        <div className="dashboard-card">

          <div className="dashboard-icon">
            📈
          </div>

          <div>

            <h4>
              Avg Order Value
            </h4>

            <h1>
              Rs. 1,200
            </h1>

            <p>
              ↑ 6.7% this month
            </p>

          </div>

        </div>

      </div>

      {/* CHARTS */}

      <div className="dashboard-chart-grid">

        {/* REVENUE */}

        <div className="dashboard-chart-card">

          <div className="chart-header">

            <h2>
              Revenue Overview
            </h2>

            <button>
              By Day
            </button>

          </div>

          <div className="chart-price">

            Rs. 4,50,000

          </div>

          <div className="chart-growth">

            ↑ 18.6% this month

          </div>

          <div className="fake-chart">

            <div className="bar" style={{ height: "120px" }}></div>

            <div className="bar" style={{ height: "180px" }}></div>

            <div className="bar" style={{ height: "140px" }}></div>

            <div className="bar" style={{ height: "250px" }}></div>

            <div className="bar" style={{ height: "200px" }}></div>

            <div className="bar" style={{ height: "300px" }}></div>

            <div className="bar" style={{ height: "260px" }}></div>

          </div>

        </div>

        {/* PIE */}

        <div className="dashboard-chart-card">

          <h2>
            Orders Overview
          </h2>

          <div className="dashboard-pie"></div>

          <div className="pie-list">

            <div>
              🍽 Dine In
            </div>

            <div>
              🥡 Takeaway
            </div>

            <div>
              🛵 Delivery
            </div>

            <div>
              📅 Reservation
            </div>

          </div>

        </div>

      </div>

      {/* LOWER GRID */}

      <div className="dashboard-lower-grid">

        {/* TOP ITEMS */}

        <div className="dashboard-table-card">

          <div className="section-header">

            <h2>
              Top Selling Items
            </h2>

            <button>
              View All
            </button>

          </div>

          <table>

            <thead>

              <tr>

                <th>
                  Item
                </th>

                <th>
                  Qty
                </th>

                <th>
                  Revenue
                </th>

              </tr>

            </thead>

            <tbody>

              {topItems.map((item, index) => (

                <tr key={index}>

                  <td>

                    <div className="table-food">

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <span>
                        {item.name}
                      </span>

                    </div>

                  </td>

                  <td>
                    {item.qty}
                  </td>

                  <td>
                    {item.revenue}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* RECENT ORDERS */}

        <div className="dashboard-table-card">

          <div className="section-header">

            <h2>
              Recent Orders
            </h2>

            <button>
              View All
            </button>

          </div>

          <table>

            <thead>

              <tr>

                <th>
                  Order ID
                </th>

                <th>
                  Customer
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {recentOrders.map((order, index) => (

                <tr key={index}>

                  <td>
                    {order.id}
                  </td>

                  <td>
                    {order.customer}
                  </td>

                  <td>
                    {order.amount}
                  </td>

                  <td>

                    <span
                      className={`status-badge ${order.status}`}
                    >

                      {order.status}

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* REMINDERS */}

        <div className="dashboard-reminder-card">

          <h2>
            Reminders
          </h2>

          <div className="reminder-item">

            <div>
              📅 Upcoming Reservations
            </div>

            <span>
              {" > "}
            </span>

          </div>

          <div className="reminder-item">

            <div>
              📦 Low Stock Items
            </div>

            <span>
              {" > "}
            </span>

          </div>

          <div className="reminder-item">

            <div>
              ⭐ New Reviews
            </div>

            <span>
              {" > "}
            </span>

          </div>

          <div className="reminder-item">

            <div>
              💳 Pending Payments
            </div>

            <span>
              {" > "}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;