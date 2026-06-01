import "../../styles/billing.css";

const Billing = () => {

  const bills = [

    {
      billNo: "BIL-000128",
      orderId: "#TH1250",
      table: "Table 5",
      amount: "Rs. 2,500",
      payment: "Cash",
      status: "Paid",
      time: "10:30 AM",
    },

    {
      billNo: "BIL-000127",
      orderId: "#TH1249",
      table: "Table 3",
      amount: "Rs. 1,800",
      payment: "UPI",
      status: "Paid",
      time: "10:15 AM",
    },

    {
      billNo: "BIL-000126",
      orderId: "#TH1248",
      table: "Table 1",
      amount: "Rs. 3,200",
      payment: "Card",
      status: "Paid",
      time: "10:05 AM",
    },

  ];

  return (

    <div className="billing-page">

      {/* TOP */}

      <div className="billing-top">

        <div>

          <h1>
            Billing
          </h1>

          <p>
            Dashboard {" > "} Billing
          </p>

        </div>

      </div>

      {/* STATS */}

      <div className="billing-stats">

        <div className="billing-stat-card">

          <div className="billing-icon">
            💰
          </div>

          <div>

            <h4>
              Today's Revenue
            </h4>

            <h2>
              Rs. 2,85,000
            </h2>

            <p>
              ↑ 18.6% vs Yesterday
            </p>

          </div>

        </div>

        <div className="billing-stat-card">

          <div className="billing-icon">
            🧾
          </div>

          <div>

            <h4>
              Total Bills
            </h4>

            <h2>
              128
            </h2>

            <p>
              ↑ 12.4% vs Yesterday
            </p>

          </div>

        </div>

        <div className="billing-stat-card">

          <div className="billing-icon">
            💳
          </div>

          <div>

            <h4>
              Average Bill
            </h4>

            <h2>
              Rs. 1,250
            </h2>

            <p>
              ↑ 6.8% vs Yesterday
            </p>

          </div>

        </div>

      </div>

      {/* TABLE SECTION */}

      <div className="billing-content">

        {/* LEFT */}

        <div className="billing-table-wrapper">

          <div className="billing-filter-bar">

            <div className="billing-tabs">

              <button className="active-bill-tab">
                All Bills
              </button>

              <button>
                Paid
              </button>

            </div>

            <input
              type="text"
              placeholder="Search bill..."
              className="billing-search"
            />

          </div>

          <table className="billing-table">

            <thead>

              <tr>

                <th>
                  Bill No.
                </th>

                <th>
                  Order ID
                </th>

                <th>
                  Table
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Payment
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

              {bills.map((bill, index) => (

                <tr key={index}>

                  <td>
                    {bill.billNo}
                  </td>

                  <td>
                    {bill.orderId}
                  </td>

                  <td>
                    {bill.table}
                  </td>

                  <td>
                    {bill.amount}
                  </td>

                  <td>

                    <span className={`payment-method ${bill.payment}`}>
                      {bill.payment}
                    </span>

                  </td>

                  <td>

                    <span className={`bill-status ${bill.status}`}>
                      {bill.status}
                    </span>

                  </td>

                  <td>
                    {bill.time}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* RIGHT */}

        <div className="bill-details">

          <div className="details-top">

            <h2>
              Bill Details
            </h2>

            <span className="paid-badge">
              Paid
            </span>

          </div>

          <div className="details-row">

            <span>
              Bill No.
            </span>

            <strong>
              BIL-000128
            </strong>

          </div>

          <div className="details-row">

            <span>
              Table
            </span>

            <strong>
              Table 5
            </strong>

          </div>

          <div className="details-row">

            <span>
              Payment
            </span>

            <strong>
              Cash
            </strong>

          </div>

          <hr />

          <div className="bill-item">

            <span>
              Grilled Chicken
            </span>

            <span>
              Rs. 1,200
            </span>

          </div>

          <div className="bill-item">

            <span>
              Alfredo Pasta
            </span>

            <span>
              Rs. 950
            </span>

          </div>

          <div className="bill-item">

            <span>
              Fresh Lime Soda
            </span>

            <span>
              Rs. 350
            </span>

          </div>

          <hr />

          <div className="total-amount">

            <span>
              Total Amount
            </span>

            <h2>
              Rs. 2,500
            </h2>

          </div>

          <button className="invoice-btn">
            ⬇ Download Invoice
          </button>

        </div>

      </div>

    </div>

  );
};

export default Billing;