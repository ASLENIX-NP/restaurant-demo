import "../../styles/staff.css";

const Dashboard = () => {
  return (
    <div>
      {/* HEADER */}
      <div className="page-header">
        <h1>Staff Dashboard</h1>

        <p>
          Manage orders, tables, and reservations
        </p>
      </div>

      {/* STATS */}
      <div className="staff-stats">
        <div className="staff-card">
          <h3>Active Tables</h3>
          <h2>12</h2>
        </div>

        <div className="staff-card">
          <h3>Pending Orders</h3>
          <h2>8</h2>
        </div>

        <div className="staff-card">
          <h3>Reservations</h3>
          <h2>5</h2>
        </div>

        <div className="staff-card">
          <h3>Completed Orders</h3>
          <h2>42</h2>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="table-section">
        <div className="section-header">
          <h2>Restaurant Tables</h2>
        </div>

        <div className="table-grid">
          <div className="table-card occupied">
            <h3>Table 1</h3>
            <p>Occupied</p>
          </div>

          <div className="table-card available">
            <h3>Table 2</h3>
            <p>Available</p>
          </div>

          <div className="table-card reserved">
            <h3>Table 3</h3>
            <p>Reserved</p>
          </div>

          <div className="table-card occupied">
            <h3>Table 4</h3>
            <p>Occupied</p>
          </div>

          <div className="table-card available">
            <h3>Table 5</h3>
            <p>Available</p>
          </div>

          <div className="table-card occupied">
            <h3>Table 6</h3>
            <p>Occupied</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;