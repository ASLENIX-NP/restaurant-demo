import React, { useState } from "react";
import { 
  Download, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Calendar, 
  BarChart3, 
  PieChart as PieIcon 
} from "lucide-react";
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
  Cell
} from "recharts";

// Links the stylesheet cleanly
import "../../styles/reports.css";
// Premium Mock Metrics matching your dashboard values safely
const revenueTrendData = [
  { label: "05-05", revenue: 42000 },
  { label: "10-05", revenue: 58000 },
  { label: "15-05", revenue: 49000 },
  { label: "20-05", revenue: 78000 },
  { label: "25-05", revenue: 62000 },
  { label: "31-05", revenue: 92000 },
];

const categoryDistributionData = [
  { name: "Pizza", value: 38, color: "#1e293b" },    /* Slate-800 */
  { name: "Momo", value: 23, color: "#475569" },     /* Slate-600 */
  { name: "Burger", value: 17, color: "#94a3b8" },   /* Slate-400 */
  { name: "Beverage", value: 11, color: "#cbd5e1" }, /* Slate-300 */
];

const topItems = [
  {
    name: "Chicken Burger",
    category: "Fast Food",
    quantity: 120,
    revenue: "Rs. 54,000",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=120&auto=format&fit=crop",
  },
  {
    name: "Pepperoni Pizza",
    category: "Italian",
    quantity: 95,
    revenue: "Rs. 85,500",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=120&auto=format&fit=crop",
  },
  {
    name: "Buff Momo",
    category: "Nepali",
    quantity: 160,
    revenue: "Rs. 51,200",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=120&auto=format&fit=crop",
  },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Sales Report", "Orders", "Menu Report", "Customers"];

  const handlePrintExport = () => {
    window.print();
  };

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
        <div className="report-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active-tab" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "Overview" && <BarChart3 size={15} />}
              {tab === "Sales Report" && <DollarSign size={15} />}
              {tab === "Orders" && <ShoppingBag size={15} />}
              {tab === "Customers" && <Users size={15} />}
              {tab !== "Overview" && tab !== "Sales Report" && tab !== "Orders" && tab !== "Customers" && "🍔"}
              <span className="tab-text-label">{tab}</span>
            </button>
          ))}
        </div>

        {/* TIME FRAME RANGE FILTER BAR */}
        <div className="report-filter">
          <div className="date-box">
            <Calendar size={15} className="text-purple-500" />
            <span>May 01, 2026 - May 31, 2026</span>
          </div>
        </div>

        {/* ANALYTIC KPI SUMMARY GRID */}
        <div className="report-stats-grid">
          {[
            { title: "Total Revenue", value: "Rs. 4,50,000", change: "↑ 18.6% this month", icon: <DollarSign size={20} /> },
            { title: "Total Orders", value: "540", change: "↑ 12.4% this month", icon: <ShoppingBag size={20} /> },
            { title: "Avg Order Value", value: "Rs. 1,200", change: "↑ 6.7% this month", icon: <TrendingUp size={20} /> },
            { title: "Customers", value: "482", change: "↑ 15.3% this month", icon: <Users size={20} /> },
          ].map((stat, i) => (
            <div key={i} className="report-stat-card">
              <div className="report-icon-wrapper">
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3>{stat.title}</h3>
                <h1>{stat.value}</h1>
                <p className="stat-change-text">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* INTERACTIVE GRAPH DATA BLOCK CONTAINER */}
        <div className="report-chart-grid">
          
          {/* SMOOTH AREA-LINE CHART */}
          <div className="chart-card linear-graph-block">
            <div className="chart-header-node">
              <div>
                <h2>Revenue Overview</h2>
                <p>Gross performance trends over this cycle</p>
              </div>
              <button className="chart-toggle-btn">By Day</button>
            </div>
            
            <div className="chart-wrapper-canvas">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="reportRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e293b" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#1e293b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} dy={8} style={{ fontSize: '11px' }} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} dx={-5} tickFormatter={(v) => `Rs.${v/1000}k`} style={{ fontSize: '11px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "10px", border: "none", color: "#fff", fontSize: "12px" }}
                    formatter={(value) => [`Rs. ${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#334155" strokeWidth={2.5} fillOpacity={1} fill="url(#reportRevenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DOUGHNUT PIE CHART */}
          <div className="chart-card distribution-graph-block">
            <div className="chart-header-node">
              <h2>Sales By Category</h2>
              <p>Performance weight by preparation tier</p>
            </div>

            <div className="pie-section-wrapper">
              <div className="pie-canvas-container">
                <ResponsiveContainer width="100%" height="100%">
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
                      <span className="color-indicator-dot" style={{ backgroundColor: item.color }} />
                      <span className="legend-name-text">{item.name}</span>
                    </div>
                    <span className="legend-percentage-value">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* COMPREHENSIVE PERFORMANCE DATATABLE */}
        <div className="top-items-card">
          <div className="table-title-node">
            <h2>Top Selling Items</h2>
            <p>High velocity restaurant performance entries listed by inventory rank</p>
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
                {topItems.map((item, index) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}