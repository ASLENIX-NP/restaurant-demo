import {
  useOrders,
} from "../../context/OrderContext";

import "../../styles/dashboard.css";

const Dashboard = () => {

  const {
    orders,
    completeOrder,
  } = useOrders();

  const readyOrders =
    orders.filter(
      (order) =>
        order.status ===
        "Ready"
    );

  return (
    <div>

      <div className="page-header">

        <h1>
          Cashier Dashboard
        </h1>

        <p>
          Process completed orders
        </p>

      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>
            Total Revenue
          </h3>

          <h1>
            Rs.{" "}
            {readyOrders.length *
              1000}
          </h1>
        </div>

        <div className="stat-card">
          <h3>
            Ready Orders
          </h3>

          <h1>
            {
              readyOrders.length
            }
          </h1>
        </div>

      </div>

      <div className="recent-orders">

        <h2>
          Orders Ready For Billing
        </h2>

        {readyOrders.length ===
        0 ? (
          <p>
            No Ready Orders
          </p>
        ) : (
          readyOrders.map(
            (order) => (
              <div
                key={order.id}
                className="order-item"
              >

                <div>

                  <h3>
                    Order #
                    {order.id}
                  </h3>

                  <p>
                    Table:
                    {
                      order.table
                    }
                  </p>

                </div>

                <button
                  className="complete-btn"
                  onClick={() =>
                    completeOrder(
                      order.id
                    )
                  }
                >
                  Complete Payment
                </button>

              </div>
            )
          )
        )}

      </div>
    </div>
  );
};

export default Dashboard;