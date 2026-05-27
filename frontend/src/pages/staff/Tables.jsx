import "../../styles/tables.css";

const tables = [
  {
    id: 1,
    seats: 4,
    status: "Available",
    customer: "No Customer",
  },
  {
    id: 2,
    seats: 2,
    status: "Occupied",
    customer: "John Doe",
  },
  {
    id: 3,
    seats: 6,
    status: "Reserved",
    customer: "Sarah",
  },
  {
    id: 4,
    seats: 8,
    status: "Cleaning",
    customer: "Cleaning Team",
  },
  {
    id: 5,
    seats: 2,
    status: "Available",
    customer: "No Customer",
  },
  {
    id: 6,
    seats: 5,
    status: "Occupied",
    customer: "Emily",
  },
  {
    id: 7,
    seats: 3,
    status: "Reserved",
    customer: "Michael",
  },
  {
    id: 8,
    seats: 6,
    status: "Available",
    customer: "No Customer",
  },
];

const Tables = () => {
  return (
    <div className="tables-page">
      <div className="tables-header">
        <div>
          <h1>Restaurant Tables</h1>
          <p>Live table availability</p>
        </div>

        <button className="add-table-btn">
          + Add Table
        </button>
      </div>

      <div className="table-stats">
        <div className="table-stat-card">
          <h2>24</h2>
          <p>Total Tables</p>
        </div>

        <div className="table-stat-card green">
          <h2>10</h2>
          <p>Available</p>
        </div>

        <div className="table-stat-card red">
          <h2>8</h2>
          <p>Occupied</p>
        </div>

        <div className="table-stat-card orange">
          <h2>6</h2>
          <p>Reserved</p>
        </div>
      </div>

      <div className="tables-grid">
        {tables.map((table) => (
          <div
            className={`table-card ${table.status.toLowerCase()}`}
            key={table.id}
          >
            <div className="table-top">
              <h2>Table {table.id}</h2>

              <span className={`status-badge ${table.status.toLowerCase()}`}>
                {table.status}
              </span>
            </div>

            <div className="table-icon">
              🍽️
            </div>

            <div className="table-info">
              <p>
                <strong>Seats:</strong> {table.seats}
              </p>

              <p>
                <strong>Customer:</strong> {table.customer}
              </p>
            </div>

            <div className="table-actions">
              <button className="view-btn">
                View
              </button>

              <button className="edit-btn">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tables;