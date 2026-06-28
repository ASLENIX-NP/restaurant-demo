import React from "react";
import { Edit2, Trash2 } from "lucide-react";

const EmployeeList = ({
  filteredEmployees,
  handleRejectClick,
  handleApproveClick,
  handleOpenEdit,
  handleDeleteClick,
}) => {
  return (
    <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-slate-50/80 text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-100">
            <tr>
              <th className="p-5 pl-8">Employee</th>
              <th className="p-5">Role</th>
              <th className="p-5">Shift</th>
              <th className="p-5">Contact</th>
              <th className="p-5">Salary</th>
              <th className="p-5">Status</th>
              <th className="p-5 pr-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredEmployees.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-16 text-slate-400 font-medium"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">🔍</span>
                    <span>No employees match your search criteria.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr
                  key={employee._id || employee.tempId}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  <td className="p-5 pl-8">
                    <div className="flex items-center gap-4">
                      <img
                        src={employee.image || "https://randomuser.me/api/portraits/men/1.jpg"}
                        alt={employee.name}
                        className="w-11 h-11 rounded-full object-cover shadow-sm ring-2 ring-white"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight">
                          {employee.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 font-bold text-blue-600">
                    {employee.role}
                  </td>
                  <td className="p-5 font-medium text-slate-600">
                    {employee.shift}
                  </td>
                  <td className="p-5 font-medium text-slate-600">
                    {employee.phone}
                  </td>
                  <td className="p-5 font-bold text-slate-900">
                    {employee.salary}
                  </td>
                  <td className="p-5">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                        employee.status === "Active"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : employee.status === "Pending"
                          ? "bg-amber-50 text-amber-600 border-amber-200 animate-pulse"
                          : "bg-rose-50 text-rose-600 border-rose-200"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="p-5 pr-8">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {employee.status === "Pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRejectClick(employee._id || employee.tempId)}
                            className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition shadow-sm hover:-translate-y-0.5"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveClick(employee._id || employee.tempId)}
                            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition shadow-sm hover:-translate-y-0.5"
                          >
                            Approve
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenEdit(employee)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(employee._id || employee.tempId)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
