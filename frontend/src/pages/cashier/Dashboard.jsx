// src/pages/cashier/Dashboard.jsx

import React from "react";
import "../../styles/cashierDashboard.css";
const Dashboard = () => {
  return (
    <div className="cashier-dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome back! Here's what's happening with your sales today.
          </p>
        </div>

        <button className="date-btn">
          📅 May 15, 2024
        </button>
      </div>

      {/* TOP CARDS */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon green-bg">💵</div>

          <div>
            <h4>Total Sales</h4>
            <h2>Rs. 2,45,000.00</h2>
            <span className="green-text">
              ↑ 12.5% vs yesterday
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue-bg">🛒</div>

          <div>
            <h4>Total Orders</h4>
            <h2>48</h2>
            <span className="green-text">
              ↑ 5 vs yesterday
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange-bg">📦</div>

          <div>
            <h4>Total Items Sold</h4>
            <h2>132</h2>
            <span className="green-text">
              ↑ 10.6% vs yesterday
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple-bg">💳</div>

          <div>
            <h4>Average Order Value</h4>
            <h2>Rs. 5,104.17</h2>
            <span className="green-text">
              ↑ 8.3% vs yesterday
            </span>
          </div>
        </div>

      </div>

      {/* MIDDLE SECTION */}
      <div className="middle-grid">

        {/* SALES OVERVIEW */}
        <div className="overview-card">

          <div className="card-top">
            <h3>Today's Sales Overview</h3>

            <select>
              <option>Today</option>
            </select>
          </div>

          <div className="overview-content">

            {/* LEFT INFO */}
            <div className="overview-info">

              <div className="overview-item">
                <span>💳 Sales Amount</span>
                <strong>Rs. 2,45,000.00</strong>
              </div>

              <div className="overview-item">
                <span>🧾 Orders</span>
                <strong>48</strong>
              </div>

              <div className="overview-item">
                <span>📦 Items Sold</span>
                <strong>132</strong>
              </div>

              <div className="overview-item">
                <span>👥 Customers</span>
                <strong>36</strong>
              </div>

              <div className="overview-item">
                <span>↩ Refunds</span>
                <strong>2</strong>
              </div>

            </div>

            {/* CHART */}
            <div className="chart-area">

              <div className="line-chart">
                <div className="chart-line"></div>
              </div>

              <div className="chart-labels">
                <span>12 AM</span>
                <span>4 AM</span>
                <span>8 AM</span>
                <span>12 PM</span>
                <span>4 PM</span>
                <span>8 PM</span>
              </div>

            </div>

          </div>

        </div>

        {/* PAYMENT METHOD */}
        <div className="payment-card">

          <h3>Sales by Payment Method</h3>

          <div className="payment-chart">

            <div className="circle-chart">
              <div className="circle-center">
                <h4>Total</h4>
                <p>Rs. 2,45,000</p>
              </div>
            </div>

            <div className="payment-list">

              <div className="payment-item">
                <span className="dot green"></span>
                Cash
              </div>

              <div className="payment-item">
                <span className="dot blue"></span>
                Card
              </div>

              <div className="payment-item">
                <span className="dot lightgreen"></span>
                eSewa
              </div>

              <div className="payment-item">
                <span className="dot purple"></span>
                Khalti
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* BOTTOM GRID */}
      <div className="bottom-grid">

        {/* RECENT TRANSACTIONS */}
        <div className="transactions-card">

          <div className="card-top">
            <h3>Recent Transactions</h3>
            <button>View All</button>
          </div>

          <table className="transaction-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td className="blue-text">#TXN-10048</td>
                <td>Walk-in Customer</td>
                <td>3 Items</td>
                <td>Rs. 250.00</td>
                <td>Cash</td>
                <td>
                  <span className="status completed">
                    Completed
                  </span>
                </td>
                <td>10:34 AM</td>
              </tr>

              <tr>
                <td className="blue-text">#TXN-10047</td>
                <td>Arman Sharma</td>
                <td>4 Items</td>
                <td>Rs. 350.00</td>
                <td>Card</td>
                <td>
                  <span className="status completed">
                    Completed
                  </span>
                </td>
                <td>10:15 AM</td>
              </tr>

              <tr>
                <td className="blue-text">#TXN-10046</td>
                <td>Neha Verma</td>
                <td>2 Items</td>
                <td>Rs. 180.00</td>
                <td>eSewa</td>
                <td>
                  <span className="status completed">
                    Completed
                  </span>
                </td>
                <td>10:04 AM</td>
              </tr>

              <tr>
                <td className="blue-text">#TXN-10045</td>
                <td>Rohan Das</td>
                <td>2 Items</td>
                <td>Rs. 120.00</td>
                <td>Khalti</td>
                <td>
                  <span className="status completed">
                    Completed
                  </span>
                </td>
                <td>09:56 AM</td>
              </tr>

            </tbody>
          </table>

        </div>

        {/* RECENT SALES */}
        <div className="recent-sales-card">

          <div className="card-top">
            <h3>Recent Sales</h3>
            <button>View All</button>
          </div>

          <div className="sale-item">

            <div className="sale-left">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
                alt=""
              />

              <div>
                <h4>Coke</h4>
                <p>1 x Rs. 50.00</p>
              </div>
            </div>

            <strong>Rs. 50.00</strong>

          </div>

          <div className="sale-item">

            <div className="sale-left">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
                alt=""
              />

              <div>
                <h4>Burger</h4>
                <p>1 x Rs. 150.00</p>
              </div>
            </div>

            <strong>Rs. 150.00</strong>

          </div>

          <div className="sale-item">

            <div className="sale-left">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3132/3132693.png"
                alt=""
              />

              <div>
                <h4>Pizza</h4>
                <p>1 x Rs. 300.00</p>
              </div>
            </div>

            <strong>Rs. 300.00</strong>

          </div>

          <div className="total-sale">
            <span>Total (3 Items)</span>
            <strong>Rs. 500.00</strong>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;