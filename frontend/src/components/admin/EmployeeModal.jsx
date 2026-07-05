import React, { useState } from "react";
import { X, AlertTriangle, Image as ImageIcon, FolderOpen, Trash2 } from "lucide-react";
import apiClient from "../../api/apiClient";
import { useToast } from "../../context/ToastContext";

const EmployeeModal = ({
  showModal,
  setShowModal,
  isEditing,
  newEmployee,
  setNewEmployee,
  handleSaveEmployee
}) => {
  const { showToast } = useToast();
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("File size must be less than 5MB", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", "profile");

    setUploadingImage(true);
    try {
      const response = await apiClient.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setNewEmployee({ ...newEmployee, image: response.data.url });
      showToast("Image uploaded successfully!", "success");
    } catch (error) {
      showToast(`Upload failed: ${error.response?.data?.message || error.message}`, "error");
    } finally {
      setUploadingImage(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-slide-in">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {isEditing ? "Edit Employee" : "Add New Employee"}
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-1">
              {isEditing ? "Update the details below." : "Fill in the required information."}
            </p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSaveEmployee} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Username *
              </label>
              <input
                type="text"
                required
                value={newEmployee.username}
                onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                placeholder="e.g. janedoe"
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
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                placeholder="e.g. Jane Doe"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all font-medium text-sm"
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
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                placeholder="+977 98..."
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Salary</label>
              <input
                type="text"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all font-medium text-sm"
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
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all font-medium text-sm cursor-pointer"
              >
                <option value="" disabled>Select Role</option>
                <option value="Chef">Chef</option>
                <option value="Cashier">Cashier</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Shift</label>
              <select
                value={newEmployee.shift}
                onChange={(e) => setNewEmployee({ ...newEmployee, shift: e.target.value })}
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all font-medium text-sm cursor-pointer"
              >
                <option value="" disabled>Select Shift</option>
                <option value="Morning">Morning</option>
                <option value="Day">Day</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
              <select
                value={newEmployee.status}
                onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all font-medium text-sm cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Profile Image
              </label>
              <div className="flex gap-4 items-end">
                <div 
                  className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative group"
                >
                  {newEmployee.image ? (
                    <>
                      <img 
                        src={newEmployee.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          type="button"
                          onClick={() => setNewEmployee({...newEmployee, image: ""})}
                          className="p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 shadow-md transition"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <ImageIcon size={24} className="text-slate-300" />
                  )}
                </div>
                <div className="flex-1 pb-1">
                  <input
                    type="file"
                    id="empImageUpload"
                    accept="image/jpeg, image/png, image/webp, image/gif, image/svg+xml"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label 
                    htmlFor="empImageUpload"
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-sm cursor-pointer transition-colors border ${
                      uploadingImage 
                        ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed" 
                        : "bg-white border-slate-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200"
                    }`}
                  >
                    <FolderOpen size={14} />
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                  </label>
                </div>
              </div>
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
              className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition"
            >
              {isEditing ? "Save Changes" : "Save Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
