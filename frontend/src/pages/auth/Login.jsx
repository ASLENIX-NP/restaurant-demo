import { useState, useEffect } from"react";
import { useNavigate } from"react-router-dom";
import { useAuth } from"../../context/AuthContext";
import { 
 User, Mail, Phone, Lock, Briefcase, Utensils, 
 AlertCircle, CheckCircle2, Eye, EyeOff, ArrowRight, Loader2,
 Shield, CreditCard, Users, Sparkles, ChevronRight
} from"lucide-react";
import { motion, AnimatePresence } from"framer-motion";

const demoUsers = [
 { role:"admin", label:"Admin Manager", icon: <Shield size={16} className="text-amber-500" />, desc:"Manage setup & view reports" },
 { role:"chef", label:"Head Chef", icon: <Utensils size={16} className="text-indigo-500" />, desc:"Track tickets in KDS" },
 { role:"staff", label:"Server Staff", icon: <Users size={16} className="text-rose-500" />, desc:"Take orders & reserve tables" },
 { role:"cashier", label:"POS Cashier", icon: <CreditCard size={16} className="text-emerald-500" />, desc:"Manage billing & cash drawers" }
];

const Login = () => {
 const navigate = useNavigate();
 const { login, register, user } = useAuth();
 
 const [view, setView] = useState("login"); 
 
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const [resetEmail, setResetEmail] = useState("");
 const [error, setError] = useState("");
 const [info, setInfo] = useState("");
 const [loading, setLoading] = useState(false);
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [showDemoDrawer, setShowDemoDrawer] = useState(false);

 const [registration, setRegistration] = useState({
 name:"",
 username:"",
 email:"",
 phone:"",
 role:"staff",
 password:"",
 confirmPassword:"",
 });

 // No automatic redirect on mount, allowing users to always see the login page if they navigate to"/"

 const handleLogin = async (e) => {
 e.preventDefault();
 setError("");
 setInfo("");
 setLoading(true);

 const result = await login(username, password);

 if (result?.success) {
 let route = result.role?.toLowerCase() ||"staff";
 if (route ==="manager" || route ==="admin") route ="admin";
 else if (route ==="waiter" || route ==="staff") route ="staff";
 else if (route ==="chef") route ="chef";
 else if (route ==="cashier") route ="cashier";

 navigate(`/${route}`);
 } else {
 setError(
 result?.message ||
"Invalid credentials. Please check your username and password."
 );
 }
 setLoading(false);
 };

 const handleRegister = async (e) => {
 e.preventDefault();
 setError("");
 setInfo("");
 setLoading(true);

 if (registration.password.length < 8) {
 setError("Password must be at least 8 characters long.");
 setLoading(false);
 return;
 }

 if (registration.password !== registration.confirmPassword) {
 setError("Passwords do not match.");
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
 setInfo(result.message);
 setUsername(registration.username);
 setPassword("");
 setRegistration({
 name:"", username:"", email:"", phone:"",
 role:"staff", password:"", confirmPassword:"",
 });
 setView("login");
 setShowPassword(false);
 setShowConfirmPassword(false);
 } else {
 setError(result?.message ||"Could not submit registration.");
 }
 setLoading(false);
 };

 const handleForgotPassword = async (e) => {
 e.preventDefault();
 setError("");
 setInfo("");
 setLoading(true);

 setTimeout(() => {
 setInfo("If an account exists with this email, a password reset link has been sent.");
 setLoading(false);
 }, 1200);
 };

 const switchView = (newView) => {
 setView(newView);
 setError("");
 setInfo("");
 };

 const handleQuickLogin = (role) => {
 setUsername(role);
 setPassword(`${role}123`);
 setView("login");
 setInfo(`Loaded test credentials for'${role.toUpperCase()}'! Ready to sign in.`);
 setError("");
 setShowDemoDrawer(false);
 };

 return (
 <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0f172a] to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans text-slate-200 relative overflow-hidden">
 
 {/* Decorative Blur Orbs */}
 <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
 <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

 {/* Main Container - Glassmorphic Card */}
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.4, ease:"easeOut" }}
 className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 border border-white/10 p-8 sm:p-10 relative z-10"
 >
 
 {/* Header Logo */}
 <div className="flex items-center justify-center gap-2.5 mb-8">
 <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
 <Utensils size={24} className="text-white" />
 </div>
 <span className="text-3xl font-black tracking-tight text-white">
 ASLENIX<span className="text-purple-400"> POS</span>
 </span>
 </div>

 {/* Heading Headers */}
 <div className="text-center mb-8">
 <h1 className="text-2xl font-bold tracking-tight text-white">
 {view ==="register" ?"Join the Team" : view ==="forgotPassword" ?"Account Recovery" :"Welcome Back"}
 </h1>
 <p className="mt-2 text-sm text-slate-400">
 {view ==="register"
 ?"Submit a request to register your system account."
 : view ==="forgotPassword"
 ?"Enter email instructions to reset your password credentials."
 :"Sign in to manage your restaurant shift."}
 </p>
 </div>

 {/* Alert Logs */}
 <AnimatePresence mode="wait">
 {error && (
 <motion.div
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 className="mb-5 bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3"
 >
 <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
 <p className="text-xs font-medium text-rose-700 leading-snug">{error}</p>
 </motion.div>
 )}
 {info && (
 <motion.div
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 className="mb-5 bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3"
 >
 <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
 <p className="text-xs font-medium text-emerald-700 leading-snug">{info}</p>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Form Panels switcher */}
 <div className="relative flex-1">
 {view ==="register" ? (
 <form id="register-form" onSubmit={handleRegister} className="space-y-4">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 
 <div className="sm:col-span-2">
 <label htmlFor="reg-name-input" className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
 <div className="relative group">
 <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
 <input
 id="reg-name-input"
 type="text"
 value={registration.name}
 onChange={(e) => setRegistration({ ...registration, name: e.target.value })}
 className="w-full bg-white/10 border border-white/20 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 text-white placeholder:text-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
 placeholder="Sarah Jenkins"
 required
 />
 </div>
 </div>

 <div>
 <label htmlFor="reg-username-input" className="block text-xs font-semibold text-slate-300 mb-1.5">Username</label>
 <div className="relative group">
 <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
 <input
 id="reg-username-input"
 type="text"
 value={registration.username}
 onChange={(e) => setRegistration({ ...registration, username: e.target.value })}
 className="w-full bg-white/10 border border-white/20 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 text-white placeholder:text-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
 placeholder="sarah_j"
 required
 />
 </div>
 </div>

 <div>
 <label htmlFor="reg-role-select" className="block text-xs font-semibold text-slate-300 mb-1.5">Role</label>
 <div className="relative group">
 <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors pointer-events-none" />
 <select
 id="reg-role-select"
 value={registration.role}
 onChange={(e) => setRegistration({ ...registration, role: e.target.value })}
 className="w-full bg-white/10 border border-white/20 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 text-white placeholder:text-slate-400 pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none appearance-none cursor-pointer transition-all"
 >
 <option value="staff">Staff / Waiter</option>
 <option value="chef">Kitchen Chef</option>
 <option value="cashier">POS Cashier</option>
 </select>
 <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400" />
 </div>
 </div>

 <div className="sm:col-span-2">
 <label htmlFor="reg-email-input" className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
 <div className="relative group">
 <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
 <input
 id="reg-email-input"
 type="email"
 value={registration.email}
 onChange={(e) => setRegistration({ ...registration, email: e.target.value })}
 className="w-full bg-white/10 border border-white/20 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 text-white placeholder:text-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
 placeholder="sarah@bistro.com"
 required
 />
 </div>
 </div>

 <div className="sm:col-span-2">
 <label htmlFor="reg-phone-input" className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
 <div className="relative group">
 <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
 <input
 id="reg-phone-input"
 type="tel"
 pattern="[0-9]{10}"
 maxLength="10"
 value={registration.phone}
 onChange={(e) => setRegistration({ ...registration, phone: e.target.value.replace(/\D/g,"").slice(0, 10) })}
 className="w-full bg-white/10 border border-white/20 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 text-white placeholder:text-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
 placeholder="10-digit number"
 required
 />
 </div>
 </div>

 <div>
 <label htmlFor="reg-password-input" className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
 <div className="relative group">
 <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
 <input
 id="reg-password-input"
 type={showPassword ?"text" :"password"}
 value={registration.password}
 onChange={(e) => setRegistration({ ...registration, password: e.target.value })}
 className="w-full bg-white/10 border border-white/20 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 text-white placeholder:text-slate-400 pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all"
 placeholder="••••••••"
 required minLength={8}
 />
 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
 {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
 </button>
 </div>
 </div>

 <div>
 <label htmlFor="reg-confirmpassword-input" className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm Password</label>
 <div className="relative group">
 <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
 <input
 id="reg-confirmpassword-input"
 type={showConfirmPassword ?"text" :"password"}
 value={registration.confirmPassword}
 onChange={(e) => setRegistration({ ...registration, confirmPassword: e.target.value })}
 className="w-full bg-white/10 border border-white/20 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 text-white placeholder:text-slate-400 pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all"
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
 className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98] disabled:opacity-50 cursor-pointer"
 >
 {loading && <Loader2 size={16} className="animate-spin" />}
 {loading ?"Registering..." :"Submit Registration"}
 </button>

 <p className="text-center text-sm font-medium text-slate-500 mt-5">
 Already have access?{""}
 <button type="button" onClick={() => switchView("login")} className="text-slate-900 font-bold hover:underline cursor-pointer">
 Sign in
 </button>
 </p>
 </form>
 ) : view ==="login" ? (
 <form id="login-form" onSubmit={handleLogin} className="space-y-4">
 <div>
 <label htmlFor="login-username-input" className="block text-xs font-semibold text-slate-300 mb-1.5">Username</label>
 <div className="relative group">
 <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
 <input
 id="login-username-input"
 type="text"
 value={username}
 onChange={(e) => setUsername(e.target.value)}
 className="w-full bg-white/10 border border-white/20 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-slate-400 outline-none transition-all"
 placeholder="Enter your username"
 required
 />
 </div>
 </div>
 
 <div>
 <div className="flex justify-between items-center mb-1.5">
 <label htmlFor="login-password-input" className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
 <button
 type="button"
 onClick={() => switchView("forgotPassword")}
 className="text-xs font-bold text-purple-400 hover:text-purple-300 hover:underline cursor-pointer transition-colors"
 >
 Forgot password?
 </button>
 </div>
 <div className="relative group">
 <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
 <input
 id="login-password-input"
 type={showPassword ?"text" :"password"}
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="w-full bg-white/10 border border-white/20 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 pl-10 pr-10 py-3 rounded-xl text-sm text-white placeholder:text-slate-400 outline-none transition-all"
 placeholder="••••••••"
 required
 />
 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
 {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
 </button>
 </div>
 </div>

 <button
 id="login-submit-button"
 type="submit"
 disabled={loading}
 className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-lg shadow-purple-500/25 mt-2"
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

 <p className="text-center text-sm font-medium text-slate-400 pt-4">
 Don't have an account?{""}
 <button type="button" onClick={() => switchView("register")} className="text-purple-400 font-bold hover:underline cursor-pointer">
 Register
 </button>
 </p>
 </form>
 ) : (
 <form id="forgot-password-form" onSubmit={handleForgotPassword} className="space-y-4">
 <div>
 <label htmlFor="reset-email-input" className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
 <div className="relative group">
 <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
 <input
 id="reset-email-input"
 type="email"
 value={resetEmail}
 onChange={(e) => setResetEmail(e.target.value)}
 className="w-full bg-white/10 border border-white/20 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 text-white placeholder:text-slate-400 pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
 placeholder="name@restaurant.com"
 required
 />
 </div>
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-md mt-2"
 >
 {loading && <Loader2 size={16} className="animate-spin" />}
 {loading ?"Sending..." :"Send Reset Link"}
 </button>

 <p className="text-center text-sm font-medium text-slate-400 pt-4">
 Remember your password?{""}
 <button type="button" onClick={() => switchView("login")} className="text-purple-400 font-bold hover:underline cursor-pointer">
 Sign in
 </button>
 </p>
 </form>
 )}
 </div>

 {/* Quick Demo Credentials Panel */}
 <div className="mt-6 pt-5 border-t border-slate-100">
 <div className="flex justify-between items-center mb-3">
 <button
 type="button"
 onClick={() => setShowDemoDrawer(!showDemoDrawer)}
 className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors font-semibold cursor-pointer"
 id="toggle-demo-credentials"
 >
 <Sparkles size={13} className="text-amber-500" />
 <span>Demo Accounts</span>
 <ChevronRight size={13} className={`transform transition-transform ${showDemoDrawer ?"rotate-90 text-slate-800" :""}`} />
 </button>
 </div>

 <AnimatePresence>
 {showDemoDrawer && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height:"auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.25, ease:"easeInOut" }}
 className="overflow-hidden"
 >
 <div className="grid grid-cols-2 gap-2 pt-1">
 {demoUsers.map((demo) => (
 <button
 key={demo.role}
 type="button"
 onClick={() => handleQuickLogin(demo.role)}
 className="flex flex-col items-start p-2.5 bg-white/5 border border-white/10 hover:border-purple-400/50 rounded-lg text-left transition-all hover:bg-white/10 group cursor-pointer active:scale-[0.98]"
 id={`quick-fill-${demo.role}`}
 >
 <div className="flex items-center gap-1.5 mb-0.5">
 {demo.icon}
 <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{demo.label}</span>
 </div>
 <p className="text-[10px] text-slate-400 leading-tight">{demo.desc}</p>
 </button>
 ))}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 </motion.div>
 
 {/* Footer Details */}
 <div className="absolute bottom-6 w-full text-center text-xs text-slate-400 font-medium">
 © {new Date().getFullYear()} Aslenix. Secure portal.
 </div>
 
 </div>
 );
};

export default Login;
