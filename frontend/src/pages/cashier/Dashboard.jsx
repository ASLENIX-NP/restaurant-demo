import { useOrders } from "../../context/OrderContext";

import "../../styles/cashier.css";

const Dashboard = () => {
  const { orders } = useOrders();

  const readyOrders =
    orders.filter(
      (order) =>
        order.status === "ready"
    );

  const totalRevenue =
    orders.reduce(
      (acc, order) =>
        acc + order.total,
      0
    );

  return (
    <div>
      <div className="page-header">
        <h1>Cashier Dashboard</h1>

        <p>
          Process completed orders
        </p>
      </div>

      {/* STATS */}
      <div className="cashier-stats">
        <div className="cashier-card">
          <h3>Total Revenue</h3>

          <h2>
            Rs. {totalRevenue}
          </h2>
        </div>

        <div className="cashier-card">
          <h3>Ready Orders</h3>

          <h2>
            {readyOrders.length}
          </h2>
        </div>
      </div>

      {/* READY ORDERS */}
      <div className="cashier-section">
        <div className="section-header">
          <h2>
            Orders Ready For Billing
          </h2>
        </div>

        <div className="payment-list">
          {readyOrders.map((order) => (
            <div
              className="payment-item"
              key={order.id}
            >
              <div>
                <h3>
                  Order #{order.id}
                </h3>

                <p>
                  Table {order.table}
                </p>
              </div>

              <h2>
                Rs. {order.total}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;