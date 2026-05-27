import "../../styles/cashier.css";

const SalesHistory = () => {

  const sales = [
    {
      id: 1,
      amount: 2400,
      method: "eSewa",
      date: "Today",
    },

    {
      id: 2,
      amount: 1800,
      method: "Cash",
      date: "Today",
    },

    {
      id: 3,
      amount: 3200,
      method: "Card",
      date: "Yesterday",
    },
  ];

  return (
    <div>

      <div className="page-header">
        <h1>Sales History</h1>

        <p>
          Daily transaction records
        </p>
      </div>

      <div className="sales-history">

        {sales.map((sale) => (
          <div
            className="sale-card"
            key={sale.id}
          >
            <h2>
              Rs. {sale.amount}
            </h2>

            <p>
              Payment:
              {sale.method}
            </p>

            <p>
              Date:
              {sale.date}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
};

export default SalesHistory;