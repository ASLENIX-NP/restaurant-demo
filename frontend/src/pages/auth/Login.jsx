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
    <div className="min-h-screen w-full flex font-sans text-slate-900 selection:bg-slate-200 overflow-hidden">
      
      {/* Left Panel - Image & Branding */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative bg-slate-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Restaurant Interior" 
            className="w-full h-full object-cover opacity-50 mix-blend-overlay animate-ken-burns origin-center"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/70 to-slate-800/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-12 xl:px-20 animate-fade-in-up">
          <div className="w-28 h-28 bg-white/10 backdrop-blur-2xl rounded-[32px] flex items-center justify-center mb-10 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] border border-white/20">
            <Utensils size={50} className="text-white drop-shadow-lg" />
          </div>
          <h1 className="text-5xl xl:text-6xl font-bold text-white mb-6 tracking-tight leading-tight drop-shadow-md font-['Outfit']">
            मिठ्ठो चिया <br /> & Tiffin घर
          </h1>
          <p className="text-slate-200 text-lg xl:text-xl max-w-md font-light leading-relaxed opacity-90">
            A symphony of flavors awaits. Elevate your culinary management with our next-generation platform.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[55%] xl:w-[50%] flex flex-col items-center justify-center p-6 sm:p-12 relative bg-gradient-to-br from-white via-slate-50 to-slate-100 overflow-y-auto">
        
        {/* Subtle decorative background shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[100px] opacity-60 translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        <div className="w-full max-w-[440px] relative z-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          
          {/* Mobile Header Logo */}
          <div className="flex lg:hidden flex-col items-center gap-4 mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[24px] flex items-center justify-center shadow-xl border border-slate-700/50">
              <Utensils size={36} className="text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-slate-900 font-['Outfit']">
              मिठ्ठो चिया & Tiffin घर
            </span>
          </div>

          <div className="text-center lg:text-left mb-10">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-3 font-['Outfit']">
              {view === "login"
                ? "Welcome back"
                : view === "register"
                ? "Create an account"
                : "Account recovery"}
            </h2>
            <p className="text-slate-500 text-[16px] font-light">
              {view === "login"
                ? "Please enter your credentials to access your dashboard."
                : view === "register"
                ? "Enter your details below to register as a staff member."
                : view === "verifyOtp"
                ? `Enter the 6-digit code sent to ${resetEmail}`
                : view === "verifyRegOtp"
                ? `Enter the 6-digit verification code sent to ${resetEmail}`
                : view === "verify2fa"
                ? "Enter the 6-digit 2FA code sent to your email"
                : "We'll send you instructions to securely reset your password."}
            </p>
          </div>

          <div className="glass-panel rounded-[28px] p-2 sm:p-8 relative">
            {view === "register" ? (
              <form id="register-form" onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  <div className="sm:col-span-2 relative group">
                    <input
                      id="reg-name-input"
                      type="text"
                      value={registration.name}
                      onChange={(e) => setRegistration({ ...registration, name: e.target.value })}
                      className="peer w-full glass-input pl-12 pr-4 pt-6 pb-2.5 rounded-2xl text-[15px] font-medium text-slate-900 placeholder-transparent outline-none"
                      placeholder="Full Name"
                      required
                    />
                    <label htmlFor="reg-name-input" className="absolute left-12 top-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-medium peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-slate-400 peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-slate-800 peer-focus:uppercase peer-focus:tracking-wider pointer-events-none">
                      Full Name
                    </label>
                    <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-slate-800 transition-colors" />
                  </div>

                  <div className="relative group">
                    <input
                      id="reg-username-input"
                      type="text"
                      value={registration.username}
                      onChange={(e) => setRegistration({ ...registration, username: e.target.value })}
                      className="peer w-full glass-input pl-12 pr-4 pt-6 pb-2.5 rounded-2xl text-[15px] font-medium text-slate-900 placeholder-transparent outline-none"
                      placeholder="Username"
                      required
                    />
                    <label htmlFor="reg-username-input" className="absolute left-12 top-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-medium peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-slate-400 peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-slate-800 peer-focus:uppercase peer-focus:tracking-wider pointer-events-none">
                      Username
                    </label>
                    <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-slate-800 transition-colors" />
                  </div>

                  <div className="relative group">
                    <select
                      id="reg-role-select"
                      value={registration.role}
                      onChange={(e) => setRegistration({ ...registration, role: e.target.value })}
                      className="peer w-full glass-input pl-12 pr-8 pt-6 pb-2.5 rounded-2xl text-[15px] font-medium text-slate-900 outline-none appearance-none cursor-pointer"
                    >
                      <option value="Staff">Staff</option>
                      <option value="Chef">Chef</option>
                      <option value="Cashier">Cashier</option>
                    </select>
                    <label htmlFor="reg-role-select" className="absolute left-12 top-2 text-[11px] font-bold text-slate-800 uppercase tracking-wider pointer-events-none">
                      Role
                    </label>
                    <Briefcase size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800 pointer-events-none" />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-[4px] border-r-[4px] border-t-[5px] border-transparent border-t-slate-500" />
                  </div>

                  <div className="sm:col-span-2 relative group">
                    <input
                      id="reg-email-input"
                      type="email"
                      value={registration.email}
                      onChange={(e) => setRegistration({ ...registration, email: e.target.value })}
                      className="peer w-full glass-input pl-12 pr-4 pt-6 pb-2.5 rounded-2xl text-[15px] font-medium text-slate-900 placeholder-transparent outline-none"
                      placeholder="Email Address"
                      required
                    />
                    <label htmlFor="reg-email-input" className="absolute left-12 top-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-medium peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-slate-400 peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-slate-800 peer-focus:uppercase peer-focus:tracking-wider pointer-events-none">
                      Email Address
                    </label>
                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-slate-800 transition-colors" />
                  </div>

                  <div className="sm:col-span-2 relative group">
                    <input
                      id="reg-phone-input"
                      type="tel"
                      pattern="[0-9]{10}"
                      maxLength="10"
                      value={registration.phone}
                      onChange={(e) => setRegistration({ ...registration, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      className="peer w-full glass-input pl-12 pr-4 pt-6 pb-2.5 rounded-2xl text-[15px] font-medium text-slate-900 placeholder-transparent outline-none"
                      placeholder="Phone Number"
                      required
                    />
                    <label htmlFor="reg-phone-input" className="absolute left-12 top-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-medium peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-slate-400 peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-slate-800 peer-focus:uppercase peer-focus:tracking-wider pointer-events-none">
                      Phone Number
                    </label>
                    <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-slate-800 transition-colors" />
                  </div>

                  <div className="relative group">
                    <input
                      id="reg-password-input"
                      type={showPassword ? "text" : "password"}
                      value={registration.password}
                      onChange={(e) => setRegistration({ ...registration, password: e.target.value })}
                      className="peer w-full glass-input pl-12 pr-12 pt-6 pb-2.5 rounded-2xl text-[15px] font-medium text-slate-900 placeholder-transparent outline-none"
                      placeholder="Password"
                      required minLength={8}
                    />
                    <label htmlFor="reg-password-input" className="absolute left-12 top-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-medium peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-slate-400 peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-slate-800 peer-focus:uppercase peer-focus:tracking-wider pointer-events-none">
                      Password
                    </label>
                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-slate-800 transition-colors" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="relative group">
                    <input
                      id="reg-confirmpassword-input"
                      type={showConfirmPassword ? "text" : "password"}
                      value={registration.confirmPassword}
                      onChange={(e) => setRegistration({ ...registration, confirmPassword: e.target.value })}
                      className="peer w-full glass-input pl-12 pr-12 pt-6 pb-2.5 rounded-2xl text-[15px] font-medium text-slate-900 placeholder-transparent outline-none"
                      placeholder="Confirm Password"
                      required minLength={8}
                    />
                    <label htmlFor="reg-confirmpassword-input" className="absolute left-12 top-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-medium peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-slate-400 peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-slate-800 peer-focus:uppercase peer-focus:tracking-wider pointer-events-none">
                      Confirm Password
                    </label>
                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-slate-800 transition-colors" />
                  </div>
                </div>

                <button
                  id="register-submit-button"
                  type="submit"
                  disabled={loading}
                  className="relative overflow-hidden w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.6)] mt-8 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  {loading && <Loader2 size={20} className="animate-spin" />}
                  <span className="text-[16px] tracking-wide">{loading ? "Registering..." : "Create Account"}</span>
                </button>

                <p className="text-center text-[15px] text-slate-500 mt-6 pt-2">
                  Already have access?{" "}
                  <button type="button" onClick={() => switchView("login")} className="text-slate-900 font-bold hover:text-slate-700 underline underline-offset-4 decoration-2 decoration-slate-900/30 transition-all cursor-pointer">
                    Sign in here
                  </button>
                </p>
              </form>
            ) : view === "login" ? (
              <form id="login-form" onSubmit={handleLogin} className="space-y-6">
                
                <div className="relative group">
                  <input
                    id="login-username-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="peer w-full glass-input pl-12 pr-4 pt-6 pb-2.5 rounded-2xl text-[15px] font-medium text-slate-900 placeholder-transparent outline-none"
                    placeholder="Username"
                    required
                  />
                  <label htmlFor="login-username-input" className="absolute left-12 top-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-medium peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-slate-400 peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-slate-800 peer-focus:uppercase peer-focus:tracking-wider pointer-events-none">
                    Username
                  </label>
                  <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-slate-800 transition-colors" />
                </div>
                
                <div>
                  <div className="relative group">
                    <input
                      id="login-password-input"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="peer w-full glass-input pl-12 pr-12 pt-6 pb-2.5 rounded-2xl text-[15px] font-medium text-slate-900 placeholder-transparent outline-none"
                      placeholder="Password"
                      required
                    />
                    <label htmlFor="login-password-input" className="absolute left-12 top-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-medium peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-slate-400 peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-slate-800 peer-focus:uppercase peer-focus:tracking-wider pointer-events-none">
                      Password
                    </label>
                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-slate-800 transition-colors" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-3 px-2">
                    <button
                      type="button"
                      onClick={() => switchView("forgotPassword")}
                      className="text-[14px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                <button
                  id="login-submit-button"
                  type="submit"
                  disabled={loading}
                  className="relative overflow-hidden w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.6)] mt-8 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <span className="text-[16px] tracking-wide">Sign In</span>
                      <ArrowRight size={20} className="transition-transform group-hover:translate-x-1.5" />
                    </>
                  )}
                </button>

                <p className="text-center text-[15px] text-slate-500 pt-6 mt-8 border-t border-slate-200/50">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => switchView("register")} className="text-slate-900 font-bold hover:text-slate-700 underline underline-offset-4 decoration-2 decoration-slate-900/30 transition-all cursor-pointer">
                    Sign up now
                  </button>
                </p>
              </form>
            ) : view === "verifyRegOtp" ? (
              <form id="verify-reg-otp-form" onSubmit={handleVerifyRegOtp} className="space-y-6">
                <div className="relative group">
                  <input
                    id="verify-reg-otp-input"
                    type="text"
                    maxLength="6"
                    pattern="\d{6}"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="peer w-full glass-input pl-12 pr-4 pt-6 pb-2.5 rounded-2xl text-[20px] font-mono text-center tracking-[0.5em] text-slate-900 placeholder-transparent outline-none"
                    placeholder="OTP"
                    required
                  />
                  <label htmlFor="verify-reg-otp-input" className="absolute left-12 top-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-medium peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-slate-400 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-slate-800 peer-focus:uppercase peer-focus:tracking-wider pointer-events-none">
                    Verification Code
                  </label>
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-slate-800 transition-colors" />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="relative overflow-hidden w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.6)] mt-8 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <span className="text-[16px] tracking-wide">Verify Email</span>}
                </button>
              </form>
            ) : view === "verifyOtp" ? (
              <form id="verify-otp-form" onSubmit={handleResetPassword} className="space-y-6">
                <div className="relative group">
                  <input
                    id="verify-otp-input"
                    type="text"
                    maxLength="6"
                    pattern="\d{6}"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="peer w-full glass-input pl-12 pr-4 pt-6 pb-2.5 rounded-2xl text-[20px] font-mono text-center tracking-[0.5em] text-slate-900 placeholder-transparent outline-none"
                    placeholder="OTP"
                    required
                  />
                  <label htmlFor="verify-otp-input" className="absolute left-12 top-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-medium peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-slate-400 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-slate-800 peer-focus:uppercase peer-focus:tracking-wider pointer-events-none">
                    6-Digit OTP
                  </label>
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-slate-800 transition-colors" />
                </div>

                <div className="relative group">
                  <input
                    id="new-password-input"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="peer w-full glass-input pl-12 pr-4 pt-6 pb-2.5 rounded-2xl text-[15px] font-medium text-slate-900 placeholder-transparent outline-none"
                    placeholder="New Password"
                    required minLength={8}
                  />
                  <label htmlFor="new-password-input" className="absolute left-12 top-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-medium peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-slate-400 peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-slate-800 peer-focus:uppercase peer-focus:tracking-wider pointer-events-none">
                    New Password
                  </label>
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-slate-800 transition-colors" />
                </div>

                <div className="relative group">
                  <input
                    id="confirm-new-password-input"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="peer w-full glass-input pl-12 pr-4 pt-6 pb-2.5 rounded-2xl text-[15px] font-medium text-slate-900 placeholder-transparent outline-none"
                    placeholder="Confirm New Password"
                    required minLength={8}
                  />
                  <label htmlFor="confirm-new-password-input" className="absolute left-12 top-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-medium peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-slate-400 peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-slate-800 peer-focus:uppercase peer-focus:tracking-wider pointer-events-none">
                    Confirm New Password
                  </label>
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-slate-800 transition-colors" />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative overflow-hidden w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.6)] mt-8 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  {loading && <Loader2 size={20} className="animate-spin" />}
                  <span className="text-[16px] tracking-wide">{loading ? "Verifying..." : "Verify & Reset Password"}</span>
                </button>

                <p className="text-center text-[15px] text-slate-500 pt-6">
                  Changed your mind?{" "}
                  <button type="button" onClick={() => switchView("login")} className="text-slate-900 font-bold hover:text-slate-700 underline underline-offset-4 decoration-2 decoration-slate-900/30 transition-all cursor-pointer">
                    Back to login
                  </button>
                </p>
              </form>
            ) : view === "verify2fa" ? (
              <form id="verify-2fa-form" onSubmit={handleVerify2FA} className="space-y-6">
                <div className="relative group">
                  <input
                    id="verify-2fa-input"
                    type="text"
                    maxLength="6"
                    pattern="\d{6}"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="peer w-full glass-input pl-12 pr-4 pt-6 pb-2.5 rounded-2xl text-[20px] font-mono text-center tracking-[0.5em] text-slate-900 placeholder-transparent outline-none"
                    placeholder="2FA Code"
                    required
                  />
                  <label htmlFor="verify-2fa-input" className="absolute left-12 top-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-medium peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-slate-400 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-slate-800 peer-focus:uppercase peer-focus:tracking-wider pointer-events-none">
                    6-Digit 2FA Code
                  </label>
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-slate-800 transition-colors" />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="relative overflow-hidden w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.6)] mt-8 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <span className="text-[16px] tracking-wide">Verify 2FA</span>}
                </button>
              </form>
            ) : (
              <form id="forgot-password-form" onSubmit={handleForgotPassword} className="space-y-6">
                <div className="relative group">
                  <input
                    id="reset-email-input"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="peer w-full glass-input pl-12 pr-4 pt-6 pb-2.5 rounded-2xl text-[15px] font-medium text-slate-900 placeholder-transparent outline-none"
                    placeholder="Email Address"
                    required
                  />
                  <label htmlFor="reset-email-input" className="absolute left-12 top-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-medium peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-slate-400 peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:text-slate-800 peer-focus:uppercase peer-focus:tracking-wider pointer-events-none">
                    Email Address
                  </label>
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-slate-800 transition-colors" />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative overflow-hidden w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.6)] mt-8 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  {loading && <Loader2 size={20} className="animate-spin" />}
                  <span className="text-[16px] tracking-wide">{loading ? "Sending link..." : "Send Reset Link"}</span>
                </button>

                <p className="text-center text-[15px] text-slate-500 pt-6">
                  Remember your password?{" "}
                  <button type="button" onClick={() => switchView("login")} className="text-slate-900 font-bold hover:text-slate-700 underline underline-offset-4 decoration-2 decoration-slate-900/30 transition-all cursor-pointer">
                    Back to login
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      
      {/* PWA Install Button Floating at Bottom */}
      {isInstallable && (
        <button
          onClick={installPWA}
          className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 bg-slate-900 text-white px-8 py-4 rounded-full font-semibold shadow-[0_12px_40px_-10px_rgba(15,23,42,0.8)] flex items-center gap-3 hover:scale-105 hover:bg-slate-800 transition-all z-50 animate-fade-in-up font-['Outfit'] group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
          <Download size={20} className="relative z-10" />
          <span className="relative z-10 text-[16px] tracking-wide">Install App</span>
        </button>
      )}
    </div>
  );
};

export default Login;
