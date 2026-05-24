import { useOrders } from "../../context/OrderContext";

import "../../styles/chef.css";

const CookingOrders = () => {
  const {
    orders,
    updateOrderStatus,
  } = useOrders();

  const cookingOrders = orders.filter(
    (order) => order.status === "cooking"
  );

  return (
    <div>
      <div className="page-header">
        <h1>Cooking Orders</h1>

        <p>
          Orders currently cooking
        </p>
      </div>

      <div className="orders-page-list">

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
    </div>
  );
};

export default CookingOrders;