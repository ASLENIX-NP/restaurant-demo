// src/pages/cashier/Invoices.jsx

import React from "react";
import "../../styles/invoices.css";
import {
  FaSearch,
  FaPlus,
  FaDownload,
  FaEye,
  FaPrint,
  FaEllipsisV,
} from "react-icons/fa";

const invoices = [
  {
    id: "INV-10024",
    date: "May 15, 2024",
    customer: "Walk-in Customer",
    amount: "Rs. 2,250.00",
    status: "Paid",
    method: "Cash",
  },
  {
    id: "INV-10023",
    date: "May 15, 2024",
    customer: "Arman Sharma",
    amount: "Rs. 1,350.00",
    status: "Paid",
    method: "Card",
  },
  {
    id: "INV-10022",
    date: "May 15, 2024",
    customer: "Neha Verma",
    amount: "Rs. 880.00",
    status: "Paid",
    method: "Khalti",
  },
  {
    id: "INV-10021",
    date: "May 15, 2024",
    customer: "Sita Thapa",
    amount: "Rs. 1,080.00",
    status: "Pending",
    method: "eSewa",
  },
  {
    id: "INV-10020",
    date: "May 14, 2024",
    customer: "Rohan Das",
    amount: "Rs. 3,300.00",
    status: "Paid",
    method: "Card",
  },
  {
    id: "INV-10019",
    date: "May 14, 2024",
    customer: "Walk-in Customer",
    amount: "Rs. 2,150.00",
    status: "Paid",
    method: "Cash",
  },
  {
    id: "INV-10018",
    date: "May 14, 2024",
    customer: "Amit Kumar",
    amount: "Rs. 1,750.00",
    status: "Cancelled",
    method: "Card",
  },
  {
    id: "INV-10017",
    date: "May 13, 2024",
    customer: "Priya Patel",
    amount: "Rs. 950.00",
    status: "Paid",
    method: "Khalti",
  },
];

const Invoices = () => {
  return (
    <div className="invoices-page">
      {/* Header */}
      <div className="invoice-top">
        <div>
          <h1>Invoices</h1>
          <p>
            Home <span>›</span> Invoices
          </p>
        </div>

        <div className="invoice-actions">
          <button className="filter-btn">Filter</button>

          <button className="new-btn">
            <FaPlus />
            New Invoice
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="invoice-stats">
        <div className="invoice-card">
          <div className="card-icon blue">📄</div>

          <div>
            <h4>Total Invoices</h4>
            <h2>128</h2>
            <span className="green">↑ 15.2% vs yesterday</span>
          </div>
        </div>

        <div className="invoice-card">
          <div className="card-icon green-bg">💵</div>

          <div>
            <h4>Paid Invoices</h4>
            <h2>98</h2>
            <span className="green">↑ 12.5% vs yesterday</span>
          </div>
        </div>

        <div className="invoice-card">
          <div className="card-icon orange-bg">🕒</div>

          <div>
            <h4>Pending Invoices</h4>
            <h2>20</h2>
            <span className="green">↑ 8.3% vs yesterday</span>
          </div>
        </div>

        <div className="invoice-card">
          <div className="card-icon red-bg">❌</div>

          <div>
            <h4>Cancelled Invoices</h4>
            <h2>10</h2>
            <span className="red">↓ 4.1% vs yesterday</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="invoice-table-card">
        <div className="table-header">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by Invoice ID or Customer..."
            />
          </div>

          <div className="table-buttons">
            <button className="status-btn">All Status</button>

            <button className="export-btn">
              <FaDownload />
              Export
            </button>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Payment Method</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={index}>
                <td className="invoice-id">{invoice.id}</td>
                <td>{invoice.date}</td>
                <td>{invoice.customer}</td>
                <td>{invoice.amount}</td>

                <td>
                  <span
                    className={`status ${
                      invoice.status === "Paid"
                        ? "paid"
                        : invoice.status === "Pending"
                        ? "pending"
                        : "cancelled"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>

                <td>{invoice.method}</td>

                <td>
                  <div className="action-buttons">
                    <button>
                      <FaEye />
                    </button>

                    <button>
                      <FaPrint />
                    </button>

                    <button>
                      <FaEllipsisV />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <p>Showing 1 to 8 of 128 entries</p>

          <div className="pages">
            <button className="active-page">1</button>
            <button>2</button>
            <button>3</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;