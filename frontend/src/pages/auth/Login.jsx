import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";
import { 
  Loader2, ArrowRight, Eye, EyeOff, Utensils, Download
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

  const inputClass = "w-full bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-indigo-500 rounded-[18px] px-5 py-3.5 text-[15px] font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]";
  const labelClass = "block text-[13px] font-bold text-slate-700 mb-2";

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-8 font-['Outfit'] relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Decorative airy background shapes for a modern SaaS look */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-200/40 to-purple-100/40 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-emerald-100/30 to-amber-100/40 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[480px] bg-white rounded-[32px] p-8 sm:p-12 relative z-10 border border-slate-100 shadow-[0_32px_64px_-24px_rgba(15,23,42,0.06)] animate-fade-in-up">
        
        {/* Branding */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-slate-900 rounded-[20px] flex items-center justify-center shadow-lg shadow-slate-900/20 mb-6">
            <Utensils size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
            मिठ्ठो चिया & Tiffin घर
          </h1>
          <p className="text-slate-500 text-[15px] font-medium">
            {view === "login"
              ? "Sign in to your account"
              : view === "register"
              ? "Create your staff account"
              : "Account recovery"}
          </p>
        </div>

        <div className="relative">
          {view === "register" ? (
            <form id="register-form" onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                <div className="sm:col-span-2">
                  <label htmlFor="reg-name-input" className={labelClass}>Full Name</label>
                  <input
                    id="reg-name-input"
                    type="text"
                    value={registration.name}
                    onChange={(e) => setRegistration({ ...registration, name: e.target.value })}
                    className={inputClass}
                    placeholder="Sarah Jenkins"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="reg-username-input" className={labelClass}>Username</label>
                  <input
                    id="reg-username-input"
                    type="text"
                    value={registration.username}
                    onChange={(e) => setRegistration({ ...registration, username: e.target.value })}
                    className={inputClass}
                    placeholder="sarah_j"
                    required
                  />
                </div>

                <div className="relative">
                  <label htmlFor="reg-role-select" className={labelClass}>Role</label>
                  <select
                    id="reg-role-select"
                    value={registration.role}
                    onChange={(e) => setRegistration({ ...registration, role: e.target.value })}
                    className={`${inputClass} appearance-none cursor-pointer pr-10`}
                  >
                    <option value="Staff">Staff</option>
                    <option value="Chef">Chef</option>
                    <option value="Cashier">Cashier</option>
                  </select>
                  <div className="absolute right-4 top-[42px] pointer-events-none border-l-[4px] border-r-[4px] border-t-[5px] border-transparent border-t-slate-500" />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="reg-email-input" className={labelClass}>Email Address</label>
                  <input
                    id="reg-email-input"
                    type="email"
                    value={registration.email}
                    onChange={(e) => setRegistration({ ...registration, email: e.target.value })}
                    className={inputClass}
                    placeholder="sarah@example.com"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="reg-phone-input" className={labelClass}>Phone Number</label>
                  <input
                    id="reg-phone-input"
                    type="tel"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    value={registration.phone}
                    onChange={(e) => setRegistration({ ...registration, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    className={inputClass}
                    placeholder="10-digit number"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="reg-password-input" className={labelClass}>Password</label>
                  <div className="relative">
                    <input
                      id="reg-password-input"
                      type={showPassword ? "text" : "password"}
                      value={registration.password}
                      onChange={(e) => setRegistration({ ...registration, password: e.target.value })}
                      className={`${inputClass} pr-12`}
                      placeholder="••••••••"
                      required minLength={8}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-confirmpassword-input" className={labelClass}>Confirm</label>
                  <input
                    id="reg-confirmpassword-input"
                    type={showConfirmPassword ? "text" : "password"}
                    value={registration.confirmPassword}
                    onChange={(e) => setRegistration({ ...registration, confirmPassword: e.target.value })}
                    className={inputClass}
                    placeholder="••••••••"
                    required minLength={8}
                  />
                </div>

              </div>

              <button
                id="register-submit-button"
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-[18px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-slate-900/10 mt-8"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                <span className="text-[16px]">Create Account</span>
              </button>

              <p className="text-center text-[14px] text-slate-500 mt-6 font-medium">
                Already have an account?{" "}
                <button type="button" onClick={() => switchView("login")} className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                  Sign in here
                </button>
              </p>
            </form>
          ) : view === "login" ? (
            <form id="login-form" onSubmit={handleLogin} className="space-y-6">
              
              <div>
                <label htmlFor="login-username-input" className={labelClass}>Username</label>
                <input
                  id="login-username-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClass}
                  placeholder="Enter your username"
                  required
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="login-password-input" className="block text-[13px] font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => switchView("forgotPassword")}
                    className="text-[13px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password-input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-12`}
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit-button"
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-[18px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-slate-900/10 mt-8 group"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <span className="text-[16px]">Sign In</span>
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <p className="text-center text-[14px] text-slate-500 pt-6 mt-6 border-t border-slate-100 font-medium">
                Don't have an account?{" "}
                <button type="button" onClick={() => switchView("register")} className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                  Create one now
                </button>
              </p>
            </form>
          ) : view === "verifyRegOtp" ? (
            <form id="verify-reg-otp-form" onSubmit={handleVerifyRegOtp} className="space-y-6">
              <div>
                <label htmlFor="verify-reg-otp-input" className={labelClass}>Verification Code</label>
                <input
                  id="verify-reg-otp-input"
                  type="text"
                  maxLength="6"
                  pattern="\d{6}"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className={`${inputClass} text-center text-[24px] tracking-[0.5em] font-mono py-4`}
                  placeholder="••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-[18px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-slate-900/10"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <span className="text-[16px]">Verify Email</span>}
              </button>
            </form>
          ) : view === "verifyOtp" ? (
            <form id="verify-otp-form" onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label htmlFor="verify-otp-input" className={labelClass}>6-Digit OTP</label>
                <input
                  id="verify-otp-input"
                  type="text"
                  maxLength="6"
                  pattern="\d{6}"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className={`${inputClass} text-center text-[24px] tracking-[0.5em] font-mono py-4`}
                  placeholder="••••••"
                  required
                />
              </div>

              <div>
                <label htmlFor="new-password-input" className={labelClass}>New Password</label>
                <input
                  id="new-password-input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                  required minLength={8}
                />
              </div>

              <div>
                <label htmlFor="confirm-new-password-input" className={labelClass}>Confirm New Password</label>
                <input
                  id="confirm-new-password-input"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                  required minLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-[18px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-slate-900/10 mt-8"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                <span className="text-[16px]">{loading ? "Verifying..." : "Verify & Reset Password"}</span>
              </button>

              <p className="text-center text-[14px] text-slate-500 pt-4 font-medium">
                Changed your mind?{" "}
                <button type="button" onClick={() => switchView("login")} className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                  Back to login
                </button>
              </p>
            </form>
          ) : view === "verify2fa" ? (
            <form id="verify-2fa-form" onSubmit={handleVerify2FA} className="space-y-6">
              <div>
                <label htmlFor="verify-2fa-input" className={labelClass}>6-Digit 2FA Code</label>
                <input
                  id="verify-2fa-input"
                  type="text"
                  maxLength="6"
                  pattern="\d{6}"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className={`${inputClass} text-center text-[24px] tracking-[0.5em] font-mono py-4`}
                  placeholder="••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-[18px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-slate-900/10"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <span className="text-[16px]">Verify 2FA</span>}
              </button>
            </form>
          ) : (
            <form id="forgot-password-form" onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label htmlFor="reset-email-input" className={labelClass}>Email Address</label>
                <input
                  id="reset-email-input"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className={inputClass}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-[18px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-slate-900/10 mt-8"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                <span className="text-[16px]">{loading ? "Sending link..." : "Send Reset Link"}</span>
              </button>

              <p className="text-center text-[14px] text-slate-500 pt-4 font-medium">
                Remember your password?{" "}
                <button type="button" onClick={() => switchView("login")} className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
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
          className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-full font-bold shadow-[0_12px_32px_-10px_rgba(0,0,0,0.1)] flex items-center gap-3 hover:-translate-y-1 transition-all z-50 animate-fade-in-up"
        >
          <Download size={20} className="text-indigo-600" />
          <span className="text-[15px]">Install App</span>
        </button>
      )}
    </div>
  );
};

export default Login;
