import { useOrders } from "../../context/OrderContext";

import "../../styles/chef.css";

const ReadyOrders = () => {
  const { orders } = useOrders();

  const readyOrders = orders.filter(
    (order) => order.status === "ready"
  );

  return (
    <div>
      <div className="page-header">
        <h1>Ready Orders</h1>

        <p>
          Orders ready for serving
        </p>
      </div>

      <div className="orders-page-list">

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
  );
};

export default ReadyOrders;