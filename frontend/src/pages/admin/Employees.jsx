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
  AlertTriangle,
  Mail,
  Phone,
  Clock,
  Banknote,
  LayoutGrid,
  List,
  Filter,
} from "lucide-react";
import {
  getPendingApplications,
  savePendingApplications,
  getUsers,
  saveUsers,
} from "../../utils/users";

import "../../styles/employees.css"; // Kept for any global custom overrides

const Employees = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState(() => {
    const savedEmployees = localStorage.getItem("restaurant_employees");
    if (savedEmployees) {
      return JSON.parse(savedEmployees);
    }

    return [
      {
        tempId: "emp-1",
        username: "johndoe",
        name: "John Doe",
        role: "Manager",
        shift: "Morning",
        email: "john.doe@example.com",
        phone: "+977 9812345678",
        salary: "Rs. 45,000",
        status: "Active",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        tempId: "emp-2",
        username: "sarahsmith",
        name: "Sarah Smith",
        role: "Chef",
        shift: "Evening",
        email: "sarah.smith@example.com",
        phone: "+977 9823456789",
        salary: "Rs. 60,000",
        status: "Active",
        image: "https://randomuser.me/api/portraits/women/2.jpg",
      },
      {
        tempId: "emp-3",
        username: "mikejones",
        name: "Mike Jones",
        role: "Waiter",
        shift: "Day",
        email: "mike.jones@example.com",
        phone: "+977 9834567890",
        salary: "Rs. 25,000",
        status: "Inactive",
        image: "https://randomuser.me/api/portraits/men/3.jpg",
      },
      {
        tempId: "emp-4",
        username: "emilydavis",
        name: "Emily Davis",
        role: "Cashier",
        shift: "Morning",
        email: "emily.davis@example.com",
        phone: "+977 9845678901",
        salary: "Rs. 30,000",
        status: "Active",
        image: "https://randomuser.me/api/portraits/women/4.jpg",
      },
    ];
  });

  const [pendingApplications, setPendingApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("Newest First");

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    setPendingApplications(getPendingApplications() || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("restaurant_employees", JSON.stringify(employees));
  }, [employees]);

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

  const handleDeleteClick = (employeeId) => {
    setEmployeeToDelete(employeeId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const updated = employees.filter(
      (emp) => (emp._id || emp.id || emp.tempId) !== employeeToDelete
    );
    setEmployees(updated);
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const handleApproveApplication = (applicationId) => {
    const application = pendingApplications.find((app) => app.id === applicationId);
    if (!application) return;

    const updatedPending = pendingApplications.filter((app) => app.id !== applicationId);
    savePendingApplications(updatedPending);
    setPendingApplications(updatedPending);

    let normalizedRole = application.role?.toLowerCase() || "staff";
    if (normalizedRole === "manager") normalizedRole = "admin";
    if (normalizedRole === "waiter") normalizedRole = "staff";

    const users = getUsers() || [];
    const updatedUsers = [
      ...users,
      {
        username: application.username,
        password: application.password,
        role: normalizedRole,
      },
    ];
    
    saveUsers(updatedUsers);
    try {
      // Fallback direct storage sync
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    } catch(e) {}

    const approvedEmployee = {
      tempId: `app-${Date.now()}`,
      username: application.username,
      name: application.name,
      role: application.role,
      shift: application.shift || "Day",
      email: application.email,
      phone: application.phone,
      salary: application.salary || "Rs. 25,000",
      status: "Active",
      image: application.image || "https://randomuser.me/api/portraits/lego/1.jpg",
    };

    setEmployees((prev) => [...prev, approvedEmployee]);
  };

  const handleRejectApplication = (applicationId) => {
    const updatedPending = pendingApplications.filter((app) => app.id !== applicationId);
    savePendingApplications(updatedPending);
    setPendingApplications(updatedPending);
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingId(null);
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
    setShowModal(true);
  };

  const handleOpenEdit = (employee) => {
    setIsEditing(true);
    setEditingId(employee._id || employee.id || employee.tempId);
    setNewEmployee({
      username: employee.username || "",
      password: "",
      name: employee.name || "",
      role: employee.role || "",
      shift: employee.shift || "",
      email: employee.email || "",
      phone: employee.phone || "",
      salary: employee.salary || "",
      status: employee.status || "Active",
      image: employee.image || "https://randomuser.me/api/portraits/men/1.jpg",
    });
    setShowModal(true);
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();

    if (isEditing) {
      const updatedList = employees.map((emp) => {
        if ((emp._id || emp.id || emp.tempId) === editingId) {
          const updatedEmp = { ...emp, ...newEmployee };
          if (!newEmployee.password) {
            updatedEmp.password = emp.password;
          }
          return updatedEmp;
        }
        return emp;
      });
      setEmployees(updatedList);

      const allUsers = getUsers() || [];
      let normalizedRole = newEmployee.role.toLowerCase();
      if (normalizedRole === "manager") normalizedRole = "admin";
      if (normalizedRole === "waiter") normalizedRole = "staff";

      const updatedUsers = allUsers.map(u => 
        u.username === newEmployee.username 
          ? { ...u, role: normalizedRole, ...(newEmployee.password ? { password: newEmployee.password } : {}) } 
          : u
      );
      saveUsers(updatedUsers);

      setShowModal(false);
    } else {
      if (!newEmployee.username || !newEmployee.password || !newEmployee.role) {
        alert("Username, password, and role are required");
        return;
      }
      const newEmpWithId = { ...newEmployee, tempId: `temp-${Date.now()}` };
      setEmployees([...employees, newEmpWithId]);
      
      const allUsers = getUsers() || [];
      let normalizedRole = newEmployee.role.toLowerCase();
      if (normalizedRole === "manager") normalizedRole = "admin";
      if (normalizedRole === "waiter") normalizedRole = "staff";

      saveUsers([
        ...allUsers, 
        { 
          username: newEmployee.username, 
          password: newEmployee.password, 
          role: normalizedRole 
        }
      ]);

      setShowModal(false);
    }
  };

  const processedEmployees = employees.filter((employee) => {
    const safeName = employee?.name || "";
    const safeEmail = employee?.email || "";
    const safeRole = employee?.role || "";
    const safeSearch = search || "";

    const matchesSearch =
      safeName.toLowerCase().includes(safeSearch.toLowerCase()) ||
      safeEmail.toLowerCase().includes(safeSearch.toLowerCase()) ||
      safeRole.toLowerCase().includes(safeSearch.toLowerCase());

    const matchesRole = roleFilter === "All" || employee?.role === roleFilter;
    const matchesStatus =
      statusFilter === "All" || employee?.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (sortBy === "Name (A - Z)") {
    processedEmployees.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  } else if (sortBy === "Name (Z - A)") {
    processedEmployees.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
  } else if (sortBy === "Newest First") {
    processedEmployees.reverse();
  }

  // Metric Computations
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const inactiveEmployees = employees.filter(
    (e) => e.status === "Inactive"
  ).length;
  const kitchenStaff = employees.filter((e) => e.role === "Chef").length;

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
      <main className="max-w-[1600px] mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
              Employees
            </h1>
            <p className="text-slate-400 text-sm mt-0.5 font-medium">
              Dashboard <span className="mx-1.5 text-slate-300">&gt;</span>{" "}
              Employees
            </p>
          </div>

          <div className="flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 outline-none font-semibold shadow-sm cursor-pointer"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 outline-none font-semibold shadow-sm cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="Chef">Chef</option>
              <option value="Cashier">Cashier</option>
              <option value="Staff">Staff</option>
            </select>
            <button
              onClick={handleOpenAdd}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
            >
              <Plus size={16} /> Add Employee
            </button>
          </div>
        </div>

        {pendingApplications.length > 0 && (
          <div className="mb-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Pending Employee Applications</h2>
                <p className="text-sm text-slate-500 mt-1">
                  New registration requests submitted by prospective staff.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingApplications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-3xl border border-slate-200 p-5 bg-slate-50 shadow-sm"
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {application.name}
                      </h3>
                      <p className="text-slate-500 text-sm">
                        @{application.username} · {application.role}
                      </p>
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-2xl">
                      Pending
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 mb-4">
                    <div>
                      <p className="font-semibold text-slate-800">Email</p>
                      <p>{application.email}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Phone</p>
                      <p>{application.phone}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Requested On</p>
                      <p>{new Date(application.requestedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Role</p>
                      <p>{application.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleApproveApplication(application.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-4 py-2 text-sm font-semibold transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectApplication(application.id)}
                      className="bg-white border border-slate-200 text-slate-700 rounded-2xl px-4 py-2 text-sm font-semibold hover:bg-slate-100 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* METRICS & STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Users size={24} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                Total Employees
              </h4>
              <h2 className="text-2xl font-black text-slate-900 leading-none">
                {totalEmployees}
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-1">
                All departments
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                Active Staff
              </h4>
              <h2 className="text-2xl font-black text-slate-900 leading-none">
                {activeEmployees}
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-1">
                Currently working
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                Pending Requests
              </h4>
              <h2 className="text-2xl font-black text-slate-900 leading-none">
                {pendingApplications.length}
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-1">
                Waiting for approval
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <ChefHat size={24} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                Kitchen Staff
              </h4>
              <h2 className="text-2xl font-black text-slate-900 leading-none">
                {kitchenStaff}
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-1">
                In kitchen
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <XCircle size={24} />
            </div>
            <div>
              <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                Inactive Staff
              </h4>
              <h2 className="text-2xl font-black text-slate-900 leading-none">
                {inactiveEmployees}
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-1">
                Not active
              </p>
            </div>
          </div>
        </div>

        {/* CONTROLS BAR (Search, Sort, Layout Toggles) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by name, role or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 transition-all placeholder:text-slate-400 shadow-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-500">
                Sort By
              </span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 outline-none font-medium shadow-sm cursor-pointer"
            >
              <option value="Newest First">Newest First</option>
              <option value="Name (A - Z)">Name (A - Z)</option>
              <option value="Name (Z - A)">Name (Z - A)</option>
              </select>
            </div>

            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        {viewMode === "grid" ? (
          // --- GRID VIEW (New UI) ---
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedEmployees.map((employee) => (
              <div
                key={employee._id || employee.tempId}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm relative group hover:shadow-md transition-all"
              >
                {/* Status Badge */}
                <span
                  className={`absolute top-5 left-5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    employee.status === "Active"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {employee.status}
                </span>

                {/* Header (Image + Name + Role) */}
                <div className="flex items-center gap-4 mt-8 mb-6">
                  <img
                    src={employee.image}
                    alt={employee.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">
                      {employee.name}
                    </h3>
                    <p className="text-blue-600 font-bold text-sm mt-0.5">
                      {employee.role}
                    </p>
                  </div>
                </div>

                {/* Details List */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                    <Mail size={16} className="text-slate-400" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                    <Phone size={16} className="text-slate-400" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                    <Clock size={16} className="text-slate-400" />
                    <span>{employee.shift} Shift</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                    <Banknote size={16} className="text-slate-400" />
                    <span>{employee.salary}</span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenEdit(employee)}
                    className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-wide hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50 shadow-sm"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteClick(
                        employee._id || employee.id || employee.tempId
                      )
                    }
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 shadow-sm transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // --- LIST VIEW (Old Table UI) ---
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-100">
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
              {processedEmployees.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-12 text-slate-400 font-medium"
                      >
                        No employees match your search criteria.
                      </td>
                    </tr>
                  ) : (
                processedEmployees.map((employee) => (
                      <tr
                        key={employee._id || employee.tempId}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={employee.image}
                              alt={employee.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                            />
                            <div>
                              <h4 className="font-bold text-slate-900">
                                {employee.name}
                              </h4>
                              <p className="text-xs text-slate-500 font-medium">
                                {employee.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-blue-600">
                          {employee.role}
                        </td>
                        <td className="p-4 font-medium text-slate-500">
                          {employee.shift}
                        </td>
                        <td className="p-4 font-medium text-slate-500">
                          {employee.phone}
                        </td>
                        <td className="p-4 font-bold text-slate-900">
                          {employee.salary}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                              employee.status === "Active"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : "bg-rose-50 text-rose-600 border-rose-200"
                            }`}
                          >
                            {employee.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEdit(employee)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteClick(
                                  employee._id || employee.tempId
                                )
                              }
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
        )}

        {/* PAGINATION FOOTER */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 text-sm text-slate-500 font-medium">
          <p>
            Showing 1 to {processedEmployees.length} of {totalEmployees}{" "}
            employees
          </p>
          <div className="flex items-center gap-1 mt-4 sm:mt-0">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-sm shadow-blue-200">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
              3
            </button>
            <span className="px-1">...</span>
            <button className="px-3 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors font-semibold text-slate-700">
              Next &gt;
            </button>
          </div>
        </div>
      </main>

      {/* --- ADD / EDIT EMPLOYEE MODAL (Kept Exactly As Your Original) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-slide-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                {isEditing ? (
                  <Edit2 size={18} className="text-blue-500" />
                ) : (
                  <Plus size={18} className="text-purple-500" />
                )}
                {isEditing ? "Edit Employee" : "Add New Employee"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-lg border border-slate-200 shadow-sm transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveEmployee} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmployee.username}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        username: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                    placeholder="e.g. janedoe"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Password {!isEditing && "*"}
                  </label>
                  <input
                    type="password"
                    required={!isEditing}
                    value={newEmployee.password}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        password: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                    placeholder={
                      isEditing ? "(Leave blank to keep unchanged)" : "••••••••"
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                    placeholder="e.g. Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                    placeholder="name@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    title="Please enter exactly 10 digits"
                    value={newEmployee.phone}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })
                    }
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                    placeholder="e.g. 9812345678"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Salary
                  </label>
                  <input
                    type="text"
                    value={newEmployee.salary}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, salary: e.target.value })
                    }
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                    placeholder="e.g. Rs. 30,000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Role *
                  </label>
                  <select
                    required
                    value={newEmployee.role}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, role: e.target.value })
                    }
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="Chef">Chef</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Shift
                  </label>
                  <select
                    value={newEmployee.shift}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, shift: e.target.value })
                    }
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Shift
                    </option>
                    <option value="Morning">Morning</option>
                    <option value="Day">Day</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={newEmployee.status}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, status: e.target.value })
                    }
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Profile Image URL
                  </label>
                  <input
                    type="text"
                    value={newEmployee.image}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, image: e.target.value })
                    }
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm"
                    placeholder="https://..."
                  />
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
                  {isEditing ? "Save Changes" : "Save Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-slide-in">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-rose-500" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">
              Delete Employee?
            </h2>
            <p className="text-sm text-slate-500 font-medium mb-6">
              Are you sure you want to remove this employee? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setEmployeeToDelete(null);
                }}
                className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 shadow-md shadow-rose-200 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;