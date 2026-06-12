import React, { useState, useEffect, useMemo } from "react";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Links the stylesheet cleanly
import "../../styles/reports.css";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [reportData, setReportData] = useState(null);

  // Default to the current month's report
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [dateRange, setDateRange] = useState([startOfMonth, today]);
  const [startDate, endDate] = dateRange;
  const [loading, setLoading] = useState(true);

  const tabs = [
    "Overview",
    "Sales Report",
    "Orders",
    "Menu Report",
    "Customers",
  ];

  useEffect(() => {
    // Prevent fetching if the user has only clicked the start date and is still picking the end date
    if (startDate && !endDate) return;

    const fetchReports = async (start, end) => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        let url = "http://localhost:5001/api/reports/dashboard";
        if (start && end) {
          const formattedStart = start.toISOString().split("T")[0];
          const formattedEnd = end.toISOString().split("T")[0];
          url += `?startDate=${formattedStart}&endDate=${formattedEnd}`;
        }

        const res = await fetch(url, {
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

    fetchReports(startDate, endDate);

    const socket = io("http://localhost:5001");

    const handleUpdate = () => fetchReports(startDate, endDate);

    socket.on("newOrder", handleUpdate);
    socket.on("orderUpdated", handleUpdate);
    socket.on("orderStatusUpdated", handleUpdate);
    socket.on("orderCompleted", handleUpdate);

    return () => socket.disconnect();
  }, [startDate, endDate]);

  const totalRevenue = reportData?.overall?.totalRevenue || 0;
  const totalOrders = reportData?.overall?.totalOrders || 0;
  const avgOrderValue = reportData?.overall?.avgOrderValue || 0;
  const totalCustomers = reportData?.totalCustomers || 0;

  // Vibrant color palette for the Pie Chart
  const colors = [
    "#8b5cf6", // Purple
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Rose
    "#06b6d4", // Cyan
    "#ec4899", // Pink
  ];
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
    revenue: `Rs. ${(item.revenue || 0).toLocaleString()}`,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80",
  }));

  // Dynamic Revenue Trend Data (Last 7 Days)
  const revenueTrendData = useMemo(() => {
    const trendStartDate =
      startDate || new Date(new Date().setDate(new Date().getDate() - 6));
    const trendEndDate = endDate || new Date();
    const dateLabels = [];
    let currentDate = new Date(trendStartDate);
    while (currentDate <= trendEndDate) {
      dateLabels.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateLabels.map((d) => {
      const label = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const fullDateStr = d.toISOString().split("T")[0];
      const found = (reportData?.revenueTrend || []).find(
        (r) => r.date === fullDateStr
      );
      return {
        label,
        revenue: found ? found.revenue : 0,
      };
    });
  }, [reportData, startDate, endDate]);

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
      {/* PRINT-ONLY STYLES FOR PDF EXPORT */}
      <style>
        {`
        @media print {
          @page { margin: 10mm; size: A4 portrait; }
          html, body { background: #fff; margin: 0; padding: 0; }
          body * { visibility: hidden; }
          .sidebar, .navbar, header, footer, .report-container { display: none !important; }
          .report-page { padding: 0 !important; margin: 0 !important; background: transparent !important; }
          #printable-report-container, #printable-report-container * { visibility: visible; }
          #printable-report-container { position: absolute; left: 0; top: 0; width: 100%; margin: 0; font-family: 'Arial', sans-serif; color: #000; }
          .print-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .print-table th, .print-table td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 12px; }
          .print-table th { background-color: #f8fafc !important; -webkit-print-color-adjust: exact; font-weight: bold; color: #334155; }
        }
        @media screen {
          #printable-report-container { display: none; }
        }
        `}
      </style>

      <div className="report-container screen-only">
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
        <div className="mb-8">
          <style>{`
            .react-datepicker-wrapper {
              width: 100%;
              display: block;
            }
            .react-datepicker__input-container {
              display: block;
            }
            .react-datepicker__close-icon {
              padding: 0;
              right: 0;
            }
            .react-datepicker__close-icon::after {
              background-color: #f1f5f9;
              color: #64748b;
              font-size: 16px;
              height: 22px;
              width: 22px;
              line-height: 20px;
              border-radius: 6px;
              transition: all 0.2s ease;
            }
            .react-datepicker__close-icon:hover::after {
              background-color: #fee2e2;
              color: #ef4444;
            }
          `}</style>

          <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-3 rounded-xl shadow-sm hover:border-purple-300 hover:shadow-md transition-all w-full max-w-sm relative">
            <Calendar size={18} className="text-purple-500 flex-shrink-0" />
            <div className="flex-1 w-full">
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                }}
                isClearable={true}
                placeholderText="Select a date range (All Time)"
                className="w-full bg-transparent outline-none cursor-pointer text-sm text-slate-700 font-bold placeholder:text-slate-400 placeholder:font-medium"
                dateFormat="MMM d, yyyy"
                maxDate={new Date()}
              />
            </div>
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

        {/* EMPTY STATE FOR NO DATA IN SELECTED DATES */}
        {reportData &&
          totalOrders === 0 &&
          (activeTab === "Overview" ||
            activeTab === "Sales Report" ||
            activeTab === "Menu Report") && (
            <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center text-slate-500 font-medium shadow-sm mb-6">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                No Records Found
              </h2>
              <p className="max-w-md mx-auto leading-relaxed">
                There are no completed orders within the selected date range.
                Please adjust the calendar to a different time period.
              </p>
            </div>
          )}

        {/* INTERACTIVE GRAPH DATA BLOCK CONTAINER */}
        {reportData &&
          totalOrders > 0 &&
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
        {reportData &&
          totalOrders > 0 &&
          (activeTab === "Overview" || activeTab === "Menu Report") && (
            <div className="top-items-card">
              <div className="table-title-node">
                <h2>Top Selling Items</h2>
                <p>
                  High velocity restaurant performance entries listed by
                  inventory rank
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
                              <span className="item-name-bold">
                                {item.name}
                              </span>
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

      {/* DEDICATED PRINTABLE PDF REPORT LAYOUT */}
      <div id="printable-report-container">
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "22px", margin: "0 0 8px 0" }}>
            ASLENIX RESTAURANT
          </h2>
          <h3
            style={{ fontSize: "16px", margin: "0 0 5px 0", color: "#475569" }}
          >
            Financial & Sales Report
          </h3>
          <p style={{ margin: "3px 0", fontSize: "13px" }}>
            <strong>Date Range:</strong>{" "}
            {startDate ? startDate.toLocaleDateString() : "All Time"} to{" "}
            {endDate ? endDate.toLocaleDateString() : "Today"}
          </p>
          <p style={{ margin: "3px 0", fontSize: "13px" }}>
            <strong>Generated On:</strong> {new Date().toLocaleString()}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
            fontSize: "13px",
            backgroundColor: "#f8fafc",
            padding: "12px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            WebkitPrintColorAdjust: "exact",
          }}
        >
          <div>
            <strong>Total Revenue:</strong> Rs. {totalRevenue.toLocaleString()}
          </div>
          <div>
            <strong>Total Orders:</strong> {totalOrders}
          </div>
          <div>
            <strong>Avg Order Value:</strong> Rs.{" "}
            {avgOrderValue.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </div>
          <div>
            <strong>Total Customers:</strong> {totalCustomers}
          </div>
        </div>

        <h3
          style={{
            fontSize: "16px",
            margin: "20px 0 10px 0",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "5px",
          }}
        >
          Top Selling Items
        </h3>
        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>#</th>
              <th>Item</th>
              <th>Category</th>
              <th style={{ textAlign: "center" }}>Quantity Sold</th>
              <th style={{ textAlign: "right" }}>Revenue Generated</th>
            </tr>
          </thead>
          <tbody>
            {topItems.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#64748b",
                  }}
                >
                  No items sold in this period.
                </td>
              </tr>
            ) : (
              topItems.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td style={{ fontWeight: "bold" }}>{item.name}</td>
                  <td>{item.category}</td>
                  <td style={{ textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ textAlign: "right" }}>{item.revenue}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <h3
          style={{
            fontSize: "16px",
            margin: "30px 0 10px 0",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "5px",
          }}
        >
          Category Distribution
        </h3>
        <table className="print-table" style={{ width: "50%" }}>
          <thead>
            <tr>
              <th>Category</th>
              <th style={{ textAlign: "right" }}>Share (%)</th>
            </tr>
          </thead>
          <tbody>
            {categoryDistributionData.map((cat, idx) => (
              <tr key={idx}>
                <td>{cat.name}</td>
                <td style={{ textAlign: "right" }}>{cat.value}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
