import React, { useState, useEffect } from "react";
import {
  Download,
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart as PieIcon,
} from "lucide-react";
import { io } from "socket.io-client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Links the stylesheet cleanly
import "../../styles/reports.css";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const tabs = [
    "Overview",
    "Sales Report",
    "Orders",
    "Menu Report",
    "Customers",
  ];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch("http://localhost:5001/api/reports/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setReportData(data);
        }
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();

    const socket = io("http://localhost:5001");

    socket.on("newOrder", fetchReports);
    socket.on("orderUpdated", fetchReports);
    socket.on("orderStatusUpdated", fetchReports);
    socket.on("orderCompleted", fetchReports);

    return () => socket.disconnect();
  }, []);

  const totalRevenue = reportData?.overall?.totalRevenue || 0;
  const totalOrders = reportData?.overall?.totalOrders || 0;
  const avgOrderValue = reportData?.overall?.avgOrderValue || 0;
  const totalCustomers = reportData?.totalCustomers || 0;

  const colors = ["#1e293b", "#475569", "#94a3b8", "#cbd5e1", "#818cf8"];
  const totalItemsSold = (reportData?.categoryDistribution || []).reduce(
    (acc, curr) => acc + curr.value,
    0
  );

  let categoryDistributionData = (reportData?.categoryDistribution || []).map(
    (cat, idx) => ({
      name: cat.name,
      value:
        totalItemsSold > 0 ? Math.round((cat.value / totalItemsSold) * 100) : 0,
      color: colors[idx % colors.length],
    })
  );

  if (categoryDistributionData.length === 0) {
    categoryDistributionData = [
      { name: "No Sales", value: 100, color: "#cbd5e1" },
    ];
  }

  const topItems = (reportData?.topItems || []).map((item) => ({
    name: item.name,
    category: item.category || "Mains",
    quantity: item.sold,
    revenue: `Rs. ${item.revenue.toLocaleString()}`,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80",
  }));

  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  // Dynamic Revenue Trend Data (Last 7 Days)
  const revenueTrendData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d
      .toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })
      .replace("/", "-");
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const fullDateStr = `${year}-${month}-${day}`;

    const found = (reportData?.revenueTrend || []).find(
      (r) => r.date === fullDateStr
    );

    revenueTrendData.push({
      label,
      fullDate: d.toLocaleDateString(),
      revenue: found ? found.revenue : 0,
    });
  }

  const handlePrintExport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
        <p className="font-semibold">Loading Analytics Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="report-container">
        {/* HEADER SECTION */}
        <div className="report-header">
          <div>
            <h1>Reports</h1>
            <p className="breadcrumb">
              Dashboard <span>&gt;</span> Reports
            </p>
          </div>
          <button className="export-report-btn" onClick={handlePrintExport}>
            <Download size={16} />
            Export Report
          </button>
        </div>

        {/* CONTROLS TABS */}
        <div className="flex bg-slate-200/60 p-1.5 rounded-xl w-full sm:w-fit my-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "Overview" && <BarChart3 size={16} />}
              {tab === "Sales Report" && <DollarSign size={16} />}
              {tab === "Orders" && <ShoppingBag size={16} />}
              {tab === "Menu Report" && <PieIcon size={16} />}
              {tab === "Customers" && <Users size={16} />}
              {tab}
            </button>
          ))}
        </div>

        {/* TIME FRAME RANGE FILTER BAR */}
        <div className="report-filter mb-6">
          <div className="date-box">
            <Calendar size={15} className="text-purple-500" />
            <span>
              {startOfMonth} - {endOfMonth}
            </span>
          </div>
        </div>

        {/* ANALYTIC KPI SUMMARY GRID */}
        {(activeTab === "Overview" || activeTab === "Sales Report") && (
          <div className="report-stats-grid mb-6">
            {[
              {
                title: "Total Revenue",
                value: `Rs. ${totalRevenue.toLocaleString()}`,
                change: "0% this month",
                icon: <DollarSign size={20} />,
              },
              {
                title: "Total Orders",
                value: totalOrders,
                change: "0% this month",
                icon: <ShoppingBag size={20} />,
              },
              {
                title: "Avg Order Value",
                value: `Rs. ${avgOrderValue.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}`,
                change: "0% this month",
                icon: <TrendingUp size={20} />,
              },
              {
                title: "Customers",
                value: totalCustomers,
                change: "0% this month",
                icon: <Users size={20} />,
              },
            ].map((stat, i) => (
              <div key={i} className="report-stat-card">
                <div className="report-icon-wrapper">{stat.icon}</div>
                <div className="stat-content">
                  <h3>{stat.title}</h3>
                  <h1>{stat.value}</h1>
                  <p className="stat-change-text">{stat.change}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INTERACTIVE GRAPH DATA BLOCK CONTAINER */}
        {reportData &&
          (activeTab === "Overview" ||
            activeTab === "Sales Report" ||
            activeTab === "Menu Report") && (
            <div
              className="report-chart-grid mb-6"
              style={{
                gridTemplateColumns:
                  activeTab === "Overview" ? "2fr 1fr" : "1fr",
              }}
            >
              {/* SMOOTH AREA-LINE CHART */}
              {(activeTab === "Overview" || activeTab === "Sales Report") && (
                <div className="chart-card linear-graph-block">
                  <div className="chart-header-node">
                    <div>
                      <h2>Revenue Overview</h2>
                      <p>Gross performance trends over this cycle</p>
                    </div>
                    <button className="chart-toggle-btn">By Day</button>
                  </div>

                  <div className="chart-wrapper-canvas">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                      minWidth={1}
                      minHeight={1}
                    >
                      <AreaChart
                        data={revenueTrendData}
                        margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="reportRevenueGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#1e293b"
                              stopOpacity={0.15}
                            />
                            <stop
                              offset="95%"
                              stopColor="#1e293b"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1f5f9"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="label"
                          stroke="#94a3b8"
                          tickLine={false}
                          axisLine={false}
                          dy={8}
                          style={{ fontSize: "11px" }}
                        />
                        <YAxis
                          stroke="#94a3b8"
                          tickLine={false}
                          axisLine={false}
                          dx={-5}
                          tickFormatter={(v) => `Rs.${v / 1000}k`}
                          style={{ fontSize: "11px" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderRadius: "10px",
                            border: "none",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                          formatter={(value) => [
                            `Rs. ${value.toLocaleString()}`,
                            "Revenue",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#334155"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#reportRevenueGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* DOUGHNUT PIE CHART */}
              {(activeTab === "Overview" || activeTab === "Menu Report") && (
                <div className="chart-card distribution-graph-block">
                  <div className="chart-header-node">
                    <h2>Sales By Category</h2>
                    <p>Performance weight by preparation tier</p>
                  </div>

                  <div className="pie-section-wrapper">
                    <div className="pie-canvas-container">
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                        minWidth={1}
                        minHeight={1}
                      >
                        <PieChart>
                          <Pie
                            data={categoryDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {categoryDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}% Share`]} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="pie-center-label">
                        <PieIcon size={18} className="text-slate-400" />
                      </div>
                    </div>

                    <div className="pie-details-legend">
                      {categoryDistributionData.map((item, index) => (
                        <div key={index} className="legend-row-item">
                          <div className="legend-indicator">
                            <span
                              className="color-indicator-dot"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="legend-name-text">
                              {item.name}
                            </span>
                          </div>
                          <span className="legend-percentage-value">
                            {item.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        {/* COMPREHENSIVE PERFORMANCE DATATABLE */}
        {(activeTab === "Overview" || activeTab === "Menu Report") && (
          <div className="top-items-card">
            <div className="table-title-node">
              <h2>Top Selling Items</h2>
              <p>
                High velocity restaurant performance entries listed by inventory
                rank
              </p>
            </div>

            <div className="report-table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th style={{ width: "60px" }}>#</th>
                    <th>Item</th>
                    <th>Category</th>
                    <th style={{ textAlign: "center" }}>Quantity</th>
                    <th style={{ textAlign: "right" }}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-8 text-slate-400 font-medium"
                      >
                        No items sold yet.
                      </td>
                    </tr>
                  ) : (
                    topItems.map((item, index) => (
                      <tr key={index}>
                        <td className="rank-index-cell">{index + 1}</td>
                        <td>
                          <div className="item-info">
                            <img src={item.image} alt={item.name} />
                            <span className="item-name-bold">{item.name}</span>
                          </div>
                        </td>
                        <td className="category-text-dim">{item.category}</td>
                        <td className="qty-center-cell">{item.quantity}</td>
                        <td className="revenue-right-cell">{item.revenue}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS & CUSTOMERS PLACEHOLDER */}
        {(activeTab === "Orders" || activeTab === "Customers") && (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center text-slate-500 font-medium shadow-sm mt-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === "Orders" ? (
                <ShoppingBag size={32} className="text-slate-400" />
              ) : (
                <Users size={32} className="text-slate-400" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {activeTab} Details
            </h2>
            <p className="max-w-md mx-auto leading-relaxed">
              Detailed reporting for {activeTab.toLowerCase()} is currently
              being collected. Please navigate to the dedicated {activeTab} page
              from the sidebar to view and manage them directly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
