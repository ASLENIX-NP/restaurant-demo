import "../../styles/inventory.css";

const inventoryItems = [

  {
    code: "INV-001",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5",
    name: "Olive Oil",
    category: "Oils & Sauces",
    unit: "Ltr",
    qty: "12.50",
    status: "In Stock",
    updated: "10:30 AM",
  },

  {
    code: "INV-002",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c",
    name: "Basmati Rice",
    category: "Grains",
    unit: "Kg",
    qty: "45.00",
    status: "In Stock",
    updated: "09:45 AM",
  },

  {
    code: "INV-003",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f",
    name: "Chicken Breast",
    category: "Meat & Poultry",
    unit: "Kg",
    qty: "8.20",
    status: "Low Stock",
    updated: "09:20 AM",
  },

  {
    code: "INV-004",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337",
    name: "Tomatoes",
    category: "Vegetables",
    unit: "Kg",
    qty: "3.00",
    status: "Low Stock",
    updated: "09:10 AM",
  },

  {
    code: "INV-005",
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d",
    name: "Mozzarella Cheese",
    category: "Dairy",
    unit: "Kg",
    qty: "0.00",
    status: "Out of Stock",
    updated: "08:55 AM",
  },

];

const Inventory = () => {

  return (

    <div className="inventory-page">

      {/* HEADER */}

      <div className="inventory-top">

        <div>

          <h1>
            Inventory
          </h1>

          <p>
            Dashboard {" > "} Inventory
          </p>

        </div>

        <div className="inventory-buttons">

          <button className="white-btn">
            📦 Stock Adjustment
          </button>

          <button className="white-btn">
            🧾 Purchase History
          </button>

          <button className="black-btn">
            + Add Item
          </button>

        </div>

      </div>

      {/* STATS */}

      <div className="inventory-stats">

        <div className="inventory-stat-card">

          <div className="inventory-icon">
            📦
          </div>

          <div>

            <h4>
              Total Items
            </h4>

            <h2>
              152
            </h2>

            <p>
              All inventory items
            </p>

          </div>

        </div>

        <div className="inventory-stat-card">

          <div className="inventory-icon green-bg">
            ✅
          </div>

          <div>

            <h4>
              In Stock
            </h4>

            <h2>
              98
            </h2>

            <p className="green-text">
              64.5% of total items
            </p>

          </div>

        </div>

        <div className="inventory-stat-card">

          <div className="inventory-icon yellow-bg">
            ⚠️
          </div>

          <div>

            <h4>
              Low Stock
            </h4>

            <h2>
              34
            </h2>

            <p className="yellow-text">
              22.4% of total items
            </p>

          </div>

        </div>

        <div className="inventory-stat-card">

          <div className="inventory-icon red-bg">
            ❌
          </div>

          <div>

            <h4>
              Out of Stock
            </h4>

            <h2>
              20
            </h2>

            <p className="red-text">
              13.1% of total items
            </p>

          </div>

        </div>

      </div>

      {/* MAIN */}

      <div className="inventory-main">

        {/* LEFT */}

        <div className="inventory-table-wrapper">

          {/* FILTER */}

          <div className="inventory-filter">

            <input
              type="text"
              placeholder="Search item..."
              className="inventory-search"
            />

            <select>
              <option>
                All Categories
              </option>
            </select>

            <select>
              <option>
                All Units
              </option>
            </select>

            <select>
              <option>
                All Status
              </option>
            </select>

            <button className="filter-btn">
              Filter
            </button>

          </div>

          {/* TABLE */}

          <table className="inventory-table">

            <thead>

              <tr>

                <th>Item Code</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Stock Qty</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {inventoryItems.map((item, index) => (

                <tr key={index}>

                  <td>
                    {item.code}
                  </td>

                  <td>

                    <div className="item-info">

                      <img src={item.image} alt="" />

                      <span>
                        {item.name}
                      </span>

                    </div>

                  </td>

                  <td>
                    {item.category}
                  </td>

                  <td>
                    {item.unit}
                  </td>

                  <td>
                    {item.qty}
                  </td>

                  <td>

                    <span className={`inventory-status ${item.status.replace(/\s/g, "")}`}>
                      {item.status}
                    </span>

                  </td>

                  <td>
                    {item.updated}
                  </td>

                  <td>

                    <div className="inventory-actions">

                      <button>
                        ✏️
                      </button>

                      <button>
                        🗑️
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* RIGHT */}

        <div className="inventory-sidebar">

          <div className="inventory-side-card">

            <h3>
              Low Stock Alerts
            </h3>

            <div className="alert-item">

              <div>

                <h4>
                  Tomatoes
                </h4>

                <p>
                  Threshold: 5 Kg
                </p>

              </div>

              <span>
                3.00 Kg
              </span>

            </div>

            <div className="alert-item">

              <div>

                <h4>
                  Chicken Breast
                </h4>

                <p>
                  Threshold: 10 Kg
                </p>

              </div>

              <span>
                8.20 Kg
              </span>

            </div>

          </div>

          <div className="inventory-side-card">

            <h3>
              Quick Actions
            </h3>

            <div className="quick-actions">

              <button>
                ➕ Add Item
              </button>

              <button>
                📦 Stock Adjustment
              </button>

              <button>
                📂 Add Category
              </button>

              <button>
                🚚 Suppliers
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Inventory;