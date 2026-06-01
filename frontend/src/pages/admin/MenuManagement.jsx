import { useEffect, useState } from "react";
import "../../styles/menu.css";
import { getProducts } from "../../services/menuService";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

const [newItem, setNewItem] = useState({
  name: "",
  category: "",
  price: "",
  description: "",
  image: "",
});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      console.log("PRODUCTS FROM SUPABASE:", data);

      setMenuItems(data || []);
    } catch (error) {
      console.error("MENU ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = menuItems.length;

  const totalCategories = [
    ...new Set(menuItems.map((item) => item.category)),
  ].length;

  const activeItems = menuItems.filter(
    (item) => item.status === true
  ).length;

  const inactiveItems = menuItems.filter(
    (item) => item.status === false
  ).length;

  const avgPrice =
    totalItems > 0
      ? Math.round(
          menuItems.reduce(
            (sum, item) => sum + Number(item.price || 0),
            0
          ) / totalItems
        )
      : 0;

  const popularDish =
    totalItems > 0
      ? menuItems[0]?.name
      : "-";
      const handleAddItem = () => {

  if (
    !newItem.name ||
    !newItem.category ||
    !newItem.price
  ) {
    alert(
      "Please fill all required fields"
    );
    return;
  }

  const item = {
    id: Date.now(),
    ...newItem,
    status: true,
  };

  setMenuItems([
    ...menuItems,
    item,
  ]);

  setNewItem({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
  });

  setShowAddModal(false);
};

  return (
    <div className="taste-menu-page">

      {/* HEADER */}

      <div className="taste-header">
        <div>
          <h1>Menu Management</h1>
          <p>Dashboard {" > "} Menu Management</p>
        </div>

       <button
  className="taste-add-btn"
  onClick={() =>
    setShowAddModal(true)
  }
>
  + Add New Item
</button>
      </div>

      {/* STATS */}

      <div className="taste-stats-grid">

        <div className="taste-stat-card">
          <div className="stat-icon">🍔</div>
          <div>
            <h3>Total Items</h3>
            <h1>{totalItems}</h1>
            <p>All Menu Products</p>
          </div>
        </div>

        <div className="taste-stat-card">
          <div className="stat-icon">📂</div>
          <div>
            <h3>Categories</h3>
            <h1>{totalCategories}</h1>
            <p>Food Categories</p>
          </div>
        </div>

        <div className="taste-stat-card">
          <div className="stat-icon">✅</div>
          <div>
            <h3>Available</h3>
            <h1>{activeItems}</h1>
            <p>Ready To Order</p>
          </div>
        </div>

        <div className="taste-stat-card">
          <div className="stat-icon">❌</div>
          <div>
            <h3>Unavailable</h3>
            <h1>{inactiveItems}</h1>
            <p>Out Of Stock</p>
          </div>
        </div>

        <div className="taste-stat-card">
          <div className="stat-icon">💰</div>
          <div>
            <h3>Avg Price</h3>
            <h1>Rs. {avgPrice}</h1>
            <p>Average Price</p>
          </div>
        </div>

        <div className="taste-stat-card">
          <div className="stat-icon">🔥</div>
          <div>
            <h3>Popular Dish</h3>
            <h1>{popularDish}</h1>
            <p>Top Seller</p>
          </div>
        </div>

      </div>

      {/* TABLE */}

      <div className="taste-table-container">

        <div className="taste-controls">

          <div className="category-buttons">
            <button className="active-category">
              All
            </button>
          </div>

          <div className="taste-search-box">
            <input
              type="text"
              placeholder="Search menu items..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

        </div>

        {loading ? (
          <h3 style={{ padding: "20px" }}>
            Loading Products...
          </h3>
        ) : (
          <table className="taste-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No Products Found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id}>

                    <td>{item.id}</td>

                    <td>
                      <div className="food-info">

                        <img
                          src={
                            item.image ||
                            "https://via.placeholder.com/80"
                          }
                          alt={item.name}
                        />

                        <div>
                          <h3>{item.name}</h3>
                          <p>{item.description}</p>
                        </div>

                      </div>
                    </td>

                    <td>
                      <span className="category-badge">
                        {item.category}
                      </span>
                    </td>

                    <td>
                      Rs. {item.price}
                    </td>

                    <td>
                      <span
                        className={
                          item.status
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {item.status
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">

                        <button
                          className="edit-action"
                          onClick={() =>
                            alert(
                              `Edit ${item.name}`
                            )
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="delete-action"
                          onClick={() =>
                            alert(
                              `Delete ${item.name}`
                            )
                          }
                        >
                          🗑 Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>
        )}

           </div>

      {showAddModal && (

        <div className="menu-modal-overlay">

          <div className="menu-modal">

            <h2>Add New Menu Item</h2>

            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  name: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Category"
              value={newItem.category}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  category: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  price: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Image URL"
              value={newItem.image}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  image: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Description"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  description: e.target.value,
                })
              }
            />

            <div className="modal-buttons">

              <button
                className="save-btn"
                onClick={handleAddItem}
              >
                Save Item
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Menu;
