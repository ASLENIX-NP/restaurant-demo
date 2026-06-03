import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "../../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // LOGIN
  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { username, password });
      
      if (response.data && response.data.success) {
        const { token, user } = response.data;
        // Include token and user info together for AuthContext
        login({ ...user, token });
        
        // REDIRECT based on role
        const roleRoute = user.role ? user.role.toLowerCase() : "staff";
        navigate(`/${roleRoute}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
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
          <h3>Register via Admin Dashboard to test live login</h3>
          <p>Requires an initial Admin user in MongoDB.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;