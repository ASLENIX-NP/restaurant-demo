import "../../styles/cashier.css";

const SalesHistory = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Sales History</h1>

        <p>
          View completed transactions
        </p>
      </div>

      <div className="sales-table-card">
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Table</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>#1001</td>
              <td>4</td>
              <td>Cash</td>
              <td>Rs. 2,400</td>
              <td>
                <span className="paid-status">
                  Paid
                </span>
              </td>
            </tr>

            <tr>
              <td>#1002</td>
              <td>7</td>
              <td>Card</td>
              <td>Rs. 1,850</td>
              <td>
                <span className="paid-status">
                  Paid
                </span>
              </td>
            </tr>

            <tr>
              <td>#1003</td>
              <td>2</td>
              <td>eSewa</td>
              <td>Rs. 3,100</td>
              <td>
                <span className="paid-status">
                  Paid
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesHistory;