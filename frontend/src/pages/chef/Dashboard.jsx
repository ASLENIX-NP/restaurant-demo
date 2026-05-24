import { useOrders } from "../../context/OrderContext";

import "../../styles/chef.css";

const Dashboard = () => {
  const {
    orders,
    updateOrderStatus,
  } = useOrders();

  // FILTER ORDERS
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  );

  const cookingOrders = orders.filter(
    (order) => order.status === "cooking"
  );

  const readyOrders = orders.filter(
    (order) => order.status === "ready"
  );

  return (
    <div>
      {/* HEADER */}
      <div className="page-header">
        <h1>Kitchen Dashboard</h1>

        <p>Live kitchen workflow</p>
      </div>

      {/* KITCHEN BOARD */}
      <div className="kitchen-board">

        {/* PENDING */}
        <div className="kitchen-column">
          <h2>🕒 Pending</h2>

          {pendingOrders.length === 0 ? (
            <p>No Pending Orders</p>
          ) : (
            pendingOrders.map((order) => (
              <div
                className="kitchen-order pending-order"
                key={order.id}
              >
                <h3>
                  Order #{order.id}
                </h3>

                <p>
                  Table {order.table}
                </p>

                <ul>
                  {order.items.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>

                <button
                  onClick={() =>
                    updateOrderStatus(
                      order.id,
                      "cooking"
                    )
                  }
                >
                  Start Cooking
                </button>
              </div>
            ))
          )}
        </div>

        {/* COOKING */}
        <div className="kitchen-column">
          <h2>🔥 Cooking</h2>

          {cookingOrders.length === 0 ? (
            <p>No Cooking Orders</p>
          ) : (
            cookingOrders.map((order) => (
              <div
                className="kitchen-order cooking-order"
                key={order.id}
              >
                <h3>
                  Order #{order.id}
                </h3>

                <p>
                  Table {order.table}
                </p>

                <ul>
                  {order.items.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>

                <button
                  onClick={() =>
                    updateOrderStatus(
                      order.id,
                      "ready"
                    )
                  }
                >
                  Mark Ready
                </button>
              </div>
            ))
          )}
        </div>

        {/* READY */}
        <div className="kitchen-column">
          <h2>✅ Ready</h2>

          {readyOrders.length === 0 ? (
            <p>No Ready Orders</p>
          ) : (
            readyOrders.map((order) => (
              <div
                className="kitchen-order ready-order"
                key={order.id}
              >
                <h3>
                  Order #{order.id}
                </h3>

                <p>
                  Table {order.table}
                </p>

                <ul>
                  {order.items.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>

                <button>
                  Ready To Serve
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;