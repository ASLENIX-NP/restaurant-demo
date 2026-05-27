import "../../styles/staff.css";

const Dashboard = () => {

  const tables = [
    { number: 1, status: "Occupied" },
    { number: 2, status: "Available" },
    { number: 3, status: "Reserved" },
    { number: 4, status: "Occupied" },
    { number: 5, status: "Available" },
    { number: 6, status: "Occupied" },
  ];

  return (

    <div className="staff-page">

      {/* HEADER */}

      <div className="staff-header">

        <div>

          <h1>
            Welcome Back 👋
          </h1>

          <p>
            Manage restaurant tables and live orders
          </p>

        </div>

        <button className="take-order-btn">
          + Take New Order
        </button>

      </div>

      {/* STATS */}

      <div className="staff-stats">

        <div className="staff-stat-card">

          <div className="stat-icon blue">
            🍽
          </div>

          <div>
            <h2>12</h2>
            <p>Active Tables</p>
          </div>

        </div>

        <div className="staff-stat-card">

          <div className="stat-icon orange">
            📦
          </div>

          <div>
            <h2>8</h2>
            <p>Pending Orders</p>
          </div>

        </div>

        <div className="staff-stat-card">

          <div className="stat-icon green">
            ✅
          </div>

          <div>
            <h2>42</h2>
            <p>Completed Orders</p>
          </div>

        </div>

        <div className="staff-stat-card">

          <div className="stat-icon red">
            ⏰
          </div>

          <div>
            <h2>5</h2>
            <p>Reservations</p>
          </div>

        </div>

      </div>

      {/* TABLES */}

      <div className="tables-section">

        <div className="section-top">

          <h2>
            Restaurant Tables
          </h2>

          <input
            type="text"
            placeholder="Search table..."
          />

        </div>

        <div className="tables-grid">

          {tables.map((table, index) => (

            <div
              key={index}
              className={`table-card ${table.status}`}
            >

              <div className="table-top">

                <h3>
                  Table {table.number}
                </h3>

                <span>
                  ●
                </span>

              </div>

              <p>
                {table.status}
              </p>

              <button>
                Manage Table
              </button>

            </div>

          ))}

        </div>

      </div>

      {/* LIVE ORDERS */}

      <div className="live-orders">

        <div className="section-top">

          <h2>
            Live Orders
          </h2>

          <button className="view-all-btn">
            View All
          </button>

        </div>

        <div className="orders-list">

          <div className="order-card">

            <div>

              <h3>#ORD-1025</h3>

              <p>Table 2 • 3 Items</p>

            </div>

            <span className="pending">
              Preparing
            </span>

          </div>

          <div className="order-card">

            <div>

              <h3>#ORD-1026</h3>

              <p>Table 5 • 2 Items</p>

            </div>

            <span className="completed">
              Ready
            </span>

          </div>

          <div className="order-card">

            <div>

              <h3>#ORD-1027</h3>

              <p>Table 1 • 5 Items</p>

            </div>

            <span className="pending">
              Cooking
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;