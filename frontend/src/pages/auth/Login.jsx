import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // LOGIN
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(username, password);

    if (result && result.success) {
      navigate(`/${result.role}`);
    } else {
      setError(
        result?.message ||
          "Invalid username or password. Passwords: admin123, chef123, staff123, cashier123"
      );
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>ASLENIX ERP</h1>
        <p>Restaurant Management System</p>

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ERROR */}
        {error && <div className="login-error">{error}</div>}

        {/* LOGIN BUTTON */}
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* DEMO USERS */}
        <div className="demo-users">
          <h3>Local Testing Mode Active</h3>
          <p>
            Login with: admin, chef, staff, or cashier (Passwords: admin123,
            chef123, staff123, cashier123)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
