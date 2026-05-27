import "../../styles/adminTables.css";

const tables = [
  {
    id: 1,
    name: "Table 1",
    customer: "John Doe",
    status: "occupied",
    amount: "Rs. 4,500",
  },
  {
    id: 2,
    name: "Table 2",
    customer: "No Customer",
    status: "available",
    amount: "Rs. 0",
  },
  {
    id: 3,
    name: "Table 3",
    customer: "Reserved",
    status: "reserved",
    amount: "Rs. 2,200",
  },
  {
    id: 4,
    name: "VIP 1",
    customer: "Emily",
    status: "occupied",
    amount: "Rs. 8,900",
  },
  {
    id: 5,
    name: "Table 5",
    customer: "No Customer",
    status: "available",
    amount: "Rs. 0",
  },
  {
    id: 6,
    name: "Family Table",
    customer: "Reserved",
    status: "reserved",
    amount: "Rs. 5,000",
  },
];

const AdminTables = () => {
  return (
    <div className="admin-tables-page">

      {/* HEADER */}

      <div className="admin-tables-header">

        <div>
          <h1>Table Management</h1>
          <p>Manage restaurant tables professionally</p>
        </div>

        <button className="admin-add-table-btn">
          + Add New Table
        </button>

      </div>

      {/* STATS */}

      <div className="admin-table-stats">

        <div className="admin-table-stat-card total">

          <div className="admin-stat-icon">
            🍽️
          </div>

          <h2>25</h2>
          <p>Total Tables</p>

        </div>

        <div className="admin-table-stat-card available">

          <div className="admin-stat-icon">
            ✅
          </div>

          <h2>10</h2>
          <p>Available Tables</p>

        </div>

        <div className="admin-table-stat-card occupied">

          <div className="admin-stat-icon">
            🔥
          </div>

          <h2>8</h2>
          <p>Occupied Tables</p>

        </div>

        <div className="admin-table-stat-card reserved">

          <div className="admin-stat-icon">
            📅
          </div>

          <h2>7</h2>
          <p>Reserved Tables</p>

        </div>

      </div>

      {/* FILTER BAR */}

      <div className="admin-table-filter">

        <div className="admin-table-tabs">
          <button className="active">All</button>
          <button>Available</button>
          <button>Occupied</button>
          <button>Reserved</button>
        </div>

        <input
          type="text"
          placeholder="Search tables..."
          className="admin-table-search"
        />

      </div>

      {/* TABLE GRID */}

      <div className="admin-table-grid">

        {tables.map((table) => (

          <div
            className={`admin-table-card ${table.status}`}
            key={table.id}
          >

            <div className="admin-table-top">

              <h3>{table.name}</h3>

              <span className={`admin-status ${table.status}`}>
                {table.status}
              </span>

            </div>

            <div className="admin-table-center">

              <div className="admin-table-icon">
                🍴
              </div>

              <h4>{table.customer}</h4>

              <p>
                Current Customer
              </p>

              <p>
                <strong>Billing:</strong> {table.amount}
              </p>

            </div>

            <div className="admin-table-footer">

              <div className="admin-table-actions">

                <button className="admin-view-btn">
                  View
                </button>

                <button className="admin-edit-btn">
                  Edit
                </button>

                <button className="admin-delete-btn">
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default AdminTables;