import "../../styles/history.css";

const orders = [
  {
    id: "#1021",
    table: "Table 4",
    amount: "Rs. 2400",
    status: "Completed",
    customer: "John Doe",
    items: 4,
    time: "7:30 PM",
  },
  {
    id: "#1022",
    table: "Table 2",
    amount: "Rs. 1800",
    status: "Cancelled",
    customer: "Emily Smith",
    items: 2,
    time: "8:00 PM",
  },
  {
    id: "#1023",
    table: "Table 7",
    amount: "Rs. 3200",
    status: "Completed",
    customer: "Michael Lee",
    items: 5,
    time: "9:15 PM",
  },
];

const History = () => {
  return (
    <div className="history-page">

      <div className="history-header">
        <div>
          <h1>Order History</h1>
          <p>Track previous customer orders professionally</p>
        </div>

        <button className="export-btn">
          Export History
        </button>
      </div>

      <div className="history-table-wrapper">

        <table className="history-table">

          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Table</th>
              <th>Items</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {orders.map((order, index) => (
              <tr key={index}>

                <td className="order-id">
                  {order.id}
                </td>

                <td>
                  <div className="customer-box">

                    <div className="customer-avatar">
                      {order.customer.charAt(0)}
                    </div>

                    <div>
                      <h4>{order.customer}</h4>
                      <p>Regular Customer</p>
                    </div>

                  </div>
                </td>

                <td>{order.table}</td>

                <td>{order.items} Items</td>

                <td>{order.time}</td>

                <td className="amount">
                  {order.amount}
                </td>

                <td>
                  <span
                    className={`status ${order.status}`}
                  >
                    {order.status}
                  </span>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default History;