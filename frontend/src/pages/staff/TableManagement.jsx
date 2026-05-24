import "../../styles/staff.css";

const TableManagement = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Table Management</h1>

        <p>Monitor restaurant floor</p>
      </div>

      <div className="table-grid large-grid">
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

        <div className="table-card cleaning">
          <h3>Table 4</h3>
          <p>Cleaning</p>
        </div>

        <div className="table-card occupied">
          <h3>Table 5</h3>
          <p>Occupied</p>
        </div>

        <div className="table-card available">
          <h3>Table 6</h3>
          <p>Available</p>
        </div>

        <div className="table-card occupied">
          <h3>Table 7</h3>
          <p>Occupied</p>
        </div>

        <div className="table-card reserved">
          <h3>Table 8</h3>
          <p>Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default TableManagement;