import React, { useState, useEffect } from"react";
import { ArrowLeft, Search, Clock, User, ShieldAlert, Monitor, Download, Filter } from"lucide-react";
import { useNavigate } from"react-router-dom";
import apiClient from"../../api/apiClient";

const UserLog = () => {
 const navigate = useNavigate();
 const [searchTerm, setSearchTerm] = useState("");
 const [roleFilter, setRoleFilter] = useState("All");
 const [logs, setLogs] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchLogs = async () => {
 setLoading(true);
 try {
 const { data } = await apiClient.get("/api/logs");
 const formattedData = data.map(log => ({
 id: log._id,
 user: log.user,
 role: log.role,
 action: log.action,
 device: log.device,
 ip: log.ip,
 status: log.status,
 time: new Date(log.createdAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
 date: new Date(log.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })
 }));
 setLogs(formattedData);
 } catch (error) {
 console.error("Error fetching logs:", error);
 }
 setLoading(false);
 };

 fetchLogs();
 }, []);

 const filteredLogs = logs.filter((log) => {
 const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
 log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
 log.ip.includes(searchTerm);
 const matchesRole = roleFilter ==="All" || log.role === roleFilter;
 
 return matchesSearch && matchesRole;
 });

 return (
 <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
 <main className="max-w-[1600px] mx-auto">
 
 {/* Header Section */}
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
 <div className="flex items-center gap-4">
 <button
 onClick={() => navigate(-1)}
 className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm hover:bg-slate-50 transition"
 >
 <ArrowLeft size={18} className="text-slate-600" />
 </button>
 <div>
 <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">System Activity Logs</h1>
 <p className="text-slate-400 text-sm mt-0.5 font-medium">Dashboard <span className="mx-1.5 text-slate-300">&gt;</span> Settings <span className="mx-1.5 text-slate-300">&gt;</span> Activity Logs</p>
 </div>
 </div>
 
 <button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all">
 <Download size={16} /> Export Logs
 </button>
 </div>

 {/* Quick Stats Grid */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
 <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
 <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
 <User size={22} />
 </div>
 <div>
 <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Actions</h4>
 <h2 className="text-2xl font-black text-slate-900 mt-1">{logs.length}</h2>
 </div>
 </div>

 <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
 <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
 <ShieldAlert size={22} />
 </div>
 <div>
 <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Failed Logins</h4>
 <h2 className="text-2xl font-black text-slate-900 mt-1">
 {logs.filter(l => l.status ==="Failed").length}
 </h2>
 </div>
 </div>
 </div>

 {/* Main Log Table Workspace */}
 <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
 
 {/* Controls Bar */}
 <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
 <div className="relative w-full md:max-w-md">
 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
 <input
 type="text"
 placeholder="Search user, action, or IP Address..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 transition-all placeholder:text-slate-400 shadow-sm font-medium"
 />
 </div>

 <div className="flex items-center gap-3 w-full md:w-auto">
 <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1 shadow-sm">
 <Filter size={16} className="text-slate-400" />
 <select
 value={roleFilter}
 onChange={(e) => setRoleFilter(e.target.value)}
 className="bg-transparent text-slate-700 text-sm py-1.5 outline-none font-semibold cursor-pointer"
 >
 <option value="All">All Roles</option>
 <option value="Admin">Admin</option>
 <option value="Chef">Chef</option>
 <option value="Cashier">Cashier</option>
 <option value="Waiter">Waiter</option>
 </select>
 </div>
 </div>
 </div>

 {/* Logs Data Table */}
 <div className="overflow-x-auto min-h-[400px]">
 <table className="w-full text-left border-collapse min-w-[700px]">
 <thead className="bg-white text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-100">
 <tr>
 <th className="p-4 pl-6">Timestamp</th>
 <th className="p-4">User</th>
 <th className="p-4">Action Event</th>
 <th className="p-4">Device / IP</th>
 <th className="p-4 pr-6 text-right">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-sm">
 {loading ? (
 <tr>
 <td colSpan="5" className="text-center py-16 text-slate-400 font-medium">
 <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin mx-auto mb-3" />
 Loading Logs...
 </td>
 </tr>
 ) : filteredLogs.length === 0 ? (
 <tr>
 <td colSpan="5" className="text-center py-16 text-slate-400 font-medium">
 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
 <Search size={24} className="text-slate-300" />
 </div>
 No logs found matching your criteria.
 </td>
 </tr>
 ) : (
 filteredLogs.map((log) => (
 <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
 {/* Timestamp */}
 <td className="p-4 pl-6">
 <div className="font-bold text-slate-900 flex items-center gap-1.5">
 <Clock size={14} className="text-slate-400" /> {log.time}
 </div>
 <div className="text-xs text-slate-500 font-medium mt-0.5 ml-5">{log.date}</div>
 </td>
 
 {/* User Info */}
 <td className="p-4">
 <div className="font-bold text-slate-900">{log.user}</div>
 <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{log.role}</div>
 </td>

 {/* Action */}
 <td className="p-4 font-semibold text-slate-700">
 {log.action}
 </td>

 {/* Device / IP */}
 <td className="p-4">
 <div className="font-semibold text-slate-700 flex items-center gap-1.5">
 <Monitor size={14} className="text-slate-400" /> {log.device}
 </div>
 <div className="text-xs text-slate-500 font-medium mt-0.5 ml-5">{log.ip}</div>
 </td>

 {/* Status */}
 <td className="p-4 pr-6 text-right">
 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${log.status ==="Success" ?"bg-emerald-50 text-emerald-600 border-emerald-100" :"bg-rose-50 text-rose-600 border-rose-100"}`}>
 {log.status}
 </span>
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

export default UserLog;
