import { useState } from "react";
import "../../styles/inventory.css";

// Initial dummy data
const initialInventoryItems = [
  {
    code: "INV-001",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5",
    name: "Olive Oil",
    category: "Oils & Sauces",
    unit: "Ltr",
    qty: "12.50", // Fixed the syntax error 'a' that was here
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
  // State to manage inventory data
  const [items, setItems] = useState(initialInventoryItems);

  // Form/Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemCode, setCurrentItemCode] = useState("");
  
  // Form input fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Grains");
  const [formUnit, setFormUnit] = useState("Kg");
  const [formQty, setFormQty] = useState("0.00");

  // Helper helper to automatically assign status based on quantity
  const getStatus = (qty) => {
    const q = parseFloat(qty);
    if (q <= 0) return "Out of Stock";
    if (q <= 10) return "Low Stock";
    return "In Stock";
  };

  // --- ACTIONS ---

  // Open modal for adding a new item
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setFormName("");
    setFormCategory("Grains");
    setFormUnit("Kg");
    setFormQty("0.00");
    setIsModalOpen(true);
  };

  // Open modal pre-filled for editing an existing item
  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setCurrentItemCode(item.code);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormUnit(item.unit);
    setFormQty(item.qty);
    setIsModalOpen(true);
  };

  // Handle Form Submission (Add or Update)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isEditing) {
      // Update existing item
      setItems(items.map(item => 
        item.code === currentItemCode 
          ? { 
              ...item, 
              name: formName, 
              category: formCategory, 
              unit: formUnit, 
              qty: parseFloat(formQty).toFixed(2), 
              status: getStatus(formQty),
              updated: currentTime 
            } 
          : item
      ));
    } else {
      // Create new item
      const newCode = `INV-00${items.length + 1}`; // Simple code generator
      const newItem = {
        code: newCode,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e", // default mockup image
        name: formName,
        category: formCategory,
        unit: formUnit,
        qty: parseFloat(formQty).toFixed(2),
        status: getStatus(formQty),
        updated: currentTime
      };
      setItems([...items, newItem]);
    }

    setIsModalOpen(false);
  };

  // Delete Item Action
  const handleDeleteItem = (code) => {
    if (window.confirm(`Are you sure you want to delete item ${code}?`)) {
      setItems(items.filter(item => item.code !== code));
    }
  };

  // Other placeholder quick actions
  const handlePlaceholderAction = (actionName) => {
    alert(`${actionName} feature coming soon!`);
  };

  return (
    <div className="inventory-page">
      {/* HEADER */}
      <div className="inventory-top">
        <div>
          <h1>Inventory</h1>
          <p>Dashboard {" > "} Inventory</p>
        </div>
        <div className="inventory-buttons">
          <button className="white-btn" onClick={() => handlePlaceholderAction("Stock Adjustment")}>📦 Stock Adjustment</button>
          <button className="white-btn" onClick={() => handlePlaceholderAction("Purchase History")}>🧾 Purchase History</button>
          <button className="black-btn" onClick={handleOpenAddModal}>+ Add Item</button>
        </div>
      </div>

      {/* STATS */}
      <div className="inventory-stats">
        <div className="inventory-stat-card">
          <div className="inventory-icon">📦</div>
          <div>
            <h4>Total Items</h4>
            <h2>{items.length}</h2>
            <p>All inventory items</p>
          </div>
        </div>
        <div className="inventory-stat-card">
          <div className="inventory-icon green-bg">✅</div>
          <div>
            <h4>In Stock</h4>
            <h2>{items.filter(i => i.status === "In Stock").length}</h2>
            <p className="green-text">Active availability</p>
          </div>
        </div>
        <div className="inventory-stat-card">
          <div className="inventory-icon yellow-bg">⚠️</div>
          <div>
            <h4>Low Stock</h4>
            <h2>{items.filter(i => i.status === "Low Stock").length}</h2>
            <p className="yellow-text">Requires attention</p>
          </div>
        </div>
        <div className="inventory-stat-card">
          <div className="inventory-icon red-bg">❌</div>
          <div>
            <h4>Out of Stock</h4>
            <h2>{items.filter(i => i.status === "Out of Stock").length}</h2>
            <p className="red-text">Needs immediate reorder</p>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="inventory-main">
        {/* LEFT */}
        <div className="inventory-table-wrapper">
          {/* FILTER */}
          <div className="inventory-filter">
            <input type="text" placeholder="Search item..." className="inventory-search" />
            <select><option>All Categories</option></select>
            <select><option>All Units</option></select>
            <select><option>All Status</option></select>
            <button className="filter-btn">Filter</button>
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
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.code}</td>
                  <td>
                    <div className="item-info">
                      <img src={item.image} alt={item.name} />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.unit}</td>
                  <td>{item.qty}</td>
                  <td>
                    <span className={`inventory-status ${item.status.replace(/\s/g, "")}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.updated}</td>
                  <td>
                    <div className="inventory-actions">
                      <button onClick={() => handleOpenEditModal(item)}>✏️</button>
                      <button onClick={() => handleDeleteItem(item.code)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT */}
        <div className="inventory-sidebar">
          {/* Dynamic Low Stock Alerts based on state */}
          <div className="inventory-side-card">
            <h3>Low Stock Alerts</h3>
            {items.filter(i => i.status === "Low Stock").map((item, idx) => (
              <div className="alert-item" key={idx}>
                <div>
                  <h4>{item.name}</h4>
                  <p>Category: {item.category}</p>
                </div>
                <span>{item.qty} {item.unit}</span>
              </div>
            ))}
          </div>

          <div className="inventory-side-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button onClick={handleOpenAddModal}>➕ Add Item</button>
              <button onClick={() => handlePlaceholderAction("Stock Adjustment")}>📦 Stock Adjustment</button>
              <button onClick={() => handlePlaceholderAction("Add Category")}>📂 Add Category</button>
              <button onClick={() => handlePlaceholderAction("Suppliers")}>🚚 Suppliers</button>
            </div>
          </div>
        </div>
      </div>

      {/* BASIC INLINE MODAL FOR ADD/EDIT */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>{isEditing ? "✏️ Edit Item" : "➕ Add New Item"}</h2>
            <form onSubmit={handleFormSubmit} style={formStyle}>
              <label>Item Name:</label>
              <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} />

              <label>Category:</label>
              <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                <option value="Oils & Sauces">Oils & Sauces</option>
                <option value="Grains">Grains</option>
                <option value="Meat & Poultry">Meat & Poultry</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Dairy">Dairy</option>
              </select>

              <label>Unit:</label>
              <select value={formUnit} onChange={(e) => setFormUnit(e.target.value)}>
                <option value="Kg">Kg</option>
                <option value="Ltr">Ltr</option>
                <option value="Pcs">Pcs</option>
              </select>

              <label>Quantity:</label>
              <input type="number" step="0.01" min="0" value={formQty} onChange={(e) => setFormQty(e.target.value)} />

              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button type="submit" style={{ background: "#000", color: "#fff", padding: "8px 16px", border: "none", cursor: "pointer" }}>Save</button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: "#ccc", color: "#000", padding: "8px 16px", border: "none", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Quick basic modal styling variables (move these into inventory.css if preferred)
const modalOverlayStyle = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
};
const modalContentStyle = {
  background: "#fff", padding: "24px", borderRadius: "8px", width: "400px", color: "#000"
};
const formStyle = {
  display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px"
};

export default Inventory;