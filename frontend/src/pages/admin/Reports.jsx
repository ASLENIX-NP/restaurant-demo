import "../../styles/reports.css";

const Reports = () => {

  const topItems = [

    {
      name: "Chicken Burger",

      category: "Fast Food",

      quantity: 120,

      revenue: 54000,

      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
    },

    {
      name: "Pepperoni Pizza",

      category: "Italian",

      quantity: 95,

      revenue: 85500,

      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
    },

    {
      name: "Buff Momo",

      category: "Nepali",

      quantity: 160,

      revenue: 51200,

      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    },

  ];

  return (

    <div className="report-page">

      {/* HEADER */}

      <div className="report-header">

        <div>

          <h1>
            Reports
          </h1>

          <p>
            Dashboard
            {" > "}
            Reports
          </p>

        </div>

        <button className="export-report-btn">

          ⬇ Export Report

        </button>

      </div>

      {/* TABS */}

      <div className="report-tabs">

        <button className="active-tab">

          📊 Overview

        </button>

        <button>
          💰 Sales Report
        </button>

        <button>
          📦 Orders
        </button>

        <button>
          🍔 Menu Report
        </button>

        <button>
          👥 Customers
        </button>

      </div>

      {/* FILTER */}

      <div className="report-filter">

        <div className="date-box">

          📅 May 01, 2026 - May 31, 2026

        </div>

      </div>

      {/* STATS */}

      <div className="report-stats-grid">

        <div className="report-stat-card">

          <div className="report-icon">
            💰
          </div>

          <div>

            <h3>
              Total Revenue
            </h3>

            <h1>
              Rs. 4,50,000
            </h1>

            <p>
              ↑ 18.6% this month
            </p>

          </div>

        </div>

        <div className="report-stat-card">

          <div className="report-icon">
            📦
          </div>

          <div>

            <h3>
              Total Orders
            </h3>

            <h1>
              540
            </h1>

            <p>
              ↑ 12.4% this month
            </p>

          </div>

        </div>

        <div className="report-stat-card">

          <div className="report-icon">
            📈
          </div>

          <div>

            <h3>
              Avg Order Value
            </h3>

            <h1>
              Rs. 1,200
            </h1>

            <p>
              ↑ 6.7% this month
            </p>

          </div>

        </div>

        <div className="report-stat-card">

          <div className="report-icon">
            👥
          </div>

          <div>

            <h3>
              Customers
            </h3>

            <h1>
              482
            </h1>

            <p>
              ↑ 15.3% this month
            </p>

          </div>

        </div>

      </div>

      {/* CHART SECTION */}

      <div className="report-chart-grid">

        {/* LINE CHART */}

        <div className="chart-card">

          <div className="chart-header">

            <h2>
              Revenue Overview
            </h2>

            <button>
              By Day
            </button>

          </div>

          <div className="fake-line-chart">

            <div
              className="line-point"
              style={{
                height: "120px",
              }}
            ></div>

            <div
              className="line-point"
              style={{
                height: "180px",
              }}
            ></div>

            <div
              className="line-point"
              style={{
                height: "150px",
              }}
            ></div>

            <div
              className="line-point"
              style={{
                height: "240px",
              }}
            ></div>

            <div
              className="line-point"
              style={{
                height: "200px",
              }}
            ></div>

            <div
              className="line-point"
              style={{
                height: "300px",
              }}
            ></div>

          </div>

        </div>

        {/* PIE */}

        <div className="chart-card">

          <h2>
            Sales By Category
          </h2>

          <div className="fake-pie"></div>

          <div className="pie-details">

            <p>
              🍕 Pizza - 38%
            </p>

            <p>
              🥟 Momo - 23%
            </p>

            <p>
              🍔 Burger - 17%
            </p>

            <p>
              ☕ Beverage - 11%
            </p>

          </div>

        </div>

      </div>

      {/* TABLE */}

      <div className="top-items-card">

        <h2>
          Top Selling Items
        </h2>

        <table className="report-table">

          <thead>

            <tr>

              <th>
                #
              </th>

              <th>
                Item
              </th>

              <th>
                Category
              </th>

              <th>
                Quantity
              </th>

              <th>
                Revenue
              </th>

            </tr>

          </thead>

          <tbody>

            {topItems.map(
              (
                item,
                index
              ) => (

                <tr key={index}>

                  <td>
                    {index + 1}
                  </td>

                  <td>

                    <div className="item-info">

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <span>
                        {item.name}
                      </span>

                    </div>

                  </td>

                  <td>
                    {item.category}
                  </td>

                  <td>
                    {item.quantity}
                  </td>

                  <td>
                    Rs.
                    {" "}
                    {item.revenue}
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Reports;