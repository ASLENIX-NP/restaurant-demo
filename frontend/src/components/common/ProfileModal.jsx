import React, { useState, useEffect } from "react";
import { UserCircle, ShieldCheck, Camera, X } from "lucide-react";
import apiClient from "../../api/apiClient";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const ProfileModal = ({ onClose }) => {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "", username: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        username: user.username || ""
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await apiClient.put("/api/auth/profile", profileForm);
      const currentUser = JSON.parse(localStorage.getItem("restaurant_user")) || {};
      const updatedUser = { ...currentUser, ...data.user };
      localStorage.setItem("restaurant_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      showToast("Profile updated successfully!", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update profile", "error");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return showToast("New passwords do not match", "error");
    }

    try {
      await apiClient.put("/api/auth/profile", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      showToast("Password updated successfully!", "success");
      setShowPasswordForm(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update password", "error");
    }
  };

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
      const uploadRes = await apiClient.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const { data } = await apiClient.put("/api/auth/profile", { image: uploadRes.data.url });
      
      const currentUser = JSON.parse(localStorage.getItem("restaurant_user")) || {};
      const updatedUser = { ...currentUser, ...data.user };
      localStorage.setItem("restaurant_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      showToast("Profile image updated!", "success");
    } catch (error) {
      showToast(`Image upload failed: ${error.response?.data?.message || error.message}`, "error");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50 relative shrink-0">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <UserCircle size={24} className="text-blue-500" />
            My Profile
          </h2>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors shadow-sm">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group shrink-0 mb-4">
              <div className="p-1.5 bg-white rounded-full shadow-sm border border-slate-100">
                {user?.image ? (
                  <img src={user.image} alt={user?.name} className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <UserCircle size={48} />
                  </div>
                )}
              </div>
              <label className="absolute bottom-1 right-1 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md hover:bg-slate-800 hover:scale-105 transition-all cursor-pointer">
                <Camera size={14} />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
              </label>
            </div>
            <h3 className="text-xl font-black text-slate-900">{user?.name || "User"}</h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck size={14} className="text-indigo-500" /> {user?.role}
            </span>
          </div>

          <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => { setShowEditForm(true); setShowPasswordForm(false); }} 
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${!showPasswordForm ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Details
            </button>
            <button 
              onClick={() => { setShowPasswordForm(true); setShowEditForm(false); }} 
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${showPasswordForm ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Security
            </button>
          </div>

          {/* Edit Profile Form */}
          {!showPasswordForm && (
            <form onSubmit={handleProfileUpdate} className="space-y-4 animate-slide-in">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Username</label>
                <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" value={profileForm.username} onChange={e => setProfileForm({...profileForm, username: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
                <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Phone</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition mt-6 shadow-sm">
                Save Changes
              </button>
            </form>
          )}

          {/* Password Form */}
          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="space-y-4 animate-slide-in">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Current Password</label>
                <input type="password" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" value={passwordForm.currentPassword} onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">New Password</label>
                <input type="password" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Confirm New Password</label>
                <input type="password" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition mt-6 shadow-sm">
                Update Password
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
