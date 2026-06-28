import React from "react";
import { Mail, Phone, Clock, Banknote, XCircle, CheckCircle2, Edit2, Trash2 } from "lucide-react";

const EmployeeCard = ({
  employee,
  handleRejectClick,
  handleApproveClick,
  handleOpenEdit,
  handleDeleteClick,
}) => {
  return (
    <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Header Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img
            src={employee.image || "https://randomuser.me/api/portraits/men/1.jpg"}
            alt={employee.name}
            className="w-16 h-16 rounded-2xl object-cover shadow-sm"
          />
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
              employee.status === "Active"
                ? "bg-emerald-500"
                : employee.status === "Pending"
                ? "bg-amber-400 animate-pulse"
                : "bg-slate-300"
            }`}
          ></div>
        </div>
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
      <div className="pt-4 border-t border-slate-100 mt-auto">
        {employee.status === "Pending" ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRejectClick(employee._id || employee.tempId)}
              className="flex-1 flex items-center justify-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wide bg-rose-50 hover:bg-rose-100 transition-colors px-4 py-2 rounded-lg border border-rose-200 shadow-sm"
            >
              <XCircle size={14} /> Reject
            </button>
            <button
              onClick={() => handleApproveClick(employee._id || employee.tempId)}
              className="flex-1 flex items-center justify-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wide bg-emerald-50 hover:bg-emerald-100 transition-colors px-4 py-2 rounded-lg border border-emerald-200 shadow-sm"
            >
              <CheckCircle2 size={14} /> Approve
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleOpenEdit(employee)}
              className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-wide hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50 shadow-sm"
            >
              <Edit2 size={14} /> Edit
            </button>
            <button
              onClick={() => handleDeleteClick(employee._id || employee.id || employee.tempId)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 shadow-sm transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeCard;
