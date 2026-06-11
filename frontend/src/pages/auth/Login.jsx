import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Phone, Lock, Briefcase, UserCircle } from "lucide-react";
import "../../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, register, user } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [registration, setRegistration] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    role: "staff",
    password: "",
    confirmPassword: "",
  });

  // Protect the Login page: Redirect if already logged in
  useEffect(() => {
    if (user) {
      let route = user.role?.toLowerCase() || "staff";
      if (route === "manager" || route === "admin") route = "admin";
      else if (route === "waiter" || route === "staff") route = "staff";
      else if (route === "chef") route = "chef";
      else if (route === "cashier") route = "cashier";
      navigate(`/${route}`);
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    const result = await login(username, password);

    if (result?.success) {
      let route = result.role?.toLowerCase() || "staff";
      if (route === "manager" || route === "admin") route = "admin";
      else if (route === "waiter" || route === "staff") route = "staff";
      else if (route === "chef") route = "chef";
      else if (route === "cashier") route = "cashier";

      navigate(`/${route}`);
    } else {
      setError(
        result?.message ||
          "Invalid username or password. Passwords: admin123, chef123, staff123, cashier123"
      );
    }

    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

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
        name: "",
        username: "",
        email: "",
        phone: "",
        role: "staff",
        password: "",
        confirmPassword: "",
      });
      setIsRegistering(false);
    } else {
      setError(result?.message || "Could not submit registration.");
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            ASLENIX ERP
          </h1>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Restaurant Management System
          </p>
        </div>

        {isRegistering ? (
          <form
            onSubmit={handleRegister}
            className="w-full mt-4 animate-slide-in"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-3 shadow-sm border border-blue-100">
                <UserCircle size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Apply for Access
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1.5">
                Please fill in your details to join the team.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 text-left">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    value={registration.name}
                    onChange={(e) =>
                      setRegistration({ ...registration, name: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium !text-slate-900 placeholder:text-slate-400 m-0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 text-left">
                  Username *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. janedoe"
                    value={registration.username}
                    onChange={(e) =>
                      setRegistration({
                        ...registration,
                        username: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium !text-slate-900 placeholder:text-slate-400 m-0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 text-left">
                  Role *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Briefcase size={18} className="text-slate-400" />
                  </div>
                  <select
                    value={registration.role}
                    onChange={(e) =>
                      setRegistration({ ...registration, role: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium !text-slate-900 appearance-none cursor-pointer m-0"
                  >
                    <option value="staff">Staff</option>
                    <option value="chef">Chef</option>
                    <option value="cashier">Cashier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 text-left">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={registration.email}
                    onChange={(e) =>
                      setRegistration({
                        ...registration,
                        email: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium !text-slate-900 placeholder:text-slate-400 m-0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 text-left">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    title="Please enter exactly 10 digits"
                    placeholder="e.g. 9812345678"
                    value={registration.phone}
                    onChange={(e) =>
                      setRegistration({
                        ...registration,
                        phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium !text-slate-900 placeholder:text-slate-400 m-0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 text-left">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={registration.password}
                    onChange={(e) =>
                      setRegistration({
                        ...registration,
                        password: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium !text-slate-900 placeholder:text-slate-400 m-0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 text-left">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={registration.confirmPassword}
                    onChange={(e) =>
                      setRegistration({
                        ...registration,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium !text-slate-900 placeholder:text-slate-400 m-0"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-rose-500 text-sm font-bold bg-rose-50 p-3 rounded-xl mb-4 border border-rose-100 text-left">
                {error}
              </div>
            )}
            {info && (
              <div className="text-emerald-600 text-sm font-bold bg-emerald-50 p-3 rounded-xl mb-4 border border-emerald-100 text-left">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>

            <div className="mt-6 text-center text-sm font-medium text-slate-500 pt-2">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setError("");
                  setInfo("");
                }}
                className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all"
              >
                Sign in securely
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleLogin}
            className="w-full mt-4 animate-slide-in space-y-4"
          >
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium !text-slate-900 placeholder:text-slate-400 m-0"
                  required
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium !text-slate-900 placeholder:text-slate-400 m-0"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-rose-500 text-sm font-bold bg-rose-50 p-3 rounded-xl border border-rose-100 text-left">
                {error}
              </div>
            )}
            {info && (
              <div className="text-emerald-600 text-sm font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-left">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-200 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>

            <div className="mt-6 text-center text-sm font-medium text-slate-500 pt-2">
              Need access to the system?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setError("");
                  setInfo("");
                }}
                className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all"
              >
                Apply for access
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 bg-amber-50 border border-amber-100 rounded-xl p-4 text-left">
          <h3 className="text-amber-800 text-xs font-black uppercase tracking-wider mb-1">
            Local Testing Mode Active
          </h3>
          <p className="text-amber-700 text-xs font-medium leading-relaxed">
            Login with: admin, chef, staff, or cashier (Passwords: admin123,
            chef123, staff123, cashier123)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
