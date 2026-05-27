import "../../styles/menu.css";

const Menu = () => {

  const menuItems = [

    {
      id: 1,

      name: "Chicken Burger",

      description:
        "Juicy grilled burger with cheese",

      category: "Fast Food",

      price: 450,

      status: "Active",

      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 2,

      name: "Pepperoni Pizza",

      description:
        "Italian pizza with extra cheese",

      category: "Italian",

      price: 900,

      status: "Active",

      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 3,

      name: "Cold Coffee",

      description:
        "Refreshing cold coffee",

      category: "Beverage",

      price: 250,

      status: "Inactive",

      image:
        "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 4,

      name: "Buff Momo",

      description:
        "Fresh Nepali style momo",

      category: "Nepali",

      price: 320,

      status: "Active",

      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    },

  ];

  return (

    <div className="taste-menu-page">

      {/* TOP */}

      <div className="taste-header">

        <div>

          <h1>
            Menu Management
          </h1>

          <p>
            Dashboard
            {" > "}
            Menu Management
          </p>

        </div>

        <button className="taste-add-btn">

          + Add New Item

        </button>

      </div>

      {/* STATS */}

      <div className="taste-stats-grid">

        <div className="taste-stat-card">

          <div className="stat-icon">
            🍔
          </div>

          <div>

            <h3>
              Total Items
            </h3>

            <h1>
              128
            </h1>

            <p>
              +12 this month
            </p>

          </div>

        </div>

        <div className="taste-stat-card">

          <div className="stat-icon">
            📂
          </div>

          <div>

            <h3>
              Categories
            </h3>

            <h1>
              12
            </h1>

            <p>
              +2 this month
            </p>

          </div>

        </div>

        <div className="taste-stat-card">

          <div className="stat-icon">
            👁
          </div>

          <div>

            <h3>
              Active Items
            </h3>

            <h1>
              110
            </h1>

            <p>
              86% of total
            </p>

          </div>

        </div>

        <div className="taste-stat-card">

          <div className="stat-icon">
            ❌
          </div>

          <div>

            <h3>
              Inactive Items
            </h3>

            <h1>
              18
            </h1>

            <p>
              14% of total
            </p>

          </div>

        </div>

      </div>

      {/* TABLE */}

      <div className="taste-table-container">

        {/* CONTROLS */}

        <div className="taste-controls">

          <div className="category-buttons">

            <button className="active-category">

              All

            </button>

            <button>
              Fast Food
            </button>

            <button>
              Italian
            </button>

            <button>
              Beverage
            </button>

            <button>
              Nepali
            </button>

          </div>

          <div className="taste-search-box">

            <input
              type="text"
              placeholder="Search menu items..."
            />

          </div>

        </div>

        {/* TABLE */}

        <table className="taste-table">

          <thead>

            <tr>

              <th>
                #
              </th>

              <th>
                Item
              </th>

              <th>
                Category
              </th>

              <th>
                Price
              </th>

              <th>
                Status
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {menuItems.map(
              (
                item,
                index
              ) => (

                <tr key={index}>

                  <td>
                    {item.id}
                  </td>

                  <td>

                    <div className="food-info">

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <div>

                        <h3>
                          {item.name}
                        </h3>

                        <p>
                          {item.description}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td>

                    <span className="category-badge">

                      {item.category}

                    </span>

                  </td>

                  <td>
                    Rs.
                    {" "}
                    {item.price}
                  </td>

                  <td>

                    <span
                      className={
                        item.status ===
                        "Active"
                          ? "status-active"
                          : "status-inactive"
                      }
                    >

                      {item.status}

                    </span>

                  </td>

                  <td>

                    <div className="action-buttons">

                      <button className="edit-action">

                        ✏

                      </button>

                      <button className="delete-action">

                        🗑

                      </button>

                    </div>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Menu;