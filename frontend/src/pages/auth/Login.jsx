import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";
import { 
  User, Mail, Briefcase, Utensils, Eye, EyeOff, Loader2, ArrowRight, Phone, Lock, Download
} from "lucide-react";
import { usePWAInstall } from "../../hooks/usePWAInstall";

const Login = () => {
  const navigate = useNavigate();
  const { login, register, forgotPassword, resetPassword } = useAuth();
  
  const [view, setView] = useState("login"); 
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const { isInstallable, installPWA } = usePWAInstall();

  const [registration, setRegistration] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    role: "Staff",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(username, password);

    if (result?.requires2FA) {
      setUserId(result.userId);
      setView("verify2fa");
      setLoading(false);
      return;
    }

    if (result?.success) {
      let route = result.role?.toLowerCase() || "staff";
      if (route === "manager" || route === "admin") route = "admin";
      else if (route === "waiter" || route === "staff") route = "staff";
      else if (route === "chef") route = "chef";
      else if (route === "cashier") route = "cashier";

      navigate(`/${route}`);
    }
    setLoading(false);
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await useAuth().verify2FA(userId, otp);

    if (result?.success) {
      let route = result.role?.toLowerCase() || "staff";
      if (route === "manager" || route === "admin") route = "admin";
      else if (route === "waiter" || route === "staff") route = "staff";
      else if (route === "chef") route = "chef";
      else if (route === "cashier") route = "cashier";

      navigate(`/${route}`);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (registration.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (registration.password !== registration.confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    const result = await register({
      username: registration.username,
      password: registration.password,
      confirmPassword: registration.confirmPassword,
      name: registration.name,
      email: registration.email,
      phone: registration.phone,
      role: registration.role,
    });

    if (result?.success) {
      setUsername(registration.username);
      setResetEmail(registration.email);
      setPassword("");
      setRegistration({
        name: "", username: "", email: "", phone: "",
        role: "Staff", password: "", confirmPassword: "",
      });
      setView("verifyRegOtp");
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await forgotPassword(resetEmail);
    if (result?.success) {
      if (result.previewUrl) {
        window.open(result.previewUrl, "_blank");
      }
      setView("verifyOtp");
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    
    setLoading(true);
    const result = await resetPassword(resetEmail, otp, newPassword);
    if (result?.success) {
      setView("login");
      setResetEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
    setLoading(false);
  };

  const handleVerifyRegOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await apiClient.post("/api/auth/verify-registration-otp", {
        email: resetEmail,
        otp
      });
      toast.success(data.message || "Email verified successfully! Please wait for Admin approval.");
      setView("login");
      setResetEmail("");
      setOtp("");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setLoading(false);
  };

  const switchView = (newView) => {
    setView(newView);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f9fa] font-sans text-slate-800 selection:bg-slate-200 p-4 sm:p-8 relative">
      
      {/* Subtle textured background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-50 pointer-events-none"></div>

      <div className="w-full max-w-[420px] bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10 relative z-10 animate-[fadeIn_0.4s_ease-out]">
        
        {/* Elegant Header Logo */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-slate-900 rounded-[14px] flex items-center justify-center shadow-md">
            <Utensils size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            ASLENIX
          </span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1.5">
            {view === "login"
              ? "Welcome back"
              : view === "register"
              ? "Create an account"
              : "Account recovery"}
          </h1>
          <p className="text-slate-500 text-sm">
            {view === "login"
              ? "Please enter your details to sign in."
              : view === "register"
              ? "Enter your details to register as staff."
              : view === "verifyOtp"
              ? `Enter the 6-digit code sent to ${resetEmail}`
              : view === "verifyRegOtp"
              ? `Enter the 6-digit verification code sent to ${resetEmail}`
              : view === "verify2fa"
              ? "Enter the 6-digit 2FA code sent to your email"
              : "We'll send you instructions to reset your password."}
          </p>
        </div>

        <div className="relative">
          {view === "register" ? (
            <form id="register-form" onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="sm:col-span-2">
                  <label htmlFor="reg-name-input" className="block text-[13px] font-medium text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative group">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                    <input
                      id="reg-name-input"
                      type="text"
                      value={registration.name}
                      onChange={(e) => setRegistration({ ...registration, name: e.target.value })}
                      className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 text-slate-900 placeholder:text-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-[14px] outline-none transition-all shadow-sm"
                      placeholder="Sarah Jenkins"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-username-input" className="block text-[13px] font-medium text-slate-700 mb-1.5">Username</label>
                  <div className="relative group">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                    <input
                      id="reg-username-input"
                      type="text"
                      value={registration.username}
                      onChange={(e) => setRegistration({ ...registration, username: e.target.value })}
                      className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 text-slate-900 placeholder:text-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-[14px] outline-none transition-all shadow-sm"
                      placeholder="sarah_j"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-role-select" className="block text-[13px] font-medium text-slate-700 mb-1.5">Role</label>
                  <div className="relative group">
                    <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors pointer-events-none" />
                    <select
                      id="reg-role-select"
                      value={registration.role}
                      onChange={(e) => setRegistration({ ...registration, role: e.target.value })}
                      className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 text-slate-900 placeholder:text-slate-400 pl-10 pr-8 py-2.5 rounded-xl text-[14px] outline-none appearance-none cursor-pointer transition-all shadow-sm"
                    >
                      <option value="Staff">Staff</option>
                      <option value="Chef">Chef</option>
                      <option value="Cashier">Cashier</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l-[3px] border-r-[3px] border-t-[4px] border-transparent border-t-slate-400" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="reg-email-input" className="block text-[13px] font-medium text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative group">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                    <input
                      id="reg-email-input"
                      type="email"
                      value={registration.email}
                      onChange={(e) => setRegistration({ ...registration, email: e.target.value })}
                      className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 text-slate-900 placeholder:text-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-[14px] outline-none transition-all shadow-sm"
                      placeholder="sarah@bistro.com"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="reg-phone-input" className="block text-[13px] font-medium text-slate-700 mb-1.5">Phone Number</label>
                  <div className="relative group">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                    <input
                      id="reg-phone-input"
                      type="tel"
                      pattern="[0-9]{10}"
                      maxLength="10"
                      value={registration.phone}
                      onChange={(e) => setRegistration({ ...registration, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 text-slate-900 placeholder:text-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-[14px] outline-none transition-all shadow-sm"
                      placeholder="10-digit number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-password-input" className="block text-[13px] font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                    <input
                      id="reg-password-input"
                      type={showPassword ? "text" : "password"}
                      value={registration.password}
                      onChange={(e) => setRegistration({ ...registration, password: e.target.value })}
                      className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 text-slate-900 placeholder:text-slate-400 pl-10 pr-10 py-2.5 rounded-xl text-[14px] outline-none transition-all shadow-sm"
                      placeholder="••••••••"
                      required minLength={8}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-confirmpassword-input" className="block text-[13px] font-medium text-slate-700 mb-1.5">Confirm Password</label>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                    <input
                      id="reg-confirmpassword-input"
                      type={showConfirmPassword ? "text" : "password"}
                      value={registration.confirmPassword}
                      onChange={(e) => setRegistration({ ...registration, confirmPassword: e.target.value })}
                      className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 text-slate-900 placeholder:text-slate-400 pl-10 pr-10 py-2.5 rounded-xl text-[14px] outline-none transition-all shadow-sm"
                      placeholder="••••••••"
                      required minLength={8}
                    />
                  </div>
                </div>

              </div>

              <button
                id="register-submit-button"
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Registering..." : "Create Account"}
              </button>

              <p className="text-center text-[13px] text-slate-500 mt-6">
                Already have access?{" "}
                <button type="button" onClick={() => switchView("login")} className="text-slate-900 font-semibold hover:underline cursor-pointer transition-colors">
                  Sign in
                </button>
              </p>
            </form>
          ) : view === "login" ? (
            <form id="login-form" onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="login-username-input" className="block text-[13px] font-medium text-slate-700 mb-1.5">Username</label>
                <div className="relative group">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                  <input
                    id="login-username-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 pl-10 pr-4 py-2.5 rounded-xl text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-sm"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="login-password-input" className="block text-[13px] font-medium text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => switchView("forgotPassword")}
                    className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                  <input
                    id="login-password-input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 pl-10 pr-10 py-2.5 rounded-xl text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit-button"
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-sm mt-6 group"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <p className="text-center text-[13px] text-slate-500 pt-6 mt-6 border-t border-slate-100">
                Don't have an account?{" "}
                <button type="button" onClick={() => switchView("register")} className="text-slate-900 font-semibold hover:underline cursor-pointer transition-colors">
                  Sign up
                </button>
              </p>
            </form>
          ) : view === "verifyRegOtp" ? (
            <form id="verify-reg-otp-form" onSubmit={handleVerifyRegOtp} className="space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Verification OTP</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                  <input
                    type="text"
                    maxLength="6"
                    pattern="\d{6}"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 text-slate-900 placeholder:text-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-[14px] text-center tracking-[0.5em] font-mono outline-none transition-all shadow-sm"
                    placeholder="••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Verify Email"}
              </button>
            </form>
          ) : view === "verifyOtp" ? (
            <form id="verify-otp-form" onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">6-Digit OTP</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                  <input
                    type="text"
                    maxLength="6"
                    pattern="\d{6}"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 text-slate-900 placeholder:text-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-[14px] text-center tracking-[0.5em] font-mono outline-none transition-all shadow-sm"
                    placeholder="••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">New Password</label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 pl-10 pr-4 py-2.5 rounded-xl text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-sm"
                    placeholder="••••••••"
                    required minLength={8}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 pl-10 pr-4 py-2.5 rounded-xl text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-sm"
                    placeholder="••••••••"
                    required minLength={8}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-sm mt-6 group"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Verifying..." : "Verify & Reset Password"}
              </button>

              <p className="text-center text-[13px] text-slate-500 pt-6">
                Changed your mind?{" "}
                <button type="button" onClick={() => switchView("login")} className="text-slate-900 font-semibold hover:underline cursor-pointer transition-colors">
                  Back to login
                </button>
              </p>
            </form>
          ) : (
            <form id="forgot-password-form" onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label htmlFor="reset-email-input" className="block text-[13px] font-medium text-slate-700 mb-1.5">Email Address</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                  <input
                    id="reset-email-input"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 text-slate-900 placeholder:text-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-[14px] outline-none transition-all shadow-sm"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-sm mt-6"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Sending link..." : "Send Reset Link"}
              </button>

              <p className="text-center text-[13px] text-slate-500 pt-6">
                Remember your password?{" "}
                <button type="button" onClick={() => switchView("login")} className="text-slate-900 font-semibold hover:underline cursor-pointer transition-colors">
                  Back to login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
      {/* PWA Install Button Floating at Bottom */}
      {isInstallable && (
        <button
          onClick={installPWA}
          className="absolute bottom-6 bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-2 hover:scale-105 transition-transform animate-[fadeIn_0.5s_ease-out]"
        >
          <Download size={18} />
          Install Aslenix App
        </button>
      )}
    </div>
  );
};

export default Login;
