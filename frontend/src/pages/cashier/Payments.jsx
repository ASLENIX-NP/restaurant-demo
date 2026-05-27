// src/pages/cashier/Payments.jsx

import React from "react";
import "../../styles/payments.css";

const payments = [
  {
    paymentId: "PAY-10048",
    orderId: "TXN-10048",
    customer: "Walk-in Customer",
    method: "Cash",
    amount: "Rs. 250.00",
    status: "Completed",
    time: "10:34 AM",
  },
  {
    paymentId: "PAY-10047",
    orderId: "TXN-10047",
    customer: "Arman Sharma",
    method: "Card",
    amount: "Rs. 350.00",
    status: "Completed",
    time: "10:15 AM",
  },
  {
    paymentId: "PAY-10046",
    orderId: "TXN-10046",
    customer: "Neha Verma",
    method: "eSewa",
    amount: "Rs. 180.00",
    status: "Completed",
    time: "10:04 AM",
  },
  {
    paymentId: "PAY-10045",
    orderId: "TXN-10045",
    customer: "Rohan Das",
    method: "Khalti",
    amount: "Rs. 120.00",
    status: "Completed",
    time: "09:56 AM",
  },
  {
    paymentId: "PAY-10044",
    orderId: "TXN-10044",
    customer: "Walk-in Customer",
    method: "Cash",
    amount: "Rs. 200.00",
    status: "Completed",
    time: "09:42 AM",
  },
];

const Payments = () => {
  return (
    <div className="payments-page">

      <div className="payments-top">

        <div>
          <h1>Payments</h1>

          <div className="breadcrumb">
            Home <span>›</span> Payments
          </div>
        </div>

        <button className="date-btn">
          📅 May 15, 2024
        </button>

      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon green">💵</div>

          <div>
            <p>Total Collected</p>
            <h2>Rs. 2,000.00</h2>
            <span className="success">
              ↑ 12.5% vs yesterday
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">🧾</div>

          <div>
            <p>Total Payments</p>
            <h2>24</h2>
            <span className="success">
              ↑ 5 vs yesterday
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">💳</div>

          <div>
            <p>Average Payment</p>
            <h2>Rs. 83.33</h2>
            <span className="success">
              ↑ 8.3% vs yesterday
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">↩</div>

          <div>
            <p>Refunds</p>
            <h2>Rs. 120.00</h2>
            <span className="danger">
              ↑ 2.1% vs yesterday
            </span>
          </div>
        </div>

      </div>

      <div className="payments-layout">

        <div className="payments-table-card">

          <div className="table-header">

            <h2>All Payments</h2>

            <div className="table-actions">

              <input
                type="text"
                placeholder="Search by Order ID or Customer..."
              />

              <button>Filter</button>

              <button>Export</button>

            </div>

          </div>

          <table>

            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>

              {payments.map((payment, index) => (
                <tr key={index}>

                  <td className="blue-text">
                    {payment.paymentId}
                  </td>

                  <td>{payment.orderId}</td>

                  <td>{payment.customer}</td>

                  <td>{payment.method}</td>

                  <td>{payment.amount}</td>

                  <td>
                    <span
                      className={
                        payment.status === "Refunded"
                          ? "status refunded"
                          : "status completed"
                      }
                    >
                      {payment.status}
                    </span>
                  </td>

                  <td>{payment.time}</td>

                </tr>
              ))}

            </tbody>

          </table>

          <div className="pagination">

            <button>{"<"}</button>

            <button className="active">
              1
            </button>

            <button>2</button>

            <button>3</button>

            <button>{">"}</button>

          </div>

        </div>

        <div className="overview-card">

          <h2>Payment Methods Overview</h2>

          <div className="circle-chart">
            <div className="circle-center">
              <h3>Total</h3>
              <p>Rs. 2,000.00</p>
            </div>
          </div>

          <div className="methods-list">

            <div className="method-row">
              <span>Cash</span>
              <span>Rs. 750.00</span>
              <span>37.5%</span>
            </div>

            <div className="method-row">
              <span>Card</span>
              <span>Rs. 800.00</span>
              <span>40.0%</span>
            </div>

            <div className="method-row">
              <span>eSewa</span>
              <span>Rs. 300.00</span>
              <span>15.0%</span>
            </div>

            <div className="method-row">
              <span>Khalti</span>
              <span>Rs. 150.00</span>
              <span>7.5%</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Payments;