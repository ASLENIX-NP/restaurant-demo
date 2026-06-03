import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Plus, 
  Users, 
  CheckCircle2, 
  ChefHat, 
  XCircle, 
  Edit2, 
  Trash2, 
  X,
  CalendarCheck
} from "lucide-react";
import { registerUser, getUsers } from "../../services/authService";

import "../../styles/employees.css"; // Kept for any global custom overrides

const Employees = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    username: "",
    password: "",
    name: "",
    role: "",
    shift: "",
    email: "",
    phone: "",
    salary: "",
    status: "Active",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getUsers();
      setEmployees(data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleDelete = (index) => {
    if (window.confirm("Delete functionality not fully implemented on backend yet. Remove locally?")) {
      const updated = employees.filter((_, i) => i !== index);
      setEmployees(updated);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmployee.username || !newEmployee.password || !newEmployee.role) {
      alert("Username, password, and role are required");
      return;
    }

    try {
      const response = await registerUser(newEmployee);
      alert("Employee registered successfully!");
      setEmployees([...employees, response.user || newEmployee]);
      setShowModal(false);
      setNewEmployee({
        username: "",
        password: "",
        name: "",
        role: "",
        shift: "",
        email: "",
        phone: "",
        salary: "",
        status: "Active",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
      });
      fetchEmployees();
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Failed to register employee");
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase()) ||
      employee.role.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "All" || employee.role === roleFilter;
    const matchesStatus = statusFilter === "All" || employee.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Metric Computations
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const inactiveEmployees = employees.filter((e) => e.status === "Inactive").length;
  const kitchenStaff = employees.filter((e) => e.role === "Chef").length;

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Employees</h1>
            <p className="text-slate-400 text-sm mt-0.5 font-medium">
              Dashboard <span className="mx-1.5 text-slate-300">&gt;</span> Employees
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/admin/attendance")}
              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
            >
              <CalendarCheck size={16} /> Attendance
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
            >
              <Plus size={16} /> Add Employee
            </button>
          </div>
        </div>

        {/* METRICS & STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {/* Total Employees */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Employees</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">{totalEmployees}</h2>
            </div>
          </div>

          {/* Active Staff */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Staff</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">{activeEmployees}</h2>
            </div>
          </div>

          {/* Kitchen Staff */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <ChefHat size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Kitchen Staff</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">{kitchenStaff}</h2>
            </div>
          </div>

          {/* Inactive Staff */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <XCircle size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Inactive</h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">{inactiveEmployees}</h2>
            </div>
          </div>
        </div>

        {/* MAIN DATA TABLE SECTION */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          
          {/* Controls & Filters Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
            <div className="relative w-full sm:max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-400 transition-all placeholder:text-slate-400 shadow-sm"
              />
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-600 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-purple-400 font-medium shadow-sm flex-1 sm:flex-none cursor-pointer"
              >
                <option value="All">All Roles</option>
                <option value="Manager">Manager</option>
                <option value="Chef">Chef</option>
                <option value="Cashier">Cashier</option>
                <option value="Waiter">Waiter</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-600 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-purple-400 font-medium shadow-sm flex-1 sm:flex-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="p-4 pl-6">Employee</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Shift</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Salary</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-slate-400 font-medium">
                      No employees match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img 
                            src={employee.image} 
                            alt={employee.name} 
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900">{employee.name}</h4>
                            <p className="text-xs text-slate-500 font-medium">{employee.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">{employee.role}</td>
                      <td className="p-4 font-medium text-slate-500">{employee.shift}</td>
                      <td className="p-4 font-medium text-slate-500">{employee.phone}</td>
                      <td className="p-4 font-bold text-slate-900">{employee.salary}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider border ${
                          employee.status === "Active" 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                            : "bg-rose-50 text-rose-600 border-rose-200"
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => alert(`Edit ${employee.name}`)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(index)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* ADD EMPLOYEE MODAL OVERLAY */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-slide-in">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Plus size={18} className="text-purple-500"/>
                Add New Employee
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-lg border border-slate-200 shadow-sm transition">
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Username *</label>
                  <input 
                    type="text" 
                    required 
                    value={newEmployee.username} 
                    onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })} 
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                    placeholder="e.g. janedoe"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password *</label>
                  <input 
                    type="password" 
                    required 
                    value={newEmployee.password} 
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })} 
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    value={newEmployee.name} 
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} 
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                    placeholder="e.g. Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                  <input 
                    type="email" 
                    value={newEmployee.email} 
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} 
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                    placeholder="name@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input 
                    type="text" 
                    value={newEmployee.phone} 
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })} 
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                    placeholder="+977 98..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Salary</label>
                  <input 
                    type="text" 
                    value={newEmployee.salary} 
                    onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })} 
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                    placeholder="e.g. Rs. 30,000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Role *</label>
                  <select 
                    required
                    value={newEmployee.role} 
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm cursor-pointer"
                  >
                    <option value="" disabled>Select Role</option>
                    <option value="Manager">Manager</option>
                    <option value="Chef">Chef</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Waiter">Waiter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Shift</label>
                  <select 
                    value={newEmployee.shift} 
                    onChange={(e) => setNewEmployee({ ...newEmployee, shift: e.target.value })}
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm cursor-pointer"
                  >
                    <option value="" disabled>Select Shift</option>
                    <option value="Morning">Morning</option>
                    <option value="Day">Day</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 mt-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 shadow-md transition"
                >
                  Save Employee
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Employees;