import React, { useState, useEffect } from"react";
import { Search, Plus, UserPlus, X } from"lucide-react";
import apiClient from"../../api/apiClient";

const Customers = () => {
 const [customers, setCustomers] = useState([]);
 const [search, setSearch] = useState("");
 const [loading, setLoading] = useState(true);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [newCustomer, setNewCustomer] = useState({ name:"", phone:"", email:"" });
 const [saving, setSaving] = useState(false);

 useEffect(() => {
 fetchCustomers();
 }, []);

 const fetchCustomers = async () => {
 try {
 const { data } = await apiClient.get("/api/customers");
 setCustomers(data);
 } catch (error) {
 console.error("Failed to fetch customers", error);
 } finally {
 setLoading(false);
 }
 };

 const handleAddCustomer = async (e) => {
 e.preventDefault();
 setSaving(true);
 try {
 await apiClient.post("/api/customers", newCustomer);
 setIsModalOpen(false);
 setNewCustomer({ name:"", phone:"", email:"" });
 fetchCustomers();
 } catch (error) {
 console.error("Failed to add customer", error);
 alert(error.response?.data?.message ||"Error adding customer");
 } finally {
 setSaving(false);
 }
 };

 const filteredCustomers = customers.filter(c => 
 c.name?.toLowerCase().includes(search.toLowerCase()) || 
 c.phone?.includes(search)
 );

 return (
 <div className="p-6">
 <div className="flex justify-between items-center mb-6">
 <div>
 <h1 className="text-3xl font-bold text-slate-900">Loyalty & Customers</h1>
 <p className="text-slate-500">Track returning guests and points</p>
 </div>
 <button 
 onClick={() => setIsModalOpen(true)}
 className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm flex items-center gap-2 transition"
 >
 <UserPlus size={18} /> Add Customer
 </button>
 </div>

 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
 <div className="relative w-full md:w-1/2 mb-6">
 <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
 <input 
 type="text" 
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Search by phone number or name..." 
 className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 transition font-medium"
 />
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left whitespace-nowrap">
 <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
 <tr>
 <th className="p-4 rounded-tl-xl">Name</th>
 <th className="p-4">Phone Number</th>
 <th className="p-4">Total Visits</th>
 <th className="p-4">Loyalty Points</th>
 <th className="p-4 rounded-tr-xl">Last Visit</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-sm">
 {loading ? (
 <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-medium">Loading customers...</td></tr>
 ) : filteredCustomers.length === 0 ? (
 <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-medium">No customers found.</td></tr>
 ) : (
 filteredCustomers.map((customer) => (
 <tr key={customer._id} className="hover:bg-slate-50 transition">
 <td className="p-4 font-semibold text-slate-800">{customer.name}</td>
 <td className="p-4 text-slate-600">{customer.phone}</td>
 <td className="p-4 text-slate-600">{customer.totalVisits}</td>
 <td className="p-4 font-bold text-blue-600">{customer.loyaltyPoints} pts</td>
 <td className="p-4 text-slate-600">{customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString() :'N/A'}</td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* Add Customer Modal */}
 {isModalOpen && (
 <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
 <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
 <div className="flex justify-between items-center p-6 border-b border-slate-100">
 <h2 className="text-xl font-bold text-slate-800">Add New Customer</h2>
 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
 <X size={20} />
 </button>
 </div>
 <form onSubmit={handleAddCustomer} className="p-6">
 <div className="space-y-4">
 <div>
 <label className="block text-sm font-semibold text-slate-600 mb-1">Full Name</label>
 <input 
 required
 type="text" 
 value={newCustomer.name}
 onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
 className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
 placeholder="John Doe"
 />
 </div>
 <div>
 <label className="block text-sm font-semibold text-slate-600 mb-1">Phone Number</label>
 <input 
 required
 type="tel" 
 value={newCustomer.phone}
 onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
 className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
 placeholder="+977 98..."
 />
 </div>
 <div>
 <label className="block text-sm font-semibold text-slate-600 mb-1">Email (Optional)</label>
 <input 
 type="email" 
 value={newCustomer.email}
 onChange={e => setNewCustomer({...newCustomer, email: e.target.value})}
 className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
 placeholder="john@example.com"
 />
 </div>
 </div>
 <div className="mt-8 flex gap-3">
 <button 
 type="button" 
 onClick={() => setIsModalOpen(false)}
 className="flex-1 px-4 py-2 text-slate-600 font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg transition"
 >
 Cancel
 </button>
 <button 
 type="submit" 
 disabled={saving}
 className="flex-1 px-4 py-2 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
 >
 {saving ?'Saving...' :'Save Customer'}
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
};

export default Customers;
