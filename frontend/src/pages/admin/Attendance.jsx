import React, { useState, useMemo } from "react";
import {
  Search,
  Calendar,
  Clock,
  UserX,
  CheckCircle2,
  XCircle,
  Settings,
  Download,
  Filter,
  CalendarCheck,
  X,
} from "lucide-react";

const Attendance = () => {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("2024-05-22");
  const [department, setDepartment] = useState("All Departments");

  // New State for the detailed employee modal
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Mock Data
  const attendanceData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      role: "Manager",
      shift: "Morning",
      checkIn: "09:02 AM",
      checkInStatus: "On Time",
      checkOut: "06:12 PM",
      workHours: "9h 10m",
      status: "PRESENT",
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@example.com",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      role: "Chef",
      shift: "Evening",
      checkIn: "02:05 PM",
      checkInStatus: "On Time",
      checkOut: "10:15 PM",
      workHours: "8h 10m",
      status: "PRESENT",
    },
    {
      id: 3,
      name: "Mike Jones",
      email: "mike@example.com",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      role: "Waiter",
      shift: "Day",
      checkIn: "09:25 AM",
      checkInStatus: "Late",
      checkOut: "-",
      workHours: "-",
      status: "ABSENT",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      role: "Cashier",
      shift: "Morning",
      checkIn: "09:08 AM",
      checkInStatus: "On Time",
      checkOut: "06:05 PM",
      workHours: "8h 57m",
      status: "PRESENT",
    },
    // Adding extra dummy data to demonstrate scrolling
    {
      id: 5,
      name: "Alex Chen",
      email: "alex@example.com",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      role: "Chef",
      shift: "Morning",
      checkIn: "08:55 AM",
      checkInStatus: "On Time",
      checkOut: "05:00 PM",
      workHours: "8h 5m",
      status: "PRESENT",
    },
    {
      id: 6,
      name: "Maria Garcia",
      email: "maria@example.com",
      image: "https://randomuser.me/api/portraits/women/6.jpg",
      role: "Waiter",
      shift: "Evening",
      checkIn: "-",
      checkInStatus: "-",
      checkOut: "-",
      workHours: "-",
      status: "ON LEAVE",
    },
  ];

  const weeklySummary = [
    {
      id: 1,
      name: "John Doe",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      role: "Manager",
      days: [
        "present",
        "present",
        "present",
        "present",
        "present",
        "present",
        "present",
      ],
    },
    {
      id: 2,
      name: "Sarah Smith",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      role: "Chef",
      days: [
        "present",
        "present",
        "present",
        "present",
        "present",
        "present",
        "present",
      ],
    },
    {
      id: 3,
      name: "Mike Jones",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      role: "Waiter",
      days: ["absent", "late", "absent", "absent", "absent", "absent", "late"],
    },
    {
      id: 4,
      name: "Emily Davis",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      role: "Cashier",
      days: [
        "present",
        "absent",
        "present",
        "present",
        "present",
        "present",
        "present",
      ],
    },
    {
      id: 5,
      name: "Alex Chen",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      role: "Chef",
      days: [
        "present",
        "present",
        "present",
        "present",
        "present",
        "present",
        "present",
      ],
    },
    {
      id: 6,
      name: "Maria Garcia",
      image: "https://randomuser.me/api/portraits/women/6.jpg",
      role: "Waiter",
      days: [
        "leave",
        "leave",
        "present",
        "present",
        "present",
        "present",
        "present",
      ],
    },
  ];

  // Filtering logic for daily attendance table
  const filteredAttendance = useMemo(() => {
    return attendanceData.filter((emp) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        emp.name.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower);

      const getDepartment = (role) => {
        if (["Chef"].includes(role)) return "Kitchen";
        if (["Manager", "Waiter", "Cashier"].includes(role))
          return "Front of House";
        return "Other";
      };

      const matchesDept =
        department === "All Departments" ||
        getDepartment(emp.role) === department;

      // Note: Date filter is not applied as dummy data is for a single day.
      // In a real app, you would compare emp.date with the `date` state.

      return matchesSearch && matchesDept;
    });
  }, [search, department, attendanceData]);

  // Filtering logic for the weekly summary table
  const filteredWeeklySummary = useMemo(() => {
    return weeklySummary.filter((record) => {
      const searchLower = search.toLowerCase();
      return record.name.toLowerCase().includes(searchLower);
    });
  }, [search, weeklySummary]);

  // Export to CSV function
  const handleExport = () => {
    if (filteredAttendance.length === 0) {
      alert("No data to export for the current filters.");
      return;
    }

    const headers = [
      "ID",
      "Name",
      "Email",
      "Role",
      "Shift",
      "Check In",
      "Check In Status",
      "Check Out",
      "Work Hours",
      "Status",
    ];
    const csvRows = [
      headers.join(","),
      ...filteredAttendance.map((row) =>
        [
          row.id,
          `"${row.name}"`,
          row.email,
          row.role,
          row.shift,
          row.checkIn,
          row.checkInStatus,
          row.checkOut,
          row.workHours,
          row.status,
        ].join(",")
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_report_${date}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to render correct icon based on status
  const renderStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <CheckCircle2 size={18} className="text-emerald-500" />;
      case "absent":
        return <XCircle size={18} className="text-rose-500" />;
      case "late":
        return <Clock size={18} className="text-amber-500" />;
      case "leave":
        return <Calendar size={18} className="text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans relative">
      <main className="max-w-[1600px] mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
              Attendance
            </h1>
            <p className="text-slate-400 text-sm mt-0.5 font-medium">
              Dashboard <span className="mx-1.5 text-slate-300">&gt;</span>{" "}
              Attendance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all">
              <Settings size={16} /> Settings
            </button>
            <button
              onClick={handleExport}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
            >
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* METRICS CARDS */}
        {/* ... (Metrics cards remain exactly the same) ... */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <CalendarCheck size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Today Present
              </h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">4</h2>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <UserX size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Today Absent
              </h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">1</h2>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <Clock size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Late Arrivals
              </h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">1</h2>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
              <Calendar size={22} />
            </div>
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                On Leave
              </h4>
              <h2 className="text-2xl font-black text-slate-900 mt-1">1</h2>
            </div>
          </div>
        </div>

        {/* MAIN DATA SECTION - NOW SCROLLABLE */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col mb-8">
          <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
            {/* Filters remain the same */}
            <div className="flex gap-3">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm outline-none focus:border-purple-400 font-medium shadow-sm"
              />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="bg-white border border-slate-200 text-slate-600 text-sm rounded-xl px-4 py-2.5 outline-none shadow-sm cursor-pointer"
              >
                <option>All Departments</option>
                <option>Kitchen</option>
                <option>Front of House</option>
              </select>
            </div>
            <div className="relative flex-1 sm:max-w-xs">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none shadow-sm"
              />
            </div>
          </div>

          {/* ADDED SCROLLING HERE: max-h-[400px] overflow-y-auto */}
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto overscroll-contain relative">
            <table className="w-full text-left border-collapse">
              {/* ADDED STICKY HEADER: sticky top-0 z-10 */}
              <thead className="bg-white/95 backdrop-blur-sm text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="p-4 pl-6">Employee</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Shift</th>
                  <th className="p-4">Check In</th>
                  <th className="p-4">Check Out</th>
                  <th className="p-4">Work Hours</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAttendance.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-16 text-slate-400 font-medium"
                    >
                      No attendance records found for the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredAttendance.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.image}
                            alt={emp.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900">
                              {emp.name}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium">
                              {emp.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">
                        {emp.role}
                      </td>
                      <td className="p-4 font-medium text-slate-500">
                        {emp.shift}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">
                          {emp.checkIn}
                        </div>
                        <div
                          className={`text-[11px] font-bold mt-0.5 ${
                            emp.checkInStatus === "On Time"
                              ? "text-emerald-500"
                              : "text-rose-500"
                          }`}
                        >
                          {emp.checkInStatus}
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-600">
                        {emp.checkOut}
                      </td>
                      <td className="p-4 font-medium text-slate-600">
                        {emp.workHours}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider border ${
                            emp.status === "PRESENT"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : emp.status === "ON LEAVE"
                              ? "bg-purple-50 text-purple-600 border-purple-200"
                              : "bg-rose-50 text-rose-600 border-rose-200"
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM SECTION: SUMMARY & LEGEND */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Weekly Summary Grid - NOW SCROLLABLE AND CLICKABLE */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">
                Weekly Attendance Summary
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Click on any employee to view their detailed history.
              </p>
            </div>

            {/* ADDED SCROLLING HERE */}
            <div className="overflow-x-auto max-h-[350px] overflow-y-auto overscroll-contain relative">
              <table className="w-full text-left">
                {/* ADDED STICKY HEADER */}
                <thead className="bg-white/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
                  <tr className="text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-100">
                    <th className="p-4 pl-6">Employee</th>
                    <th className="p-4 text-center">May 16</th>
                    <th className="p-4 text-center">May 17</th>
                    <th className="p-4 text-center">May 18</th>
                    <th className="p-4 text-center">May 19</th>
                    <th className="p-4 text-center">May 20</th>
                    <th className="p-4 text-center">May 21</th>
                    <th className="p-4 text-center">May 22</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50">
                  {filteredWeeklySummary.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-16 text-slate-400 font-medium"
                      >
                        No employees match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredWeeklySummary.map((record) => (
                      // ADDED CLICK HANDLER & HOVER STYLES HERE
                      <tr
                        key={record.id}
                        onClick={() => setSelectedEmployee(record)}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <td className="p-4 pl-6 font-bold text-slate-700 flex items-center gap-3">
                          <img
                            src={record.image}
                            alt={record.name}
                            className="w-8 h-8 rounded-full border border-slate-200"
                          />
                          {record.name}
                        </td>
                        {record.days.map((status, j) => (
                          <td key={j} className="p-4 text-center">
                            <div className="flex justify-center">
                              {renderStatusIcon(status)}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-fit">
            <h3 className="font-bold text-slate-900 mb-4">Legend</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span className="text-sm font-medium text-slate-600">
                  Present
                </span>
              </div>
              <div className="flex items-center gap-3">
                <XCircle size={18} className="text-rose-500" />
                <span className="text-sm font-medium text-slate-600">
                  Absent
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-amber-500" />
                <span className="text-sm font-medium text-slate-600">Late</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-purple-500" />
                <span className="text-sm font-medium text-slate-600">
                  On Leave
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* DETAILED EMPLOYEE MODAL */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-slide-in">
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <img
                  src={selectedEmployee.image}
                  alt={selectedEmployee.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                />
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {selectedEmployee.name}
                  </h2>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">
                    {selectedEmployee.role} • Attendance Record
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body - Quick Stats */}
            <div className="p-6 bg-white">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <div className="text-2xl font-black text-emerald-500">
                    {
                      selectedEmployee.days.filter((d) => d === "present")
                        .length
                    }
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    Days Present
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <div className="text-2xl font-black text-rose-500">
                    {selectedEmployee.days.filter((d) => d === "absent").length}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    Days Absent
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <div className="text-2xl font-black text-amber-500">
                    {selectedEmployee.days.filter((d) => d === "late").length}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    Days Late
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <div className="text-2xl font-black text-purple-500">
                    {selectedEmployee.days.filter((d) => d === "leave").length}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    On Leave
                  </div>
                </div>
              </div>

              {/* Detailed List */}
              <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">
                Recent Activity
              </h3>
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <div className="divide-y divide-slate-50 max-h-[250px] overflow-y-auto">
                  {[
                    "May 22",
                    "May 21",
                    "May 20",
                    "May 19",
                    "May 18",
                    "May 17",
                    "May 16",
                  ].map((date, index) => {
                    const status = selectedEmployee.days[6 - index]; // reverse map for recent first
                    return (
                      <div
                        key={date}
                        className="flex justify-between items-center p-3 px-4 hover:bg-slate-50"
                      >
                        <div className="font-medium text-sm text-slate-700">
                          {date}, 2024
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            {status}
                          </span>
                          {renderStatusIcon(status)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
