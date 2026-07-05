import React, { useState, useEffect } from "react";
import {
  Search, Plus, Users, CheckCircle2, ChefHat, XCircle as XCircleIcon, LayoutGrid, List, Filter, AlertTriangle
} from "lucide-react";

import "../../styles/employees.css";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";

import EmployeeCard from "../../components/admin/EmployeeCard";
import EmployeeList from "../../components/admin/EmployeeList";
import EmployeeModal from "../../components/admin/EmployeeModal";
import { useSocket } from "../../context/SocketContext";

const Employees = () => {
  const socket = useSocket();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newEmployee, setNewEmployee] = useState({
    username: "",
    password: "",
    name: "",
    role: "Staff",
    shift: "Morning",
    email: "",
    phone: "",
    salary: "",
    status: "Active",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get("/api/auth/users");
        setEmployees(data.users || data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();

    if (socket) {
      const handleNewRegistration = (data) => {
        if (data.user) {
          setEmployees((prev) => {
            const exists = prev.find(e => e.username === data.user.username);
            if (!exists) {
              toast(`New registration: ${data.user.username} is awaiting approval.`, { icon: "👋" });
              return [data.user, ...prev];
            }
            return prev;
          });
        }
      };
      
      socket.on("newRegistration", handleNewRegistration);
      
      return () => {
        socket.off("newRegistration", handleNewRegistration);
      };
    }
  }, [socket]);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Name (A - Z)");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [employeeToReject, setEmployeeToReject] = useState(null);

  const handleDeleteClick = (id) => {
    setEmployeeToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await apiClient.delete(`/api/auth/users/${employeeToDelete}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== employeeToDelete));
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
      toast.success("Employee deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleRejectClick = (id) => {
    setEmployeeToReject(id);
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (!employeeToReject) return;
    try {
      await apiClient.delete(`/api/auth/users/${employeeToReject}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== employeeToReject));
      setShowRejectModal(false);
      setEmployeeToReject(null);
      toast.success("User rejected and data deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleApproveClick = async (id) => {
    try {
      const response = await apiClient.put(`/api/auth/users/${id}/status`, { status: "Active" });
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === id ? { ...emp, status: "Active" } : emp))
      );
      toast.success("User successfully approved and activated.");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };



  const handleOpenEdit = (employee) => {
    setIsEditing(true);
    setEditEmployeeId(employee._id);
    setNewEmployee({
      username: employee.username, password: "", name: employee.name, role: employee.role, shift: employee.shift, email: employee.email, phone: employee.phone, salary: employee.salary, status: employee.status, image: employee.image,
    });
    setShowModal(true);
  };

  const handleSaveEmployee = async () => {
    try {
      if (isEditing) {
        await apiClient.put(`/api/auth/users/${editEmployeeId}`, newEmployee);
        setEmployees((prev) =>
          prev.map((emp) => (emp._id === editEmployeeId ? { ...emp, ...newEmployee } : emp))
        );
        toast.success("Employee updated successfully!");
      } else {
        const payload = {
          ...newEmployee,
          password: "password123", // Default password for new employees
          confirmPassword: "password123"
        };
        const { data } = await apiClient.post("/api/auth/users", payload);
        setEmployees((prev) => [...prev, data.user]);
        toast.success(data.message || "Employee added successfully!");
      }
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const filteredEmployees = employees
    .filter((employee) => {
      const safeSearch = search || "";
      const safeName = employee?.name || "";
      const safeRole = employee?.role || "";
      const matchesSearch =
        safeName.toLowerCase().includes(safeSearch.toLowerCase()) ||
        safeRole.toLowerCase().includes(safeSearch.toLowerCase());
      const matchesRole = roleFilter === "All" || employee?.role === roleFilter;
      const matchesStatus = statusFilter === "All" || employee?.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "Name (A - Z)") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "Name (Z - A)") return (b.name || "").localeCompare(a.name || "");
      if (sortBy === "Newest First") return (b._id || "").localeCompare(a._id || "");
      return 0;
    });

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const inactiveEmployees = employees.filter((e) => e.status === "Inactive").length;
  const kitchenStaff = employees.filter((e) => e.role === "Chef").length;

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto min-h-screen bg-slate-50/50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="text-indigo-600" size={32} />
            Team Members
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage your restaurant staff, roles, and permissions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
            <Users size={24} />
          </div>
          <div>
            <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Total Employees</h4>
            <h2 className="text-2xl font-black text-slate-900 leading-none">{totalEmployees}</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Active Staff</h4>
            <h2 className="text-2xl font-black text-slate-900 leading-none">{activeEmployees}</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm">
            <ChefHat size={24} />
          </div>
          <div>
            <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Kitchen Staff</h4>
            <h2 className="text-2xl font-black text-slate-900 leading-none">{kitchenStaff}</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm">
            <XCircleIcon size={24} />
          </div>
          <div>
            <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Inactive Staff</h4>
            <h2 className="text-2xl font-black text-slate-900 leading-none">{inactiveEmployees}</h2>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 flex flex-col xl:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 block pl-11 p-3 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              <LayoutGrid size={18} />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              <List size={18} />
            </button>
          </div>

          <div className="relative min-w-[140px] flex-1 sm:flex-none">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 block pl-10 p-3 outline-none appearance-none cursor-pointer transition-all">
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Chef">Chef</option>
              <option value="Staff">Staff</option>
              <option value="Cashier">Cashier</option>
            </select>
          </div>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 block p-3 outline-none appearance-none cursor-pointer transition-all">
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Loading team members...</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 border-dashed">
              <Users size={48} className="text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No employees match your search criteria.</p>
            </div>
          ) : (
            filteredEmployees.map((employee) => (
              <EmployeeCard key={employee._id || employee.tempId} employee={employee} handleRejectClick={handleRejectClick} handleApproveClick={handleApproveClick} handleOpenEdit={handleOpenEdit} handleDeleteClick={handleDeleteClick} />
            ))
          )}
        </div>
      ) : (
        <EmployeeList filteredEmployees={filteredEmployees} handleRejectClick={handleRejectClick} handleApproveClick={handleApproveClick} handleOpenEdit={handleOpenEdit} handleDeleteClick={handleDeleteClick} />
      )}

      <EmployeeModal showModal={showModal} setShowModal={setShowModal} isEditing={isEditing} newEmployee={newEmployee} setNewEmployee={setNewEmployee} handleSaveEmployee={handleSaveEmployee} />

      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center animate-slide-in">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={28} className="text-rose-500" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Reject Application?</h2>
            <p className="text-sm text-slate-500 font-medium mb-8">Are you sure you want to reject this user? Their data will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => { setShowRejectModal(false); setEmployeeToReject(null); }} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleConfirmReject} className="flex-1 bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 shadow-md shadow-rose-200 transition">Yes, Reject</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center animate-slide-in">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={28} className="text-rose-500" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Delete Employee?</h2>
            <p className="text-sm text-slate-500 font-medium mb-8">Are you sure you want to remove this employee? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteModal(false); setEmployeeToDelete(null); }} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleConfirmDelete} className="flex-1 bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 shadow-md shadow-rose-200 transition">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
