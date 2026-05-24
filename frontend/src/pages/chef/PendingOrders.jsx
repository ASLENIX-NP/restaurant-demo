import { useOrders } from "../../context/OrderContext";

import "../../styles/chef.css";

const PendingOrders = () => {
  const {
    orders,
    updateOrderStatus,
  } = useOrders();

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  );

  return (
    <div>
      <div className="page-header">
        <h1>Pending Orders</h1>

        <p>
          Orders waiting to be cooked
        </p>
      </div>

      <div className="orders-page-list">

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
    </div>
  );
};

export default PendingOrders;