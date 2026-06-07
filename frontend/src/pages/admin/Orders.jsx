import React, { useState } from "react";
import {
  Search,
  Plus,
  Package,
  CheckCircle2,
  Hourglass,
  Truck,
} from "lucide-react";
import { useOrders } from "../../context/OrderContext";

import "../../styles/orders.css"; // Kept for any global custom overrides

const Orders = () => {
  const { orders = [] } = useOrders();
  const [activeFilter, setActiveFilter] = useState("All Orders");
  const [searchTerm, setSearchTerm] = useState("");

  const formattedOrders = orders
    .map((o, i) => {
      const subtotal = (o.items || []).reduce(
        (sum, item) => sum + item.qty * item.price,
        0
      );
      const total =
        o.amount !== undefined ? o.amount : subtotal + (subtotal > 0 ? 50 : 0);
      const avatarColors = [
        "bg-blue-500",
        "bg-emerald-500",
        "bg-purple-500",
        "bg-orange-500",
      ];
      return {
        id: o.id,
        customer: o.customer || "Guest",
        phone: o.phone || "N/A",
        avatarColor: avatarColors[i % avatarColors.length],
        items: (o.items || []).map(
          () =>
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80"
        ), // Fallback item image
        type: o.channel || "Dine In",
        amount: `Rs. ${total.toLocaleString()}`,
        status: o.status,
        time: o.time || "N/A",
      };
    })
    .reverse();

  // Logic to filter the orders based on tabs and search box
  const filteredOrders = formattedOrders.filter((order) => {
    const matchesFilter =
      activeFilter === "All Orders"
        ? true
        : activeFilter === "Preparing"
        ? order.status === "Cooking" || order.status === "Ready"
        : order.status === activeFilter;

    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto">
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
              Orders
            </h1>
            <p className="text-slate-400 text-sm mt-0.5 font-medium">
              Dashboard <span className="mx-1.5 text-slate-300">&gt;</span>{" "}
              Orders
            </p>
          </div>
          <button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all">
            <Plus size={16} /> New Order
          </button>
        </div>

        {/* METRICS & STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {/* Stat Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
              <Package size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Total Orders
              </h4>
              <div className="flex items-end gap-2 mt-1">
                <h2 className="text-2xl font-black text-slate-900">
                  {formattedOrders.length}
                </h2>
                <span className="text-xs font-bold text-slate-400 mb-1">
                  0%
                </span>
              </div>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Completed
              </h4>
              <div className="flex items-end gap-2 mt-1">
                <h2 className="text-2xl font-black text-slate-900">
                  {
                    formattedOrders.filter((o) => o.status === "Completed")
                      .length
                  }
                </h2>
                <span className="text-xs font-bold text-slate-400 mb-1">
                  0%
                </span>
              </div>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <Hourglass size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Pending
              </h4>
              <div className="flex items-end gap-2 mt-1">
                <h2 className="text-2xl font-black text-slate-900">
                  {formattedOrders.filter((o) => o.status === "Pending").length}
                </h2>
                <span className="text-xs font-bold text-slate-400 mb-1">
                  0%
                </span>
              </div>
            </div>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Delivery
              </h4>
              <div className="flex items-end gap-2 mt-1">
                <h2 className="text-2xl font-black text-slate-900">
                  {formattedOrders.filter((o) => o.type === "Delivery").length}
                </h2>
                <span className="text-xs font-bold text-slate-400 mb-1">
                  0%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE WORKSPACE COMPONENT */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Top Controls Bar */}
          <div className="p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
            {/* Nav Tabs */}
            <div className="flex bg-slate-50 p-1 rounded-xl">
              {["All Orders", "Pending", "Preparing", "Completed"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      activeFilter === tab
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search order..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400 transition-all placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-5 pl-6 border-b border-slate-100">
                    Order ID
                  </th>
                  <th className="p-5 border-b border-slate-100">Customer</th>
                  <th className="p-5 border-b border-slate-100">Items</th>
                  <th className="p-5 border-b border-slate-100">Type</th>
                  <th className="p-5 border-b border-slate-100">Amount</th>
                  <th className="p-5 border-b border-slate-100">Status</th>
                  <th className="p-5 pr-6 border-b border-slate-100">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-12 text-slate-400 font-medium"
                    >
                      No orders found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    >
                      {/* ID Column */}
                      <td className="p-5 pl-6 font-bold text-slate-900">
                        {order.id}
                      </td>

                      {/* Customer Column */}
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${order.avatarColor} shadow-sm`}
                          >
                            {order.customer.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">
                              {order.customer}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              {order.phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Overlapping Items Array Column */}
                      <td className="p-5">
                        <div className="flex -space-x-2.5">
                          {order.items.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="Food Item"
                              className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm relative hover:z-10 transition-transform hover:scale-110"
                            />
                          ))}
                        </div>
                      </td>

                      {/* Type Column */}
                      <td className="p-5 font-semibold text-slate-600">
                        {order.type}
                      </td>

                      {/* Amount Column */}
                      <td className="p-5 font-bold text-slate-900">
                        {order.amount}
                      </td>

                      {/* Status Pills Column */}
                      <td className="p-5">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide ${
                            order.status === "Completed"
                              ? "bg-emerald-50 text-emerald-600"
                              : order.status === "Preparing"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-orange-50 text-orange-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* Time Column */}
                      <td className="p-5 pr-6 font-semibold text-slate-500">
                        {order.time}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Orders;
