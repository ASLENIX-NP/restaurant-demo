import "../../styles/orders.css";

const Orders = () => {

  const orders = [

    {
      id: "#TH1250",
      customer: "John Doe",
      phone: "+1 987 654 3210",
      items: [
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300",
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300",
      ],
      type: "Dine In",
      amount: "Rs. 2,500",
      status: "Completed",
      time: "10:30 AM",
    },

    {
      id: "#TH1249",
      customer: "Sarah Wilson",
      phone: "+1 912 345 6780",
      items: [
        "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=300",
      ],
      type: "Takeaway",
      amount: "Rs. 1,800",
      status: "Preparing",
      time: "10:15 AM",
    },

    {
      id: "#TH1248",
      customer: "Michael Brown",
      phone: "+1 876 543 2109",
      items: [
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300",
      ],
      type: "Delivery",
      amount: "Rs. 3,200",
      status: "Pending",
      time: "09:45 AM",
    },

  ];

  return (

    <div className="orders-page">

      {/* TOP */}

      <div className="orders-top">

        <div>

          <h1>
            Orders
          </h1>

          <p>
            Dashboard {" > "} Orders
          </p>

        </div>

        <button className="new-order-btn">
          + New Order
        </button>

      </div>

      {/* STATS */}

      <div className="orders-stats">

        <div className="orders-stat-card">

          <div className="stat-icon">
            📦
          </div>

          <div>

            <h4>
              Total Orders
            </h4>

            <h2>
              540
            </h2>

            <p>
              ↑ 12.4%
            </p>

          </div>

        </div>

        <div className="orders-stat-card">

          <div className="stat-icon">
            ✅
          </div>

          <div>

            <h4>
              Completed
            </h4>

            <h2>
              420
            </h2>

            <p>
              ↑ 14.2%
            </p>

          </div>

        </div>

        <div className="orders-stat-card">

          <div className="stat-icon">
            ⏳
          </div>

          <div>

            <h4>
              Pending
            </h4>

            <h2>
              78
            </h2>

            <p className="red">
              ↓ 5.1%
            </p>

          </div>

        </div>

        <div className="orders-stat-card">

          <div className="stat-icon">
            🛵
          </div>

          <div>

            <h4>
              Delivery
            </h4>

            <h2>
              32
            </h2>

            <p>
              ↑ 8.3%
            </p>

          </div>

        </div>

      </div>

      {/* TABLE */}

      <div className="orders-table-wrapper">

        <div className="orders-filter-bar">

          <div className="orders-tabs">

            <button className="active-tab">
              All Orders
            </button>

            <button>
              Pending
            </button>

            <button>
              Preparing
            </button>

            <button>
              Completed
            </button>

          </div>

          <input
            type="text"
            placeholder="Search order..."
            className="orders-search"
          />

        </div>

        <table className="orders-table">

          <thead>

            <tr>

              <th>
                Order ID
              </th>

              <th>
                Customer
              </th>

              <th>
                Items
              </th>

              <th>
                Type
              </th>

              <th>
                Amount
              </th>

              <th>
                Status
              </th>

              <th>
                Time
              </th>

            </tr>

          </thead>

          <tbody>

            {orders.map((order, index) => (

              <tr key={index}>

                <td>
                  {order.id}
                </td>

                <td>

                  <div className="customer-info">

                    <div className="customer-avatar">
                      {order.customer[0]}
                    </div>

                    <div>

                      <h4>
                        {order.customer}
                      </h4>

                      <p>
                        {order.phone}
                      </p>

                    </div>

                  </div>

                </td>

                <td>

                  <div className="order-images">

                    {order.items.map((img, i) => (

                      <img
                        key={i}
                        src={img}
                        alt=""
                      />

                    ))}

                  </div>

                </td>

                <td>
                  {order.type}
                </td>

                <td>
                  {order.amount}
                </td>

                <td>

                  <span className={`order-status ${order.status}`}>
                    {order.status}
                  </span>

                </td>

                <td>
                  {order.time}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Orders;