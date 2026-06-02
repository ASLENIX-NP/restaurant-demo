import React from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  ChevronRight, 
  Calendar,
  AlertTriangle,
  Star,
  CreditCard,
  Layers
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
  Cell,
  Legend
} from "recharts";

// Modern Interactive Chart Dataset Formats
const revenueTrendData = [
  { day: "Mon", revenue: 42000 },
  { day: "Tue", revenue: 58000 },
  { day: "Wed", revenue: 49000 },
  { day: "Thu", revenue: 75000 },
  { day: "Fri", revenue: 68000 },
  { day: "Sat", revenue: 92000 },
  { day: "Sun", revenue: 85500 },
];

const orderDistributionData = [
  { name: "Dine In", value: 245, color: "#6366f1" },     // Indigo
  { name: "Takeaway", value: 142, color: "#f97316" },    // Orange
  { name: "Delivery", value: 118, color: "#10b981" },    // Emerald
  { name: "Reservation", value: 35, color: "#a855f7" },  // Purple
];

const topItems = [
  {
    name: "Chicken Burger",
    qty: 120,
    revenue: "Rs. 54,000",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=120&auto=format&fit=crop",
  },
  {
    name: "Pepperoni Pizza",
    qty: 95,
    revenue: "Rs. 85,500",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=120&auto=format&fit=crop",
  },
  {
    name: "Buff Momo",
    qty: 160,
    revenue: "Rs. 51,200",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=120&auto=format&fit=crop",
  },
];

const recentOrders = [
  { id: "#TH1250", customer: "John Doe", amount: "Rs. 2,500", status: "Completed" },
  { id: "#TH1249", customer: "Sarah Wilson", amount: "Rs. 1,800", status: "Preparing" },
  { id: "#TH1248", customer: "Michael Brown", amount: "Rs. 3,200", status: "Pending" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto">
        
        {/* TOP SECTION: PAGE HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
              Welcome back, Admin! 👋
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Here's what's happening in your restaurant today.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-4 py-2.5 rounded-xl shadow-sm text-slate-600 font-medium text-sm">
            <Calendar size={16} className="text-purple-500" />
            <span>May 01, 2026 - May 31, 2026</span>
          </div>
        </div>

        {/* METRICS SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { title: "Total Revenue", value: "Rs. 4,50,000", change: "↑ 18.6% this month", icon: <DollarSign size={22} />, color: "bg-purple-50 text-purple-600 border-purple-100/50" },
            { title: "Total Orders", value: "540", change: "↑ 12.4% this month", icon: <ShoppingBag size={22} />, color: "bg-blue-50 text-blue-600 border-blue-100/50" },
            { title: "Customers", value: "482", change: "↑ 15.3% this month", icon: <Users size={22} />, color: "bg-emerald-50 text-emerald-600 border-emerald-100/50" },
            { title: "Avg Order Value", value: "Rs. 1,200", change: "↑ 6.7% this month", icon: <TrendingUp size={22} />, color: "bg-orange-50 text-orange-600 border-orange-100/50" },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start justify-between transition hover:shadow-md">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  {card.title}
                </p>
                <h2 className="text-[26px] font-extrabold text-slate-900 mt-1.5 tracking-tight">
                  {card.value}
                </h2>
                <p className="text-emerald-500 text-xs font-semibold mt-1 flex items-center gap-0.5">
                  {card.change}
                </p>
              </div>
              <div className={`p-3.5 rounded-xl border ${card.color}`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* HIGH-PERFORMANCE DATA VISUALIZATION GRAPH GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* INTERACTIVE AREA CHART: REVENUE TRACKING */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[420px]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Revenue Overview</h2>
                <p className="text-slate-400 text-xs mt-0.5">Weekly breakdown total gross revenue run-rate</p>
              </div>
              <button className="bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition">
                By Day
              </button>
            </div>

            <div className="flex-1 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(v) => `Rs.${v/1000}k`} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff" }} 
                    formatter={(value) => [`Rs. ${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DOUGHNUT PIE CHART: ORDER FULFILLMENT BREAKDOWN */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[420px]">
            <div>
              <h2 className="text-base font-bold text-slate-900">Orders Overview</h2>
              <p className="text-slate-400 text-xs mt-0.5">Distribution by channel types</p>
            </div>

            <div className="flex-1 w-full h-[220px] relative my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Orders`]} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Absoluted Core Total Aggregate Visual Node */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transform translate-y-[-4px]">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</span>
                <span className="text-2xl font-black text-slate-800">540</span>
              </div>
            </div>

            {/* Micro-Badges Component List Grid Layout */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600 mt-2">
              {orderDistributionData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 border border-slate-50 p-2 rounded-xl bg-slate-50/50">
                  <span className="w-2.5 h-2.5 rounded-full block shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* LOWER DATA MATRIX SECTION GRID CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT AREA PANEL: TOP SELLING ITEMS GRID SECTION */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Top Selling Items</h2>
              <button className="text-purple-600 hover:text-purple-700 font-bold text-xs transition">View All</button>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-3 pl-4">Item</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right pr-4">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {topItems.map((item) => (
                    <tr key={item.name} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-3 pl-4">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-9 h-9 object-cover rounded-lg border border-slate-100" />
                          <span className="font-semibold text-slate-900 shrink-0">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center text-slate-500">{item.qty}</td>
                      <td className="p-3 text-right pr-4 text-slate-900 font-bold">{item.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CENTER AREA PANEL: RECENT CUSTOMER LIVE DISPATCH MATRICES */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
              <button className="text-purple-600 hover:text-purple-700 font-bold text-xs transition">View All</button>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-3.5 pl-4">Order ID</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5 text-right pr-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-3.5 pl-4 font-bold text-purple-600">{order.id}</td>
                      <td className="p-3.5 text-slate-900 font-semibold">{order.customer}</td>
                      <td className="p-3.5 text-slate-600 font-medium">{order.amount}</td>
                      <td className="p-3.5 text-right pr-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-block ${
                          order.status === "Completed" ? "bg-emerald-50 text-emerald-600" :
                          order.status === "Preparing" ? "bg-amber-50 text-amber-600" : 
                          "bg-blue-50 text-blue-600"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT AREA PANEL: LIVE OPERATIONAL ACTION REMINDERS BLOCK */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Layers size={18} className="text-purple-500" /> Reminders
            </h2>
            
            <div className="space-y-2.5">
              {[
                { label: "Upcoming Reservations", icon: <Calendar size={15} />, color: "bg-purple-50 text-purple-600 border-purple-100" },
                { label: "Low Stock Items", icon: <AlertTriangle size={15} />, color: "bg-red-50 text-red-600 border-red-100" },
                { label: "New Reviews Pending", icon: <Star size={15} />, color: "bg-amber-50 text-amber-600 border-amber-100" },
                { label: "Pending Payments", icon: <CreditCard size={15} />, color: "bg-blue-50 text-blue-600 border-blue-100" },
              ].map((reminder) => (
                <button 
                  key={reminder.label} 
                  className="w-full bg-white border border-slate-200/60 hover:border-slate-300 rounded-xl p-3 flex items-center justify-between text-xs font-semibold text-slate-700 transition hover:bg-slate-50/50 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-2 rounded-lg border ${reminder.color}`}>
                      {reminder.icon}
                    </div>
                    <span className="truncate">{reminder.label}</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}